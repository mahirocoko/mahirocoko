#!/usr/bin/env python3
"""Bounded local retrieval benchmark comparing nomic_raw, qwen_raw, and qwen_instructed."""

import argparse
import datetime
import hashlib
import json
from pathlib import Path
import platform
import sys
import time
from typing import Any, Dict, List, Tuple

LAB_DIR = Path(__file__).resolve().parent
REPO_ROOT = LAB_DIR.parent.parent

# Lab modules
from retrieval.corpus import (
    SAFE_ANCHOR_FILES,
    VALID_QUERY_CATEGORIES,
    DocumentRecord,
    QueryRecord,
    compute_file_sha256,
    load_documents,
    load_queries,
)
from retrieval.metrics import (
    aggregate_metrics,
    compute_query_retrieval_metrics,
    rank_documents,
)
from retrieval.ollama_client import OllamaClient
from retrieval.reporting import atomic_write, generate_markdown_report

QWEN_INSTRUCTION_PREFIX = (
    'Instruct: Given a developer code-search query, retrieve the source-code chunk '
    'that best implements or explains the requested behavior.\nQuery: '
)

VARIANT_CONFIGS: Dict[str, Dict[str, Any]] = {
    'nomic_raw': {
        'model': 'nomic-embed-text:latest',
        'query_format': 'raw',
        'description': 'nomic-embed-text with raw document code and raw queries',
    },
    'qwen_raw': {
        'model': 'qwen3-embedding:0.6b',
        'query_format': 'raw',
        'description': 'qwen3-embedding:0.6b with raw document code and raw queries',
    },
    'qwen_instructed': {
        'model': 'qwen3-embedding:0.6b',
        'query_format': 'instructed',
        'description': 'qwen3-embedding:0.6b reusing raw document vectors with instructed queries',
    },
}


def format_query(raw_query: str, format_type: str) -> str:
    """Format query according to the variant specification."""
    if format_type == 'raw':
        return raw_query
    if format_type == 'instructed':
        return f'{QWEN_INSTRUCTION_PREFIX}{raw_query}'
    raise ValueError(f'Unknown query format_type: {format_type!r}')


def collect_source_hashes() -> Dict[str, str]:
    """Collect SHA-256 hashes of all lab Python files and corpus source files for provenance."""
    hashes: Dict[str, str] = {}

    # Lab sources
    lab_py_files = sorted(LAB_DIR.rglob('*.py'))
    for p in lab_py_files:
        rel = str(p.relative_to(REPO_ROOT))
        hashes[rel] = compute_file_sha256(p)

    # Allowlisted safe corpus sources
    for rel_path in sorted(SAFE_ANCHOR_FILES):
        p = REPO_ROOT / rel_path
        if p.is_file():
            hashes[rel_path] = compute_file_sha256(p)

    return hashes


def build_query_vector_diagnostics(
    queries: List[QueryRecord],
    vectors: List[List[float]],
) -> Dict[str, Any]:
    """Record exact duplicate query vectors without retaining vector contents."""
    if len(queries) != len(vectors):
        raise ValueError(
            f'Query/vector length mismatch: {len(queries)} != {len(vectors)}'
        )

    groups: Dict[str, List[str]] = {}
    hashes_by_category: Dict[str, set[str]] = {
        category: set() for category in VALID_QUERY_CATEGORIES
    }
    counts_by_category: Dict[str, int] = {
        category: 0 for category in VALID_QUERY_CATEGORIES
    }

    for query, vector in zip(queries, vectors):
        vector_bytes = json.dumps(vector, separators=(',', ':')).encode('utf-8')
        digest = hashlib.sha256(vector_bytes).hexdigest()
        groups.setdefault(digest, []).append(query.id)
        hashes_by_category[query.category].add(digest)
        counts_by_category[query.category] += 1

    return {
        'unique_query_vectors': len(groups),
        'total_queries': len(queries),
        'duplicate_groups': [
            {'query_ids': query_ids, 'count': len(query_ids)}
            for _, query_ids in sorted(groups.items())
            if len(query_ids) > 1
        ],
        'by_category': {
            category: {
                'unique_query_vectors': len(hashes_by_category[category]),
                'total_queries': counts_by_category[category],
            }
            for category in sorted(VALID_QUERY_CATEGORIES)
        },
    }


