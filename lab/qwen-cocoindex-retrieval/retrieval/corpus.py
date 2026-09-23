"""Corpus manifest loader, AST extractor, and fixture validator."""

import ast
from dataclasses import dataclass
import hashlib
import json
from pathlib import Path
import re
from typing import Dict, List, Set

SAFE_ANCHOR_FILES: Set[str] = {
    'lab/laya-herdr-event-router/benchmark.py',
    'lab/laya-herdr-event-router/router/baseline.py',
    'lab/laya-herdr-event-router/router/contract.py',
    'lab/laya-herdr-event-router/router/laya_engine.py',
    'lab/laya-herdr-event-router/router/manifest.py',
    'lab/laya-herdr-event-router/router/metrics.py',
    'lab/laya-herdr-event-router/tests/test_router.py',
}

VALID_QUERY_CATEGORIES: Set[str] = {
    'adversarial_semantic',
    'english_semantic',
    'thai_semantic',
    'exact_identifier',
    'behavior_paraphrase',
    'security_operational',
}


@dataclass(frozen=True)
class DocumentRecord:
    id: str
    path: str
    symbol: str
    symbol_type: str
    description: str
    extracted_source: str


@dataclass(frozen=True)
class QueryRecord:
    id: str
    category: str
    query: str
    relevant_doc_ids: List[str]


def compute_file_sha256(path: Path) -> str:
    """Compute SHA-256 hex digest of a file in 64KB blocks."""
    h = hashlib.sha256()
    with path.open('rb') as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()


def extract_ast_node(source_code: str, symbol: str) -> str:
    """Extract source code of a top-level function or Class.method using Python AST."""
    if not source_code or not source_code.strip():
        raise ValueError('source_code must be non-empty')
    if not symbol or not symbol.strip():
        raise ValueError('symbol must be non-empty')

    tree = ast.parse(source_code)

    if '.' in symbol:
        parts = symbol.split('.')
        if len(parts) != 2:
            raise ValueError(f"Symbol '{symbol}' has invalid nested format; expected Class.method")
        class_name, method_name = parts

        matching_classes = [
            node for node in tree.body
            if isinstance(node, ast.ClassDef) and node.name == class_name
        ]
        if not matching_classes:
            raise ValueError(f"Class '{class_name}' not found in source")
        if len(matching_classes) > 1:
            raise ValueError(f"Class '{class_name}' declared multiple times in module")

        class_node = matching_classes[0]
        matching_methods = [
            node for node in class_node.body
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.name == method_name
        ]
        if not matching_methods:
            raise ValueError(f"Method '{method_name}' not found in class '{class_name}'")
        if len(matching_methods) > 1:
            raise ValueError(f"Method '{method_name}' declared multiple times in class '{class_name}'")

        target_node = matching_methods[0]
    else:
        matching_funcs = [
            node for node in tree.body
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.name == symbol
        ]
        if not matching_funcs:
            raise ValueError(f"Function '{symbol}' not found in module")
        if len(matching_funcs) > 1:
            raise ValueError(f"Function '{symbol}' declared multiple times in module")

        target_node = matching_funcs[0]

    segment = ast.get_source_segment(source_code, target_node)
    if not segment or not segment.strip():
        raise ValueError(f"Extracted AST segment for '{symbol}' was empty")

    return segment


