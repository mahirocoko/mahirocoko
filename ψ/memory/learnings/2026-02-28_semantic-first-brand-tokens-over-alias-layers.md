---
title: Prefer semantic-first brand tokens over alias layers
tags: [design-tokens, semantic-tokens, branding, button-variants, frontend]
created: 2026-02-28
source: rrr: mahirocoko
---

# Prefer semantic-first brand tokens over alias layers

When a project already treats `primary` as the main brand color, adding intermediate alias tokens (for example `brand-base`) often adds cognitive load without adding architectural value.

## Pattern

- Use semantic tokens directly as brand source-of-truth when possible (`primary`, `accent`)
- Keep gradient definition composable with stop tokens only:
  - `--brand-gradient-primary-start`
  - `--brand-gradient-primary-end`
- Avoid redundant combined alias token if it doesn’t unlock a real implementation benefit

## UI Implications

- Remove overlapping component variants (`brand` vs `default`) early
- Keep `outline` behavior neutral (secondary/gray hover) when CTA already carries brand emphasis
- Avoid bright accent-driven hover on text/link actions unless explicitly intended

## Practical Rule

Introduce a new token layer only when it solves one of these:

1. Multi-brand theming requirements
2. Cross-product token package extraction
3. Clear semantic mismatch between existing tokens and required usage

Otherwise, keep the model small and semantic-first.
