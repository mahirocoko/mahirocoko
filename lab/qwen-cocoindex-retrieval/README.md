# Bounded Local Retrieval Benchmark (`lab/qwen-cocoindex-retrieval`)

Standalone, standard-library-only Python benchmark comparing local code-retrieval embedding variants via the Ollama `/api/embed` endpoint:
1. `nomic_raw`: `nomic-embed-text:latest` with raw documents and raw queries.
2. `qwen_raw`: `qwen3-embedding:0.6b` with raw documents and raw queries.
3. `qwen_instructed`: `qwen3-embedding:0.6b` reusing raw document vectors with asymmetric instructed queries.

---

## 1. Architecture & Design Principles

```
lab/qwen-cocoindex-retrieval/
├── README.md                      # Architecture, commands, and interpretation boundaries
├── RESULTS.md                     # Current execution status and results template
├── .gitignore                     # Ignores reports/, caches/, and Python bytecode
├── benchmark.py                   # Main CLI entrypoint with dry-run and live modes
├── retrieval/
│   ├── __init__.py
│   ├── corpus.py                  # Allowlisted manifest loader, AST extractor, and validator
│   ├── ollama_client.py           # Loopback-only fail-closed /api/embed HTTP client
│   ├── metrics.py                 # Cosine similarity, deterministic ranking, Hit@k, MRR@10, nDCG@10
│   └── reporting.py               # Atomic report writer (JSON and readable Markdown)
├── fixtures/
│   ├── documents.json             # Manifest of 30 allowlisted AST symbols from safe anchors
│   └── queries.jsonl              # 38 labeled queries across 6 categories with leakage checks
└── tests/
    ├── __init__.py
    └── test_benchmark.py          # Comprehensive unit test suite (100% standard library)
```

### Key Invariants

1. **Standard Library Only**: Built strictly on Python 3 standard library modules (`ast`, `urllib.request`, `json`, `math`, `hashlib`, `unittest`, `dataclasses`, `time`). Zero third-party package dependencies.
2. **Loopback-Enforced Ollama Client**: Accepts only loopback HTTP endpoints (`127.0.0.1`, `localhost`, `::1`). Any non-loopback address is rejected fail-closed to prevent unintended outbound network traffic.
3. **Fail-Closed Vector Parsing**: Validates that all embeddings return expected count, identical dimensions, finite non-null floats (rejects `NaN`, `+Inf`, `-Inf`), and match batch size.
4. **Exact AST Extraction from Safe Anchors**: Documents are extracted by exact AST symbol resolution (module functions and `Class.method`) from committed safe anchors in `lab/laya-herdr-event-router/`. Never scans arbitrary filesystem paths.
5. **Deterministic Ranking**: Ranked by cosine similarity with deterministic tie-breaking: `(-similarity_score, doc_id)`.
6. **Asymmetric Query Formatting**:
   - `nomic_raw`: Raw query string.
   - `qwen_raw`: Raw query string.
   - `qwen_instructed`: Formats only the query string with the prompt:
     ```text
     Instruct: Given a developer code-search query, retrieve the source-code chunk that best implements or explains the requested behavior.
     Query: <query>
     ```
7. **Document Embedding Reuse**: Document embeddings for `qwen3-embedding:0.6b` are computed once and reused between `qwen_raw` and `qwen_instructed`, avoiding redundant inference and ensuring a mathematically fair comparison of query formulation.
8. **Atomic Report Persistence**: All JSON and Markdown reports are written atomically via temporary files and `os.replace` under `reports/`.

The audited live result and bounded recommendation are recorded in `RESULTS.md`. Generated machine-readable reports remain ignored runtime evidence under `reports/`.

---

## 2. Invariant for CocoIndex (CCC) Model Changes

> [!IMPORTANT]
> **Switching embedding models in CocoIndex (CCC) requires a complete index rebuild.**
> Vector representations from different models (e.g. `nomic-embed-text:latest` vs `qwen3-embedding:0.6b`) or different dimensions inhabit entirely distinct geometric spaces. Cosine similarities between vectors produced by different models are mathematically undefined. Whenever changing embedding configuration, rebuild the index with `ccc reset && ccc index` before issuing semantic search queries.

