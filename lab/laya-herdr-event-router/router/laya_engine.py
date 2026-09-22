"""Laya model execution engine with strict offline controls and fail-closed parsing."""

import math
import os
import site
import time
from pathlib import Path
from typing import Any, Dict, Optional

from .contract import (
    EVENT_TYPES,
    NEXT_ACTIONS,
    QUESTIONS_SCHEMA,
    Decision,
    EventType,
    NextAction,
)
from .manifest import verify_manifest

REQUIRED_OFFLINE_ENV = {
    "HF_HUB_OFFLINE": "1",
    "TRANSFORMERS_OFFLINE": "1",
    "PYTHONNOUSERSITE": "1",
}
FORBIDDEN_ENV_VARS = (
    "HF_TOKEN",
    "HUGGING_FACE_HUB_TOKEN",
    "HF_API_KEY",
)


def _validate_probability_map(
    field_name: str,
    probabilities: Any,
    expected_labels: tuple[str, ...],
) -> None:
    """Require one finite probability per label and an approximately unit sum."""
    if not isinstance(probabilities, dict):
        raise ValueError(f"Malformed {field_name} probabilities: expected dict")

    labels = set(probabilities)
    expected = set(expected_labels)
    if labels != expected:
        missing = sorted(expected - labels)
        extra = sorted(labels - expected)
        raise ValueError(
            f"Malformed {field_name} probabilities: missing={missing}, extra={extra}"
        )

    values: list[float] = []
    for label in expected_labels:
        value = probabilities[label]
        if (
            isinstance(value, bool)
            or not isinstance(value, (int, float))
            or not math.isfinite(value)
            or not 0.0 <= float(value) <= 1.0
        ):
            raise ValueError(
                f"Invalid probability value for {field_name} '{label}': {value!r}"
            )
        values.append(float(value))

    if not math.isclose(sum(values), 1.0, rel_tol=0.0, abs_tol=0.01):
        raise ValueError(
            f"Malformed {field_name} probabilities: values sum to {sum(values):.6f}, expected approximately 1.0"
        )


def _validate_selected_argmax(
    field_name: str,
    selected: str,
    probabilities: Dict[str, Any],
) -> None:
    """Reject a selected label that disagrees with its own probability map."""
    selected_probability = float(probabilities[selected])
    maximum_probability = max(float(value) for value in probabilities.values())
    if selected_probability < maximum_probability - 1e-9:
        leaders = sorted(
            label
            for label, value in probabilities.items()
            if math.isclose(float(value), maximum_probability, abs_tol=1e-9)
        )
        raise ValueError(
            f"Malformed {field_name} answer: selected {selected!r} with probability "
            f"{selected_probability:.6f}, but argmax label(s) are {leaders} at "
            f"{maximum_probability:.6f}"
        )


def verify_offline_environment() -> None:
    """Verify runtime library offline isolation flags and disabled user site.

    Fails closed if user site is enabled or any required offline variable is missing,
    or if Hugging Face authentication tokens are present in the environment.
    Note: These are library and runtime offline controls, not an OS-level airgap or network sandbox.
    """
    if site.ENABLE_USER_SITE:
        raise RuntimeError(
            f"Security check failed: site.ENABLE_USER_SITE is {site.ENABLE_USER_SITE}. "
            "User site packages must be disabled (via PYTHONNOUSERSITE=1 or -s) before loading Laya."
        )
    for var, val in REQUIRED_OFFLINE_ENV.items():
        if os.environ.get(var) != val:
            raise RuntimeError(
                f"Security check failed: environment variable {var} is {os.environ.get(var)!r}, expected {val!r}."
            )
    for var in FORBIDDEN_ENV_VARS:
        if var in os.environ:
            raise RuntimeError(
                f"Security check failed: forbidden credential environment variable '{var}' is present."
            )


