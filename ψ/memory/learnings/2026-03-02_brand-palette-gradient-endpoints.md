---
title: Brand Palette with Gradient Endpoints
tags: [design-tokens, branding, gradient, primary, accent, frontend]
created: 2026-03-02
source: hrm-brand-palette-update
---

# Brand Palette with Gradient Endpoints

When defining brand gradients, use explicit `-end` tokens instead of mixing two brand colors. This keeps gradients monochromatic per brand and avoids accidental color mixing.

## Pattern

**Primary (Blue Brand)**
- `--primary: oklch(0.55 0.25 259)` — #0d53ff
- `--primary-end: oklch(0.70 0.15 220)` — cyan-ish gradient endpoint

**Accent (Warm Brand)**
- `--accent: oklch(0.65 0.24 32)` — #ff4938
- `--accent-end: oklch(0.80 0.16 70)` — #ffae4a

**Secondary (Cancel/Neutral)**
- `--secondary: oklch(0.94 0.01 259)` — light blue-gray
- `--secondary-foreground: oklch(0.30 0.02 259)` — text on secondary

## Gradient Tokens

```css
--brand-gradient-primary-start: var(--primary);
--brand-gradient-primary-end: var(--primary-end);
--brand-gradient-accent-start: var(--accent);
--brand-gradient-accent-end: var(--accent-end);
```

## Button Variants

- `primary-gradient` — uses `--primary` → `--primary-end` (blue → cyan)
- `accent-gradient` — uses `--accent` → `--accent-end` (red-orange → orange-yellow)
- `secondary` — for cancel/neutral actions

## Why This Works

1. **Monochromatic gradients** — Each brand color has its own gradient endpoint, avoiding hue clash
2. **Semantic clarity** — `primary-end` clearly belongs to primary brand, not a separate accent
3. **Flexible composition** — Can create primary CTAs with blue gradient, accent CTAs with warm gradient
4. **State colors independent** — `success`, `warning`, `info` remain state-only, not brand

## Practical Rule

Define `-end` tokens for any brand color that needs a gradient variant. Keep the endpoint within the same hue family or a deliberate shift (like blue → cyan) rather than mixing two different brand colors.
