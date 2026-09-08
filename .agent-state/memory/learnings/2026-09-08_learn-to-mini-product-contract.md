---
artifact: reference-learning
authority: non-canonical
status: candidate
source: .agent-state/memory/retrospectives/2026-09/08/14.09_libraries-dev-passcraft-visual-contract.md
---

# Adapt a learned visual repository through an explicit reuse map

## Intent

Turn external visual-library research into a small product experiment without copying source code, importing unnecessary runtime machinery, or implying that visual inspiration equals package adoption.

## Trigger

A learned repository contains compelling visual effects, presets, playgrounds, or agent-controlled parameters, and the next task is to build a bounded mini-product from those findings.

## Action

Before implementation, classify each proposed reuse as:

1. **Contract reuse** — schemas, validation, presets, lifecycle boundaries, or testing strategy.
2. **Runtime/package reuse** — an actual dependency, renderer, protocol, or copied integration surface.
3. **Visual inspiration** — material, motion, composition, or interaction direction owned by the selected taste source.
4. **Not used** — source capabilities deliberately omitted from the slice.

Name the smallest hypothesis the product should test. Give the visual owner semantic controls and calibrated presets; let the implementation owner enforce one canonical parameter source, safe state boundaries, fallbacks, and direct evidence. At handoff, report the same reuse map truthfully so “inspired by” is never mistaken for “built with.”

## Boundary

Do not claim model-tool-schema generation, streamed patches, shared renderers, package adoption, or backend behavior when the experiment implements only local UI state and validation. Do not import a graphics runtime merely because it exists in the learned source; require the target effect and capability envelope to justify it. Keep human visual acceptance separate from schema validity and technical PASS.

## Rationale

The strongest lesson in a visual repository is often its ownership and constraint model rather than its most dramatic effect. An explicit reuse map preserves source truth, keeps the experiment proportional, and makes it possible to evaluate whether the learned contract improved the product without conflating that result with code reuse or model taste.

## Tags

`learn` `frontend-experiment` `visual-contract` `schema` `presets` `evidence`