def run_benchmark(
    variants: List[str],
    ollama_host: str,
    output_dir: Path,
    batch_size: int,
    report_name: str,
    dry_run: bool = False,
    verbose: bool = False,
) -> int:
    """Execute the retrieval benchmark or dry-run validation."""
    print('=== Local Retrieval Benchmark ===')
    print(f'Repository Root: {REPO_ROOT}')
    print(f'Lab Directory:   {LAB_DIR}')
    print(f'Requested Variants: {variants}')
    print(f'Dry Run Mode:    {dry_run}')

    manifest_path = LAB_DIR / 'fixtures' / 'documents.json'
    queries_path = LAB_DIR / 'fixtures' / 'queries.jsonl'

    print('\n[1/4] Loading and validating allowlisted document corpus...')
    documents = load_documents(manifest_path, REPO_ROOT)
    print(f'  Extracted {len(documents)} AST document chunks successfully.')

    print('\n[2/4] Loading and validating labeled query fixtures...')
    queries = load_queries(queries_path, documents)
    print(f'  Loaded {len(queries)} queries across {len(VALID_QUERY_CATEGORIES)} categories.')

    # Print Category Breakdown of Fixtures
    category_counts: Dict[str, int] = {}
    for q in queries:
        category_counts[q.category] = category_counts.get(q.category, 0) + 1
    print('  Query counts by category:')
    for cat in sorted(VALID_QUERY_CATEGORIES):
        print(f'    - {cat}: {category_counts.get(cat, 0)}')

    if dry_run:
        print('\n[3/4] Dry run requested: skipping Ollama calls.')
        print('  Corpus extraction: VALID')
        print('  Query references:  VALID')
        print('  Category coverage: VALID')
        print('  No-leakage checks: VALID')
        print('\n[4/4] Model-free dry validation PASSED.')
        return 0

    print(f'\n[3/4] Connecting to loopback Ollama at {ollama_host}...')
    client = OllamaClient(base_url=ollama_host)
    required_models = {
        str(VARIANT_CONFIGS[variant]['model']) for variant in variants
    }
    installed_metadata = client.get_runtime_metadata(required_models)

    # Document and query lists
    doc_ids = sorted(documents.keys())
    doc_texts = [documents[did].extracted_source for did in doc_ids]

    # Caches for embeddings to allow Qwen reuse
    doc_embedding_cache: Dict[str, Dict[str, List[float]]] = {}
    doc_latency_cache: Dict[str, float] = {}

    variant_results: Dict[str, Any] = {}

    for var_name in variants:
        if var_name not in VARIANT_CONFIGS:
            raise ValueError(f'Unknown variant: {var_name}')

        config = VARIANT_CONFIGS[var_name]
        model = config['model']
        query_fmt = config['query_format']

        print(f"\n--- Running Variant: '{var_name}' (model: {model}, query: {query_fmt}) ---")

        # 1. Document embeddings (with strict reuse between Qwen variants)
        reused_docs = False
        if model in doc_embedding_cache:
            print(f"  Reusing cached document embeddings for model '{model}'...")
            doc_vectors = doc_embedding_cache[model]
            doc_latency = doc_latency_cache[model]
            reused_docs = True
        else:
            print(f"  Embedding {len(doc_texts)} documents with '{model}'...")
            vectors, latency = client.embed_batch(model=model, texts=doc_texts, batch_size=batch_size)
            doc_vectors = {did: vec for did, vec in zip(doc_ids, vectors)}
            doc_embedding_cache[model] = doc_vectors
            doc_latency_cache[model] = latency
            doc_latency = latency
            print(f'  Documents embedded in {latency:.1f} ms.')

        vector_dim = len(next(iter(doc_vectors.values())))

        # 2. Query embeddings
        formatted_query_texts = [format_query(q.query, query_fmt) for q in queries]
        print(f"  Embedding {len(queries)} queries with '{model}'...")
        query_vectors, q_latency = client.embed_batch(
            model=model, texts=formatted_query_texts, batch_size=batch_size
        )
        print(f'  Queries embedded in {q_latency:.1f} ms.')
        query_vector_diagnostics = build_query_vector_diagnostics(
            queries,
            query_vectors,
        )
        if query_vector_diagnostics['duplicate_groups']:
            print(
                '  Warning: exact duplicate query vectors detected: '
                f"{query_vector_diagnostics['duplicate_groups']}"
            )

        # 3. Retrieval and Ranking
        query_metrics_list: List[Dict[str, Any]] = []
        metrics_by_cat: Dict[str, List[Dict[str, Any]]] = {cat: [] for cat in VALID_QUERY_CATEGORIES}

        for q_record, q_vec in zip(queries, query_vectors):
            ranked = rank_documents(q_vec, doc_vectors)
            q_res = compute_query_retrieval_metrics(
                ranked_docs=ranked,
                relevant_doc_ids=q_record.relevant_doc_ids,
                top_k=10,
            )
            q_res['query_id'] = q_record.id
            q_res['category'] = q_record.category
            q_res['raw_query'] = q_record.query
            q_res['relevant_doc_ids'] = q_record.relevant_doc_ids

            query_metrics_list.append(q_res)
            metrics_by_cat[q_record.category].append(q_res)

            if verbose:
                top1_hit = 'HIT' if q_res['hit@1'] > 0 else 'MISS'
                top3_hit = 'HIT' if q_res['hit@3'] > 0 else 'MISS'
                print(
                    f"    [{q_record.id}] ({q_record.category}) Top-1: {top1_hit}, Top-3: {top3_hit}, "
                    f"MRR: {q_res['mrr@10']:.3f}, nDCG: {q_res['ndcg@10']:.3f}"
                )

        overall_metrics = aggregate_metrics(query_metrics_list)
        aggregated_by_cat: Dict[str, Dict[str, float]] = {
            cat: aggregate_metrics(q_list) for cat, q_list in metrics_by_cat.items()
        }

        print(
            f"  Variant '{var_name}' Overall: Hit@1={overall_metrics['hit@1']:.4f}, "
            f"Hit@3={overall_metrics['hit@3']:.4f}, Hit@5={overall_metrics['hit@5']:.4f}, "
            f"Recall@5={overall_metrics['recall@5']:.4f}, "
            f"MRR@10={overall_metrics['mrr@10']:.4f}, nDCG@10={overall_metrics['ndcg@10']:.4f}"
        )

        variant_results[var_name] = {
            'model': model,
            'vector_dimension': vector_dim,
            'query_formatting': query_fmt,
            'doc_embeddings_reused': reused_docs,
            'document_embedding_latency_ms': round(doc_latency, 2),
            'query_embedding_latency_ms': round(q_latency, 2),
            'query_vector_diagnostics': query_vector_diagnostics,
            'metrics_overall': overall_metrics,
            'metrics_by_category': aggregated_by_cat,
            'query_rankings': query_metrics_list,
        }

    # 4. Generate Reports
    print('\n[4/4] Writing benchmark reports atomically...')
    run_timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()
    source_hashes = collect_source_hashes()
    manifest_hash = compute_file_sha256(manifest_path)
    queries_hash = compute_file_sha256(queries_path)

    final_runtime_metadata = client.get_runtime_metadata(required_models)
    final_runtime_metadata['loaded_models_before_run'] = installed_metadata[
        'loaded_models_after_run'
    ]

    report_payload: Dict[str, Any] = {
        'run_timestamp': run_timestamp,
        'command_metadata': {
            'argv': sys.argv,
            'variants': variants,
            'ollama_host': ollama_host,
            'batch_size': batch_size,
        },
        'system': {
            'python_version': sys.version,
            'platform': platform.platform(),
        },
        'ollama_runtime': final_runtime_metadata,
        'limitations': (
            'Curated AST corpus from lab/laya-herdr-event-router; not an exhaustive codebase index. '
            'Synthetic evaluation using local loopback Ollama embeddings only.'
        ),
        'rebuild_rule_notice': (
            'Switching CCC/CocoIndex embedding models requires a full index rebuild; '
            'vector spaces across different models or dimensions cannot be mixed.'
        ),
        'provenance': {
            'manifest_sha256': manifest_hash,
            'queries_sha256': queries_hash,
            'source_hashes': source_hashes,
        },
        'variants': variant_results,
    }

    if (
        installed_metadata['installed_models']
        != report_payload['ollama_runtime']['installed_models']
    ):
        raise RuntimeError('Installed Ollama model metadata changed during benchmark')

    output_dir.mkdir(parents=True, exist_ok=True)
    json_path = output_dir / f'{report_name}.json'
    md_path = output_dir / f'{report_name}.md'

    atomic_write(json_path, json.dumps(report_payload, indent=2))
    print(f'  JSON report written atomically to: {json_path}')

    md_content = generate_markdown_report(report_payload)
    atomic_write(md_path, md_content)
    print(f'  Markdown report written atomically to: {md_path}')

    print('\nBenchmark completed successfully.')
    return 0


