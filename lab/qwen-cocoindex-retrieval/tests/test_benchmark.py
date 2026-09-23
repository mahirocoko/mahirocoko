"""Comprehensive unit test suite for local retrieval benchmark."""

import json
import math
from pathlib import Path
import tempfile
import unittest
from unittest.mock import MagicMock

# Lab imports
LAB_DIR = Path(__file__).resolve().parent.parent
REPO_ROOT = LAB_DIR.parent.parent
import sys
sys.path.insert(0, str(LAB_DIR))

import benchmark
from retrieval.corpus import (
    SAFE_ANCHOR_FILES,
    VALID_QUERY_CATEGORIES,
    DocumentRecord,
    compute_file_sha256,
    extract_ast_node,
    load_documents,
    load_queries,
    validate_leakage,
)
from retrieval.metrics import (
    aggregate_metrics,
    compute_query_retrieval_metrics,
    cosine_similarity,
    rank_documents,
)
from retrieval.ollama_client import OllamaClient, validate_loopback_url
from retrieval.reporting import atomic_write, generate_markdown_report


class TestASTExtraction(unittest.TestCase):
    """Test Python AST extraction for module functions and Class.method."""

    def test_extract_module_function_success(self):
        code = 'def alpha():\n    return 42\n\ndef beta():\n    return 99\n'
        extracted = extract_ast_node(code, 'alpha')
        self.assertEqual(extracted, 'def alpha():\n    return 42')

    def test_extract_class_method_success(self):
        code = 'class Worker:\n    def execute(self):\n        return True\n'
        extracted = extract_ast_node(code, 'Worker.execute')
        self.assertEqual(extracted, 'def execute(self):\n        return True')

    def test_extract_missing_symbol_fails(self):
        code = 'def exists():\n    pass\n'
        with self.assertRaises(ValueError) as ctx:
            extract_ast_node(code, 'does_not_exist')
        self.assertIn("Function 'does_not_exist' not found", str(ctx.exception))

    def test_extract_missing_class_fails(self):
        code = 'class Other:\n    pass\n'
        with self.assertRaises(ValueError) as ctx:
            extract_ast_node(code, 'Missing.method')
        self.assertIn("Class 'Missing' not found", str(ctx.exception))

    def test_extract_missing_method_in_class_fails(self):
        code = 'class Worker:\n    def run(self):\n        pass\n'
        with self.assertRaises(ValueError) as ctx:
            extract_ast_node(code, 'Worker.stop')
        self.assertIn("Method 'stop' not found in class 'Worker'", str(ctx.exception))

    def test_extract_duplicate_function_fails(self):
        code = 'def dup():\n    pass\n\ndef dup():\n    pass\n'
        with self.assertRaises(ValueError) as ctx:
            extract_ast_node(code, 'dup')
        self.assertIn("declared multiple times", str(ctx.exception))

    def test_extract_empty_source_fails(self):
        with self.assertRaises(ValueError):
            extract_ast_node('', 'symbol')


class TestFixturesAndManifest(unittest.TestCase):
    """Validate document manifest, safe anchors, and labeled queries."""

    def setUp(self):
        self.manifest_path = LAB_DIR / 'fixtures' / 'documents.json'
        self.queries_path = LAB_DIR / 'fixtures' / 'queries.jsonl'

    def test_documents_manifest_load_and_extract(self):
        self.assertTrue(self.manifest_path.is_file())
        documents = load_documents(self.manifest_path, REPO_ROOT)
        self.assertGreaterEqual(len(documents), 25)

        for did, doc in documents.items():
            self.assertIn(doc.path, SAFE_ANCHOR_FILES)
            self.assertTrue(len(doc.extracted_source.strip()) > 0)
            self.assertIn(doc.symbol_type, ('function', 'method'))

    def test_manifest_rejects_out_of_allowlist_path(self):
        with tempfile.TemporaryDirectory() as td:
            bad_manifest = Path(td) / 'bad_manifest.json'
            bad_manifest.write_text(json.dumps([
                {
                    'id': 'bad_doc',
                    'path': 'lab/unsafe/malicious.py',
                    'symbol': 'hack',
                    'symbol_type': 'function',
                }
            ]))
            with self.assertRaises(ValueError) as ctx:
                load_documents(bad_manifest, REPO_ROOT)
            self.assertIn('violates safe anchor allowlist', str(ctx.exception))

    def test_queries_fixture_validation(self):
        documents = load_documents(self.manifest_path, REPO_ROOT)
        queries = load_queries(self.queries_path, documents)

        # Requirement: At least 24 useful cases spanning all categories
        self.assertGreaterEqual(len(queries), 24)

        categories = {q.category for q in queries}
        self.assertEqual(categories, VALID_QUERY_CATEGORIES)

        for q in queries:
            self.assertGreaterEqual(len(q.relevant_doc_ids), 1)
            for did in q.relevant_doc_ids:
                self.assertIn(did, documents)

    def test_leakage_detection_catches_trivial_leaks(self):
        fake_docs = {
            'doc1': DocumentRecord(
                id='doc1',
                path='lab/laya-herdr-event-router/router/contract.py',
                symbol='check_consistency',
                symbol_type='function',
                description='',
                extracted_source='def check_consistency(): pass',
            )
        }
        # Trivial leakage in english_semantic
        with self.assertRaises(ValueError) as ctx:
            validate_leakage('please check_consistency now', 'english_semantic', ['doc1'], fake_docs)
        self.assertIn('Trivial leakage detected', str(ctx.exception))

        # But exact_identifier category is allowed to mention the identifier
        validate_leakage('check_consistency', 'exact_identifier', ['doc1'], fake_docs)


