# Security Policy & Audit Evidence

This document details the security baseline, cryptographic audit evidence, threat model, and containment policies for the Herdr Shadow Event Router Lab (`lab/laya-herdr-event-router/`).

---

## 1. Audit Evidence & Package Provenance

An isolated security audit was conducted on 2026-09-22 (documented under `.tmp/laya-security-audit-20260922/`).

### Package Source Verification
- **Target Package**: `laya==0.3.5`
- **PyPI Wheel SHA-256**: `4c57f64cbaf893bb5c7b4affddc2bf21a819f55df51941689f11868583be2903` (`laya-0.3.5-py3-none-any.whl`)
- **PyPI Sdist SHA-256**: `5e8a4c2b38dbddc0febe7443f26f74fd9d7571fb172648b1481830c667d59219` (`laya-0.3.5.tar.gz`)
- **Source Equivalence**: Byte-identical shipped Python source across wheel, sdist, and pinned GitHub tag `v0.3.5` after archive extraction and file tree diff (not AST comparison).

### Dependency Vulnerability Audit (`pip-audit`)
The initial unpinned dependency tree contained critical CVEs that dictated our strict dependency floor:
1. **`setuptools` (PYSEC-2026-3447)**:
   - *Vulnerability*: Prior to version 83.0.0, `FileList` applied `MANIFEST.in` exclusion directives without Unicode normalization. On macOS APFS/HFS+ normalization-preserving filesystems, an NFD filename silently bypassed an NFC exclusion rule, packing excluded files (such as local configs, keys, or private fixtures) into the published source distribution.
   - *Resolution*: Pinned floor to `setuptools==84.0.0` (fixed in 83.0.0+).
2. **`torch` (PYSEC-2025-194)**:
   - *Vulnerability*: Critical memory corruption flaw in `torch.jit.script` in PyTorch < 2.13.0, allowing local execution attacks.
   - *Resolution*: Pinned floor to `torch==2.14.0` (fixed in 2.13.0+).

### Static Analysis Findings (`bandit`)
Bandit static analysis on `laya==0.3.5` revealed:
- **`B615` (Medium Severity - Unsafe Hugging Face Hub Download)**:
  - `agent.py:137`: Call to `snapshot_download()` without revision pinning when passed a remote repository ID.
  - `agent.py:185`: Call to `AutoTokenizer.from_pretrained()` without revision pinning.
  - `common.py:143` & `146`: Calls to `AutoModel.from_pretrained()` and `AutoConfig.from_pretrained()` without revision pinning.
- **`B110` (Low Severity - Try/Except/Pass)**:
  - `agent.py:49` and `agent.py:201`: Silent suppression of exceptions during config saving and compilation flag setting.

These `B615` findings directly motivated our complete rejection of remote model loading.

---

## 2. Rejection of Remote Model IDs, trust_remote_code, and Pickle

### 1. Remote Model ID Rejection
Laya's built-in loader (`laya.load("org/model")`) automatically invokes `huggingface_hub.snapshot_download` and fetches unpinned assets over HTTPS. This mechanism is **strictly forbidden** in this lab because:
- It creates non-deterministic runtime dependencies on external third-party infrastructure.
- It exposes Hugging Face credentials if `HF_TOKEN` exists in the shell environment.
- It circumvents local cryptographic integrity validation.

### 2. Prohibition of `trust_remote_code=True`
Hugging Face architectures that require `trust_remote_code=True` allow arbitrary Python scripts inside the model repository to execute locally during model initialization. The router lab enforces standard, audited Hugging Face model classes and rejects any models requiring arbitrary execution.

### 3. Prohibition of Pickle (`.bin`, `.pt`, `.pkl`)
PyTorch weights saved using Python's `pickle` format execute arbitrary code during deserialization via the `__reduce__` protocol.
- All legacy `.bin`, `.pt`, `.pth`, and `.pkl` files are prohibited by manifest policy.
- The pre-flight manifest verification fails closed if any pickle or executable file is discovered in the model directory.

---

## 3. SafeTensors-Only Policy

The router lab operates exclusively on weights stored in **SafeTensors** format (`model.safetensors`):
- SafeTensors is a restricted binary format containing only a JSON header and raw contiguous byte buffers for tensor storage.
- It does not contain code, function pointers, or object reconstruction instructions.
- File integrity is cryptographically pinned in `model-manifest.json` to SHA-256 hash:
  `4fa56de72383a9d3efa9cfa78955733c81b9fc8067a587ca4beb82c78107a24e`

