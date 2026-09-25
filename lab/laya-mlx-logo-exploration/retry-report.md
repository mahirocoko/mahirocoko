# Laya MLX Lab logo exploration — native retry run

Status: six independent native image-generation candidates completed successfully. Historical blocked attempts remain in `report.md`; this run is recorded separately. This report owns the raw six-call retry only; later W1 derivatives and the separate character route are indexed by `README.md`. No product repository files were touched.

## Dispatch

- Calls: exactly six, sequential, one candidate per native `image_gen__imagegen` call.
- Order: W1, W2, M1, M2, C1, C2.
- Native tool: built-in `image_gen__imagegen`.
- Provider/model identity: the native result exposed only `image_url` and `output_hint`; provider and model fields were not exposed, so no model identity is guessed.
- Raw artifacts: copied byte-for-byte from each returned provider path into the label folder.
- Derivative: one contact sheet created only after all six raw artifacts were present.

## Receipt table

| Call | Label | Exact prompt | Returned artifact identity | Raw artifact | Dimensions | Mode | SHA-256 |
| ---: | --- | --- | --- | --- | ---: | --- | --- |
| 1 | W1 | `W1/prompt.txt` | `/Users/mahiro/.codex/generated_images/01a0d2d6-be3b-7bf0-993e-9ccc2536382b/exec-7928a503-1b8c-445c-8d1b-018438316379.png` | `W1/raw.png` | 2172×724 | RGBA | `ba77add11208b79c4f40f063ea3287731101df275cb25e716242677ca36f415d` |
| 2 | W2 | `W2/prompt.txt` | `/Users/mahiro/.codex/generated_images/01a0d2d6-be3b-7bf0-993e-9ccc2536382b/exec-97bfa800-cfa9-47c3-8016-a0b1207fad6f.png` | `W2/raw.png` | 1942×809 | RGBA | `55dd232024cead897da56bbb2fccbcb914fcfec234cae1a39bdf2ecdd3353dfa` |
| 3 | M1 | `M1/prompt.txt` | `/Users/mahiro/.codex/generated_images/01a0d2d6-be3b-7bf0-993e-9ccc2536382b/exec-4ded6b34-e9c2-4b0b-a0fd-f73ad3e4548e.png` | `M1/raw.png` | 1983×793 | RGBA | `225bd941f0c3832bfaf408192b6693eb56b46877b88c0b8a930cb799b77f13c1` |
| 4 | M2 | `M2/prompt.txt` | `/Users/mahiro/.codex/generated_images/01a0d2d6-be3b-7bf0-993e-9ccc2536382b/exec-1cfe5c7b-9ed7-4976-93fe-e280daa98c39.png` | `M2/raw.png` | 1774×887 | RGBA | `5b57ee3dd25abfa24a89ca768ee826d993a58b17a12e98f47ebe3a3e7c560d10` |
| 5 | C1 | `C1/prompt.txt` | `/Users/mahiro/.codex/generated_images/01a0d2d6-be3b-7bf0-993e-9ccc2536382b/exec-2cd2c5da-db93-45f9-b3ab-f25e4e6c5d07.png` | `C1/raw.png` | 1672×941 | RGBA | `78378cecda4a46c82614b491845668e91ea2b8b4f952a54b6cc93ed2a484d674` |
| 6 | C2 | `C2/prompt.txt` | `/Users/mahiro/.codex/generated_images/01a0d2d6-be3b-7bf0-993e-9ccc2536382b/exec-a7925108-7782-473b-b23f-ca8f2a05fc46.png` | `C2/raw.png` | 1774×887 | RGBA | `c371d6a90b13a3f8f1731f86adaaca5240511f85b6ec42db3cc4ffabed4c1769` |

## Derivative

- Contact sheet: `contact-sheet.png`
- Dimensions/mode: 2700x928, RGB
- SHA-256: `4db9d1f8a1f944718af51fe526fb0f0b78013b036bf3a39cfa2a5d290a1a1ecd`
- Construction: six full raw images placed into labeled cells with proportional thumbnail fitting on a dark background; no crop, retouch, upscale, vectorization, or filtering.

## Mechanical observations

Full-size review confirms six distinct single-mark concepts on dark canvases:

- W1: wordmark-led with layered page-like mark; high contrast, but bright edge noise and glow around the lettering.
- W2: wordmark-led with a measured baseline device; strong contrast, with a broad atmospheric halo.
- M1: compact geometric L/M monogram plus wordmark; the lockup is clear and balanced.
- M2: folded negative-space monogram plus wordmark; clean silhouette and the most restrained backdrop of the set.
- C1: independent moth-like archivist mascot with wordmark; character reads clearly, while the stacked lockup and lettering have more texture.
- C2: independent hare-like scout mascot with wordmark; strong silhouette and clear horizontal lockup.

At the contact-sheet scale, M1, M2, and C2 retain the clearest lockup silhouettes; W1 and W2 retain readable wordmarks with more halo; C1 remains identifiable but its smaller lettering is more texture-sensitive. These are mechanical observations only; no direction is selected. Generated lettering remains concept evidence and was not corrected.

Within this six-call retry run, no candidate was retried, edited, or cleaned, and no product repository integration occurred. Later separately authorized W1 and character work preserved these raw files unchanged and is outside this report's scope.
