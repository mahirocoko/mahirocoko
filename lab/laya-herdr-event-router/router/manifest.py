"""Strict model manifest verification for local offline Laya models."""

import hashlib
import json
from pathlib import Path
import re
from typing import Dict, List, Tuple

EXPECTED_RELATIVE_PATHS = {
    "encoder/config.json",
    "model.safetensors",
    "rl_agent_config.json",
    "tokenizer/tokenizer_config.json",
    "tokenizer/tokenizer.json",
}

EXPECTED_MODEL_ID = "convaiinnovations/laya-typed-decisions"
EXPECTED_REVISION = "f9ab0b228f0fc0f14d873dbc99038f135c2da1b2"

SHA256_HEX_PATTERN = re.compile(r"^[0-9a-fA-F]{64}$")

FORBIDDEN_EXTENSIONS = (
    ".bin",
    ".pt",
    ".pth",
    ".pkl",
    ".pickle",
    ".py",
    ".sh",
)


def compute_sha256(path: Path) -> str:
    """Compute SHA-256 hex digest of a file in 64KB blocks."""
    h = hashlib.sha256()
    with path.open("rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()


def verify_manifest(model_dir: Path, manifest_path: Path) -> Tuple[bool, List[str]]:
    """Verify local model directory against strict manifest.

    Fails closed if:
    - manifest is missing or invalid JSON;
    - manifest policy deviates from strict safetensors-only, allow_pickle=false,
      allow_remote_code=false, strict_file_count=true;
    - manifest does not declare the exact five expected model file paths;
    - any manifest SHA-256 hash is empty or malformed;
    - model directory does not exist or is not a directory;
    - any symlink exists in the model tree;
    - any expected file is missing;
    - any file hash does not match;
    - any unexpected extra file (including .DS_Store or hidden files) is present;
    - any pickle/binary code execution artifact (.bin, .pt, .pkl, .py, .sh) is present.
    """
    errors: List[str] = []

    if not manifest_path.is_file():
        return False, [f"Manifest file not found: {manifest_path}"]

    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except Exception as e:
        return False, [f"Failed to parse manifest JSON: {e}"]

    if not isinstance(manifest, dict):
        return False, ["Manifest top-level entity must be a JSON object"]

    if not model_dir.is_dir():
        return False, [f"Model directory not found: {model_dir}"]

    if manifest.get("model_id") != EXPECTED_MODEL_ID:
        errors.append(
            f"Manifest model_id must be {EXPECTED_MODEL_ID!r}, got {manifest.get('model_id')!r}"
        )
    if manifest.get("revision") != EXPECTED_REVISION:
        errors.append(
            f"Manifest revision must be {EXPECTED_REVISION!r}, got {manifest.get('revision')!r}"
        )

    # 1. Validate manifest policy itself (fail closed on weakened policy)
    policy = manifest.get("policy")
    if not isinstance(policy, dict):
        errors.append("Manifest policy section is missing or invalid")
    else:
        if policy.get("safetensors_only") is not True:
            errors.append("Policy violation: 'safetensors_only' must be true")
        if policy.get("allow_pickle") is not False:
            errors.append("Policy violation: 'allow_pickle' must be false")
        if policy.get("allow_remote_code") is not False:
            errors.append("Policy violation: 'allow_remote_code' must be false")
        if policy.get("strict_file_count") is not True:
            errors.append("Policy violation: 'strict_file_count' must be true")

    expected_files = manifest.get("files")
    if not isinstance(expected_files, dict):
        errors.append("Manifest files section is missing or invalid")
        expected_files = {}

    # 2. Require exact five expected relative paths in manifest
    manifest_paths = set(expected_files.keys())
    if manifest_paths != EXPECTED_RELATIVE_PATHS:
        missing_paths = sorted(EXPECTED_RELATIVE_PATHS - manifest_paths)
        extra_paths = sorted(manifest_paths - EXPECTED_RELATIVE_PATHS)
        if missing_paths:
            errors.append(f"Manifest missing expected model file paths: {missing_paths}")
        if extra_paths:
            errors.append(f"Manifest contains unexpected file paths: {extra_paths}")

    # 3. Reject malformed / empty SHA-256 hashes in manifest
    for rel, meta in expected_files.items():
        if not isinstance(meta, dict):
            errors.append(f"Manifest entry for {rel} is not a dictionary")
            continue
        sha256 = meta.get("sha256")
        if not isinstance(sha256, str) or not SHA256_HEX_PATTERN.fullmatch(sha256.strip()):
            errors.append(f"Malformed or empty SHA-256 hash in manifest for {rel}: {sha256!r}")

    # 4. Scan actual files and reject symlinks anywhere in the model tree
    actual_files: Dict[str, Path] = {}
    for p in model_dir.rglob("*"):
        if p.is_symlink():
            errors.append(f"Symlink detected in model directory: {p.relative_to(model_dir)}")
            continue
        if p.is_file():
            # Do NOT skip .DS_Store or any hidden file under strict_file_count
            rel = str(p.relative_to(model_dir))
            actual_files[rel] = p

    # 5. Check for forbidden file extensions (pickle / unsafe code)
    for rel in actual_files:
        lower = rel.lower()
        if any(lower.endswith(ext) for ext in FORBIDDEN_EXTENSIONS):
            errors.append(
                f"Forbidden file detected under safetensors-only policy: {rel}"
            )

    # 6. Check all expected files exist and match exact SHA-256 hash
    for rel, meta in expected_files.items():
        if not isinstance(meta, dict):
            continue
        expected_hash = (meta.get("sha256") or "").lower().strip()
        if rel not in actual_files:
            errors.append(f"Missing required model file: {rel}")
            continue

        actual_path = actual_files[rel]
        actual_hash = compute_sha256(actual_path).lower()
        if actual_hash != expected_hash:
            errors.append(
                f"SHA-256 hash mismatch for {rel}: expected {expected_hash}, got {actual_hash}"
            )

    # 7. Check for unexpected extra files (strict file count / fail closed)
    # Extra files (including .DS_Store and hidden files) are flagged here
    for rel in actual_files:
        if rel not in expected_files:
            errors.append(f"Unexpected extra file in model directory: {rel}")

    return len(errors) == 0, errors
