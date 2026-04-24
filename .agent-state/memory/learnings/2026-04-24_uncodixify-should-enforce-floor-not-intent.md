# Learning: uncodixify should enforce floor, not intent

**Date**: 2026-04-24
**Tags**: frontend-design, uncodixify, doctrine, typography, ai-slop, prompt-design

## Insight

When a repo has both a prompt-composition layer and an anti-slop taste layer, they should not compete for the same job.

- `frontend-design` should compose intent: structure, handoff content, prompt fragments, tokens, and explicit brand direction.
- `uncodixify` should enforce the floor: ban generic AI defaults, normalize fake premium moves, and keep the result inside normal product standards.

If `uncodixify` starts overriding explicit product intent, it becomes destructive. If it is too soft, it becomes decorative documentation. The useful middle is: respect intent, override lazy defaults.

## Why it matters

This distinction makes prompt systems easier to reason about. It also creates a better place to solve recurring quality problems like giant headings, decorative hero wrappers, or invented image URLs. Those are usually not failures of intent; they are failures of restraint.

## Reuse rule

In future prompt/doctrine systems:

1. keep composition and taste enforcement separate,
2. let explicit brand constraints lead,
3. use the doctrine layer to stop AI-default moves,
4. add hard rules when the model repeatedly abuses a weak area such as typography scale or asset URL invention.
