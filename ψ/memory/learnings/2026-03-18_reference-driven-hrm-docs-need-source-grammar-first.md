---
title: Reference-driven HRM docs need source grammar first
date: 2026-03-18
source: rrr: mahirocoko
tags:
  - docs
  - reference-driven
  - haabiz-hrm-fe
  - eizypay
  - writing
---

# Reference-driven HRM docs need source grammar first

When a repo should inherit the documentation feel of a sibling project, it is not enough to transfer facts. The source document's grammar has to come first: section order, tone, example shape, and the level of specificity. Only after that should the repo-specific adaptation happen.

In practice, this means:

- Start by mirroring the reference doc's structure as literally as possible.
- Replace only the parts that conflict with the target repo's real stack or current code shape.
- Explicitly separate current state from planned patterns when the target repo is still lean or has recently reverted code.
- Audit batch-written docs for consistency, because the weakest files are usually the ones written after the mental model feels "good enough."

The key pattern is simple: copy the source grammar first, then adapt reality into it. Do not improvise a fresh document shape unless the user explicitly asks for a new one.
