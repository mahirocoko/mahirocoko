"""Metrics and evaluation computation for router benchmark."""

import statistics
from typing import Any, Dict, List, Optional, Set

from .contract import EVENT_TYPES, NEXT_ACTIONS, Decision, check_consistency


def calculate_per_class_metrics(
    actuals: List[str], predictions: List[str], classes: tuple[str, ...]
) -> Dict[str, Dict[str, float]]:
    """Compute precision, recall, and F1 for a given set of classes."""
    results: Dict[str, Dict[str, float]] = {}

    for cls in classes:
        tp = sum(1 for a, p in zip(actuals, predictions) if a == cls and p == cls)
        fp = sum(1 for a, p in zip(actuals, predictions) if a != cls and p == cls)
        fn = sum(1 for a, p in zip(actuals, predictions) if a == cls and p != cls)

        precision = round(tp / (tp + fp), 4) if (tp + fp) > 0 else 0.0
        recall = round(tp / (tp + fn), 4) if (tp + fn) > 0 else 0.0
        f1 = (
            round(2 * precision * recall / (precision + recall), 4)
            if (precision + recall) > 0
            else 0.0
        )

        results[cls] = {
            "true_positive": tp,
            "false_positive": fp,
            "false_negative": fn,
            "precision": precision,
            "recall": recall,
            "f1": f1,
        }

    return results


def build_confusion_matrix(
    actuals: List[str], predictions: List[str], classes: tuple[str, ...]
) -> Dict[str, Dict[str, int]]:
    """Build confusion matrix: matrix[actual][predicted] = count."""
    matrix: Dict[str, Dict[str, int]] = {
        act: {pred: 0 for pred in classes} for act in classes
    }
    for a, p in zip(actuals, predictions):
        if a in matrix and p in matrix[a]:
            matrix[a][p] += 1
    return matrix


def compute_p95(values: List[float]) -> float:
    """Compute 95th percentile latency in milliseconds."""
    if not values:
        return 0.0
    if len(values) == 1:
        return round(values[0], 2)
    return round(statistics.quantiles(values, n=100, method="inclusive")[94], 2)


def compute_multiclass_brier(
    actuals: List[str],
    predicted_probs: List[Dict[str, float]],
    classes: tuple[str, ...],
) -> float:
    """Compute multiclass Brier score: (1/N) * sum_i sum_k (p_{i,k} - y_{i,k})^2."""
    if not actuals or len(actuals) != len(predicted_probs):
        raise ValueError("Actuals and predicted probabilities must be non-empty and matching in length")

    total = 0.0
    for actual, probs in zip(actuals, predicted_probs):
        for cls in classes:
            y = 1.0 if actual == cls else 0.0
            p = float(probs.get(cls, 0.0))
            total += (p - y) ** 2
    return round(total / len(actuals), 4)


def compute_binary_brier(
    actuals: List[bool],
    predicted_probs: List[float],
) -> float:
    """Compute binary Brier score: (1/N) * sum_i (p_i - y_i)^2."""
    if not actuals or len(actuals) != len(predicted_probs):
        raise ValueError("Actuals and predicted probabilities must be non-empty and matching in length")

    total = 0.0
    for actual, p in zip(actuals, predicted_probs):
        y = 1.0 if actual else 0.0
        total += (float(p) - y) ** 2
    return round(total / len(actuals), 4)


def compute_ece(
    confidences: List[float],
    accuracies: List[bool],
    num_bins: int = 10,
) -> float:
    """Compute Expected Calibration Error (ECE) with equal-width bins."""
    if not confidences or len(confidences) != len(accuracies):
        raise ValueError("Confidences and accuracies must be non-empty and matching in length")

    n = len(confidences)
    bin_size = 1.0 / num_bins
    ece = 0.0

    for b in range(num_bins):
        bin_lower = b * bin_size
        bin_upper = (b + 1) * bin_size

        if b == num_bins - 1:
            in_bin = [
                i for i, c in enumerate(confidences)
                if bin_lower <= c <= bin_upper
            ]
        else:
            in_bin = [
                i for i, c in enumerate(confidences)
                if bin_lower <= c < bin_upper
            ]

        if in_bin:
            bin_acc = sum(1 for i in in_bin if accuracies[i]) / len(in_bin)
            bin_conf = sum(confidences[i] for i in in_bin) / len(in_bin)
            ece += (len(in_bin) / n) * abs(bin_acc - bin_conf)

    return round(ece, 4)


