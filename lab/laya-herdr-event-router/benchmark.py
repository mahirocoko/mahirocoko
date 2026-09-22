#!/usr/bin/env python3
"""Shadow-only Herdr event router benchmark CLI."""

import argparse
import datetime
import importlib.metadata
import json
import os
import sys
import tempfile
import time
from pathlib import Path
from typing import Any, Dict, List, Optional

# Router components
from router.baseline import RuleBasedRouter
from router.contract import Decision
from router.manifest import compute_sha256, verify_manifest
from router.metrics import evaluate_run

RESOURCE_CAVEAT = (
    "Resource caveat: Cold load latency ~35s+, peak memory footprint ~3.96 GB on "
    "Apple Silicon MPS. Laya is an audited 421M parameter model requiring significant "
    "memory headroom and dedicated device allocation compared to sub-millisecond rule routers."
)


def load_fixtures(fixture_path: Path) -> List[Dict[str, Any]]:
    """Load JSONL fixtures from disk."""
    if not fixture_path.is_file():
        raise FileNotFoundError(f"Fixture file not found: {fixture_path}")

    fixtures: List[Dict[str, Any]] = []
    with fixture_path.open("r", encoding="utf-8") as f:
        for idx, line in enumerate(f, start=1):
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            try:
                record = json.loads(line)
                fixtures.append(record)
            except json.JSONDecodeError as e:
                raise ValueError(f"Malformed JSON in {fixture_path} line {idx}: {e}")

    if not fixtures:
        raise ValueError(f"Fixture file {fixture_path} contains no records.")
    return fixtures


def get_package_versions() -> Dict[str, str]:
    """Inspect installed package versions safely."""
    versions: Dict[str, str] = {}
    for pkg in ("laya", "transformers", "torch", "setuptools"):
        try:
            versions[pkg] = importlib.metadata.version(pkg)
        except importlib.metadata.PackageNotFoundError:
            versions[pkg] = "not_installed"
    return versions


def atomic_write(target_path: Path, content: str) -> None:
    """Write content to target_path atomically using tempfile and rename."""
    target_path.parent.mkdir(parents=True, exist_ok=True)
    temp_dir = target_path.parent
    with tempfile.NamedTemporaryFile("w", dir=temp_dir, delete=False, encoding="utf-8") as tf:
        tf.write(content)
        temp_file = Path(tf.name)
    temp_file.replace(target_path)


def build_source_hashes() -> Dict[str, str]:
    """Hash the executable benchmark surface for report provenance."""
    lab_root = Path(__file__).resolve().parent
    source_paths = [
        lab_root / "benchmark.py",
        *sorted((lab_root / "router").glob("*.py")),
    ]
    return {
        str(path.relative_to(lab_root)): compute_sha256(path)
        for path in source_paths
    }


REEXEC_GUARD_VAR = "_LAYA_BOOTSTRAP_REEXECED"


def needs_laya_engine(argv: List[str]) -> bool:
    """Check if --engine laya is requested in arguments."""
    for i, arg in enumerate(argv):
        if arg == "--engine=laya":
            return True
        if arg == "--engine" and i + 1 < len(argv) and argv[i + 1] == "laya":
            return True
    return False


def check_laya_env_ready() -> tuple[bool, List[str]]:
    """Check if user site is disabled and offline environment variables are set."""
    import site

    reasons: List[str] = []
    if site.ENABLE_USER_SITE:
        reasons.append(f"site.ENABLE_USER_SITE is {site.ENABLE_USER_SITE} (must be False)")
    for var in ("HF_HUB_OFFLINE", "TRANSFORMERS_OFFLINE", "PYTHONNOUSERSITE"):
        if os.environ.get(var) != "1":
            reasons.append(f"Environment variable {var}={os.environ.get(var)!r} (must be '1')")
    for var in ("HF_TOKEN", "HUGGING_FACE_HUB_TOKEN", "HF_API_KEY"):
        if var in os.environ:
            reasons.append(f"Forbidden token variable '{var}' is present")
    return len(reasons) == 0, reasons


