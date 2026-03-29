# Feedback-First Token Iteration Beats Theory-First Tuning

In UI token tuning sessions, the fastest path to a good result is to follow explicit user preference first, then layer best-practice guidance only as optional context. Theory-first adjustments (contrast tuning, model purity, extra abstraction) can create friction when the requested visual language is clear and constrained.

## Pattern

- Implement the requested scope exactly (for example: "foreground only" means foreground only).
- Keep token iterations small and reversible.
- Align variant interaction behavior across state actions to improve consistency (`soft idle -> solid hover`).
- Defer advisory optimization until after the requested visual direction is satisfied.

## Practical Rule

When collaborating on design tokens:
1. Preference fidelity first.
2. Verification second.
3. Optional recommendations third.

This order improves trust and shortens iteration time while still keeping technical quality under control.
