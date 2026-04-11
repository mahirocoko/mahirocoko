You are redesigning an existing React app in this repo: `apps/pulselane`.

Your job:
- Read the current implementation context from the repo.
- Use the DESIGN.md content below as the source of truth for visual direction.
- Author an `apply_patch` style diff for these files only:
  - `apps/pulselane/src/App.tsx`
  - `apps/pulselane/src/index.css`

Hard constraints:
- This app is env-only. Do not add config/settings/connect UI.
- The main surface must stay board-first.
- If env is missing, show only a subdued developer-facing empty state.
- Keep board behavior intact.
- Do not invent a new app or new framework.
- Do not use Tailwind.
- Output only patch text in one fenced diff block.

Use this design system exactly as the visual posture:

# Design System Inspired by Linear

## 1. Visual Theme & Atmosphere

Linear's website is a masterclass in dark-mode-first product design — a near-black canvas (`#08090a`) where content emerges from darkness like starlight. The overall impression is one of extreme precision engineering: every element exists in a carefully calibrated hierarchy of luminance, from barely-visible borders (`rgba(255,255,255,0.05)`) to soft, luminous text (`#f7f8f8`). This is not a dark theme applied to a light design — it is darkness as the native medium, where information density is managed through subtle gradations of white opacity rather than color variation.

The typography system is built entirely on Inter Variable with OpenType features `"cv01"` and `"ss03"` enabled globally, giving the typeface a cleaner, more geometric character. Inter is used at a remarkable range of weights — from 300 (light body) through 510 (medium, Linear's signature weight) to 590 (semibold emphasis). The 510 weight is particularly distinctive: it sits between regular and medium, creating a subtle emphasis that doesn't shout. At display sizes (72px, 64px, 48px), Inter uses aggressive negative letter-spacing (-1.584px to -1.056px), creating compressed, authoritative headlines that feel engineered rather than designed. Berkeley Mono serves as the monospace companion for code and technical labels, with fallbacks to ui-monospace, SF Mono, and Menlo.

The color system is almost entirely achromatic — dark backgrounds with white/gray text — punctuated by a single brand accent: Linear's signature indigo-violet (`#5e6ad2` for backgrounds, `#7170ff` for interactive accents). This accent color is used sparingly and intentionally, appearing only on CTAs, active states, and brand elements. The border system uses ultra-thin, semi-transparent white borders (`rgba(255,255,255,0.05)` to `rgba(255,255,255,0.08)`) that create structure without visual noise, like wireframes drawn in moonlight.

Key characteristics:
- Dark-mode-native: `#08090a` marketing background, `#0f1011` panel background, `#191a1b` elevated surfaces
- Inter Variable with `"cv01", "ss03"` globally
- Signature weight 510 for most UI text
- Brand indigo-violet: `#5e6ad2` / `#7170ff` / `#828fff`
- Semi-transparent white borders throughout: `rgba(255,255,255,0.05)` to `rgba(255,255,255,0.08)`
- Button backgrounds at near-zero opacity: `rgba(255,255,255,0.02)` to `rgba(255,255,255,0.05)`
- Success green only for status indicators

## 2. Color Palette & Roles

Background surfaces:
- Marketing Black: `#010102` / `#08090a`
- Panel Dark: `#0f1011`
- Level 3 Surface: `#191a1b`
- Secondary Surface: `#28282c`

Text:
- Primary Text: `#f7f8f8`
- Secondary Text: `#d0d6e0`
- Tertiary Text: `#8a8f98`
- Quaternary Text: `#62666d`

Brand & accent:
- Brand Indigo: `#5e6ad2`
- Accent Violet: `#7170ff`
- Accent Hover: `#828fff`

Status:
- Green: `#27a644`
- Emerald: `#10b981`

Border & divider:
- Border Primary: `#23252a`
- Border Secondary: `#34343a`
- Border Tertiary: `#3e3e44`
- Border Subtle: `rgba(255,255,255,0.05)`
- Border Standard: `rgba(255,255,255,0.08)`
- Line Tint: `#141516`
- Line Tertiary: `#18191a`

Overlay:
- Overlay Primary: `rgba(0,0,0,0.85)`

## 3. Typography Rules

Font family:
- Primary: `Inter Variable`
- Monospace: `Berkeley Mono`
- OpenType features: `"cv01", "ss03"`

Important hierarchy guidance:
- Use weight 510 as the signature/default emphasis weight
- 400 for reading text
- 590 for stronger emphasis
- Display sizes use negative letter-spacing
- Below body sizes, spacing is mostly normal or slightly negative

## 4. Component Stylings

Buttons:
- Ghost button: `rgba(255,255,255,0.02)` background, `1px solid rgb(36, 40, 44)` border, 6px radius
- Primary brand button: `#5e6ad2`, white text, 6px radius
- Icon button: transparent or very subtle white background, 50% only if truly iconic, otherwise keep restrained
- Pill button: transparent, border, muted text

Cards & containers:
- Background: `rgba(255,255,255,0.02)` to `rgba(255,255,255,0.05)`
- Border: `1px solid rgba(255,255,255,0.08)` or subtler
- Radius: 8px standard, 12px featured
- Hover: subtle background opacity increase

Inputs:
- Background: `rgba(255,255,255,0.02)`
- Border: `1px solid rgba(255,255,255,0.08)`
- Radius: 6px

Navigation:
- Dark sticky header
- Links/labels at 13–14px with weight 510
- Bottom border subtle

## 5. Layout Principles

- Base unit: 8px
- Max content width around 1200px
- Generous whitespace, but not dashboard-y clutter
- Darkness as space
- Section isolation through spacing, not loud dividers

Border radius scale:
- 2px micro
- 4px small
- 6px functional
- 8px card
- 12px panel

## 6. Depth & Elevation

- Use luminance stacking instead of loud shadows
- Semi-transparent white borders communicate depth
- Surface elevation via background opacity steps
- Avoid heavy drop shadows on dark UI

## 7. Do's and Don'ts

Do:
- Use Inter Variable with `"cv01", "ss03"`
- Use weight 510 as default emphasis
- Use near-black surfaces and semi-transparent borders
- Reserve brand indigo for primary/interactive accents only
- Use `#f7f8f8` as primary text instead of pure white

Don't:
- Don't use pure white as the main text color
- Don't use decorative gradients or loud glows
- Don't use big wizard-like hero copy
- Don't use warm colors in the chrome
- Don't use bold 700 weights
- Don't use visible, chunky borders on dark backgrounds

## 8. Responsive Behavior

- Keep the app usable from mobile to desktop
- Collapse density, not hierarchy
- Preserve board readability

## 9. Agent Prompt Guide

Quick color reference:
- CTA: `#5e6ad2`
- Page background: `#08090a`
- Panel background: `#0f1011`
- Surface: `#191a1b`
- Heading: `#f7f8f8`
- Body: `#d0d6e0`
- Muted: `#8a8f98`
- Border default: `rgba(255,255,255,0.08)`
- Border subtle: `rgba(255,255,255,0.05)`

Apply this to the existing PulseLane implementation only. Output only patch text.
