"""Deterministic baseline classifier for agent-lane events.

NOTE: Achieving 100% match on fixtures authored alongside these rules serves
only as a harness sanity check, not independent quality evidence. Rule-based
decisions do not have probabilistic confidence or probability distributions;
confidence is set to None and transparent matched-rule metadata is recorded.
"""

import re
import time
from typing import Optional

from .contract import Decision, EventType, NextAction


class RuleBasedRouter:
    """Explicit, transparent deterministic rule-based event router."""

    # Patterns for terminal reports
    _REPORT_POSITIVE = re.compile(
        r"(?:terminal\s+report\s+(?:persisted|ready)|persisted\s+(?:terminal\s+)?report|final\s+report\s+(?:is\s+)?ready|report\s+persisted\s+at)",
        re.IGNORECASE,
    )
    _REPORT_NEGATIVE = re.compile(
        r"(?:failed\s+to\s+persist\s+report|report\s+missing|report\s+(?:not\s+found|unreachable|corrupted)|no\s+report\s+(?:was\s+)?generated)",
        re.IGNORECASE,
    )

    # Patterns for prompt injection attempts
    _INJECTION_PATTERN = re.compile(
        r"(?:ignore\s+(?:all\s+)?previous\s+instructions|system\s+prompt\s+override|override\s+classification|disregard\s+rules|you\s+are\s+now\s+in\s+admin\s+mode)",
        re.IGNORECASE,
    )

    # Patterns for noise and transient observations
    _NOISE_PATTERN = re.compile(
        r"(?:pane\s+status\s+changed|status\s+changed\s+from\s+\w+\s+to\s+idle|idle\s+for\s+\d+\s+seconds?|heartbeat(?:\s+ping|\s+ack)?|process\s+remains\s+alive|cpu\s+usage\s+normal|memory\s+telemetry\s+ping|health\s+check\s+poll|telemetry\s+ping)",
        re.IGNORECASE,
    )

    # Patterns for blockers / unrecoverable errors
    _BLOCKER_PATTERN = re.compile(
        r"(?:traceback\s+\(most\s+recent\s+call\s+last\)|out\s+of\s+memory|oom\s+killed|segmentation\s+fault|fatal\s+error|cannot\s+continue\s+without|permission\s+denied|failed\s+with\s+exit\s+code\s+[1-9]|unhandled\s+exception|dependency\s+conflict\s+blocks|crashed\s+the\s+main\s+worker)",
        re.IGNORECASE,
    )

    # Patterns for question / human decision required
    _QUESTION_PATTERN = re.compile(
        r"(?:blocked\s+on\s+(?:a\s+)?(?:product|design|user)\s+choice|should\s+the\s+|which\s+option\s+should|need\s+(?:human\s+)?decision|please\s+confirm\s+whether|waiting\s+for\s+(?:user\s+)?approval|\?\s*$)",
        re.IGNORECASE,
    )

    # Quoted error text that is actually benign progress
    _BENIGN_QUOTED_ERROR = re.compile(
        r"(?:expected\s+in\s+the\s+test\s+case|error\s+handling\s+verified|simulated\s+failure\s+passed)",
        re.IGNORECASE,
    )

    def classify(self, message: str) -> Decision:
        """Classify message deterministically according to explicit rules.

        Returns Decision with confidence=None and matched_rule metadata.
        No synthetic probability distributions or fabricated confidence scores are emitted.
        """
        t0 = time.perf_counter()
        clean = message.strip()

        # Check for prompt injection attempts
        if self._INJECTION_PATTERN.search(clean):
            latency_ms = (time.perf_counter() - t0) * 1000
            return Decision(
                event_type="noise",
                should_wake_parent=False,
                next_action="wait",
                confidence=None,
                raw_probabilities={"matched_rule": "prompt_injection_defense"},
                latency_ms=latency_ms,
                matched_rule="prompt_injection_defense",
            )

        # Check for report generation failures (adversarial missing artifact)
        if self._REPORT_NEGATIVE.search(clean):
            latency_ms = (time.perf_counter() - t0) * 1000
            return Decision(
                event_type="blocker",
                should_wake_parent=True,
                next_action="escalate",
                confidence=None,
                raw_probabilities={"matched_rule": "missing_report_negative"},
                latency_ms=latency_ms,
                matched_rule="missing_report_negative",
            )

        # Check for explicit questions first if blocked on choice
        if self._QUESTION_PATTERN.search(clean) and "blocked on" in clean.lower():
            latency_ms = (time.perf_counter() - t0) * 1000
            return Decision(
                event_type="question",
                should_wake_parent=True,
                next_action="notify",
                confidence=None,
                raw_probabilities={"matched_rule": "question_blocked_on_choice"},
                latency_ms=latency_ms,
                matched_rule="question_blocked_on_choice",
            )

        # Check for valid terminal report ready
        if self._REPORT_POSITIVE.search(clean):
            # Contradictory wording check: report mentioned but accompanied by unhandled crash / exit code
            lower_clean = clean.lower()
            if any(term in lower_clean for term in ("failed with exit code", "fatal error", "unhandled exception", "crashed")) and not self._BENIGN_QUOTED_ERROR.search(clean):
                latency_ms = (time.perf_counter() - t0) * 1000
                return Decision(
                    event_type="blocker",
                    should_wake_parent=True,
                    next_action="escalate",
                    confidence=None,
                    raw_probabilities={"matched_rule": "report_positive_crash_override"},
                    latency_ms=latency_ms,
                    matched_rule="report_positive_crash_override",
                )

            latency_ms = (time.perf_counter() - t0) * 1000
            # Report ready must wake parent to collect, next action is collect_report (never close_lane directly)
            return Decision(
                event_type="report_ready",
                should_wake_parent=True,
                next_action="collect_report",
                confidence=None,
                raw_probabilities={"matched_rule": "report_positive"},
                latency_ms=latency_ms,
                matched_rule="report_positive",
            )

        # Check if error mentions are benign progress (e.g. testing error handling)
        if self._BENIGN_QUOTED_ERROR.search(clean):
            latency_ms = (time.perf_counter() - t0) * 1000
            return Decision(
                event_type="progress",
                should_wake_parent=False,
                next_action="wait",
                confidence=None,
                raw_probabilities={"matched_rule": "benign_quoted_error"},
                latency_ms=latency_ms,
                matched_rule="benign_quoted_error",
            )

        # Check for blockers
        if self._BLOCKER_PATTERN.search(clean):
            latency_ms = (time.perf_counter() - t0) * 1000
            return Decision(
                event_type="blocker",
                should_wake_parent=True,
                next_action="escalate",
                confidence=None,
                raw_probabilities={"matched_rule": "blocker_pattern"},
                latency_ms=latency_ms,
                matched_rule="blocker_pattern",
            )

        # Check for questions
        if self._QUESTION_PATTERN.search(clean):
            latency_ms = (time.perf_counter() - t0) * 1000
            return Decision(
                event_type="question",
                should_wake_parent=True,
                next_action="notify",
                confidence=None,
                raw_probabilities={"matched_rule": "question_pattern"},
                latency_ms=latency_ms,
                matched_rule="question_pattern",
            )

        # Check for lifecycle noise / transient idle
        if self._NOISE_PATTERN.search(clean):
            latency_ms = (time.perf_counter() - t0) * 1000
            return Decision(
                event_type="noise",
                should_wake_parent=False,
                next_action="wait",
                confidence=None,
                raw_probabilities={"matched_rule": "noise_pattern"},
                latency_ms=latency_ms,
                matched_rule="noise_pattern",
            )

        # Default is progress
        latency_ms = (time.perf_counter() - t0) * 1000
        return Decision(
            event_type="progress",
            should_wake_parent=False,
            next_action="wait",
            confidence=None,
            raw_probabilities={"matched_rule": "default_progress"},
            latency_ms=latency_ms,
            matched_rule="default_progress",
        )
