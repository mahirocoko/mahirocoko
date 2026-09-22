# Herdr Shadow Event Router Lab

A lightweight, human-readable, standard-library Python lab for evaluating a shadow-only Herdr agent event router. This lab compares an audited local deployment of Convai's Laya typed decision model against an explicit deterministic baseline classifier for agent-lane lifecycle routing.

> **Current result (2026-09-22): No-go for integration.** The pinned checkpoint reached only 10/42 exact triplet matches, 29.2% wake recall, and 33 consistency violations. See [`RESULTS.md`](RESULTS.md) for the bounded conclusion and evidence.

---

## 1. Purpose & Core Principles

In an autonomous multi-agent hierarchy (such as Herdr/Letta), agent lanes emit ongoing stream events: progress updates, questions requiring human decisions, unrecoverable blockers, noise, and terminal report completions.

The goal of this lab is to evaluate whether a small, specialized decision model (`convaiinnovations/laya-typed-decisions`, 421M parameters) or an explicit rule-based router can reliably route agent-lane events without introducing deadlocks, security risks, or unauthorized actions.

> [!NOTE]
> **Out-of-Domain Hypothesis**: The `convaiinnovations/laya-typed-decisions` checkpoint was fine-tuned on four specific synthetic workflows. Applying it to this custom Herdr agent-lane lifecycle routing schema is strictly an **out-of-domain hypothesis** until experimental benchmarking proves otherwise.

> [!NOTE]
> **Harness Sanity Check Boundary**: Achieving a 100% match on fixtures authored alongside the deterministic rules serves only as an internal **harness sanity check**, not independent quality evidence.

### Non-Negotiable Boundaries (Shadow-Only)
- **Zero Production Integration**: This lab is completely decoupled from live Herdr or Letta orchestrators.
- **Shadow Evaluation Only**: The benchmark processes synthetic fixtures and records recommendations; it **never** triggers webhooks, sends wake interrupts, dispatches notifications, or closes lanes.
- **Strict Separation of Collection and Closure**: In accordance with the decision contract, `report_ready` must **never** imply `close_lane` directly. Persisted report collection and parent audit must occur before any lane termination.
- **No Masking of Contradictions**: The benchmark separately evaluates semantic accuracy, cross-answer consistency, and probability calibration. Inconsistent model answers are recorded verbatim and never silently rewritten into consistent ones.
- **Structured & Adversarial Corpus**: The 42 JSONL fixtures comprise a structured, adversarial test suite designed to evaluate edge cases, lifecycle noise, missing artifacts, and prompt injection attempts. It is **not** independently representative or production-balanced.

---

## 2. Confidence is Not Trust

A foundational tenet of this lab is: **Confidence is not trust.**

In initial offline smoke testing, Laya produced a critical logical contradiction:
- A terminal report event was classified as `event_type = "report_ready"` (59.6% probability, confidence 0.264) with `next_action = "collect_report"` (60.0% probability, confidence 0.261).
- Simultaneously, the model predicted `should_wake_parent = False` (`noul = 0.048` with a reported confidence of **0.952**).

In a production supervisor system, blindly trusting this high-confidence prediction would cause a **silent lane deadlock**: the report would be ready for collection, but the owning parent would never be awakened to retrieve it.

Furthermore, model temperatures outside the calibrated range `[0.5, 5]` cause clamping warnings at load time, rendering output confidence scores uncalibrated. Router predictions must therefore be treated as unverified recommendations subject to strict deterministic policy gates.

---

## 3. Audited Dependency & Model Pins

### Dependency Floor (`requirements.in`)
The lab pins exact package versions audited for known CVEs:
- `laya==0.3.5`: Verified wheel source matching PyPI sdist and GitHub release tag `v0.3.5` (byte-identical shipped Python implementation confirmed via archive extraction and file tree diff).
- `transformers==5.17.0`: Required transformers runtime.
- `torch==2.14.0`: Exceeds the `torch>=2.13.0` floor required to patch the critical `torch.jit.script` memory corruption vulnerability (PYSEC-2025-194).
- `setuptools==84.0.0`: Exceeds the `setuptools>=83.0.0` floor required to patch the APFS/HFS+ Unicode NFD/NFC manifest exclusion bypass (PYSEC-2026-3447).

*Note: Main maintains the cryptographic hash lock file (`requirements.lock`). Do not install packages or generate unpinned locks in this lab.*

### Model Manifest (`model-manifest.json`)
- **Model Identifier**: `convaiinnovations/laya-typed-decisions`
- **Revision**: `f9ab0b228f0fc0f14d873dbc99038f135c2da1b2`
- **Weight Format**: SafeTensors only (`model.safetensors`, 842.6 MB).
- **Verified SHA-256 Checksums**:
  - `encoder/config.json`: `5268d24ad3b77c8151de5dcb0762ba4391619aad9ab0bda33e36fb083cfeae6d`
  - `model.safetensors`: `4fa56de72383a9d3efa9cfa78955733c81b9fc8067a587ca4beb82c78107a24e`
  - `rl_agent_config.json`: `ebf0cd524d92342a6be5e48e9fca3d7c2babfb5a56ccd79d2171ef5d8c7f7be8`
  - `tokenizer/tokenizer_config.json`: `08d4cf3ac4dca381759441b85b91a6d40e688471dcd33d15d6649eb0a9a854d1`
  - `tokenizer/tokenizer.json`: `6c8aaa9a542084f2457eab775d4eeb51f92a70c0fd9de28d5edb0ddec3c08d30`

