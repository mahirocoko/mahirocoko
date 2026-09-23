"""Atomic report writing, JSON serialization, and Markdown summary formatting."""

import json
import os
from pathlib import Path
import tempfile
from typing import Any, Dict


def atomic_write(target_path: Path, content: str) -> None:
    """Write string content to target_path atomically using a temporary file in the same directory."""
    target_path.parent.mkdir(parents=True, exist_ok=True)
    temp_dir = target_path.parent
    temp_file: Path | None = None
    try:
        with tempfile.NamedTemporaryFile('w', dir=temp_dir, delete=False, encoding='utf-8') as tf:
            tf.write(content)
            tf.flush()
            os.fsync(tf.fileno())
            temp_file = Path(tf.name)
        os.replace(temp_file, target_path)
    except Exception:
        if temp_file and temp_file.exists():
            try:
                temp_file.unlink()
            except OSError:
                pass
        raise


def generate_markdown_report(report_data: Dict[str, Any]) -> str:
    """Render benchmark execution report as clean, GitHub-flavored Markdown."""
    lines: list[str] = []
    lines.append('# Local Retrieval Benchmark Report')
    lines.append('')
    lines.append(f"**Run Timestamp**: `{report_data.get('run_timestamp', 'unknown')}`  ")
    lines.append(f"**Ollama Host**: `{report_data.get('command_metadata', {}).get('ollama_host', 'N/A')}`  ")
    lines.append('')

    lines.append('## Ollama Runtime Evidence')
    lines.append('')
    runtime = report_data.get('ollama_runtime', {})
    lines.append(f"- Version: `{runtime.get('version', 'unknown')}`")
    loaded_before = sorted(runtime.get('loaded_models_before_run', {}))
    lines.append(
        '- Loaded models before run: '
        + (', '.join(f'`{name}`' for name in loaded_before) if loaded_before else 'None')
    )
    lines.append('')
    lines.append('| Model | Digest | Installed Bytes | Loaded Bytes | VRAM Bytes | Context |')
    lines.append('|:---|:---|---:|---:|---:|---:|')
    installed_models = runtime.get('installed_models', {})
    loaded_models = runtime.get('loaded_models_after_run', {})
    for model_name, installed in sorted(installed_models.items()):
        loaded = loaded_models.get(model_name, {})
        lines.append(
            f"| `{model_name}` | `{installed.get('digest', 'N/A')}` | "
            f"{installed.get('size_bytes', 0)} | {loaded.get('size_bytes', 0)} | "
            f"{loaded.get('size_vram_bytes', 0)} | {loaded.get('context_length', 0)} |"
        )
    lines.append('')

    # Limitations Callout
    lines.append('> [!NOTE]')
    lines.append(f"> **Corpus Limitation**: {report_data.get('limitations', 'Curated AST corpus.')}")
    lines.append('')

    lines.append('> [!IMPORTANT]')
    lines.append(f"> **CCC Rebuild Invariant**: {report_data.get('rebuild_rule_notice', 'Index rebuild required.')}")
    lines.append('')

    # Overall Variant Comparison Table
    lines.append('## Overall Retrieval Performance')
    lines.append('')
    lines.append(
        '| Variant | Model | Dim | Reused Docs? | Hit@1 | Hit@3 | Hit@5 | Recall@1 | Recall@3 | Recall@5 | MRR@10 | nDCG@10 | Doc Latency (ms) | Query Latency (ms) |'
    )
    lines.append(
        '|:---|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|'
    )

    variants = report_data.get('variants', {})
    for var_name, vdata in variants.items():
        m_all = vdata.get('metrics_overall', {})
        reused = 'Yes' if vdata.get('doc_embeddings_reused') else 'No'
        lines.append(
            f"| `{var_name}` | `{vdata.get('model', 'N/A')}` | {vdata.get('vector_dimension', 0)} | "
            f"{reused} | {m_all.get('hit@1', 0.0):.4f} | {m_all.get('hit@3', 0.0):.4f} | "
            f"{m_all.get('hit@5', 0.0):.4f} | {m_all.get('recall@1', 0.0):.4f} | "
            f"{m_all.get('recall@3', 0.0):.4f} | {m_all.get('recall@5', 0.0):.4f} | "
            f"{m_all.get('mrr@10', 0.0):.4f} | {m_all.get('ndcg@10', 0.0):.4f} | "
            f"{vdata.get('document_embedding_latency_ms', 0.0):.1f} | {vdata.get('query_embedding_latency_ms', 0.0):.1f} |"
        )
    lines.append('')

    # Category Breakdown Table
    lines.append('## Category Breakdown')
    lines.append('')
    lines.append('| Category | Variant | Queries | Hit@1 | Hit@3 | Hit@5 | Recall@1 | Recall@3 | Recall@5 | MRR@10 | nDCG@10 |')
    lines.append('|:---|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|')

    # Gather all categories
    all_categories: set[str] = set()
    for vdata in variants.values():
        all_categories.update(vdata.get('metrics_by_category', {}).keys())

    for cat in sorted(all_categories):
        for var_name, vdata in variants.items():
            cat_metrics = vdata.get('metrics_by_category', {}).get(cat, {})
            lines.append(
                f"| `{cat}` | `{var_name}` | {int(cat_metrics.get('count', 0))} | "
                f"{cat_metrics.get('hit@1', 0.0):.4f} | {cat_metrics.get('hit@3', 0.0):.4f} | "
                f"{cat_metrics.get('hit@5', 0.0):.4f} | {cat_metrics.get('recall@1', 0.0):.4f} | "
                f"{cat_metrics.get('recall@3', 0.0):.4f} | {cat_metrics.get('recall@5', 0.0):.4f} | "
                f"{cat_metrics.get('mrr@10', 0.0):.4f} | "
                f"{cat_metrics.get('ndcg@10', 0.0):.4f} |"
            )
    lines.append('')

    lines.append('## Query Vector Distinctness')
    lines.append('')
    lines.append('| Variant | Unique / Total | Duplicate Query Groups |')
    lines.append('|:---|:---:|:---|')
    for var_name, vdata in variants.items():
        diagnostics = vdata.get('query_vector_diagnostics', {})
        duplicate_groups = diagnostics.get('duplicate_groups', [])
        duplicate_text = ', '.join(
            '/'.join(group.get('query_ids', [])) for group in duplicate_groups
        ) or 'None'
        lines.append(
            f"| `{var_name}` | {diagnostics.get('unique_query_vectors', 0)} / "
            f"{diagnostics.get('total_queries', 0)} | {duplicate_text} |"
        )
    lines.append('')

    lines.append('### Distinctness by Query Category')
    lines.append('')
    lines.append('| Category | Variant | Unique / Total |')
    lines.append('|:---|:---|:---:|')
    for cat in sorted(all_categories):
        for var_name, vdata in variants.items():
            category_diagnostics = (
                vdata.get('query_vector_diagnostics', {})
                .get('by_category', {})
                .get(cat, {})
            )
            lines.append(
                f"| `{cat}` | `{var_name}` | "
                f"{category_diagnostics.get('unique_query_vectors', 0)} / "
                f"{category_diagnostics.get('total_queries', 0)} |"
            )
    lines.append('')

    # Provenance Table
    lines.append('## Provenance & Cryptographic Hashes')
    lines.append('')
    lines.append('| Artifact | SHA-256 Digest |')
    lines.append('|:---|:---|')
    prov = report_data.get('provenance', {})
    lines.append(f"| `fixtures/documents.json` | `{prov.get('manifest_sha256', 'N/A')}` |")
    lines.append(f"| `fixtures/queries.jsonl` | `{prov.get('queries_sha256', 'N/A')}` |")
    for src_path, digest in sorted(prov.get('source_hashes', {}).items()):
        lines.append(f'| `{src_path}` | `{digest}` |')
    lines.append('')

    return '\n'.join(lines)