def main() -> None:
    parser = argparse.ArgumentParser(
        description='Local retrieval benchmark for Ollama /api/embed (nomic_raw, qwen_raw, qwen_instructed).'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Extract allowlisted corpus and validate query fixtures without contacting Ollama.',
    )
    parser.add_argument(
        '--ollama-host',
        default='http://127.0.0.1:11434',
        help='Loopback HTTP endpoint for Ollama (default: http://127.0.0.1:11434).',
    )
    parser.add_argument(
        '--variants',
        default='nomic_raw,qwen_raw,qwen_instructed',
        help='Comma-separated variants to run (default: nomic_raw,qwen_raw,qwen_instructed).',
    )
    parser.add_argument(
        '--output-dir',
        type=Path,
        default=LAB_DIR / 'reports',
        help='Directory to store benchmark reports (default: lab/qwen-cocoindex-retrieval/reports).',
    )
    parser.add_argument(
        '--batch-size',
        type=int,
        default=16,
        help='Batch size for Ollama /api/embed (default: 16).',
    )
    parser.add_argument(
        '--report-name',
        default='',
        help='Filename prefix for generated reports (default: retrieval_benchmark_<UTC_TIMESTAMP>).',
    )
    parser.add_argument(
        '--verbose',
        action='store_true',
        help='Print verbose per-query retrieval metrics during execution.',
    )

    args = parser.parse_args()

    variant_list = [v.strip() for v in args.variants.split(',') if v.strip()]
    if not variant_list:
        parser.error('At least one variant must be specified.')

    for v in variant_list:
        if v not in VARIANT_CONFIGS:
            parser.error(f"Unknown variant '{v}'. Valid options: {sorted(VARIANT_CONFIGS.keys())}")

    if not args.report_name:
        timestamp_str = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%d_%H%M%S')
        report_name = f'retrieval_benchmark_{timestamp_str}'
    else:
        report_name = args.report_name

    exit_code = run_benchmark(
        variants=variant_list,
        ollama_host=args.ollama_host,
        output_dir=args.output_dir,
        batch_size=args.batch_size,
        report_name=report_name,
        dry_run=args.dry_run,
        verbose=args.verbose,
    )
    sys.exit(exit_code)


if __name__ == '__main__':
    main()
