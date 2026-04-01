# Learning: short namespaces age better than semantic overlap

**Date**: 2026-04-01
**Tags**: mahiro-skills, gemini, naming, namespace, release, packaging

## Context

After introducing a Gemini command namespace in `mahiro-skills`, the first prefix choice was `mahiro-`. That worked technically, but several logical command names already started with `mahiro-`, which made the resulting filenames and mental model awkward.

## What Happened

The user pointed out that `mahiro-` as a namespace prefix overlaps with existing logical names like `mahiro-style` and `mahiro-docs-rules-init`. That meant the namespace and the command identity were no longer visually separate. I replaced the namespace with `mh-`, updated runtime mapping, repo inventory normalization, docs, tests, and release surfaces, then shipped the result as `v0.1.8`.

## Lesson

When designing namespaced packaging surfaces, a short neutral prefix usually ages better than a semantically rich prefix that overlaps with real item names. The namespace should mark ownership or origin cleanly, not compete with the command’s own identity.

## Why It Matters

This reduces ambiguity, keeps normalization rules simpler, and makes future command additions easier to reason about. It also lowers the chance that a “technically fine” naming scheme will need another corrective release after real use.

## Reuse

- Prefer short namespace prefixes when wrapping user-facing names.
- Test namespace choices against existing logical names before shipping.
- Treat user discomfort with naming as product feedback, not cosmetic preference.
