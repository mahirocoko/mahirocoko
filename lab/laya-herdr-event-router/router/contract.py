"""Decision contract and question schemas for Herdr shadow event router."""

from dataclasses import dataclass, field
from typing import Any, Dict, List, Literal, Optional

# Valid decision domain
EventType = Literal["progress", "question", "blocker", "report_ready", "noise"]
NextAction = Literal["wait", "notify", "collect_report", "close_lane", "escalate"]

EVENT_TYPES: tuple[EventType, ...] = (
    "progress",
    "question",
    "blocker",
    "report_ready",
    "noise",
)

NEXT_ACTIONS: tuple[NextAction, ...] = (
    "wait",
    "notify",
    "collect_report",
    "close_lane",
    "escalate",
)

# Laya questions definition matching the audited runtime interface
QUESTIONS_SCHEMA: Dict[str, Any] = {
    "event_type": {
        "type": "choice",
        "instructions": "Classify this agent-lane event.",
        "criteria": {
            "progress": "work continues; no response is required",
            "question": "the agent asks the owning parent for a decision",
            "blocker": "work cannot continue without intervention",
            "report_ready": "the persisted final report is ready to collect",
            "noise": "a lifecycle observation without actionable meaning",
        },
    },
    "should_wake_parent": {
        "type": "noul",
        "instructions": "Should this event wake the owning parent conversation now?",
    },
    "next_action": {
        "type": "choice",
        "instructions": "What should the controller do next?",
        "criteria": {
            "wait": "continue waiting without notifying anyone",
            "notify": "notify the owning parent of an actionable event",
            "collect_report": "collect and audit the persisted report",
            "close_lane": "close the lane after successful collection",
            "escalate": "request human intervention",
        },
    },
}


@dataclass(frozen=True)
class Decision:
    """Normalized decision tuple returned by a router engine."""

    event_type: EventType
    should_wake_parent: bool
    next_action: NextAction
    confidence: Optional[float] = None
    raw_probabilities: Dict[str, Any] = field(default_factory=dict)
    latency_ms: float = 0.0
    matched_rule: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        result = {
            "event_type": self.event_type,
            "should_wake_parent": self.should_wake_parent,
            "next_action": self.next_action,
            "confidence": self.confidence,
            "raw_probabilities": self.raw_probabilities,
            "latency_ms": self.latency_ms,
        }
        if self.matched_rule is not None:
            result["matched_rule"] = self.matched_rule
        return result


def check_consistency(
    event_type: str,
    should_wake_parent: bool,
    next_action: str,
) -> List[str]:
    """Check cross-answer consistency rules without rewriting model output.

    Violations recorded:
    1. report_ready_must_collect: report_ready must specify collect_report (not wait/notify/close_lane/escalate).
    2. report_ready_should_wake: report_ready represents a terminal milestone that must wake parent to collect.
    3. premature_close_lane: next_action is close_lane directly without prior collection/audit.
    4. blocker_must_wake: blocker cannot continue without intervention and must wake parent.
    5. blocker_cannot_wait: blocker cannot have next_action == 'wait'.
    6. question_must_wake: question requires a parent decision and must wake parent.
    7. question_cannot_wait: question cannot have next_action == 'wait'.
    8. passive_event_should_not_wake: progress or noise should not wake parent.
    9. passive_event_should_wait: progress or noise should wait (not notify or escalate).
    """
    violations: List[str] = []

    # Rule 1 & 2: Report ready semantics
    if event_type == "report_ready":
        if next_action != "collect_report":
            violations.append(
                f"report_ready_must_collect: event_type is report_ready but next_action is '{next_action}'"
            )
        if not should_wake_parent:
            violations.append(
                "report_ready_no_wake: event_type is report_ready but should_wake_parent is False"
            )

    # Rule 3: Close lane direct invocation (strictly forbidden by contract)
    if next_action == "close_lane":
        violations.append(
            "premature_close_lane: next_action is close_lane directly; report collection/audit comes first"
        )

    # Rule 4 & 5: Blocker semantics
    if event_type == "blocker":
        if not should_wake_parent:
            violations.append(
                "blocker_must_wake: event_type is blocker but should_wake_parent is False"
            )
        if next_action == "wait":
            violations.append(
                "blocker_cannot_wait: event_type is blocker but next_action is wait"
            )

    # Rule 6 & 7: Question semantics
    if event_type == "question":
        if not should_wake_parent:
            violations.append(
                "question_must_wake: event_type is question but should_wake_parent is False"
            )
        if next_action == "wait":
            violations.append(
                "question_cannot_wait: event_type is question but next_action is wait"
            )

    # Rule 8 & 9: Passive events (progress, noise)
    if event_type in ("progress", "noise"):
        if should_wake_parent:
            violations.append(
                f"passive_event_should_not_wake: event_type is '{event_type}' but should_wake_parent is True"
            )
        if next_action != "wait":
            violations.append(
                f"passive_event_should_wait: event_type is '{event_type}' but next_action is '{next_action}'"
            )

    return violations
