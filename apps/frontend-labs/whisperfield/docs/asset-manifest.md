# Whisperfield asset manifest

All runtime assets are authored or generated for this lab. VoiceOS media is local reference-only and must never be copied into the repository or fetched by the runtime. HiroHiro section captures from 2026-07-19 define layout, button, and motion evidence; generated replacements must keep Whisperfield identity.

| filename | role | ratio | format | source strategy | expected QA checks | notes |
| --- | --- | --- | --- | --- | --- | --- |
| `public/favicon.svg` | Browser identity | 1:1 | SVG | Uses the owner-reviewed authored Whisperfield W-field mark | 16/32px readability, no external font | Matches the production mark geometry |
| `assets/imagegen/sources/whisperfield-mark-candidates.png` | Four original historical mark candidates | 1:1 sheet | PNG | Codex imagegen | no text, no copied voice/app logo geometry, four separated cells | Source only; the initially promoted field-furrow candidate was later superseded after rendered review |
| `public/assets/generated/whisperfield-mark.svg` | Selected production mark | 1:1 | SVG | Manually authored bold W-field geometry after owner feedback | 16/24/64px, monochrome and coral, transparent bounds | Used by navigation, compact glass header, footer, and favicon family |
| `public/assets/generated/whisperfield-mark-light.svg` | Compact mark on dark surfaces | 1:1 | SVG | Authored light role variant of the selected mark | 24px on dark/checker, coral point preserved | Never substitutes for the dark mark on white surfaces |
| `public/assets/generated/whisperfield-lockup-dark.png` | Full navigation lockup | 551:103 | PNG alpha | Authored selected mark + rasterized SF system wordmark | 36px display height, white-surface contrast, transparent bounds | Full header state; compact state swaps to the mark asset |
| `public/assets/generated/whisperfield-lockup-light.png` | Full footer/dark-surface lockup | 551:103 | PNG alpha | Authored light role variant | 36px display height, dark-surface contrast, transparent bounds | Separate role asset rather than CSS inversion |
| `assets/imagegen/sources/hero-corner-clouds-source.png` | Four cloud-corner extraction sources | 2:2 sheet | PNG | Codex imagegen on flat chroma key | uniform key, no gradients in matte, generous cell padding | Source only |
| `public/assets/generated/cloud-top-left.webp` | Hero atmospheric corner | 4:3 crop-safe | WebP alpha | Codex imagegen + dicut | light/dark/checker edge QA, no green residue | Paired with the other three corners |
| `public/assets/generated/cloud-top-right.webp` | Hero atmospheric corner | 4:3 crop-safe | WebP alpha | Codex imagegen + dicut | light/dark/checker edge QA, no green residue | Paired with the other three corners |
| `public/assets/generated/cloud-bottom-left.webp` | Hero atmospheric corner | 4:3 crop-safe | WebP alpha | Codex imagegen + dicut | light/dark/checker edge QA, no green residue | Paired with the other three corners |
| `public/assets/generated/cloud-bottom-right.webp` | Hero atmospheric corner | 4:3 crop-safe | WebP alpha | Codex imagegen + dicut | light/dark/checker edge QA, no green residue | Paired with the other three corners |
| `public/assets/generated/product-sky.webp` | Time/Agent/Dictation product-stage plate | 16:9 | WebP | Codex imagegen | 1440/390/320 crops, calm center, no text/objects | Product UI overlays remain semantic HTML |
| `public/assets/generated/privacy-sky.webp` | Privacy-stage night plate | 16:9 | WebP | Codex imagegen | white settings contrast, mobile crop, no text | Darker but related material family |
| `public/assets/generated/closing-sky.webp` | Closing CTA plate | 16:9 | WebP | Codex imagegen | center-safe copy zone, 320 crop, no text | Distinct sunrise state |
| `assets/imagegen/sources/customer-avatars-source.png` | Six fictional customer-avatar sources | 3:2 sheet | PNG | Codex imagegen | six separated faces, varied but coherent, no real-person likeness claims | Source only; fictional composites |
| `public/assets/generated/avatar-01.webp` … `avatar-06.webp` | Fictional field-note avatars | 1:1 | WebP | Codex imagegen + crop | 56px readability, face-safe crop, no grid residue | Cards remain clearly labelled fictional lab notes |
| `public/downloads/whisperfield-preview-pack.zip` | Real local preview download | archive | ZIP | Local packaging of original generated/authored assets + README | opens cleanly, contains no executable, manifest lists contents | Current SHA-256 `97f50b9018424e215199c2703e2ef037173d1748551499b9e44b17f3826fc361` |

## Runtime-authored visual elements

These remain semantic HTML/CSS rather than baked image files:

- Whisperfield wordmark text and all demo copy
- product window chrome and all product-screen text; QA screenshots are generated from the real runtime rather than imagegen text
- action/writing scenario screens
- privacy preference controls
- fictional field-note cards and copy; avatars are generated assets
- waveform and hotkey state

## Acceptance

- No `voiceos.com` runtime requests.
- No copied logo, cloud photo, app icon, testimonial avatar, screenshot, or generated text in pixels.
- Every asset survives 1440px, 390px, and 320px containers without exposing SVG canvas edges.
- Missing assets fall back to solid semantic surfaces without hiding copy or controls.
- Open-source icons must record package/version/license in `docs/open-source-attribution.md`; brand icons remain descriptive integration references rather than affiliation claims.