class TestQueryInstructionAsymmetry(unittest.TestCase):
    """Verify that query instruction formatting is applied only where specified."""

    def test_query_formatting(self):
        raw_query = 'search for hash verification'
        raw_res = benchmark.format_query(raw_query, 'raw')
        self.assertEqual(raw_res, raw_query)

        instructed_res = benchmark.format_query(raw_query, 'instructed')
        self.assertTrue(instructed_res.startswith('Instruct: Given a developer code-search query'))
        self.assertTrue(instructed_res.endswith(f'Query: {raw_query}'))

        with self.assertRaises(ValueError):
            benchmark.format_query(raw_query, 'unknown_format')

    def test_query_vector_diagnostics_detect_exact_duplicates(self):
        queries = [
            benchmark.QueryRecord('q1', 'thai_semantic', 'หนึ่ง', ['doc1']),
            benchmark.QueryRecord('q2', 'thai_semantic', 'สอง', ['doc1']),
            benchmark.QueryRecord('q3', 'english_semantic', 'three', ['doc1']),
        ]
        diagnostics = benchmark.build_query_vector_diagnostics(
            queries,
            [[1.0, 0.0], [1.0, 0.0], [0.0, 1.0]],
        )
        self.assertEqual(diagnostics['unique_query_vectors'], 2)
        self.assertEqual(diagnostics['total_queries'], 3)
        self.assertEqual(
            diagnostics['duplicate_groups'],
            [{'query_ids': ['q1', 'q2'], 'count': 2}],
        )
        self.assertEqual(
            diagnostics['by_category']['thai_semantic'],
            {'unique_query_vectors': 1, 'total_queries': 2},
        )


class TestCosineAndRanking(unittest.TestCase):
    """Test cosine similarity math, edge cases, and deterministic tie-breaking."""

    def test_cosine_similarity_values(self):
        # Parallel
        self.assertAlmostEqual(cosine_similarity([1.0, 0.0], [2.0, 0.0]), 1.0)
        # Orthogonal
        self.assertAlmostEqual(cosine_similarity([1.0, 0.0], [0.0, 1.0]), 0.0)
        # Opposite
        self.assertAlmostEqual(cosine_similarity([1.0, 0.0], [-1.0, 0.0]), -1.0)

    def test_cosine_similarity_dimension_mismatch(self):
        with self.assertRaises(ValueError):
            cosine_similarity([1.0, 2.0], [1.0, 2.0, 3.0])

    def test_cosine_similarity_zero_magnitude(self):
        with self.assertRaises(ValueError):
            cosine_similarity([0.0, 0.0], [1.0, 1.0])

    def test_cosine_similarity_non_finite(self):
        with self.assertRaises(ValueError):
            cosine_similarity([float('nan'), 1.0], [1.0, 1.0])
        with self.assertRaises(ValueError):
            cosine_similarity([float('inf'), 1.0], [1.0, 1.0])

    def test_ranking_deterministic_tie_break(self):
        query_vec = [1.0, 0.0]
        # Three documents with identical orthogonal similarity to query_vec
        doc_vectors = {
            'doc_z': [0.0, 1.0],
            'doc_a': [0.0, 1.0],
            'doc_m': [0.0, 1.0],
        }
        ranked = rank_documents(query_vec, doc_vectors)
        # Scores are all 0.0, so tie-break must be alphabetical: doc_a, doc_m, doc_z
        ids = [doc_id for doc_id, _ in ranked]
        self.assertEqual(ids, ['doc_a', 'doc_m', 'doc_z'])


