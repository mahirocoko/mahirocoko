# Local Embedding Retrieval Comparison

**Date:** 2026-09-26
**Status:** Global CCC migrated to raw EmbeddingGemma; existing project indexes intentionally not rebuilt

## Decision

Keep CocoIndex Code as the indexing and vector-storage owner. Do **not** replace or
reimplement CocoIndex. After the pilot was restored and audited, Mahiro separately
approved migrating only the global CCC settings to raw
`ollama/embeddinggemma:latest` at 768 dimensions. Existing project indexes were
intentionally left untouched.

`embeddinggemma:latest` with `title: none | text: ` document formatting and
`task: code retrieval | query: ` query formatting is the strongest candidate from
this bounded run. It tied instructed Qwen on Hit@1, improved the deeper ranking
metrics, retained perfect Thai-semantic Hit@1, and used only 28.7% of Qwen's loaded
footprint. This is sufficient to justify one real CCC pilot, not a global switch.

The subsequent real CCC mirror pilot also favored raw EmbeddingGemma: it built the
same 12,658 chunks 4.02x faster, improved Hit@1/Hit@5/MRR on the frozen 12-query
set, reduced mean and p95 query latency, and retained the same 679 MB loaded
footprint. Mahiro approved the settings-only global migration after reviewing this
evidence. Every existing Qwen index remains stale and dimension-incompatible until
that specific project receives a strict-receipt reset and full rebuild.

`nomic-embed-text-v2-moe:latest` fixed the exact-vector collapse seen in Nomic v1,
but its retrieval quality remained materially below EmbeddingGemma and instructed
Qwen. Its recommended retrieval prefixes did not improve the overall result on this
corpus.

## Bounded Testbed

- 30 exact Python AST chunks from seven explicit allowlisted files in the committed
  Laya router lab
- 38 labeled queries across six categories, including eight adversarial semantic
  queries and six Thai semantic queries
- Local Ollama `0.34.4` over loopback only
- Each model group began with `ollama ps` empty and was unloaded before the next
  group, preventing loaded-footprint contamination
- 35 model-free benchmark tests passed before the live run
- Both new models were pulled explicitly for this comparison; no CCC configuration,
  index, package, or global retrieval setting changed

## Real CCC Mirror Pilot

The 2026-09-26 pilot exercised CocoIndex Code `0.2.41` against a disposable safe
mirror of this repository:

- 1,056 indexed files and 12,658 real CCC chunks across Markdown, JSON, YAML,
  TypeScript/TSX, JavaScript, CSS, Python, HTML, text, and Bash
- identical project files, excludes, query order, top-10 limit, and path-level labels
  for both models
- 12 frozen queries: five Thai semantic, five English semantic, and two exact
  identifiers
- each full index began with no Ollama model loaded
- 22 tracked symlink entries were omitted because the portable CCC security helper
  rejects candidate symlinks fail closed
- one historical benchmark JSON with two `generic-api-key` findings was excluded by
  exact path; no broad directory or scanner exception was added
- global settings were backed up and restored byte-for-byte; the mirror, index,
  security receipts, and backup were deleted afterward

After the pilot cleanup, the approved global migration changed only
`embedding.model`, from `ollama/qwen3-embedding:0.6b` to
`ollama/embeddinggemma:latest`. Provider, empty indexing/query params, environment,
daemon settings, comments, and formatting were preserved. The daemon verified raw
768-dimensional indexing and query embeddings, then EmbeddingGemma was unloaded.
No project index was reset or rebuilt during this migration.

CCC `0.2.41` accepts only `input_type` as a per-side LiteLLM parameter. Its Ollama
adapter forwards that value as an Ollama option rather than prepending literal text,
so it cannot express EmbeddingGemma's required retrieval prefixes. The real pilot
therefore compares the actual supported **raw** modes rather than borrowing the
stronger direct-Ollama code-prompt result.

| Measurement | Qwen raw | EmbeddingGemma raw |
|:---|---:|---:|
| Full index time | 878.16 s | **218.45 s** |
| Hit@1 | 50.00% | **58.33%** |
| Hit@3 | **83.33%** | **83.33%** |
| Hit@5 | 83.33% | **91.67%** |
| Hit@10 | **91.67%** | **91.67%** |
| MRR@10 | 0.6369 | **0.7153** |
| Mean query latency | 128.82 ms | **110.47 ms** |
| Median query latency | 115.98 ms | **104.55 ms** |
| p95 query latency | 270.90 ms | **180.10 ms** |
| Loaded footprint | 2,370,652,077 B | **679,319,961 B** |

EmbeddingGemma moved the atomic-report query from rank 7 to rank 2, the Thai
loopback query from rank 2 to rank 1, the Thai Python user-site query from rank 3
to rank 1, and the exact Laya offline symbol from rank 3 to rank 1. Regressions were
the snapshot-manifest query from rank 1 to rank 4 and `validate_loopback_url` from
rank 1 to rank 2. Both models missed the AGENTS semantic-search-policy path in the
top 10. Exact identifiers should continue to use exact search.

## Bounded Corpus Result

