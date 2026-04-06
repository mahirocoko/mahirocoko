# Learning Note

**Date**: 2026-04-06
**Tags**: routing, policy, gemini, cursor, orchestration, doctrine

## Lesson
Routing policy must be shaped around current model capability and task shape, not around outdated assumptions about which model family is "for thinking" and which is "for coding." In this repo, the older policy implicitly trapped Gemini on the critique side of UX/UI work and made Cursor sound narrower than it really is. That was no longer accurate. `gemini-3.1-pro-preview` is strong enough to own design-led UX/UI implementation, while Cursor remains the broader engineering worker for backend, refactors, cross-module work, and engineering-led frontend changes.

## Why It Matters
If the doctrine is wrong, the orchestrator keeps making locally rational but globally suboptimal choices. That means design-led UI work gets routed away from the model best suited to it, while the more general engineering worker is described too narrowly. The result is friction, weaker outcomes, and repeated human correction. Updating policy is not bureaucracy here; it is performance maintenance for the whole workflow.

## Reuse Signal
Whenever model capability changes, re-audit the routing table and local worker policy. If the real-world best worker and the written best worker diverge, the written rule is now technical debt.