---

## 4. Library and Runtime Offline Controls (Not an OS Airgap)

To prevent unintended Hugging Face telemetry or remote fetches, the runtime establishes the following library and interpreter offline environment controls before third-party packages are loaded:

```bash
export HF_HUB_OFFLINE=1
export TRANSFORMERS_OFFLINE=1
export PYTHONNOUSERSITE=1
unset HF_TOKEN HUGGING_FACE_HUB_TOKEN HF_API_KEY
```

### Self-Reexec Bootstrap & Timing Boundary
Because Python evaluates `site.ENABLE_USER_SITE` during interpreter startup, assigning `PYTHONNOUSERSITE=1` inside Python code after process launch is ineffective. The CLI implements a bounded self-reexec bootstrap:
- When `--engine laya` is invoked, `benchmark.py` checks whether `site.ENABLE_USER_SITE` is disabled and required offline flags are set.
- If not, it sets the environment and re-execs the process with `sys.executable -s` before importing third-party modules. A guard variable prevents recursion loops.
- At model load time, `LayaRouterEngine` inspects `site.ENABLE_USER_SITE` and environment flags, failing closed if any control is violated.

### Residual Risk Boundary
These controls are **library and runtime configuration flags, NOT an operating-system airgap, container namespace sandbox, or firewall rule**. Arbitrary native binaries or unconstrained C-extensions could still establish network sockets if executed. OS-level network isolation remains the boundary for production deployment.

### Manifest Pre-Flight Verification
Before weights are touched, `router/manifest.py` verifies:
1. That all 5 manifest files exist on disk (`encoder/config.json`, `model.safetensors`, `rl_agent_config.json`, `tokenizer/tokenizer_config.json`, `tokenizer/tokenizer.json`).
2. That each file matches its exact pinned SHA-256 checksum (and that hashes in the manifest are valid 64-character hex strings).
3. That the manifest security policy itself is validated (`safetensors_only=true`, `allow_pickle=false`, `allow_remote_code=false`, `strict_file_count=true`).
4. That no extra unexpected files exist (`strict_file_count = True`), including hidden files such as `.DS_Store`.
5. That no symlinks exist anywhere in the model tree.
6. That no forbidden file extensions (`.bin`, `.pt`, `.pkl`, `.py`, `.sh`) exist in the tree.

If any check fails, the loader aborts immediately (`fail closed`).

The CLI verifies the snapshot during preflight, again immediately before model load, and again immediately after model load. The generated report records the manifest, fixture, source, revision, and model-file hashes used for the run. These repeated checks detect replacement around the loader boundary, but they do not create an immutable filesystem snapshot: another process with the same local write authority remains a residual time-of-check/time-of-use risk.

---

## 5. Known Residual Risks & Operational Caveats

1. **Out-of-Domain Checkpoint Hypothesis**:
   - The `convaiinnovations/laya-typed-decisions` model was fine-tuned by its authors on four specific synthetic workflows. Applying it to this custom Herdr agent-lane lifecycle routing schema is strictly an **out-of-domain hypothesis** until the benchmark demonstrates reliable transfer.
2. **Resource Footprint**:
   - In offline MPS smoke testing on Apple Silicon, memory allocation peaked at **3.96 GB**.
   - Cold model initialization required **~35.8 seconds**.
   - Running the 421M parameter model inside a resource-constrained supervisor container could risk OOM eviction of parent processes.
3. **Temperature Clamping & Calibration Drift**:
   - The checkpoint triggers a load-time warning:
     `RuntimeWarning: laya: this checkpoint ships temperatures outside [0.5, 5] which would distort confidence; clamping choice:11+=0.1006. Treat confidence from the affected buckets as uncalibrated.`
   - Model confidence scores cannot be interpreted as calibrated probabilities.
4. **Cross-Answer Contradictions**:
   - The model can output semantically valid classifications (`report_ready`, `collect_report`) while predicting contradictory wake actions (`should_wake_parent = False`, `noul = 0.048`).
   - Downstream supervisor systems must never bind actions directly to unverified model predictions without deterministic policy gates.
5. **Deterministic Baseline Sanity Boundary**:
   - The 100% exact match achieved by the deterministic rule-based router on the synthetic fixtures is only a **harness sanity check** validating that the fixtures and rules reflect the same authoring assumptions, not independent quality evidence.
