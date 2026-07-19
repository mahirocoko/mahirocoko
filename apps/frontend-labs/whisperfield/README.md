# Whisperfield

Whisperfield is an original frontend lab studying the visible page anatomy, button material, and motion pacing of [VoiceOS](https://www.voiceos.com/) with a fictional voice-workflow product, original copy, generated visual assets, open-source icons, and independently implemented interactions.

It preserves the reference's calm Mac-product pacing and full proof sequence without copying VoiceOS source code or runtime media. Whisperfield's mark, cloud plates, transparent hero clouds, fictional customer avatars, product UI, screenshots, motion, and downloadable preview pack are created for this lab.

## Run

```bash
pnpm install
pnpm dev
```

## Verify

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Product boundary

- Fictional product, fictional field-note customers, and demo-only access cards
- Real preview-asset ZIP download; no executable, installer, microphone, account, payment, or cloud service
- No runtime request to VoiceOS
- Reference observed on 2026-07-19 at desktop and mobile widths
- Section, button, state, and timed-motion evidence captured through HiroHiro QA control

## Documents

- [`docs/design-brief.md`](./docs/design-brief.md) — anatomy map, Keep/Adapt/Reject decisions, product-truth boundary, and verification contract
- [`docs/asset-manifest.md`](./docs/asset-manifest.md) — original runtime asset roles and QA contract
- [`docs/imagegen-prompts.md`](./docs/imagegen-prompts.md) — production prompts for the generated asset families
- [`assets/imagegen/provenance.md`](./assets/imagegen/provenance.md) — imagegen call IDs, hashes, dicut/crop methods, rejected derivations, and QA evidence
- [`docs/open-source-attribution.md`](./docs/open-source-attribution.md) — exact open-source icon packages and imported glyphs
