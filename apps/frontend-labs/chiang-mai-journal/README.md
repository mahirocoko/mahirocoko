# รอยเมือง — Chiang Mai Journal Lab

`รอยเมือง` is the working brand for a Thai-first contemporary culture journal about Chiang Mai.

The first issue, **เมืองที่ทำด้วยมือ**, looks at the city through lettering, makers, materials, and in-between spaces. This is a fictional editorial frontend lab, not a tourism guide or documentary publication.

## Current status

The standalone Vite/React/React Router first slice implements the current-issue Home and one complete Chapter 01 article. Maitree + Anuphan is the selected Thai font pair. Codex A01/A02 provide art-directed desktop/mobile covers, A03 is the article lead, and A07/A08 form the responsive object-study pair. The Home chapter list does not invent images or completed stories for deferred Chapters 02–04.

First implementation slice:

- Home / current issue
- One complete feature article: `ตัวอักษรของเมือง`
- Desktop and mobile composition
- Reduced-motion and media-failure states
- Original Codex imagegen editorial asset family with explicit fictional provenance

Routes:

- `/` — current issue Home / open-issue spread
- `/stories/city-lettering` — complete Chapter 01 article

Rendered implementation evidence lives in [`docs/qa/implementation/`](./docs/qa/implementation/). Verified states include the user-flagged 1912×856 article headline, 1440px, 390px, 320px, keyboard entry focus, reduced motion, missing cover media, correct responsive asset selection, and zero horizontal overflow/console errors.

## Commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Selected font pair: Maitree + Anuphan Variable. The temporary comparison route was removed after selection; evidence and rationale live in [`docs/font-selection.md`](./docs/font-selection.md).

## Documents

- [`docs/design-brief.md`](./docs/design-brief.md) — product, composition, responsive, motion, and verification contract
- [`docs/content-outline.md`](./docs/content-outline.md) — working Thai page and article copy
- [`docs/asset-manifest.md`](./docs/asset-manifest.md) — Codex imagegen roles, outputs, provenance, and promotion gates
- [`docs/imagegen-prompts.md`](./docs/imagegen-prompts.md) — production-ready Codex source prompt and selection result
- [`docs/font-selection.md`](./docs/font-selection.md) — matched Thai font evidence and selection rationale

## Boundaries

- Do not present generated scenes, people, businesses, or interviews as real Chiang Mai reporting.
- Keep authored Thai copy in semantic HTML, never baked into generated images.
- Do not use ready-made Lanna ornament, luxury-gold nostalgia, postcard collage, or a temple–mountain–café checklist as identity.
- Do not scaffold shared frontend-lab packages until a second lab proves the same ownership boundary.
