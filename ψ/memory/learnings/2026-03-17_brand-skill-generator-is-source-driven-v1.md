# Brand-skill-generator is now a usable source-driven v1, not a brief-driven generator

## Pattern

`brand-skill-generator` crossed the line from scaffold to usable tool once its outputs stopped being "top evidence summaries" and started becoming synthesized doctrine. The decisive improvements were source-specific evidence extraction, source-aware conflict handling, section-specific rule synthesis, and context-specific profile synthesis.

## Evidence

- Evidence extraction now differs by source type: websites, docs, screenshots, code, and Figma references produce different signals
- Conflict handling now uses source metadata and category-aware comparisons instead of only shallow keyword mismatch
- Core doctrine is specialized across `brand-identity`, `voice`, `visual-system`, `interaction-behavior`, and `design-system`
- Profiles are specialized across `marketing`, `product-ui`, and `dashboard` rather than reusing core rules verbatim
- The tool still expects source-like inputs (`--website`, `--docs`, `--screenshots`, `--code`, `--figma`) and does not yet accept freeform product briefs directly

## Implication

Treat the current generator as a **source-driven brand synthesizer**, not an idea-to-brand creator. If the user only has a brief, convert it into source material first or add a new `brief` source type explicitly. Also, once synthesis quality starts improving, the next bottleneck becomes real-world validation: run it on actual brands before adding too many more heuristics.

## Tags

brand-skill-generator, synthesis, skills, source-driven, doctrine, profiles, conflict-handling
