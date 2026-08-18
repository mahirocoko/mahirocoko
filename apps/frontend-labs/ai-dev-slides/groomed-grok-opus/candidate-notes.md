# Candidate notes

> **Historical evidence — superseded 18 August 2026.** This file documents the former 12-slide tool-history candidate and is not an active slide map, runtime contract, or QA report. The current 9-slide workflow deck is owned by `index.html`, `workflow.css`, and `grooming-notes.md`.

## Visual concept

A **context filament**: warm ink studio (paper bookends, copper thread) instead of a generic dark-SaaS card deck. The talk is about accumulating a working relationship with AI, so the deck keeps one copper line at the left edge while each slide gets its own composition.

- **Material:** coffee-black stage, bone paper for open/close, one copper accent, paper grain, no card mosaic.
- **Type:** Sukhumvit Set / Thonburi for Thai display; SF Mono for skill names and glossary labels.
- **Slide jobs:** 1 poster path · 2 numbered roadmap + glossary · 3 split Chat vs agent · 4 MCP stack · 5 2×2 manifesto · 6 Letta / Skills / Mods strata · 7 role bands · 8 river · 9 Herdr panes + Halo notch · 10 ecosystem core/orbit · 11 `mahiro-*` family · 12 empty Q&A.

## File inventory

| Path | Role |
| --- | --- |
| `index.html` | 12 slides, speaker-note templates, chrome, notes dialog |
| `styles.css` | Stage, type, per-slide layouts, reduced-motion, narrow reflow |
| `script.js` | Hash routing, keys, swipe, scale, notes toggle |
| `assets/filament.svg` | Left-edge copper thread |
| `assets/grain.svg` | Paper/ink grain |
| `assets/notch.svg` | Agent Halo notch diagram |
| `source/*` | Unchanged |

Open `index.html` in a browser. No server, CDN, or build step.

## Controls

| Input | Action |
| --- | --- |
| `→` `PageDown` `Space` | Next |
| `←` `PageUp` `Shift+Space` | Previous |
| `Home` / `End` | First / last |
| On-slide **ก่อนหน้า** / **ถัดไป** | Previous / next |
| Horizontal swipe / pointer drag | Previous / next |
| `N` | Toggle speaker notes (`<dialog>`, not on the projected slide) |
| URL hash | `#1`–`#12` |

Progress sits top-left as `n / 12`. Focus moves to the slide heading after a change. `prefers-reduced-motion` disables view transitions and dialog motion.

## Checks performed

- Reread all 12 articles in `index.html` against `source/slide-outline.md`.
- Confirmed Letta Code (never Mahiro Code), no Soul Vibe, no DM quotes, Slide 4 MCP-before-Letta, Slide 6 Letta / portable Skills / Letta-only Mods, Slides 10–11 ecosystem + `mahiro-*` core family.
- Local paths `styles.css`, `script.js`, `assets/*.svg` resolve. No `http(s)` in deck files.
- Headless Chrome screenshots at **1440×900** for all 12 hashes; re-shot 2, 3, 8 after overflow fixes. Narrow **390×844** for slides 2 and 11.
- Fixes from those shots: Slide 3 negative full-bleed was clipping “AI Chat”; Slide 2 grid was stuffing descriptions into the number column. Both corrected and re-checked.
- No headless Chrome left running. Source files untouched.
