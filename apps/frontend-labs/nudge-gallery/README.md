# Nudge — Interactive Sections Lab

`Nudge` is a standalone frontend lab for six original interactive sections. It keeps the useful browsing anatomy of a preview-led gallery: a direct thesis, accessible taxonomy, card routes, and inspectable build prompts. It does not reproduce the reference brand, copy, visual identity, inventory, pricing model, or animation mechanism.

## What is implemented

- Registry-driven catalogue of six original interactive sections
- Categories, accessible filtering, and selected-result announcement
- Shared media-led stage component for homepage card previews and detail showcases
- Per-section image URL paths from `/assets/gallery/nudge-field-01.png` through `06`
- Six original Codex imagegen stills, with source/hashes/rejected-candidate provenance in `assets/imagegen/codex-source/provenance.md`
- Shareable `/sections/:id` detail routes with filter-preserving return links
- Invalid section id fallback to a safe first-section detail state
- Proof-first detail pages with attached Replay/Copy Prompt controls and a fully readable selectable prompt block
- Unified dark ambient/generated-print grammar across Tilt Field, Reading Queue, Soft Radar, Travel Scrub, Type Signal, and Surface Fold
- Fine-pointer-only pointer transforms, no new animation dependency, and reduced-motion settled state
- Replay button that restarts only local decorative motion
- Responsive one/two/three-column grid

## Commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Boundaries

- This is a visual/interaction lab, not a storefront, paywall, or pricing exercise.
- Each card owns one small interaction idea; motion cannot block reading or navigation.
- Pointer movement is supplementary: filtering and opening a section work with keyboard and touch.
- `prefers-reduced-motion` renders stable previews.
- Generated media is role-bound to the section registry; each source asset remains separate from the runtime delivery copy.

See [`docs/design-brief.md`](./docs/design-brief.md) for the visual and interaction contract.
Rendered desktop/mobile and interaction evidence lives in [`docs/qa/implementation/`](./docs/qa/implementation/).