def bootstrap_laya_environment() -> None:
    """Self-reexec if --engine laya is invoked without required library offline isolation.

    Ensures PYTHONNOUSERSITE=1, HF_HUB_OFFLINE=1, TRANSFORMERS_OFFLINE=1 are set,
    and HF_TOKEN / HUGGING_FACE_HUB_TOKEN / HF_API_KEY are absent before any
    third-party imports happen. Prevents infinite re-exec loops via a guard env var.
    """
    if not needs_laya_engine(sys.argv):
        return

    ready, reasons = check_laya_env_ready()
    if ready:
        return

    # Check if we already reexeced once
    if os.environ.get(REEXEC_GUARD_VAR) == "1":
        print(
            "Fatal: Self-reexec failed to establish offline/no-user-site environment; "
            f"aborting to prevent reexec loop. Reasons: {'; '.join(reasons)}",
            file=sys.stderr,
        )
        sys.exit(1)

    print(
        f"Bootstrapping offline environment for --engine laya ({'; '.join(reasons)})...",
        file=sys.stderr,
    )
    new_env = dict(os.environ)
    new_env["PYTHONNOUSERSITE"] = "1"
    new_env["HF_HUB_OFFLINE"] = "1"
    new_env["TRANSFORMERS_OFFLINE"] = "1"
    for var in ("HF_TOKEN", "HUGGING_FACE_HUB_TOKEN", "HF_API_KEY"):
        new_env.pop(var, None)
    new_env[REEXEC_GUARD_VAR] = "1"

    # Re-exec Python with -s flag to disable user site
    os.execve(sys.executable, [sys.executable, "-s", *sys.argv], new_env)


