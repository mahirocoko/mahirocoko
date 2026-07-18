# Motion-informed Nudge fidelity verification

## Scope

The checked surface is the Nudge prompt-copy section gallery: registry-driven six-section catalogue, unified generated-media card/detail stages, `/sections/:id` detail routes, filter-preserving returns, prompt panels, local Replay, original imagegen assets, and reduced-motion/fine-pointer motion boundaries.

## Evidence

| State | Evidence | Result |
| --- | --- | --- |
| Registry catalogue | `src/content.ts` | Six original sections define id, title, category, cue, detailed original AI implementation prompt, notes, and image URL paths `/assets/gallery/nudge-field-01.png` through `06`. |
| Gallery routes | `src/app.tsx` and unit tests | Every card links to `/sections/:id`; filtered card links preserve `?filter=`. |
| Card link names | `src/app.tsx` and unit tests | Each full-card link has a distinct accessible name such as `Open Tilt Field section`; no six-link `Open section` ambiguity remains. |
| Detail fallback | Unit test `/sections/not-real?filter=Pointer` | Invalid ids show the first section and a live status note instead of crashing. |
| Filter return | Unit test `/?filter=Layout` to detail | Detail back link returns to `/?filter=Layout#sections`. |
| Prompt copy success | Clipboard mock success test | `Copy Prompt` calls `navigator.clipboard.writeText` and announces `Prompt copied to clipboard.` |
| Prompt copy failure | Clipboard mock rejection test | Failure announces `Copy failed. Select the prompt text below.` and leaves the complete prompt block selectable. |
| Unified card previews | `unified-card-previews-1440.png`, `unified-card-previews-390.png`, unit tests | All six cards render compact generated-media variants keyed to their detail composition, not separate placeholder demos. |
| Unified detail variants | `unified-detail-<id>-1440.png`, `unified-detail-<id>-390.png`, unit tests | All six detail routes render the shared component in `detail` mode: print field, queue, radar, scrub ribbon, type signal, and surface fold. |
| Prompt/runtime truth | `src/content.ts`, shared stage implementation | Tilt Field and the five related build prompts now describe their actual generated-print composition, compact/detail relationship, input boundary, and reduced-motion fallback. |
| Masthead width | `unified-masthead-2000.png` + DOM geometry | At 2000px the masthead spans exactly `x=0..2000`, `.masthead__inner` remains 1296px at `x=352..1648`, body remains `rgb(10,10,10)`, and no horizontal overflow exists. |
| Workflow and prompt depth | `motion-fidelity-method-1440.png`, `motion-fidelity-method-390.png`, `motion-fidelity-prompt-390.png` | Original non-commercial workflow panel carries whole-page pacing; the mobile prompt renders at its full 560px content height without an inner scroll. |
| Media path usage | Shared stage image elements | Each composition uses the accepted generated portrait archive from `/assets/gallery/nudge-field-01.png` through `06`; queue, radar, scrub, type, and fold now combine distinct archive prints instead of repeating one source image. |
| Codex image assets | `assets/imagegen/codex-source/provenance.md`, `public/assets/gallery/` | Six independent 1122×1402 original imagegen stills passed source/crop checks; rejected A03/A04 first passes are recorded and only accepted replacements are runtime-promoted. |
| Selection interactions | Unit tests | Tilt Field print buttons and Reading Queue numbered rows expose stable click/focus selection with `aria-pressed`; hover remains supplementary. |
| Mobile interaction cue | Current 390px detail captures | Stage cues move into the attached control panel on narrow screens; the obscured bottom cue is hidden and Tilt Field edge prints remain inside the clipped stage. |
| Motion boundary | CSS and component pointer guard | Pointer-driven transforms are scoped to `@media (hover: hover) and (pointer: fine)` plus a fine-pointer runtime guard; no new animation dependency was added. |
| Whole-page enhancement | CSS `nudge-arrive` | Hero, cards, and closing content have short one-shot arrival motion; the readable static layout remains the baseline and no scroll-linked opacity gate is used. |
| Replay boundary | Detail stage | Replay increments local preview state only and does not reset navigation, filters, or content; it is disabled when motion is reduced. |
| Reduced motion | `unified-detail-reduced-390.png` + CSS media rule | Transitions/animations collapse, the six-print field stays composed, and Replay becomes disabled `Motion reduced`. |
| Commercial boundary | App copy and docs | Pricing/paywall/checkout language was removed; footer explicitly says no paywall/no checkout. |

## Automated checks

Run from `/Users/mahiro/Git/me/mahirocoko/apps/frontend-labs/nudge-gallery` on 2026-07-18:

- `pnpm lint` — pass
- `pnpm typecheck` — pass
- `pnpm test` — pass (`src/app.test.tsx`, 9/9 tests)
- `pnpm build` — pass (`tsc -b && vite build`)