def check_probabilities_available(decisions: List[Decision]) -> bool:
    """Check if all decisions contain valid Laya-style raw probability distributions."""
    if not decisions:
        return False
    for d in decisions:
        raw = d.raw_probabilities
        if not isinstance(raw, dict):
            return False
        # Check event_type probabilities
        et_data = raw.get("event_type")
        if not isinstance(et_data, dict) or not isinstance(et_data.get("probabilities"), dict):
            return False
        # Check should_wake_parent noul
        wake_data = raw.get("should_wake_parent")
        if not isinstance(wake_data, dict) or "noul" not in wake_data:
            return False
        # Check next_action probabilities
        na_data = raw.get("next_action")
        if not isinstance(na_data, dict) or not isinstance(na_data.get("probabilities"), dict):
            return False
    return True


def evaluate_run(
    fixtures: List[Dict[str, Any]],
    decisions: List[Decision],
) -> Dict[str, Any]:
    """Calculate complete benchmark evaluation results."""
    if len(fixtures) != len(decisions):
        raise ValueError(
            f"Fixtures and decisions length mismatch: {len(fixtures)} != {len(decisions)}"
        )

    latencies = [d.latency_ms for d in decisions if d.latency_ms > 0]
    latency_stats = {
        "count": len(latencies),
        "mean_ms": round(statistics.mean(latencies), 2) if latencies else 0.0,
        "median_ms": round(statistics.median(latencies), 2) if latencies else 0.0,
        "p95_ms": compute_p95(latencies),
        "min_ms": round(min(latencies), 2) if latencies else 0.0,
        "max_ms": round(max(latencies), 2) if latencies else 0.0,
    }

    # Ground truth vs predicted lists
    actual_event_types = [f["expected"]["event_type"] for f in fixtures]
    pred_event_types = [d.event_type for d in decisions]

    actual_actions = [f["expected"]["next_action"] for f in fixtures]
    pred_actions = [d.next_action for d in decisions]

    actual_wakes = [bool(f["expected"]["should_wake_parent"]) for f in fixtures]
    pred_wakes = [bool(d.should_wake_parent) for d in decisions]

    # 1. Per-class metrics
    event_type_metrics = calculate_per_class_metrics(
        actual_event_types, pred_event_types, EVENT_TYPES
    )
    next_action_metrics = calculate_per_class_metrics(
        actual_actions, pred_actions, NEXT_ACTIONS
    )

    # 2. Confusion matrices
    event_type_confusion = build_confusion_matrix(
        actual_event_types, pred_event_types, EVENT_TYPES
    )
    next_action_confusion = build_confusion_matrix(
        actual_actions, pred_actions, NEXT_ACTIONS
    )

    # 3. Wake precision and recall (binary classification)
    wake_tp = sum(1 for a, p in zip(actual_wakes, pred_wakes) if a and p)
    wake_fp = sum(1 for a, p in zip(actual_wakes, pred_wakes) if not a and p)
    wake_fn = sum(1 for a, p in zip(actual_wakes, pred_wakes) if a and not p)
    wake_tn = sum(1 for a, p in zip(actual_wakes, pred_wakes) if not a and not p)

    wake_precision = (
        round(wake_tp / (wake_tp + wake_fp), 4) if (wake_tp + wake_fp) > 0 else 0.0
    )
    wake_recall = (
        round(wake_tp / (wake_tp + wake_fn), 4) if (wake_tp + wake_fn) > 0 else 0.0
    )
    wake_f1 = (
        round(2 * wake_precision * wake_recall / (wake_precision + wake_recall), 4)
        if (wake_precision + wake_recall) > 0
        else 0.0
    )
    wake_accuracy = round((wake_tp + wake_tn) / len(actual_wakes), 4) if actual_wakes else 0.0

    wake_metrics = {
        "true_positive": wake_tp,
        "false_positive": wake_fp,
        "false_negative": wake_fn,
        "true_negative": wake_tn,
        "precision": wake_precision,
        "recall": wake_recall,
        "f1": wake_f1,
        "accuracy": wake_accuracy,
    }

    # 4. False report-ready count
    # (predicted report_ready when expected was NOT report_ready)
    false_report_ready_count = sum(
        1
        for a, p in zip(actual_event_types, pred_event_types)
        if p == "report_ready" and a != "report_ready"
    )

    # 5. Overall exact-match accuracy
    exact_matches = sum(
        1
        for f, d in zip(fixtures, decisions)
        if d.event_type == f["expected"]["event_type"]
        and d.should_wake_parent == f["expected"]["should_wake_parent"]
        and d.next_action == f["expected"]["next_action"]
    )
    exact_match_ratio = round(exact_matches / len(fixtures), 4) if fixtures else 0.0

    # 6. Consistency violations check
    sample_consistency_records: List[Dict[str, Any]] = []
    violation_counts: Dict[str, int] = {}

    for f, d in zip(fixtures, decisions):
        violations = check_consistency(
            d.event_type, d.should_wake_parent, d.next_action
        )
        if violations:
            for v in violations:
                rule_name = v.split(":")[0].strip()
                violation_counts[rule_name] = violation_counts.get(rule_name, 0) + 1
            sample_consistency_records.append({
                "id": f["id"],
                "category": f.get("category", "unknown"),
                "decision": d.to_dict(),
                "violations": violations,
            })

    total_violations = sum(violation_counts.values())

    # 7. Calibration metrics (Brier scores & ECE) - kept strictly separate from accuracy
    if check_probabilities_available(decisions):
        et_probs = [d.raw_probabilities["event_type"]["probabilities"] for d in decisions]
        et_brier = compute_multiclass_brier(actual_event_types, et_probs, EVENT_TYPES)

        na_probs = [d.raw_probabilities["next_action"]["probabilities"] for d in decisions]
        na_brier = compute_multiclass_brier(actual_actions, na_probs, NEXT_ACTIONS)

        wake_probs = [float(d.raw_probabilities["should_wake_parent"]["noul"]) for d in decisions]
        wake_brier = compute_binary_brier(actual_wakes, wake_probs)

        # Top-label confidence for event_type: predicted class probability
        et_confs = [
            float(d.raw_probabilities["event_type"]["probabilities"].get(d.event_type, 0.0))
            for d in decisions
        ]
        et_accs = [d.event_type == a for d, a in zip(decisions, actual_event_types)]
        et_ece = compute_ece(et_confs, et_accs)

        # Top confidence for binary wake decision
        wake_confs = [max(p, 1.0 - p) for p in wake_probs]
        wake_accs = [d.should_wake_parent == a for d, a in zip(decisions, actual_wakes)]
        wake_ece = compute_ece(wake_confs, wake_accs)

        calibration: Dict[str, Any] = {
            "available": True,
            "event_type_brier": et_brier,
            "next_action_brier": na_brier,
            "wake_brier": wake_brier,
            "event_type_ece": et_ece,
            "wake_ece": wake_ece,
        }
    else:
        calibration = {
            "available": False,
            "event_type_brier": None,
            "next_action_brier": None,
            "wake_brier": None,
            "event_type_ece": None,
            "wake_ece": None,
        }

    return {
        "total_samples": len(fixtures),
        "exact_match_count": exact_matches,
        "exact_match_ratio": exact_match_ratio,
        "latency_stats": latency_stats,
        "wake_metrics": wake_metrics,
        "false_report_ready_count": false_report_ready_count,
        "event_type_metrics": event_type_metrics,
        "next_action_metrics": next_action_metrics,
        "event_type_confusion": event_type_confusion,
        "next_action_confusion": next_action_confusion,
        "consistency": {
            "total_violations": total_violations,
            "samples_with_violations": len(sample_consistency_records),
            "violation_type_counts": violation_counts,
            "violation_details": sample_consistency_records,
        },
        "calibration": calibration,
    }
