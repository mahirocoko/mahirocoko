# Pattern: Design-System Token Alignment Works Best with Locked Geometry + Layer Separation

**Date**: 2026-02-24
**Source**: rrr --deep retrospective (design-system.pen session)
**Type**: UI System Pattern

## The Pattern

For design-system work, visual consistency emerges fastest when we enforce invariant geometry first, then apply semantic layering. In this session, alignment quality improved only after we standardized fixed cell behavior (`width: 106.6`, `gap: 6`, fixed-width label cells) across all shade rows and separated concerns into three layers:

1. raw palette rows for exploration/grooming,
2. semantic/foundation documentation for stable naming,
3. component-facing examples for practical usage.

## Why It Works

1. **Geometry as a contract** — Fixed dimensions remove ambiguity and stop drift across repetitive rows.
2. **Separation of concerns** — Palette values, semantic intent, and component usage evolve at different speeds; separating them prevents accidental coupling.
3. **Rendered examples beat text specs** — Typography became more useful only after each token was shown as a real sample, not a list.
4. **Preservation mindset** — Treat tokens like an API; supersede/migrate intentionally rather than destructive renames.

## Confidence Levels

- **High**: Locking geometry early reduces visual rework in grid-like systems.
- **High**: Dedicated label rows are clearer than in-swatch annotation for dense color matrices.
- **Medium-High**: Foundation frames with explicit sections improve collaboration and future edits.
- **Medium**: Canonical mapping documentation is still needed to fully prevent naming drift into implementation code.

## Reusable Checklist

- Define and enforce row/cell invariants before color/style tuning.
- Keep swatches purely visual; move labels/metadata to a parallel row.
- Build a dedicated Foundations frame: Typography, Color, Spacing, Radius, Border/Shadow/Motion.
- Replace token lists with rendered examples where possible.
- Add temp artifact ignores (`.tmp*`) as soon as helper files appear.
- End session with immediate retrospective + learning extraction.

## Connections to Past Learnings

- **Identity emerges from articulation** (`2026-02-24_identity-emerges-from-articulation`): writing the system structure clarifies the system itself.
- **Nothing is Deleted** principle: keep history and migration pathways visible in token evolution.

## Application

Apply this pattern to every future design-system update:
- lock layout invariants first,
- update semantic mapping second,
- verify with screenshots/layout checks,
- then distill decisions into memory artifacts.

---

*"Lock structure early; style decisions become easier and safer."*
