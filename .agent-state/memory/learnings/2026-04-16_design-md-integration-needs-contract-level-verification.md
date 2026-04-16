# Lesson Learned: design-md integration needs contract-level verification

**Date**: 2026-04-16
**Tags**: retrospective, brand-skill-generator, design-md, synthesis, verification, constraints

When integrating `design-md` into `brand-skill-generator`, the hard part was not just parsing new source material. The hard part was preserving meaning across every boundary: discovery, preflight, compile, evidence extraction, synthesis, and downstream profile composition. A feature can look complete while still being wrong if any one of those layers quietly drops provenance, polarity, or priority.

The strongest example from this session was `Do:` / `Don't:` guidance. It was easy to make the evidence layer preserve that directionality and still accidentally lose it later when design-system summaries were rebuilt for mixed-source cases. Another example was `DESIGN.md` discovery: a recursive file scan cap looked harmless until it became clear that the one file we cared most about could disappear from sampling by ordering luck alone. In both cases, surface-level QA was not enough.

The durable lesson is this: for source-driven synthesis systems, verification must be contract-level. Check the exact handoff points, not just the first and last visible outputs. If a value matters semantically, prove that it survives each transformation stage with diagnostics, manual QA, and a final skeptical review.
