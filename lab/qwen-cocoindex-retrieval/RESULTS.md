# Qwen / CocoIndex Local Retrieval Result

**Date:** 2026-09-23
**Status:** Directional win for Qwen3 Embedding 0.6B; global CCC migration not approved

## Decision

Keep CocoIndex Code as the indexing and vector-storage owner. Do **not** replace or reimplement CocoIndex. A future embedding-model switch still requires rebuilding each affected index with `ccc reset && ccc index`.

`qwen3-embedding:0.6b` with an English code-retrieval instruction on the query side is the leading candidate for one real CCC pilot. It materially outperformed `nomic-embed-text:latest` on this bounded corpus, especially for Thai-to-English-code retrieval. The corpus remains small and curated, so this result does not authorize changing the global CCC model by itself.

## Testbed

- 30 exact Python AST chunks extracted from seven explicit allowlisted files in the committed Laya router lab
- 38 labeled queries across six categories, including eight less-docstring-shaped adversarial semantic queries added after the first independent review
- Local Ollama only; no external provider, package installation, model pull, CCC index, or global configuration mutation
- `nomic-embed-text:latest`: 768-dimensional vectors
- `qwen3-embedding:0.6b`: 1,024-dimensional vectors
- Qwen instructed mode reused the exact same raw Qwen document embeddings and changed only the query text

## Overall Result

| Variant | Hit@1 | Hit@3 | Recall@5 | MRR@10 | nDCG@10 |
|:---|---:|---:|---:|---:|---:|
| Nomic raw | 68.42% | 71.05% | 71.05% | 0.6959 | 0.6958 |
| Qwen raw | 84.21% | 94.74% | 94.74% | 0.8977 | 0.9176 |
| Qwen instructed | **94.74%** | **94.74%** | **97.37%** | **0.9526** | **0.9543** |

Qwen raw improved Hit@1 by 15.79 percentage points over Nomic. Adding the query-side instruction improved another 10.53 points. The instructed variant did not reach a perfect score after the adversarial set was added, which is a more credible result than the original easier 30-query run.

## Category Result

| Category | Nomic Hit@1 | Qwen Raw Hit@1 | Qwen Instructed Hit@1 |
|:---|---:|---:|---:|
| Adversarial semantic | 25.00% | 50.00% | **75.00%** |
| English semantic | 83.33% | 83.33% | **100.00%** |
| Thai semantic | 33.33% | **100.00%** | **100.00%** |
| Exact identifier | **100.00%** | 83.33% | **100.00%** |
| Behavior paraphrase | **100.00%** | **100.00%** | **100.00%** |
| Security / operational | 83.33% | **100.00%** | **100.00%** |

The adversarial category is the most useful warning: Qwen instructed still missed two of eight at rank 1, although seven of eight appeared by rank 5. Dense retrieval improved substantially but is not solved.

## Thai Query Collapse in Nomic

The installed Nomic path produced only three unique vectors for six Thai semantic queries. Four original Thai queries plus one additional Thai adversarial query collapsed to one exact vector; two other adversarial Thai queries also collapsed together despite asking about unrelated behaviors. Across all 38 queries, Nomic produced 33 unique vectors.

Both Qwen variants produced 38 distinct vectors. The Thai semantic category retrieved the correct chunk at rank 1 for all six Qwen queries, compared with two of six for Nomic.

This is stronger evidence than ranking differences alone: the current Nomic model discarded enough Thai distinctions to represent unrelated intents identically on this corpus.

## Retained Runtime Evidence

The final JSON report records the exact Ollama version, full model digests, installed sizes, loaded footprints, context lengths, timings, rankings, fixture hashes, and source hashes.

| Measurement | Nomic | Qwen 0.6B |
|:---|---:|---:|
| Exact model digest prefix | `0a109f422b47` | `ac6da0dfba84` |
| Installed artifact | 274,302,450 bytes | 639,150,858 bytes |
| Loaded footprint after run | 370,031,984 bytes | 2,370,652,077 bytes |
| Runtime context in final run | 2,048 | 4,096 |
| Document batch from unloaded start, 30 chunks | 1.452 s | 5.435 s |
| Query batch, 38 raw queries | 223.7 ms | 746.6 ms |
| Query batch, 38 instructed queries | — | 765.2 ms |

Ollama reported version `0.34.2`. The document batches began with `ollama ps` empty, but these timings can still benefit from operating-system file cache and should not be treated as portable cold-start benchmarks. Query timings are batch throughput after the model had loaded, not independently measured single-query latency.

## What This Proves

- Qwen 0.6B preserved Thai query distinctions that the installed Nomic path collapsed.
- Query-side instruction formatting improved ranking on both ordinary and adversarial cases without changing document vectors.
- The useful extension point is a thin caller-side query formatter around CCC, not a replacement vector database.
- The installed 0.6B model is strong enough to justify a real CCC pilot before downloading 4B/8B models.

## What This Does Not Prove

- The corpus contains only 30 curated AST chunks from one Python lab; it is not a full repository, mixed-language corpus, or CCC's real 1,000/250/150 chunking behavior.
- Queries and labels were authored from known code behavior. The adversarial additions reduce but do not remove authoring bias, and they are not a true held-out user-query set.
- No actual CCC SQLite index, daemon, path filter, incremental refresh, or repository-scale retrieval was exercised.
- No reranker, lexical search, BM25, or hybrid fusion was compared.
- No thin query formatter has yet been integrated with CCC's real caller boundary.

## Recommended Next Step

Run one real CCC pilot in a deliberately selected initialized project with the portable V2 security policy and a fresh strict receipt:

1. Freeze a held-out set of spontaneous Thai and English queries before changing the model.
2. Record the current Nomic results.
3. Configure `ollama/qwen3-embedding:0.6b`, then rebuild with `ccc reset && ccc index` because the vector space and dimensions change.
4. Prefix query text with the accepted English code-retrieval instruction through a thin caller-side formatter.
5. Compare real result ranks, index duration/size, single-query latency, loaded memory, and failure cases before any global rollout.

Defer 4B/8B models and Qwen3 Reranker until the real CCC pilot shows whether the remaining problem is candidate recall, final ordering, or both.