| Variant | Hit@1 | Hit@3 | Recall@5 | MRR@10 | nDCG@10 |
|:---|---:|---:|---:|---:|---:|
| Nomic v1 raw | 68.42% | 71.05% | 71.05% | 0.6959 | 0.6958 |
| Nomic v2 MoE raw | 76.32% | 89.47% | 90.79% | 0.8336 | 0.8618 |
| Nomic v2 MoE search prefixes | 76.32% | 89.47% | 90.79% | 0.8338 | 0.8596 |
| EmbeddingGemma raw | 86.84% | 97.37% | 98.68% | 0.9276 | 0.9439 |
| EmbeddingGemma retrieval prompts | 92.11% | 97.37% | 98.68% | 0.9526 | 0.9659 |
| **EmbeddingGemma code prompt** | **94.74%** | **97.37%** | **100.00%** | **0.9671** | **0.9693** |
| Qwen raw | 84.21% | 94.74% | 94.74% | 0.8977 | 0.9176 |
| Qwen instructed | **94.74%** | 94.74% | 97.37% | 0.9526 | 0.9543 |

EmbeddingGemma code prompt and instructed Qwen tied at Hit@1. EmbeddingGemma then
retrieved one more labeled item by rank 5 and produced stronger MRR and nDCG. On
this corpus, the practical difference is not merely model size: applying each
model's intended asymmetric retrieval formatting materially changed ranking.

## Category Result

| Category | Nomic v2 search | EmbeddingGemma code | Qwen instructed |
|:---|---:|---:|---:|
| Adversarial semantic | 37.50% | **87.50%** | 75.00% |
| English semantic | 83.33% | **100.00%** | **100.00%** |
| Thai semantic | 66.67% | **100.00%** | **100.00%** |
| Exact identifier | **100.00%** | 83.33% | **100.00%** |
| Behavior paraphrase | 83.33% | **100.00%** | **100.00%** |
| Security / operational | **100.00%** | **100.00%** | **100.00%** |

EmbeddingGemma's one visible tradeoff was exact-identifier Hit@1. It compensated
with the strongest adversarial semantic result. Exact symbol lookup should still
use exact search rather than relying only on dense retrieval.

## Memory, Artifact, and Latency Evidence

| Model | Installed artifact | Loaded footprint | Runtime context | First document batch | Best intended query batch |
|:---|---:|---:|---:|---:|---:|
| Nomic v1 | 274,302,450 B | 370,031,984 B | 2,048 | 1,949.2 ms | 257.8 ms |
| Nomic v2 MoE | 957,680,763 B | **586,206,412 B** | 512 | 2,592.9 ms | 585.3 ms |
| EmbeddingGemma | 621,875,917 B | 679,319,961 B | 2,048 | 3,174.8 ms | **328.5 ms** |
| Qwen 0.6B | 639,150,858 B | 2,370,652,077 B | 4,096 | 5,595.3 ms | 812.7 ms |

The first document batch for each model includes model startup from an unloaded
state. Intended prefixed document variants for Nomic v2 and EmbeddingGemma ran after
their raw variants and were therefore warm; they are excluded from the cold-start
column. Query numbers are 38-query warm batches, not independently timed single
queries.

EmbeddingGemma used 1,691,332,116 fewer loaded bytes than Qwen: approximately
71.3% less, or a 3.49x smaller loaded footprint. Its intended query batch was about
2.47x faster. Nomic v2 MoE loaded slightly smaller than EmbeddingGemma despite its
larger F16 artifact, but the quality loss was substantial.

## Query Distinctness

- Nomic v1 produced 33 unique vectors for 38 queries and only three unique vectors
  for six Thai semantic queries.
- Nomic v2 MoE, EmbeddingGemma, and Qwen produced 38 distinct query vectors in every
  tested formatting variant.
- Eliminating vector collapse is necessary but not sufficient: Nomic v2 still
  trailed the two leading models in ranking quality.

## What This Proves

- EmbeddingGemma is a credible lighter replacement candidate for Qwen on this exact
  Thai/English code-retrieval corpus.
- Its code-retrieval query prompt outperformed both its raw and generic retrieval
  modes.
- Nomic v2 MoE understands Thai distinctly enough to avoid Nomic v1's collapse, but
  it does not match the leading ranking quality here.
- Qwen's 2.37 GB loaded footprint is not required to achieve the best bounded result
  observed in this lab.
- Raw EmbeddingGemma also outperformed raw Qwen through CCC's real indexer and query
  path on this repository mirror, while building the index 4.02x faster.

## What This Does Not Prove

- The corpus is small, curated, Python-only, and authored from known behavior. It is
  not a full repository, mixed-language corpus, or a true held-out set of organic
  user searches.
- The real pilot's 12 path-labeled queries are small and authored from known safe
  repository anchors. They are not a large held-out sample of organic search history.
- The real pilot omitted tracked symlinks and one exact denied historical record, so
  it is a security-preserving mirror of regular repository files rather than the
  literal source checkout.
- The pilot measured full cold index duration and warm serial query latency, not
  incremental refresh performance or concurrent search behavior.
- The approved global settings migration does not make old Qwen indexes compatible.
  Each project still requires `ccc reset && ccc index` before semantic search can be
  trusted under EmbeddingGemma.

## Recommended Next Step

Keep the approved raw EmbeddingGemma global configuration. Do not configure fake
`input_type` values for Ollama or claim that CCC applies the stronger literal
code-retrieval prompt. Rebuild an initialized project only when Mahiro selects it or
when real work needs semantic search there: obtain a fresh strict receipt, run a full
reset and index serially, record duration and failures, verify representative
queries, then unload the model. Preserve exact search for identifiers.

`nomic-embed-text-v2-moe:latest` was removed after the experiment. Qwen remains
installed for rollback, while EmbeddingGemma is the global default and currently
unloaded.