class TestMetricsCalculation(unittest.TestCase):
    """Verify Hit@k, MRR@10, and binary nDCG@10 mathematical calculations."""

    def test_hit_at_k_and_mrr_first_rank(self):
        ranked = [
            ('doc_rel', 0.9),
            ('doc_irr_1', 0.8),
            ('doc_irr_2', 0.7),
        ]
        res = compute_query_retrieval_metrics(ranked, ['doc_rel'], top_k=10)
        self.assertEqual(res['hit@1'], 1.0)
        self.assertEqual(res['hit@3'], 1.0)
        self.assertEqual(res['hit@5'], 1.0)
        self.assertEqual(res['recall@1'], 1.0)
        self.assertEqual(res['recall@3'], 1.0)
        self.assertEqual(res['recall@5'], 1.0)
        self.assertEqual(res['mrr@10'], 1.0)
        self.assertEqual(res['ndcg@10'], 1.0)

    def test_hit_at_k_and_mrr_second_rank(self):
        ranked = [
            ('doc_irr_1', 0.95),
            ('doc_rel', 0.85),
            ('doc_irr_2', 0.75),
        ]
        res = compute_query_retrieval_metrics(ranked, ['doc_rel'], top_k=10)
        self.assertEqual(res['hit@1'], 0.0)
        self.assertEqual(res['hit@3'], 1.0)
        self.assertEqual(res['hit@5'], 1.0)
        self.assertEqual(res['recall@1'], 0.0)
        self.assertEqual(res['recall@3'], 1.0)
        self.assertEqual(res['recall@5'], 1.0)
        self.assertEqual(res['mrr@10'], 0.5)

        # nDCG calculation: DCG = 1 / log2(3), IDCG = 1 / log2(2) = 1.0
        expected_ndcg = (1.0 / math.log2(3)) / (1.0 / math.log2(2))
        self.assertAlmostEqual(res['ndcg@10'], round(expected_ndcg, 6))

    def test_mrr_and_hit_miss_outside_top_k(self):
        ranked = [(f'doc_irr_{i}', 0.9 - i * 0.05) for i in range(12)]
        ranked.append(('doc_rel', 0.1))
        res = compute_query_retrieval_metrics(ranked, ['doc_rel'], top_k=10)
        self.assertEqual(res['hit@1'], 0.0)
        self.assertEqual(res['hit@3'], 0.0)
        self.assertEqual(res['hit@5'], 0.0)
        self.assertEqual(res['mrr@10'], 0.0)
        self.assertEqual(res['ndcg@10'], 0.0)

    def test_recall_at_k_counts_all_relevant_documents(self):
        ranked = [
            ('doc_rel_a', 0.9),
            ('doc_irr', 0.8),
            ('doc_rel_b', 0.7),
        ]
        res = compute_query_retrieval_metrics(
            ranked,
            ['doc_rel_a', 'doc_rel_b'],
            top_k=10,
        )
        self.assertEqual(res['hit@1'], 1.0)
        self.assertEqual(res['recall@1'], 0.5)
        self.assertEqual(res['recall@3'], 1.0)
        self.assertEqual(res['recall@5'], 1.0)

    def test_aggregate_metrics(self):
        metrics_list = [
            {'hit@1': 1.0, 'hit@3': 1.0, 'hit@5': 1.0, 'recall@1': 1.0, 'recall@3': 1.0, 'recall@5': 1.0, 'mrr@10': 1.0, 'ndcg@10': 1.0},
            {'hit@1': 0.0, 'hit@3': 1.0, 'hit@5': 1.0, 'recall@1': 0.0, 'recall@3': 1.0, 'recall@5': 1.0, 'mrr@10': 0.5, 'ndcg@10': 0.63093},
        ]
        agg = aggregate_metrics(metrics_list)
        self.assertEqual(agg['hit@1'], 0.5)
        self.assertEqual(agg['hit@3'], 1.0)
        self.assertEqual(agg['hit@5'], 1.0)
        self.assertEqual(agg['recall@1'], 0.5)
        self.assertEqual(agg['recall@3'], 1.0)
        self.assertEqual(agg['recall@5'], 1.0)
        self.assertEqual(agg['mrr@10'], 0.75)
        self.assertEqual(agg['count'], 2.0)


