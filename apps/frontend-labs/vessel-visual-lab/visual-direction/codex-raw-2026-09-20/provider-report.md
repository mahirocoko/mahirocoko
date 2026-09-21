# Vessel Codex image-generation report

Status: complete. Both required prompt hashes matched before any provider call. Exactly two native Codex `image_gen` provider calls were submitted, sequentially, with no retries, edits, crops, upscales, background removal, or regeneration.

## Call 1 — website header hero

- Prompt SHA-256: `6e5d7da13cbbca1cc3726d44545e7e4bc71b81158cd53772cc65bc9e981a69dd`
- Provider source: `/Users/mahiro/.codex/generated_images/01a0be97-9f4f-7f50-9089-0a96d661fa7d/exec-060b7121-fb9a-4617-b6a0-57678a2c4d96.png`
- Persisted raw: `/tmp/vessel-codex-imagegen-output/website/raw.png`
- Output SHA-256: `630e4d5ccacfc74160a93718faf37642ffd1fd657d5233c57869d4fffe93f92e`
- Metadata: PNG, RGB, 1586 × 992, 1,557,583 bytes
- Status: terminal success, source preserved, persisted copy hash-matched

## Call 2 — app main window

- Prompt SHA-256: `4e1b851904ba27a0dd27a275da684fa735095dd09f492c4d49bec7464bec274a`
- Provider source: `/Users/mahiro/.codex/generated_images/01a0be97-9f4f-7f50-9089-0a96d661fa7d/exec-e0994137-7c1a-4d20-885f-9b7adba9c369.png`
- Persisted raw: `/tmp/vessel-codex-imagegen-output/app/raw.png`
- Output SHA-256: `3c1970b31d03d1251023f2515f9d99ebcac6c62ee612af599b8a95aed390039b`
- Metadata: PNG, RGBA, 1560 × 1008, 1,876,647 bytes
- Status: terminal success, source preserved, persisted copy hash-matched

## Provider limitation

The native tool returned each image inline plus an `output_hint` containing the exact saved path. It did not expose separate receipt, session, or result identifier fields. The exact provider-returned source paths and their directory/file identities are recorded in `manifest.json`.