def parse_laya_output(result: Any, latency_ms: float = 0.0) -> Decision:
    """Parse and strictly validate Laya model output payload into a Decision.

    Fails closed (raises ValueError) on missing answers, invalid types,
    out-of-domain labels, or non-finite probabilities. Preserves raw contradictory
    model output without semantic repair.
    """
    if not isinstance(result, dict):
        raise ValueError(f"Malformed model output: expected dict, got {type(result).__name__}")

    answers = result.get("answers")
    if not isinstance(answers, dict):
        raise ValueError(f"Malformed model output: 'answers' must be a dict, got {type(answers).__name__}")

    # 1. Validate event_type answer
    if "event_type" not in answers:
        raise ValueError("Malformed model output: missing 'event_type' in answers")
    event_type_data = answers["event_type"]
    if not isinstance(event_type_data, dict):
        raise ValueError(f"Malformed model output: 'event_type' must be a dict, got {type(event_type_data).__name__}")
    if "choice" not in event_type_data:
        raise ValueError("Malformed model output: missing 'choice' in event_type answer")
    raw_event_type = event_type_data["choice"]
    if raw_event_type not in EVENT_TYPES:
        raise ValueError(f"Invalid event_type choice {raw_event_type!r}; expected one of {EVENT_TYPES}")

    if "probabilities" not in event_type_data:
        raise ValueError("Malformed model output: missing 'probabilities' in event_type answer")
    _validate_probability_map(
        "event_type", event_type_data["probabilities"], EVENT_TYPES
    )
    _validate_selected_argmax(
        "event_type", raw_event_type, event_type_data["probabilities"]
    )

    # Validate event_type confidence if present
    if "confidence" in event_type_data and event_type_data["confidence"] is not None:
        conf = event_type_data["confidence"]
        if isinstance(conf, bool) or not isinstance(conf, (int, float)) or not math.isfinite(conf) or not (0.0 <= float(conf) <= 1.0):
            raise ValueError(f"Invalid confidence value in event_type: {conf!r}")

    # 2. Validate should_wake_parent answer (noul probability float in [0, 1])
    if "should_wake_parent" not in answers:
        raise ValueError("Malformed model output: missing 'should_wake_parent' in answers")
    wake_data = answers["should_wake_parent"]
    if not isinstance(wake_data, dict):
        raise ValueError(f"Malformed model output: 'should_wake_parent' must be a dict, got {type(wake_data).__name__}")
    if "noul" not in wake_data:
        raise ValueError("Malformed model output: missing 'noul' probability in should_wake_parent")
    raw_noul = wake_data["noul"]
    if isinstance(raw_noul, bool) or not isinstance(raw_noul, (int, float)) or not math.isfinite(raw_noul) or not (0.0 <= float(raw_noul) <= 1.0):
        raise ValueError(f"Invalid 'noul' probability value: {raw_noul!r}; expected finite float in [0.0, 1.0]")

    # Threshold at 0.5 without repairing contradictions
    should_wake = bool(float(raw_noul) >= 0.5)

    # Validate should_wake_parent confidence if present
    if "confidence" in wake_data and wake_data["confidence"] is not None:
        conf = wake_data["confidence"]
        if isinstance(conf, bool) or not isinstance(conf, (int, float)) or not math.isfinite(conf) or not (0.0 <= float(conf) <= 1.0):
            raise ValueError(f"Invalid confidence value in should_wake_parent: {conf!r}")

    # 3. Validate next_action answer
    if "next_action" not in answers:
        raise ValueError("Malformed model output: missing 'next_action' in answers")
    action_data = answers["next_action"]
    if not isinstance(action_data, dict):
        raise ValueError(f"Malformed model output: 'next_action' must be a dict, got {type(action_data).__name__}")
    if "choice" not in action_data:
        raise ValueError("Malformed model output: missing 'choice' in next_action answer")
    raw_next_action = action_data["choice"]
    if raw_next_action not in NEXT_ACTIONS:
        raise ValueError(f"Invalid next_action choice {raw_next_action!r}; expected one of {NEXT_ACTIONS}")

    if "probabilities" not in action_data:
        raise ValueError("Malformed model output: missing 'probabilities' in next_action answer")
    _validate_probability_map(
        "next_action", action_data["probabilities"], NEXT_ACTIONS
    )
    _validate_selected_argmax(
        "next_action", raw_next_action, action_data["probabilities"]
    )

    # Validate next_action confidence if present
    if "confidence" in action_data and action_data["confidence"] is not None:
        conf = action_data["confidence"]
        if isinstance(conf, bool) or not isinstance(conf, (int, float)) or not math.isfinite(conf) or not (0.0 <= float(conf) <= 1.0):
            raise ValueError(f"Invalid confidence value in next_action: {conf!r}")

    # Extract overall decision confidence if present
    confidence: Optional[float] = None
    if "confidence" in event_type_data and event_type_data["confidence"] is not None:
        confidence = float(event_type_data["confidence"])

    return Decision(
        event_type=raw_event_type,
        should_wake_parent=should_wake,
        next_action=raw_next_action,
        confidence=confidence,
        raw_probabilities=answers,
        latency_ms=latency_ms,
    )


class LayaRouterEngine:
    """Safe local loader and predictor for audited Laya model."""

    def __init__(
        self,
        model_dir: Path,
        manifest_path: Path,
        device: str = "cpu",
    ):
        self.model_dir = model_dir.resolve()
        self.manifest_path = manifest_path.resolve()
        self.device = device
        self.agent: Any = None
        self.load_latency_ms: float = 0.0

        # Enforce and verify strict library/runtime offline environment before loading
        self._set_offline_environment()
        verify_offline_environment()

        # Load the model
        self._load_agent()

    @staticmethod
    def _set_offline_environment() -> None:
        """Enforce strict offline isolation flags and scrub any HF authentication tokens."""
        os.environ["HF_HUB_OFFLINE"] = "1"
        os.environ["TRANSFORMERS_OFFLINE"] = "1"
        os.environ["PYTHONNOUSERSITE"] = "1"
        for token_var in FORBIDDEN_ENV_VARS:
            os.environ.pop(token_var, None)

    def _load_agent(self) -> None:
        """Import laya and load from the verified local directory only."""
        self._verify_model_snapshot("immediately before load")
        t0 = time.perf_counter()
        try:
            from laya import load  # Deferred import
        except ImportError as e:
            raise RuntimeError(
                f"Laya package is not installed in the active environment: {e}"
            ) from e

        # Ensure we only pass local filesystem path string, never remote model repo ID
        if not self.model_dir.is_dir():
            raise FileNotFoundError(
                f"Model directory not found on local disk: {self.model_dir}"
            )

        self.agent = load(str(self.model_dir), device=self.device)
        self.load_latency_ms = (time.perf_counter() - t0) * 1000
        self._verify_model_snapshot("immediately after load")

    def _verify_model_snapshot(self, stage: str) -> None:
        """Detect local checkpoint replacement around the loader boundary."""
        valid, errors = verify_manifest(self.model_dir, self.manifest_path)
        if not valid:
            details = "; ".join(errors)
            raise RuntimeError(f"Model snapshot verification failed {stage}: {details}")

    def classify(self, message: str) -> Decision:
        """Run Laya prediction on message, recording raw probabilities without normalization."""
        if not self.agent:
            raise RuntimeError("Laya agent is not initialized.")

        t0 = time.perf_counter()
        result = self.agent.predict({"message": message}, QUESTIONS_SCHEMA)
        latency_ms = (time.perf_counter() - t0) * 1000

        return parse_laya_output(result, latency_ms=latency_ms)
