# Vessel Codex border-edit report

Status: ready

Exactly two Codex native image-generation reference-edit calls were submitted in the required order: website first, then app only after the website call completed and its artifact was persisted. No retry, correction call, crop, upscale, repaint, or post-processing was performed.

## Preflight verification

All four inputs matched their expected SHA-256 values before the first provider call:

- Website source: `630e4d5ccacfc74160a93718faf37642ffd1fd657d5233c57869d4fffe93f92e`
- Website prompt: `9ad51520c510f4b93567fbc94106372565e10bc4ea80a9074ba053b7b498a80e`
- App source: `3c1970b31d03d1251023f2515f9d99ebcac6c62ee612af599b8a95aed390039b`
- App prompt: `be5300278b4399bcc1e936341a2cced54982bdfa188f21051cfa3cbe94a86be7`

## Website result

- Direct-reference attachment used: yes, through `referenced_image_paths` with the verified website source PNG.
- Prompt submitted unchanged from `/tmp/vessel-website-less-borders.prompt.txt`.
- Provider/tool provenance: Codex native `image_gen`.
- Exact provider-returned path: `/Users/mahiro/.codex/generated_images/01a0bf3c-dc8e-7350-a202-5a540e4809a6/exec-38a55e86-127d-4672-a051-bab05642ed8d.png`
- Exact provider artifact identity: `exec-38a55e86-127d-4672-a051-bab05642ed8d.png`
- Persisted raw copy: `/tmp/vessel-codex-border-edit-output/website/raw.png`
- Output: PNG, RGB, 1586 × 992, 1,616,869 bytes.
- Output SHA-256: `9900fb1742de05a68cc14ce602771d043fc5e4cbbd53fb5199d5f7135e7c5eaf`
- Byte-for-byte copy verification against provider artifact: passed.
- Provider limitation: the native tool exposed no explicit output-size or pixel-mode arguments and returned 1586 × 992 rather than the prompt's frozen canvas dimensions. The returned raw output was preserved unchanged.

## App result

- Direct-reference attachment used: yes, through `referenced_image_paths` with the verified app source PNG.
- Prompt submitted unchanged from `/tmp/vessel-app-less-borders.prompt.txt`.
- Provider/tool provenance: Codex native `image_gen`.
- Exact provider-returned path: `/Users/mahiro/.codex/generated_images/01a0bf3c-dc8e-7350-a202-5a540e4809a6/exec-13636a2c-13c5-4ed3-a00b-81a922aeec55.png`
- Exact provider artifact identity: `exec-13636a2c-13c5-4ed3-a00b-81a922aeec55.png`
- Persisted raw copy: `/tmp/vessel-codex-border-edit-output/app/raw.png`
- Output: PNG, RGB, 1561 × 1008, 1,644,456 bytes.
- Output SHA-256: `1fe68d51c9c03fae90ce9d26397754e1736367c7b0677834ec7ef7063fbf9ff1`
- Byte-for-byte copy verification against provider artifact: passed.
- Provider limitation: the native tool exposed no explicit output-size or pixel-mode arguments and returned 1561 × 1008 rather than the prompt's frozen window/canvas dimensions. The returned raw output was preserved unchanged.

Machine-readable provenance and measurements are in `/tmp/vessel-codex-border-edit-output/manifest.json`.
