# Vessel — Visual Implementation Report

## Status

**COMPLETE.** Both raw references (`references/website.png`, `references/app.png`) were inspected
directly with the image-reading capability before any code was written, including full-resolution
region crops and programmatic pixel/color sampling to verify geometry and palette. All four
validation commands pass.

## Files created

### Root launchpad (`/`)
- `index.html` — launchpad entry
- `src/main.tsx` — root bootstrap
- `src/launchpad.tsx` — restrained index linking `/website/` and `/app/`
- `src/launchpad.css` — off-white editorial styling
- `src/launchpad.test.tsx` — surface links + honesty guards

### Shared
- `src/shared/facts.ts` — fictional sample source facts, recipe selection type, asset path
- `src/shared/optic-blade.tsx` — shared Optic Blade comparison surface (pointer drag with pointer
  capture, `role="slider"` keyboard control: arrows ±2, PageUp/Down ±10, Home/End; light/dark
  themes; SOURCE/DERIVATIVE chips; optional state overlay)
- `src/shared/optic-blade.css`

### Website surface (`/website/`)
- `website/index.html`, `website/main.tsx`, `website/website-page.tsx`
- `website/site-chrome.tsx` — header (wordmark, section nav, "Local-first study" pill, app-study
  CTA) and footer with the no-production-download disclosure
- `website/site-hero.tsx` — reference hero: eyebrow, sans/serif-italic headline, lede, two CTAs
- `website/site-story.tsx` — Optic Blade proof (light theme, simulated-derivative disclosure),
  metadata/privacy audit readout (fictional-sample flagged), color/profile section with the
  explicit "CSS preview is not proof of native conversion" honesty note
- `website/site-plan.tsx` — derivative recipe + protected-source invariant, stage → inspect →
  choose → drag-out lifecycle, local-first boundary / input scope / honest limitations, FAQ
  (`<details>/<summary>`), truthful final CTA to `/app/`
- `website/website.css` — full responsive styling (1440 / 820 / 390)
- `website/website-page.test.tsx` — navigation, product-truth guards, single-h1, blade a11y

### App surface (`/app/`)
- `app/index.html`, `app/main.tsx`, `app/app-study.tsx` — state machine + composition
- `app/study-model.ts` — `DeckStatus` union, telemetry computation, per-state status metadata
  (symbol + tone + text), capability helpers
- `app/mac-window.tsx` — decorative Mac window frame (inert traffic lights, title, LOCAL-FIRST)
- `app/deck-panels.tsx` — recipe column (real checkboxes), source column (Load Sample Asset /
  Clear Deck / Re-inspect), telemetry column, non-blocking study notice
- `app/app.css` — ebonite instrument styling, desktop backdrop, narrow-viewport frame/pan
- `app/app-study.test.tsx` — 10 interaction tests

## Design interpretation

### References as authorities
- **Website:** cool off-white `#fbfbfd` page; near-black ink; small-caps letterspaced eyebrows;
  hero headline pairing a bold sans line ("Preflight the file.") with a serif italic line
  ("Keep the original."); a full-width bare-photo Optic Blade (rounded, dark divider + dark
  handle, SOURCE/DERIVATIVE chips, mono uppercase facts row); numbered lifecycle strip. Verified
  by pixel sampling — the blade on the website is the bare photograph on the off-white page, not
  a dark panel.
- **App:** near-black desktop with a subtle cool/warm glow; compact ebonite window
  (`#141519` body, `#101114` chrome, hairline `rgba(255,255,255,.08)`); muted traffic lights;
  centered "Vessel — Preflight" title; LOCAL-FIRST badge; full-width Optic Blade with white
  divider/handle; three columns (Derivative Recipe / Source / Derivative Telemetry); footer with
  emerald status dot, "Original never leaves this Mac.", and the derivative action.

### Load-bearing choices
- **Less Borders v2 restraint:** hierarchy via spacing, small-caps labels, tint (`#f2f2f6` fills),
  opacity, and hairlines only where they structure lists — no outlined card grids, no badge soup.
- **Status language:** restrained cyan (inspecting), amber (unsupported / source changed /
  destination unavailable), emerald (ready). Every status pairs a colored dot with a symbol and
  words, so meaning never relies on color alone.
- **Optic Blade as shared signature:** one component, two themes; the derivative side is the same
  `public/assets/vessel-landscape.png` with a subtle CSS filter, always labeled as simulated.
- **Honesty:** fictional-sample disclosures sit directly under every demonstration; the only CTAs
  are "Open the app study"; the derivative action shows a dismissible non-blocking notice instead
  of pretending to export.

### Deliberate tradeoffs
- The app window is fixed at 680px (the reference's compact desktop-native workbench). At 390px
  the page deliberately frames it in a horizontal pan stage with a "pan to inspect" hint instead
  of reflowing it into a fake mobile app; scenario controls stay reachable below the frame.
- The six required states are reachable through a discreet "Study scenarios" strip outside the
  window (the honest way to demo states a real filesystem would produce), plus organically:
  Load Sample Asset → Inspecting → Ready; Clear Deck → Empty; Re-inspect from Source Changed.
- System font stacks only (no external fonts, no claimed SF Pro); serif accent is Georgia italic.
- No motion pass, per scope; transitions are essentially absent and `prefers-reduced-motion` is
  respected.

## Command results (all from workspace root)

| Command | Result |
| --- | --- |
| `pnpm typecheck` | PASS (`tsc -b`, no errors) |
| `pnpm test` | PASS — 3 files, 16/16 tests |
| `pnpm lint` | PASS — "No issues found" |
| `pnpm build` | PASS — `tsc -b && vite build`, 3 HTML entries emitted |

One self-found defect was fixed during development (a test expectation arithmetic error for the
blade keyboard step); no source defects remained after the fix.

## Remaining limitations

- Everything shown is a frontend simulation: no parsing, no filesystem behavior, no export, no
  native color conversion — by design and labeled as such in the UI.
- The Optic Blade derivative is a CSS filter approximation of "sRGB preview / optimization", not
  a rendered derivative.
- Pointer-drag on the blade is covered by keyboard tests only; pointer capture paths are not
  exercised in jsdom.
- The 680×440 window keeps its desktop density at all widths; small-phone users must pan
  horizontally (intentional framing, not a responsive reflow).
- Scenario strip is a study scaffold with no analogue in a shipping native app.