class TestOllamaClientFailClosed(unittest.TestCase):
    """Test loopback enforcement and fail-closed parsing for Ollama client."""

    def test_loopback_validation(self):
        self.assertEqual(validate_loopback_url('http://localhost:11434'), 'http://localhost:11434')
        self.assertEqual(validate_loopback_url('http://127.0.0.1:11434'), 'http://127.0.0.1:11434')
        self.assertEqual(validate_loopback_url('http://[::1]:11434'), 'http://[::1]:11434')

        # Non-loopback rejection
        with self.assertRaises(ValueError):
            validate_loopback_url('http://192.168.1.1:11434')
        with self.assertRaises(ValueError):
            validate_loopback_url('http://example.com:11434')
        with self.assertRaises(ValueError):
            validate_loopback_url('https://127.0.0.1:11434')

    def test_parse_embed_response_valid(self):
        client = OllamaClient()
        payload = {'embeddings': [[0.1, 0.2, 0.3], [0.4, 0.5, 0.6]]}
        parsed = client.parse_embed_response(payload, expected_count=2)
        self.assertEqual(len(parsed), 2)
        self.assertEqual(len(parsed[0]), 3)

    def test_parse_embed_response_count_mismatch(self):
        client = OllamaClient()
        payload = {'embeddings': [[0.1, 0.2, 0.3]]}
        with self.assertRaises(ValueError) as ctx:
            client.parse_embed_response(payload, expected_count=2)
        self.assertIn('count mismatch', str(ctx.exception))

    def test_parse_embed_response_dimension_mismatch(self):
        client = OllamaClient()
        payload = {'embeddings': [[0.1, 0.2], [0.1, 0.2, 0.3]]}
        with self.assertRaises(ValueError) as ctx:
            client.parse_embed_response(payload, expected_count=2)
        self.assertIn('Inconsistent vector dimension', str(ctx.exception))

    def test_parse_embed_response_non_finite_float(self):
        client = OllamaClient()
        payload = {'embeddings': [[0.1, float('nan')]]}
        with self.assertRaises(ValueError) as ctx:
            client.parse_embed_response(payload, expected_count=1)
        self.assertIn('non-finite or invalid float', str(ctx.exception))

    def test_parse_embed_response_missing_embeddings(self):
        client = OllamaClient()
        payload = {'error': 'model not found'}
        with self.assertRaises(ValueError) as ctx:
            client.parse_embed_response(payload, expected_count=1)
        self.assertIn("missing 'embeddings'", str(ctx.exception))

    def test_parse_runtime_metadata_keeps_bounded_fields(self):
        metadata = OllamaClient.parse_runtime_metadata(
            {'version': '0.34.2'},
            {
                'models': [
                    {
                        'name': 'qwen3-embedding:0.6b',
                        'digest': 'sha256:abc',
                        'size': 639,
                        'modified_at': '2026-01-01T00:00:00Z',
                        'details': {
                            'format': 'gguf',
                            'parameter_size': '595.8M',
                            'quantization_level': 'Q8_0',
                            'untrusted_extra': 'drop-me',
                        },
                    }
                ]
            },
            {
                'models': [
                    {
                        'name': 'qwen3-embedding:0.6b',
                        'digest': 'sha256:abc',
                        'size': 2400,
                        'size_vram': 2300,
                        'context_length': 4096,
                        'expires_at': '2026-01-01T00:05:00Z',
                    }
                ]
            },
            {'qwen3-embedding:0.6b'},
        )
        self.assertEqual(metadata['version'], '0.34.2')
        installed = metadata['installed_models']['qwen3-embedding:0.6b']
        self.assertEqual(installed['digest'], 'sha256:abc')
        self.assertNotIn('untrusted_extra', installed['details'])
        loaded = metadata['loaded_models_after_run']['qwen3-embedding:0.6b']
        self.assertEqual(loaded['size_vram_bytes'], 2300)

    def test_parse_runtime_metadata_requires_all_models(self):
        with self.assertRaises(ValueError):
            OllamaClient.parse_runtime_metadata(
                {'version': '0.34.2'},
                {'models': []},
                {'models': []},
                {'missing:latest'},
            )


