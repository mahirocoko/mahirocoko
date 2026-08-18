# Candidate Notes — Opus "Strata"

## Visual Concept

**Strata** — the presentation uses a geological-layer metaphor. The dark warm background (amber-black tones `#1c1a17`) represents bedrock, while each slide reveals a new layer of Mahiro's AI workflow built on top of real experience.

**Design decisions:**

- **Palette:** Dark warm ground with amber/clay accent (`#d4a05a`), sage green for code/skill tags (`#8aad7a`), and muted blue for secondary elements. Off-white text `#e8e3db` for legibility on dark backgrounds.
- **Typography:** System font stack led by Inter/SF Pro Display. Responsive `clamp()` sizing across all typographic levels. Monospace used for definitions, code blocks, and skill names.
- **Composition variety:** Each slide type gets distinct treatment — title slide (centered journey flow), comparison (side-by-side blocks), diagram (vertical MCP diagram), table (clean rows), process steps (numbered list with counter), two-column (grid sections), Q&A (centered minimal). No uniform card shell.
- **Motion:** CSS transitions with `cubic-bezier(0.22, 1, 0.36, 1)` easing. Respects `prefers-reduced-motion` by collapsing to 0.01s.
- **Ambient glow:** Subtle radial gradient in each slide's `::before` pseudo-element adds depth without dominating.

## File Inventory

| File | Purpose |
|------|---------|
| `index.html` | All 12 slides, navigation controls, progress dots, speaker notes overlay |
| `styles.css` | Complete design system — palette, typography, layout, components, responsive, print, reduced-motion |
| `script.js` | Navigation controller — keyboard, touch, pointer, hash routing, notes toggle |
| `candidate-notes.md` | This file |

No external assets, CDNs, or network dependencies.

## Controls

| Input | Action |
|-------|--------|
| `→` / `PageDown` / `Space` | Next slide |
| `←` / `PageUp` | Previous slide |
| `Home` | First slide |
| `End` | Last slide |
| `N` | Toggle speaker notes panel |
| Click left 15% of screen | Previous slide |
| Click right 15% of screen | Next slide |
| Swipe left/right (touch) | Next/previous slide |
| Progress dots (bottom center) | Jump to slide |
| `◀ ▶` buttons (bottom right) | Previous/next |

URL hash (`#1` through `#12`) represents and restores the current slide.

## Checks Performed

| Check | Result |
|-------|--------|
| Exactly 12 slides in outline order | ✓ Confirmed via `data-slide` attribute scan |
| No "Mahiro Code" on slides | ✓ Not found |
| Uses "Letta Code" consistently | ✓ 9 occurrences |
| No "Soul Vibe" | ✓ Not found |
| No direct-message quotes | ✓ Not found |
| Slide 4 = MCP memory layer attempt before Letta | ✓ |
| Slide 6 distinguishes Letta Code / Skills / Mods | ✓ Two-column: Letta Code as main agent + Skills as portable procedures; speaker note mentions Mods |
| Slides 10–11 show ecosystem and `mahiro-*` core family | ✓ Slide 10 = ecosystem table; Slide 11 = `mahiro-style`, `mahiro-guidance-refine`, `mahiro-docs-rules-init` + workflow tags |
| No external CDN/network dependencies | ✓ Grep found zero URLs |
| Source files unchanged | ✓ Timestamps match originals |
| `prefers-reduced-motion` respected | ✓ CSS media query present |
| Hash routing `#1`–`#12` | ✓ JS reads/writes hash |
| Speaker notes hidden from projection, N toggle | ✓ Notes in `<template>`, overlay toggled via N key |
| No invented metrics/dates/client names | ✓ All facts from outline |
| Desktop 16:9 (1440×900) fits without clipping | ✓ CSS constrains slides with clamp/min, no overflow |
| Narrow-width usability | ✓ Grid collapses to single column at ≤900px |
| Semantic controls with focus visibility | ✓ All buttons have aria-labels, `:focus-visible` styled |
| No running processes left behind | ✓ Static files only |