---

## 4. Safe Setup & Execution Sequence

### Library and Runtime Offline Controls (Not an OS Airgap)
To prevent unauthorized network egress or credential exposure, the runtime enforces the following environment controls before importing Laya or Transformers:
```bash
export HF_HUB_OFFLINE=1
export TRANSFORMERS_OFFLINE=1
export PYTHONNOUSERSITE=1
unset HF_TOKEN HUGGING_FACE_HUB_TOKEN HF_API_KEY
```

> [!WARNING]
> **Residual Boundary**: Setting these environment variables disables Hugging Face Hub telemetry and user-site packages at the Python runtime level. It is **not** an OS-level network sandbox, firewall, or hardware airgap. Unconstrained C-extensions or child processes could still access the network unless isolated by operating-system containers or namespaces.

### Process Timing & Bounded Self-Reexec
Because Python checks `site.ENABLE_USER_SITE` during startup, modifying `PYTHONNOUSERSITE` after the process has booted is ineffective. When `--engine laya` is invoked, `benchmark.py` automatically performs a bounded self-reexec with `python3 -s` to guarantee user-site packages are disabled before importing third-party libraries. A guard variable prevents recursion loops. At load time, `LayaRouterEngine` fails closed if `site.ENABLE_USER_SITE` is True or required offline variables are missing.

### Pre-Flight Manifest Verification
Before loading model weights into memory, `benchmark.py` runs a cryptographic audit:
1. Validates that the manifest declares the exact five required files with valid 64-character hex SHA-256 hashes.
2. Validates the security policy (`safetensors_only=true`, `allow_pickle=false`, `allow_remote_code=false`, `strict_file_count=true`).
3. Rejects symlinks anywhere in the model tree.
4. Fails closed if any unauthorized file (including `.bin`, `.pt`, `.pkl`, `.py`, `.sh`, `.DS_Store`, or hidden files) is present.
5. Fails closed if file count or directory structure deviates from `model-manifest.json`.

---

## 5. Usage Guide

### 1. Run Unit Tests (Model-Free)
All unit tests run standard-library assertions without downloading or loading the 842 MB model weights:
```bash
python3 -m unittest discover -s tests -p "test_*.py" -v
```

### 2. Run Deterministic Baseline Benchmark
Evaluate the explicit rule-based router against the 42 synthetic fixtures:
```bash
python3 benchmark.py --engine rules \
  --fixtures fixtures/events.jsonl \
  --output-json reports/rules_benchmark.json \
  --output-md reports/rules_benchmark.md
```

### 3. Run Laya Model Benchmark (Main Only)
When verified weights are placed in a local directory audited against `model-manifest.json`:
```bash
python3 benchmark.py --engine laya \
  --model-dir /path/to/verified/model-pinned \
  --manifest model-manifest.json \
  --device mps \
  --fixtures fixtures/events.jsonl \
  --output-json reports/laya_benchmark.json \
  --output-md reports/laya_benchmark.md
```

---

## 6. Generated Output Specifications

The benchmark CLI writes two output artifacts **atomically** (using temporary file creation and replacement to prevent partial reads):

1. **Structured JSON Report (`--output-json`)**:
   - `metadata`: Engine type, device, load latency, manifest verification status, package versions, resource caveat.
   - `evaluation`: Per-class precision/recall/F1 for `event_type` and `next_action`, wake precision/recall, exact match ratio, confusion matrices, consistency violation statistics, latency stats (including `p95_ms`), and calibration metrics (`event_type_brier`, `next_action_brier`, `wake_brier`, `event_type_ece`, `wake_ece`).
   - `samples`: Complete list of fixtures with predictions, raw probabilities, per-sample latencies, and identified consistency violations.

2. **Human-Readable Markdown Report (`--output-md`)**:
   - Executive summary table.
   - Resource caveats and memory footprints.
   - Latency statistics (min, median, mean, p95, max, load).
   - Wake detection metrics and false report-ready alerts.
   - Cross-answer consistency breakdown highlighting any contradictory model predictions.
   - Probability calibration metrics (multiclass Brier, binary Brier, ECE) when model probabilities exist (recorded as null for rule engines).

---

## 7. Decision Contract Reference

| Field | Allowed Values | Semantic Meaning |
|---|---|---|
| `event_type` | `progress` | Agent work continues; no parent intervention required. |
| | `question` | Agent asks owning parent for a decision or guidance. |
| | `blocker` | Unrecoverable error; work cannot proceed without intervention. |
| | `report_ready` | Terminal report persisted to disk; ready for audit. |
| | `noise` | Lifecycle observation without actionable consequence. |
| `should_wake_parent` | `true` / `false` | Immediate wake interrupt for owning conversation. |
| `next_action` | `wait` | Continue monitoring without notification. |
| | `notify` | Notify owning parent of an actionable event. |
| | `collect_report` | Collect and audit persisted terminal report. |
| | `close_lane` | Final lane shutdown (only after report collection/audit). |
| | `escalate` | Request human operator intervention. |
