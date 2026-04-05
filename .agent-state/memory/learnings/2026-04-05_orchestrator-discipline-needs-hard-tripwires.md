# Learning Note

## Title

Orchestrator discipline needs hard tripwires, not soft principles

## Date

2026-04-05

## Tags

- orchestration
- workflow
- delegation
- process
- agent-behavior

## Summary

Delegate-first behavior did not become real just because the repo doctrine said it was important. I still drifted back into a local `read-think-edit` loop during implementation-heavy work. The fix was not another philosophical reminder. The fix was to encode mechanical rules in `AGENTS.md`: a pre-action checklist, a grounding-read budget, a context budget guard, a direct-edit allowlist, verification limits, and inline-work tripwires. Those rules make it harder to rationalize “just one more file” or “I’ll just finish this one part myself.”

## Why it matters

Without hard tripwires, I use workers only for planning and review, but not for the coding work that actually burns context. That defeats the point of orchestration. Numeric limits and explicit stop conditions push me into the right posture earlier and make my behavior more predictable across sessions.

## Reusable rule

If a task shape appears in the routing table, or if inline work would require reading more than about 100 lines or editing more than 3 files, I should delegate before doing more local analysis. Verification should happen through executable checks first and then at most a few targeted spot-checks.

## Durable note

This is not a one-session preference. It should be treated as an operating constraint for future implementation sessions, especially when I am tempted to “understand just a bit more” before spawning a worker.
