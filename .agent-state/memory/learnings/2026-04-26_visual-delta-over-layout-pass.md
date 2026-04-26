# Visual Delta Over Layout Pass

## Tags
- design-system
- retrospectives
- verification
- asset-pipeline
- composition

## Context
During lab01 landing-page generation inside `design-system.pen`, multiple iterations passed structural checks (`No layout problems`) but still felt visually off compared with image references (`1.png`, `2.png`, `3.png`).

## Lesson
For UI/design work, structural validity is not the success criterion; reference-faithful composition is. Treat diagnostics as a safety net, not as quality proof.

## Practical Rule
1. After each major visual change, run section-level screenshots (not just full-page).
2. Validate image slot ratio vs fill mode (`fill` vs `fit`) before declaring asset integration complete.
3. If asked to create another frame, default to non-cloned composition and document what is intentionally different.

## Why It Matters
This reduces churn from “looks wrong” feedback late in the loop and improves first-pass alignment with user intent in design-heavy sessions.