def load_documents(manifest_path: Path, repo_root: Path) -> Dict[str, DocumentRecord]:
    """Load allowlisted document manifest and extract exact AST nodes."""
    if not manifest_path.is_file():
        raise FileNotFoundError(f'Document manifest not found: {manifest_path}')

    with manifest_path.open('r', encoding='utf-8') as f:
        data = json.load(f)

    if not isinstance(data, list):
        raise ValueError('Document manifest must be a JSON array of objects')

    documents: Dict[str, DocumentRecord] = {}
    seen_ids: Set[str] = set()

    for item in data:
        if not isinstance(item, dict):
            raise ValueError(f'Manifest item must be a JSON object, got {type(item).__name__}')

        doc_id = item.get('id')
        rel_path = item.get('path')
        symbol = item.get('symbol')
        symbol_type = item.get('symbol_type')
        description = item.get('description', '')

        if not doc_id or not isinstance(doc_id, str):
            raise ValueError(f'Document ID missing or invalid: {doc_id!r}')
        if doc_id in seen_ids:
            raise ValueError(f'Duplicate document ID in manifest: {doc_id}')
        seen_ids.add(doc_id)

        if not rel_path or not isinstance(rel_path, str):
            raise ValueError(f'Invalid path for document {doc_id}')
        if rel_path not in SAFE_ANCHOR_FILES:
            raise ValueError(f'Path {rel_path} for {doc_id} violates safe anchor allowlist')

        if not symbol or not isinstance(symbol, str):
            raise ValueError(f'Invalid symbol for document {doc_id}')
        if symbol_type not in ('function', 'method'):
            raise ValueError(f'Invalid symbol_type {symbol_type!r} for {doc_id}')

        full_path = repo_root / rel_path
        if not full_path.is_file():
            raise FileNotFoundError(f'Corpus file does not exist: {full_path}')

        source_code = full_path.read_text(encoding='utf-8')
        extracted = extract_ast_node(source_code, symbol)

        documents[doc_id] = DocumentRecord(
            id=doc_id,
            path=rel_path,
            symbol=symbol,
            symbol_type=symbol_type,
            description=description,
            extracted_source=extracted,
        )

    return documents


def validate_leakage(query: str, category: str, relevant_doc_ids: List[str], documents: Dict[str, DocumentRecord]) -> None:
    """Ensure semantic and Thai queries do not trivially leak the target symbol name."""
    if category not in ('english_semantic', 'thai_semantic'):
        return

    lower_query = query.lower()
    for doc_id in relevant_doc_ids:
        doc = documents.get(doc_id)
        if not doc:
            continue
        symbol = doc.symbol
        parts = [symbol]
        if '.' in symbol:
            parts.extend(symbol.split('.'))

        for part in parts:
            clean_part = part.strip('_').lower()
            if len(clean_part) >= 4:
                # Check for exact token or word boundary match
                pattern = r'\b' + re.escape(clean_part) + r'\b'
                if re.search(pattern, lower_query):
                    raise ValueError(
                        f"Trivial leakage detected in {category} query '{query}': "
                        f"contains symbol token '{part}' from relevant doc '{doc_id}'"
                    )


def load_queries(queries_path: Path, documents: Dict[str, DocumentRecord]) -> List[QueryRecord]:
    """Load and strictly validate labeled queries from JSONL fixture."""
    if not queries_path.is_file():
        raise FileNotFoundError(f'Queries fixture not found: {queries_path}')

    queries: List[QueryRecord] = []
    seen_ids: Set[str] = set()

    with queries_path.open('r', encoding='utf-8') as f:
        for line_no, line in enumerate(f, start=1):
            line = line.strip()
            if not line or line.startswith('#'):
                continue

            try:
                record = json.loads(line)
            except json.JSONDecodeError as e:
                raise ValueError(f'Malformed JSON on line {line_no} of {queries_path}: {e}')

            if not isinstance(record, dict):
                raise ValueError(f'Line {line_no} of {queries_path} is not a JSON object')

            qid = record.get('id')
            category = record.get('category')
            query_text = record.get('query')
            relevant_ids = record.get('relevant_doc_ids')

            if not qid or not isinstance(qid, str):
                raise ValueError(f'Query ID missing or invalid on line {line_no}')
            if qid in seen_ids:
                raise ValueError(f'Duplicate query ID on line {line_no}: {qid}')
            seen_ids.add(qid)

            if category not in VALID_QUERY_CATEGORIES:
                raise ValueError(
                    f'Invalid category {category!r} for query {qid}; expected one of {sorted(VALID_QUERY_CATEGORIES)}'
                )

            if not query_text or not isinstance(query_text, str) or not query_text.strip():
                raise ValueError(f'Empty query text for query {qid}')

            if not isinstance(relevant_ids, list) or not relevant_ids:
                raise ValueError(f'relevant_doc_ids must be a non-empty list for query {qid}')

            for r_id in relevant_ids:
                if r_id not in documents:
                    raise ValueError(
                        f"Query {qid} references unknown document ID '{r_id}' not found in corpus manifest"
                    )

            validate_leakage(query_text, category, relevant_ids, documents)

            queries.append(
                QueryRecord(
                    id=qid,
                    category=category,
                    query=query_text.strip(),
                    relevant_doc_ids=list(relevant_ids),
                )
            )

    return queries
