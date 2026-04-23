# Multi-target frontend design needs a target-contract layer

**Tags**: frontend-design, prompts, architecture, validation, targets, html-tailwind, nextjs, react-router-7, vite

## Summary

The durable lesson from this session is that a multi-target frontend design skill cannot be built honestly by simply layering more framework names on top of the current prompt library. The current system already works as a deterministic prompt composer, but its canonical assets embed HTML/Tailwind output rules deeply enough that they act as a hidden runtime contract. If we want the skill to support plain HTML/CSS/JS, Vite, React Router 7, Next.js, or other frontend targets, we need an explicit target-contract layer that sits between shared design intent and generated output behavior.

## Context

During this session, I created and hardened `.agents/skills/frontend-design/`, added skill-owned validation, and expanded fixture coverage. In parallel, I inspected the canonical prompt assets and found that the strongest target bias is not in the CLI code but in `docs/design-prompts/design-prompts.json` and some reusable prompt fragments. The system also showed an emerging split between standalone lab prompts and compose-based handoffs, which is a clue that “target” is already present conceptually even if it is not formalized yet.

## Lesson

The system should be modeled in three layers:

1. **Shared design intent** — tone, IA, layout motifs, visual direction, motion intent, and content priorities.
2. **Target contract** — output format, framework/runtime assumptions, styling mechanism, file structure, and delivery shape.
3. **Composition engine** — the deterministic logic that combines shared intent, page mode, target contract, and optional handoff.

Without this layer split, new targets will inherit HTML/Tailwind assumptions accidentally, which creates fake multi-target support rather than real orchestration.

## Why it matters

This matters because the current system is already good enough to tempt overexpansion. It would be easy to bolt `nextjs`, `vite-react`, or `react-router-7` labels onto the current skill and claim support. But that would produce misleading behavior, brittle prompts, and confused validation. Freezing today’s behavior as a legacy `html-tailwind` target is safer than pretending the current canon is target-neutral.

## Durable rule

When a prompt system begins to support more than one frontend output target, do not treat output-format assumptions as shared prompt canon. Preserve shared design intent separately, and make every runtime/framework target an explicit contract with its own adapter layer.