---

## 3. Query Categories & Corpus

The testbed consists of **30 AST document chunks** (combining core functionality and closely matched distractors) and **38 labeled queries** across 6 distinct categories:

| Category | Count | Description | Leakage Policy |
|:---|:---:|:---|:---|
| `english_semantic` | 6 | English intent/purpose queries | Verified zero target symbol token leakage |
| `thai_semantic` | 6 | Thai natural language queries | Verified zero target symbol token leakage |
| `exact_identifier` | 6 | Exact function or `Class.method` tokens | Tests direct symbol identifier retrieval |
| `behavior_paraphrase` | 6 | Paraphrases of internal logic and constraints | Tests functional description matching |
| `security_operational` | 6 | Process isolation, manifest checks, offline flags | Tests operational requirement matching |
| `adversarial_semantic` | 8 | Less docstring-shaped English/Thai prompts, indirect intent, and multi-relevance cases | No exact target identifiers |

---

## 4. Evaluation Metrics

All metrics are computed per-variant overall and broken down by category:
- **Hit@1, Hit@3, Hit@5**: `1.0` if any labeled relevant document appears within the top $k$ retrieved results; otherwise `0.0`.
- **Recall@1, Recall@3, Recall@5**: fraction of all labeled relevant documents retrieved within the top $k$ results.
- **MRR@10** (Mean Reciprocal Rank): $\frac{1}{\text{rank}}$ of the *first* relevant document within the top 10 positions (1-indexed). Returns `0.0` if no relevant document appears in top 10.
- **Binary nDCG@10**: Normalized Discounted Cumulative Gain with binary relevance:
  $$\text{DCG@10} = \sum_{i=1}^{\min(10, N)} \frac{\text{rel}_i}{\log_2(i + 1)}$$
  $$\text{IDCG@10} = \sum_{i=1}^{\min(10, |\text{relevant}|)} \frac{1}{\log_2(i + 1)}$$
  $$\text{nDCG@10} = \frac{\text{DCG@10}}{\text{IDCG@10}}$$
- **Latency Breakdown**: Document embedding latency (ms) and query embedding latency (ms) are recorded separately.

---

## 5. Execution Commands

### A. Syntax Compilation Check
```bash
python3 -m py_compile lab/qwen-cocoindex-retrieval/benchmark.py \
    lab/qwen-cocoindex-retrieval/retrieval/*.py \
    lab/qwen-cocoindex-retrieval/tests/*.py
```

### B. Unit Test Suite (Model-Free)
```bash
python3 -m unittest discover -s lab/qwen-cocoindex-retrieval/tests -p 'test_*.py' -v
```

### C. Dry-Run Validation (Model-Free Corpus & Fixture Extraction)
```bash
python3 lab/qwen-cocoindex-retrieval/benchmark.py --dry-run
```

### D. Live Benchmark Run (Requires Local Ollama)
```bash
python3 lab/qwen-cocoindex-retrieval/benchmark.py \
    --ollama-host http://127.0.0.1:11434 \
    --variants nomic_raw,qwen_raw,qwen_instructed \
    --output-dir lab/qwen-cocoindex-retrieval/reports \
    --batch-size 16 \
    --verbose
```

Expected local Ollama models:
- `nomic-embed-text:latest`
- `qwen3-embedding:0.6b`

---

## 6. Interpretation Boundaries & Limitations

- **Curated AST Corpus**: The evaluation corpus is extracted from safe Python AST nodes in `lab/laya-herdr-event-router/`. It represents modular unit chunks, not an entire codebase tree or unstructured markdown documentation.
- **Local Network Scope**: Latencies reflect local HTTP loopback transport and on-device model execution (Metal/CPU/CUDA), not cloud network latency.
- **Bounded Result Only**: The live result establishes a directional winner on this curated corpus, not approval to change the global CCC model. A real initialized-project pilot with held-out queries remains required.
