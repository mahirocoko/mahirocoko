# Nudge — Interactive Sections Design Brief

## Current reality

- `Nudge` is a standalone frontend lab under `apps/frontend-labs/nudge-gallery/`.
- The build has pivoted from one routed study to a bounded, registry-driven gallery of six original interactive sections.
- No reference brand, text, demo inventory, pricing model, commercial access pattern, or visual trade dress is carried into this lab.
- The asset lane owns image production; this lane only references the agreed URL paths.

## Brand read and taste thesis

- **Product:** a compact gallery of original browser interaction sections with inspectable AI implementation prompts.
- **Audience:** designers and frontend builders looking for a quick, readable starting point rather than a catalogue of effects.
- **Desired read:** curious, tactile, and editorially calm; each sample feels like a small instrument on a worktable.

**Taste thesis:** Nudge should make motion feel like a precise response to intent, so a builder can inspect one interaction at a time, without becoming a dark “premium effects” store, a paywalled prompt shelf, or a generic dashboard of animated cards.

## Design read

An English-first exploratory gallery: a concise category-led hero frames the library, then large generated-media stages with captions outside the surface let each section prove one visible interaction. Homepage cards and detail routes share the same stage component, so compact previews are truthful reductions of the detail composition rather than separate CSS demos. Original naming, copy, prompts, image paths, and section inventory stay distinct.

## Mode and composition strategy

- **Mode:** greenfield lab, bounded pivot
- **Composition:** gallery-led whole page with one non-commercial workflow proof and a restrained closing section
- **Keep from reference anatomy:** concise sticky navigation, category-led proposition, media-first inventory, proof-first detail, stage-local controls, workflow explanation, closing rhythm
- **Adapt:** full-card routes, free prompt panels, copy-status feedback, image path registry, original pale workflow surface
- **Reject:** comparable brand/copy, pricing CTA, paywall language, category order copying, custom-cursor dependency, scroll-jacking, and perpetual ambient animation

## Structure

1. Masthead: product name, library count, anchored navigation
2. Intro: one clear thesis plus an interaction index
3. Filter rail: real buttons with selected state and result announcement
4. Section grid: large rounded media stage plus title/description outside it; the whole item is one keyboard-accessible route
5. Workflow proof: one original pale section explains Preview → Inspect → Copy → Adapt without pricing or service claims
6. `/sections/:id` detail route: viewport-scale live proof first, compact attached More/Replay/Copy Prompt controls, then intent notes
7. Prompt panel: moderate heading plus complete selectable prompt text; Copy Prompt status stays attached to the stage
8. Closing CTA: return to section grid rather than a commercial conversion action
9. Footer: small lab boundary/disclosure plus compact anchor groups; no pricing or checkout copy

## Visual and interaction system

- **Type:** one system-sans family across display, metadata, and body. Default copy is `300`; titles use `500` with normal letter spacing. No serif contrast lane.
- **Color:** `#0a0a0a` canvas, `#f5f5f3` primary text, muted `#969696` support text, and dark-gray shells. Preview content may retain its own interaction colors.
- **Surfaces:** dark ambient shells with restrained borders/shadows, generated portrait prints, stable focus targets, and compact/detail variants; no glass, metric-card dashboard, or unrelated old demo previews.
- **Prompts:** original implementation prompts are visible content, not paid inventory. Copying uses `navigator.clipboard.writeText` when available and falls back to selectable text.
- **Media:** registry entries reference `/assets/gallery/nudge-field-01.png` through `/assets/gallery/nudge-field-06.png`; assets are not edited in this lane.
- **Motion:** one idea per preview (scattered print field, numbered queue selection, bounded radar focus, local scrub ribbon, readable type response, folded image seam). Pointer updates are bounded and use CSS variables.
- **Progressive enhancement:** pointer transforms are limited to fine-pointer/hover contexts. Filter and open actions remain immediate.
- **Replay:** the Replay control only resets decorative local motion and never reruns navigation, filtering, or content state.
- **Reduced motion:** all preview transforms settle into their frame-zero composition through `prefers-reduced-motion`.

## Responsive contract

- Desktop keeps the intro split and a three-column section grid.
- Mid-width collapses to two columns while controls remain in normal flow.
- At 640px and below, the index stacks under the thesis, filters become horizontally scrollable, and each preview remains a touch-safe fixed-ratio panel.

## Verification

- Keyboard filter selection and visible focus state
- Six card previews render the matching compact generated-media variant
- Six detail routes render the matching full generated-media variant
- Every card opens to `/sections/:id`
- Filter query is preserved on detail return links
- Invalid ids show a safe fallback
- Prompt panel copy success and failure states
- Keyboard/touch selection for material controls such as Tilt Field prints and Reading Queue rows
- Fully readable selectable prompt fallback
- 1440px, 390px, and 320px rendering without horizontal overflow
- `prefers-reduced-motion` settled previews
- lint, typecheck, unit tests, and production build
