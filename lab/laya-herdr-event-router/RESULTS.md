# Laya Herdr Router Experiment — 2026-09-22

## Decision

**No-go for integration.** Do not use `convaiinnovations/laya-typed-decisions` at revision `f9ab0b228f0fc0f14d873dbc99038f135c2da1b2` to wake parents, collect reports, escalate blockers, or close Herdr lanes.

The checkpoint can emit the requested typed fields, but on this custom Herdr schema its decisions are not reliable enough even for a policy-gated action path. Keep it as a local research artifact only.

This is a conclusion about this checkpoint, schema, and synthetic evaluation—not a universal claim about Laya or trained decision models.

## Security gate

- Laya package pinned to `0.3.5`; shipped Python source was byte-identical across the PyPI wheel, PyPI sdist, and pinned GitHub tag after extraction and file diff.
- Exact five-file model snapshot pinned by revision and SHA-256; `model.safetensors` hash: `4fa56de72383a9d3efa9cfa78955733c81b9fc8067a587ca4beb82c78107a24e`.
- SafeTensors structure and offsets validated before execution.
- Hash-locked 35-package environment used `torch==2.14.0`, `transformers==5.17.0`, and `setuptools==84.0.0`; `pip-audit --strict` reported no known vulnerabilities.
- Runtime loaded only the verified local path with Hugging Face/Transformers offline flags, user-site packages disabled before third-party imports, and Hugging Face token variables removed.
- Snapshot hashes were checked at CLI preflight, immediately before load, and immediately after load; the report records fixture, source, manifest, revision, and model-file hashes.
- The checkpoint remained byte-identical after execution.

These are package and runtime controls, not an OS-level network sandbox or an immutable same-user filesystem snapshot.

## Benchmark

One MPS run evaluated 42 structured synthetic and adversarial fixtures. The corpus is intentionally small and is not independently representative or production-balanced.

| Signal | Result |
|---|---:|
| Exact triplet match | 10/42 (23.8%) |
| Wake precision | 70.0% |
| Wake recall | 29.2% |
| Wake false negatives | 17 |
| False `report_ready` predictions | 6 |
| Consistency violations | 33 across 28 samples |
| Event-type Brier | 0.5737 |
| Next-action Brier | 0.6588 |
| Wake Brier | 0.3171 |
| Event-type ECE | 0.2547 |
| Wake ECE | 0.2127 |
| Cold load | 29.97 s |
| Median inference | 66.73 ms |
| P95 inference | 80.42 ms |
| Peak memory footprint | 4.10 GB |

### Decisive failures

- All six true terminal reports were classified as `report_ready`, but all six independently predicted `should_wake_parent = false`.
- Five of six ordinary questions predicted no parent wake; one additional question was mislabeled as a blocker and also predicted no wake.
- Two prompt-injection fixtures directly produced `next_action = close_lane`.
- Benign quoted error text was repeatedly mislabeled as `report_ready`.
- A missing-report fixture was labeled `noise` with `collect_report`.

The model's typed output prevented schema-shape errors, but it did not prevent incorrect or internally contradictory decisions.

## Baseline boundary

The deterministic rules score 42/42 only because the fixtures and rules were authored together. That run validates the benchmark harness and policy invariants; it is not independent evidence that the rules generalize to real Herdr events.

## Recommendation

1. Do not connect this checkpoint to live Herdr callbacks, wakes, collection, escalation, or cleanup.
2. Keep current deterministic callback/receipt rules authoritative.
3. If revisiting learned routing, collect a separately governed, de-identified event corpus and train/evaluate a task-specific model. Preserve deterministic gates around every action and retain a rules-only fallback.
4. Require a held-out dataset, high wake recall, zero direct `close_lane` recommendations, zero contract violations, and resource limits before any new shadow trial advances.

The complete per-sample JSON and Markdown reports are generated locally under the ignored `reports/` directory by `benchmark.py`.