class TestRunnerDocEmbeddingReuse(unittest.TestCase):
    """Verify runner reuses Qwen document embeddings between qwen_raw and qwen_instructed."""

    def test_qwen_document_embeddings_reused(self):
        with tempfile.TemporaryDirectory() as td:
            out_dir = Path(td) / 'reports'
            # Run benchmark with mocked client
            mock_client = MagicMock()
            mock_client.get_runtime_metadata.return_value = {
                'version': 'test',
                'installed_models': {
                    'qwen3-embedding:0.6b': {
                        'name': 'qwen3-embedding:0.6b',
                        'digest': 'test-digest',
                        'size_bytes': 1,
                        'modified_at': None,
                        'details': {},
                    }
                },
                'loaded_models_after_run': {},
            }

            # Return dummy 3-dim vectors
            def mock_embed(model, texts, batch_size=16):
                return [[0.1, 0.2, 0.3] for _ in texts], 10.0

            mock_client.embed_batch.side_effect = mock_embed

            from unittest.mock import patch

            with patch('benchmark.OllamaClient', return_value=mock_client):
                code = benchmark.run_benchmark(
                    variants=['qwen_raw', 'qwen_instructed'],
                    ollama_host='http://127.0.0.1:11434',
                    output_dir=out_dir,
                    batch_size=16,
                    report_name='test_reuse',
                    dry_run=False,
                )
                self.assertEqual(code, 0)

                # Check report JSON
                report_file = out_dir / 'test_reuse.json'
                self.assertTrue(report_file.is_file())
                data = json.loads(report_file.read_text())
                self.assertEqual(
                    data['ollama_runtime']['loaded_models_before_run'],
                    {},
                )

                # qwen_raw must have doc_embeddings_reused = False
                self.assertFalse(data['variants']['qwen_raw']['doc_embeddings_reused'])
                # qwen_instructed must have doc_embeddings_reused = True
                self.assertTrue(data['variants']['qwen_instructed']['doc_embeddings_reused'])

                # Verify embed_batch was called exactly 3 times across the run:
                # 1 call for documents (30 texts) under qwen3-embedding:0.6b,
                # 1 call for queries under qwen_raw,
                # 1 call for queries under qwen_instructed.
                # Document embeddings were NOT recomputed for qwen_instructed!
                self.assertEqual(mock_client.embed_batch.call_count, 3)


class TestReportingAndAtomicWrite(unittest.TestCase):
    """Test atomic writing and report formatting."""

    def test_atomic_write_creates_file_cleanly(self):
        with tempfile.TemporaryDirectory() as td:
            target = Path(td) / 'sub' / 'report.txt'
            atomic_write(target, 'atomic content')
            self.assertTrue(target.is_file())
            self.assertEqual(target.read_text(), 'atomic content')

    def test_markdown_report_formatting(self):
        sample_data = {
            'run_timestamp': '2026-09-22T12:00:00Z',
            'command_metadata': {'ollama_host': 'http://127.0.0.1:11434'},
            'limitations': 'Curated corpus limitation',
            'rebuild_rule_notice': 'Rebuild required',
            'provenance': {'manifest_sha256': 'abc', 'queries_sha256': 'def', 'source_hashes': {}},
            'variants': {
                'nomic_raw': {
                    'model': 'nomic-embed-text',
                    'vector_dimension': 768,
                    'doc_embeddings_reused': False,
                    'document_embedding_latency_ms': 50.0,
                    'query_embedding_latency_ms': 20.0,
                    'metrics_overall': {'hit@1': 0.8, 'hit@3': 0.9, 'hit@5': 1.0, 'mrr@10': 0.85, 'ndcg@10': 0.88},
                    'metrics_by_category': {},
                }
            }
        }
        md = generate_markdown_report(sample_data)
        self.assertIn('# Local Retrieval Benchmark Report', md)
        self.assertIn('nomic_raw', md)
        self.assertIn('Curated corpus limitation', md)
        self.assertIn('Rebuild required', md)


if __name__ == '__main__':
    unittest.main()