def generate_markdown_report(
    metadata: Dict[str, Any], evaluation: Dict[str, Any], samples: List[Dict[str, Any]]
) -> str:
    """Generate clean, human-readable markdown benchmark report."""
    md: List[str] = []
    md.append(f"# Herdr Event Router Benchmark Report ({metadata['engine'].upper()})")
    md.append(f"\n*Generated at: {metadata['timestamp']}*\n")

    # Safety Notice
    md.append("> **Shadow-Only Notice**: This router runs in shadow/audit mode. ")
    md.append("> It evaluates decisions against fixtures without executing any action, waking conversations, or closing lanes.\n")

    if metadata["engine"] == "rules":
        md.append("> **Harness Sanity Check Notice**: 100% exact match on fixtures authored alongside the deterministic rules serves only as a harness sanity check, not independent quality evidence.\n")

    # Metadata Table
    md.append("## 1. Execution Metadata")
    md.append("| Field | Value |")
    md.append("|---|---|")
    md.append(f"| Engine | `{metadata['engine']}` |")
    md.append(f"| Device | `{metadata['device']}` |")
    md.append(f"| Load Latency | `{metadata['load_latency_ms']:.2f} ms` |")
    md.append(f"| Model Manifest Verified | `{metadata['model_manifest_verified']}` |")
    for pkg, ver in metadata["package_versions"].items():
        md.append(f"| Package: {pkg} | `{ver}` |")
    provenance = metadata.get("provenance", {})
    if provenance.get("fixture_sha256"):
        md.append(f"| Fixture SHA-256 | `{provenance['fixture_sha256']}` |")
    if provenance.get("manifest_sha256"):
        md.append(f"| Manifest SHA-256 | `{provenance['manifest_sha256']}` |")
        md.append(f"| Model Revision | `{provenance['model_revision']}` |")
    md.append("")

    # Resource Caveat
    md.append("## 2. Resource Caveat")
    md.append(f"> [!WARNING]\n> {metadata['resource_caveat']}\n")

    # Overall Summary
    total = evaluation["total_samples"]
    exact = evaluation["exact_match_count"]
    ratio = evaluation["exact_match_ratio"] * 100
    w_prec = evaluation["wake_metrics"]["precision"] * 100
    w_rec = evaluation["wake_metrics"]["recall"] * 100
    false_rep = evaluation["false_report_ready_count"]
    violations = evaluation["consistency"]["total_violations"]

    md.append("## 3. High-Level Summary")
    md.append("| Metric | Result | Note |")
    md.append("|---|---|---|")
    md.append(f"| Total Fixtures | {total} | Structured & adversarial corpus (not independently representative or production-balanced) |")
    md.append(f"| Exact Triplet Match | {exact}/{total} ({ratio:.1f}%) | event_type + wake + next_action |")
    md.append(f"| Wake Precision | {w_prec:.1f}% | should_wake_parent = True |")
    md.append(f"| Wake Recall | {w_rec:.1f}% | should_wake_parent = True |")
    md.append(f"| False Report-Ready Count | **{false_rep}** | Premature or unverified completion |")
    md.append(f"| Consistency Violations | **{violations}** | Cross-answer logical contradictions |")
    md.append("")

    # Latency Stats
    lat = evaluation["latency_stats"]
    md.append("## 4. Latency Statistics (ms)")
    md.append("| Stat | Milliseconds |")
    md.append("|---|---|")
    md.append(f"| Min Latency | {lat['min_ms']:.2f} ms |")
    md.append(f"| Median Latency | {lat['median_ms']:.2f} ms |")
    md.append(f"| Mean Latency | {lat['mean_ms']:.2f} ms |")
    md.append(f"| P95 Latency | {lat['p95_ms']:.2f} ms |")
    md.append(f"| Max Latency | {lat['max_ms']:.2f} ms |")
    md.append("")

    # Event Type Breakdown
    md.append("## 5. Event Type Classification Metrics")
    md.append("| Event Type | Precision | Recall | F1 | TP | FP | FN |")
    md.append("|---|---|---|---|---|---|---|")
    for cls, metrics in evaluation["event_type_metrics"].items():
        md.append(
            f"| `{cls}` | {metrics['precision']:.2f} | {metrics['recall']:.2f} | "
            f"{metrics['f1']:.2f} | {metrics['true_positive']} | "
            f"{metrics['false_positive']} | {metrics['false_negative']} |"
        )
    md.append("")

    # Next Action Breakdown
    md.append("## 6. Next Action Recommendation Metrics")
    md.append("| Next Action | Precision | Recall | F1 | TP | FP | FN |")
    md.append("|---|---|---|---|---|---|---|")
    for act, metrics in evaluation["next_action_metrics"].items():
        md.append(
            f"| `{act}` | {metrics['precision']:.2f} | {metrics['recall']:.2f} | "
            f"{metrics['f1']:.2f} | {metrics['true_positive']} | "
            f"{metrics['false_positive']} | {metrics['false_negative']} |"
        )
    md.append("")

    # Cross-Answer Consistency & Contradictions
    md.append("## 7. Cross-Answer Consistency Analysis")
    if violations == 0:
        md.append("Zero logical consistency violations detected across all fixtures.\n")
    else:
        md.append(f"Detected **{violations}** logical violations across **{evaluation['consistency']['samples_with_violations']}** fixtures:\n")
        for vtype, cnt in evaluation["consistency"]["violation_type_counts"].items():
            md.append(f"- **{vtype}**: {cnt} occurrence(s)")
        md.append("\n### Consistency Violation Details")
        for rec in evaluation["consistency"]["violation_details"]:
            md.append(f"- **Sample `{rec['id']}`** (category: `{rec['category']}`):")
            md.append(f"  - Decision: event_type=`{rec['decision']['event_type']}`, wake=`{rec['decision']['should_wake_parent']}`, next_action=`{rec['decision']['next_action']}`")
            for violation in rec["violations"]:
                md.append(f"  - ⚠️ {violation}")
    md.append("")

    # Probability Calibration
    cal = evaluation.get("calibration", {})
    md.append("## 8. Probability Calibration Metrics")
    if cal.get("available"):
        md.append("| Metric | Score | Note |")
        md.append("|---|---|---|")
        md.append(f"| Event Type Multiclass Brier | {cal['event_type_brier']:.4f} | Lower is better (0=perfect) |")
        md.append(f"| Next Action Multiclass Brier | {cal['next_action_brier']:.4f} | Lower is better (0=perfect) |")
        md.append(f"| Wake Binary Brier | {cal['wake_brier']:.4f} | Lower is better (0=perfect) |")
        md.append(f"| Event Type ECE (10-bin) | {cal['event_type_ece']:.4f} | Top-label expected calibration error |")
        md.append(f"| Wake ECE (10-bin) | {cal['wake_ece']:.4f} | Wake confidence calibration error |")
    else:
        md.append("Calibration metrics (multiclass Brier, binary Brier, and ECE) are not applicable for deterministic rule engines lacking model probability distributions. Values are recorded as null.")
    md.append("")

    # Sample Predictions
    md.append("## 9. Fixture Predictions")
    md.append("| ID | Category | Expected | Predicted | Wake | Latency (ms) | Consistent |")
    md.append("|---|---|---|---|---|---|---|")
    for s in samples:
        exp = f"{s['expected']['event_type']}/{s['expected']['next_action']}"
        pred = f"{s['decision']['event_type']}/{s['decision']['next_action']}"
        wake = f"{s['expected']['should_wake_parent']} -> {s['decision']['should_wake_parent']}"
        consistent = "✅" if not s["violations"] else "❌"
        md.append(
            f"| `{s['id']}` | `{s.get('category', '-')}` | `{exp}` | `{pred}` | `{wake}` | "
            f"{s['decision']['latency_ms']:.2f} | {consistent} |"
        )
    md.append("")

    return "\n".join(md)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Benchmark CLI for Herdr shadow event router"
    )
    parser.add_argument(
        "--engine",
        choices=["rules", "laya"],
        default="rules",
        help="Router engine: 'rules' (deterministic) or 'laya' (local model)",
    )
    parser.add_argument(
        "--fixtures",
        type=Path,
        default=Path("fixtures/events.jsonl"),
        help="Path to synthetic events JSONL fixtures",
    )
    parser.add_argument(
        "--model-dir",
        type=Path,
        default=None,
        help="Path to verified local model directory (required if --engine laya)",
    )
    parser.add_argument(
        "--manifest",
        type=Path,
        default=Path("model-manifest.json"),
        help="Path to model manifest JSON file",
    )
    parser.add_argument(
        "--device",
        default="cpu",
        help="Inference device for Laya (e.g. 'cpu', 'mps', 'cuda')",
    )
    parser.add_argument(
        "--output-json",
        type=Path,
        default=Path("reports/benchmark.json"),
        help="Output path for JSON evaluation report",
    )
    parser.add_argument(
        "--output-md",
        type=Path,
        default=Path("reports/benchmark.md"),
        help="Output path for Markdown evaluation report",
    )
    args = parser.parse_args()

    # Load fixtures
    try:
        fixtures = load_fixtures(args.fixtures)
    except Exception as e:
        print(f"Error loading fixtures: {e}", file=sys.stderr)
        return 1

    manifest_verified = False
    load_latency_ms = 0.0
    provenance: Dict[str, Any] = {
        "fixture_path": str(args.fixtures.resolve()),
        "fixture_sha256": compute_sha256(args.fixtures),
        "source_sha256": build_source_hashes(),
    }

    # Initialize selected engine
    if args.engine == "rules":
        t0 = time.perf_counter()
        engine = RuleBasedRouter()
        load_latency_ms = (time.perf_counter() - t0) * 1000
    elif args.engine == "laya":
        if not args.model_dir:
            print(
                "Error: --model-dir must be specified when --engine laya is selected",
                file=sys.stderr,
            )
            return 1

        # Manifest verification: Fail closed on missing/extra/wrong-hash files
        print(f"Verifying model manifest: {args.manifest} against {args.model_dir}")
        valid, errors = verify_manifest(args.model_dir, args.manifest)
        if not valid:
            print("Model manifest verification failed (fail closed):", file=sys.stderr)
            for err in errors:
                print(f"  - {err}", file=sys.stderr)
            return 2
        print("Model manifest verified successfully.")
        manifest_verified = True
        manifest_data = json.loads(args.manifest.read_text(encoding="utf-8"))
        provenance.update({
            "manifest_path": str(args.manifest.resolve()),
            "manifest_sha256": compute_sha256(args.manifest),
            "model_dir": str(args.model_dir.resolve()),
            "model_id": manifest_data["model_id"],
            "model_revision": manifest_data["revision"],
            "model_file_sha256": {
                path: entry["sha256"]
                for path, entry in manifest_data["files"].items()
            },
        })

        # Import and initialize Laya engine
        from router.laya_engine import LayaRouterEngine

        try:
            print(f"Loading Laya model on device '{args.device}'...")
            engine = LayaRouterEngine(
                model_dir=args.model_dir,
                manifest_path=args.manifest,
                device=args.device,
            )
            load_latency_ms = engine.load_latency_ms
            print(f"Laya model loaded in {load_latency_ms:.2f} ms.")
        except Exception as e:
            print(f"Failed to load Laya model: {e}", file=sys.stderr)
            return 1
    else:
        print(f"Unsupported engine: {args.engine}", file=sys.stderr)
        return 1

    # Run predictions
    decisions: List[Decision] = []
    samples: List[Dict[str, Any]] = []

    print(f"Evaluating {len(fixtures)} fixtures with engine '{args.engine}'...")
    for f in fixtures:
        msg = f["message"]
        decision = engine.classify(msg)
        decisions.append(decision)

        # Check consistency per sample
        from router.contract import check_consistency

        violations = check_consistency(
            decision.event_type, decision.should_wake_parent, decision.next_action
        )

        samples.append({
            "id": f["id"],
            "category": f.get("category", "unknown"),
            "message": msg,
            "expected": f["expected"],
            "decision": decision.to_dict(),
            "violations": violations,
        })

    # Evaluate metrics
    evaluation = evaluate_run(fixtures, decisions)

    # Prepare report metadata
    metadata = {
        "engine": args.engine,
        "device": args.device if args.engine == "laya" else "n/a",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "model_manifest_verified": manifest_verified,
        "load_latency_ms": round(load_latency_ms, 2),
        "package_versions": get_package_versions(),
        "resource_caveat": RESOURCE_CAVEAT,
        "provenance": provenance,
    }

    full_report = {
        "metadata": metadata,
        "evaluation": evaluation,
        "samples": samples,
    }

    # Write reports atomically
    json_content = json.dumps(full_report, indent=2)
    md_content = generate_markdown_report(metadata, evaluation, samples)

    atomic_write(args.output_json, json_content)
    atomic_write(args.output_md, md_content)

    print(f"\nBenchmark completed successfully.")
    print(f"Exact match ratio: {evaluation['exact_match_ratio'] * 100:.1f}% ({evaluation['exact_match_count']}/{evaluation['total_samples']})")
    print(f"Wake precision: {evaluation['wake_metrics']['precision'] * 100:.1f}%, Wake recall: {evaluation['wake_metrics']['recall'] * 100:.1f}%")
    print(f"False report-ready count: {evaluation['false_report_ready_count']}")
    print(f"Consistency violations: {evaluation['consistency']['total_violations']}")
    print(f"Reports written atomically:")
    print(f"  - JSON: {args.output_json}")
    print(f"  - Markdown: {args.output_md}")

    return 0


if __name__ == "__main__":
    bootstrap_laya_environment()
    sys.exit(main())
