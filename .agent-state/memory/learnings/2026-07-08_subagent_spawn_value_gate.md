# Subagent spawn value gate

**Date**: 2026-07-08
**Tags**: subagents, orchestration, workflow, fable-style

## Lesson

For Mahiro Code, non-trivial work should treat subagent spawning as opt-out rather than optional decoration. If the task has broad scope, unknown repo reality, visual/Thai/security/release risk, separable QA/research, or likely main-agent wandering, spawn at least one scout/reviewer/QA lane unless there is a concrete no-spawn reason.

## Evidence

Mahiro observed: “ตอนนี้เหมือน ยังไม่ค่อย spawn subagent เท่าไหร่แหะ”. This came after we had already added a subagent orchestration checklist, meaning the guidance was not strong enough to change behavior.

## Behavior change

Before non-trivial work:

1. Run the spawn checklist.
2. If 2+ triggers are true, spawn early unless there is a concrete reason not to.
3. Packet subagents with an evidence/value gate: exact files/commands/sources, recommendation, unknowns/limits, and clear output format.
4. If a subagent returns only generic planning or no new evidence, report that honestly and tighten the next packet.

## Anti-pattern

Do not spawn just to appear orchestrated. A useful subagent lane produces evidence, risk review, a bounded patch, or a decision-changing recommendation.
