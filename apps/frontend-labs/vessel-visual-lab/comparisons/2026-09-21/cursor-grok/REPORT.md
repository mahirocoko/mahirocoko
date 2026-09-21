# Vessel visual study — report

## Status

`COMPLETE`

Raw references `references/website.png` and `references/app.png` were inspected before implementation. The shared landscape asset at `public/assets/vessel-landscape.png` is used as the live Optic Blade source.

## Files created / changed

Created:

- `index.html`, `website/index.html`, `app/index.html`
- `src/main.tsx`, `src/launchpad.tsx`, `src/launchpad.css`, `src/vite-env.d.ts`, `src/styles/base.css`
- `src/website/main.tsx`, `src/website/website-page.tsx`, `src/website/website.css`
- `src/app/main.tsx`, `src/app/app-study.tsx`, `src/app/app.css`, `src/app/deck-states.ts`
- `src/shared/optic-blade.tsx`, `src/shared/optic-blade.css`, `src/shared/paths.ts`, `src/shared/product-truth.ts`, `src/shared/sample-asset.ts`
- `src/test/navigation.test.tsx`, `src/test/product-truth.test.tsx`, `src/test/app-study.test.tsx`, `src/test/sample-asset.test.ts`

Unchanged (as required): `references/**`, `public/assets/vessel-landscape.png`, `pnpm-lock.yaml`, `node_modules`, existing package versions, `vite.config.ts`, ESLint/TS configs, `src/test/setup.ts`.

## Design interpretation and tradeoffs

Visual thesis: an outgoing airlock. The website is an off-white optical/editorial poster that continues into a numbered story. The app is a compact ebonite Mac instrument. Hierarchy comes from spacing, type, tint, and material — not a grid of outlined cards.

Website, from `references/website.png`:

- Sticky hairline header, Vessel wordmark, quiet nav, ghost search, solid study CTA.
- Centered hero with gray “airlock,” two pills, and a rounded landscape Optic Blade.
- Source chips in dark/amber material; derivative chips in emerald; visible **Sample · simulation** label.
- Story below the blade: metadata audit, CSS color disclaimer, explicit recipe + protected source, stage→inspect→choose→drag-out, local-first boundary, FAQ, truthful final CTA.

App, from `references/app.png`:

- Fixed 680×440 window on a deep stage: traffic-light chrome, Local only, source facts, cyan recipe checks, plus-handle blade, telemetry capsule, Clear Deck / Drag derivative.
- Six states via an explicit **study-state** rail (not product chrome): Ready, Empty, Inspecting, Unsupported, Source Changed, Destination Unavailable.
- Recipe checkboxes recompute fictional derivative bytes, profile, and tag count.

Deliberate tradeoffs:

- Header “Download” / “Get Vessel for Mac” became **App study** links. No production download.
- “Lossless re-encode (Oxipng)” became **Optimize a delivery copy** so the study does not claim that architecture.
- P3 vs sRGB is a CSS filter on the same PNG, labeled as not native conversion proof.
- System UI stack only. No SF Pro claim, no Apple marks, no SF Symbols.
- No motion pass. Blade movement is pointer/keyboard interaction only.
- At 390px the website recomposes (menu, stacked hero, relocated chips). The app **pans** the desktop window instead of pretending to be a phone app.

## Command results

All run from this workspace after the final source pass:

| Command | Result |
| --- | --- |
| `pnpm typecheck` | pass (`tsc -b`) |
| `pnpm test` | pass — 4 files, 14 tests |
| `pnpm lint` | pass — no issues |
| `pnpm build` | pass — Vite client build, MPA entries at `/`, `/website/`, `/app/` |

## Remaining limitations

- All file facts, profiles, tag counts, sizes, savings, and error states are fictional samples.
- No parser, filesystem, export, native color conversion, or working download is implemented.
- CSS Optic Blade preview is not ColorSync/ICC proof.
- This candidate did not run browser automation or visual grading.
- Native window behaviors (true drag to Finder, Option-V app dismiss, disk invariance) are simulated in the browser only.
