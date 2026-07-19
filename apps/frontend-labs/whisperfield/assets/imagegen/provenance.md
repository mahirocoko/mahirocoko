# Whisperfield generated-asset provenance

Status: complete; all manifest imagegen families are generated, derived, inspected, and promoted.

Generated and promoted on 2026-07-19 in the `/root` Codex primary lane.

## Source boundary

- VoiceOS was observed through HiroHiro QA control on 2026-07-19 for section anatomy, button behavior, and motion timing.
- No VoiceOS pixels, logos, customer identities, wording, screenshots, or downloaded assets were used as image inputs.
- No input images were supplied to any generation call. Every source below is a text-to-image output.
- Raster plates and portraits contain no generated text, logos, UI, or watermarks.

## Lane and generation receipt

| lane | orchestrating model | generation surface | image model identifier | allowed paths | status |
| --- | --- | --- | --- | --- | --- |
| `/root` (`codex-sol-assets`) | Codex / GPT-5 | built-in `image_gen` tool | Not exposed in the built-in tool result; no `gpt-image-*` identifier is claimed | `assets/imagegen/**`, `public/assets/generated/**` | complete |

Built-in imagegen session/directory identifier: `019f788a-1d3c-7520-b0fd-3d175fab8374`.

| family | imagegen call identifier | preserved raw source | dimensions | source SHA-256 | promotion |
| --- | --- | --- | --- | --- | --- |
| mark candidates | `exec-a15c51f6-95f0-46d6-8c6a-75a3cf149bf4` | `assets/imagegen/sources/whisperfield-mark-candidates.png` | 1254×1254 RGB PNG | `66bec3673f3dd27ee510f80e7d0e21c0135b01cfe225e644c873cdc2b0dd9c14` | source retained; top-left candidate selected and traced |
| hero corner clouds | `exec-d10bd93c-6f99-4ade-b61e-d9cc3288fec8` | `assets/imagegen/sources/hero-corner-clouds-source.png` | 1254×1254 RGB PNG | `a5c677c126383573cf5227faf428a03a5d0f7be189326db9415a384cb524a45c` | source retained; four dicut masters and deliveries promoted |
| product sky | `exec-8ef75ac7-ff6b-40e9-bb40-049c2cf6cfa3` | `assets/imagegen/sources/product-sky-source.png` | 1672×941 RGB PNG | `6a3f5553cfc95f666b6834fa11c8fbc8f526a3dbd761498b1a3c74b3fa277103` | promoted |
| privacy sky | `exec-3187fc07-dc1e-41f3-a947-6f743b9cc620` | `assets/imagegen/sources/privacy-sky-source.png` | 1672×941 RGB PNG | `d7cd0a520ec53da14172384a565809029e98e82fa4e0f25e8677d855004c64c4` | promoted |
| closing sky | `exec-8028096d-9cbb-40ef-8726-8a58441ebf29` | `assets/imagegen/sources/closing-sky-source.png` | 1672×941 RGB PNG | `3cd7593e41b37d8abbaaa960710abd4f9d9b98e744f75152d6c175fdbd0c58f0` | promoted |
| fictional avatars | `exec-0f41c2bd-feb1-4e5a-aca8-fba17d611e36` | `assets/imagegen/sources/customer-avatars-source.png` | 1536×1024 RGB PNG | `c819cad2f247683942b12533a77ff50bcea80a0030e43b9fdff17fb9101eb902` | six crops promoted |

## Exact execution prompts

### Mark candidate sheet

```text
Use case: logo-brand
Asset type: transparent-cutout source / logo-reference sheet for a production website mark
Primary request: Create a clean 2×2 candidate sheet of four distinct original geometric symbol marks for a fictional quiet voice-workflow product named Whisperfield.
Style/medium: flat vector-like symbol exploration rendered as a raster source sheet
Composition/framing: square 1:1 canvas; four evenly sized, clearly separated cells; one centered mark per cell; generous padding; no clipped edges
Color palette: one-color black with one restrained coral accent on a plain warm-white background
Constraints: Marks only—no wordmark, letters, text, microphone icons, soundwave clichés, speech bubbles, Apple shapes, VoiceOS shapes, or existing app-logo geometry. Each mark should express a thought moving through a calm field: compact, bold, legible at 16px. No gradients, shadows, mockups, labels, watermark, frame, or clipped edges. Four candidates must be materially different from one another and separated cleanly for candidate review.
Delivery intent: original source sheet for selection and manual SVG redraw; do not include any generated text.
```

### Hero corner-cloud source sheet

```text
Use case: photorealistic-natural
Asset type: chroma-key cutout source sheet for four transparent website corner-cloud masters
Primary request: Create a 2×2 source sheet containing four separate airy cloud banks for website corner compositing: top-left wisps, top-right wisps, bottom-left fuller cloud, bottom-right fuller cloud.
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background, exactly one uniform key color with no wall, floor, gradient, texture, reflections, lighting variation, or green spill
Style/medium: soft photoreal atmospheric cloud photography, calm premium and restrained, not fantasy illustration
Composition/framing: square 1:1 canvas; strict 2×2 layout with one fully visible cloud bank per cell; generous padding inside every cell; clear separation between cells; no cloud crossing cell boundaries; no clipped edges
Lighting/mood: pale ivory cloud volume, cool lavender undertones, faint coral dawn rim, readable later over white
Constraints: no text, logo, watermark, borders, cast shadows, sun, landscape, objects, or generated UI. Do not use #00ff00 anywhere in the clouds. Keep the matte flat enough for real local chroma-key removal and preserve soft but distinct cloud silhouettes.
Delivery intent: raw image-generation source sheet for real dicut into four alpha assets.
```

### Product sky

```text
Use case: photorealistic-natural
Asset type: responsive 16:9 production website product-stage atmospheric plate
Primary request: Create a wide open powder-blue and pale-lavender atmospheric sky framed by luminous white cloud banks around the outer edges, with a large clean calm center for semantic HTML product windows.
Style/medium: premium realistic product-campaign atmospheric photography with refined natural cloud depth
Composition/framing: exact 16:9 landscape; full-bleed plate; cloud banks remain around the perimeter but do not touch the canvas edges; reserve the central 55% of the frame as quiet, low-detail copy/UI-safe sky; the central vertical crop must remain useful at 390px and 320px mobile
Lighting/mood: soft daylight, gentle contrast, subtle coral warmth, calm and airy
Constraints: no horizon, ground, people, objects, UI, text, letters, logo, watermark, sun disk, frame, or clipped critical clouds. Responsive crop-safe composition at desktop and narrow mobile; no fake interface elements.
Delivery intent: production atmospheric plate behind semantic HTML.
```

### Privacy sky

```text
Use case: photorealistic-natural
Asset type: responsive 16:9 production website privacy-section night atmospheric plate
Primary request: Create a deep indigo and muted violet night sky with soft moonlit cloud banks around the perimeter, restrained coral haze far in the background, and a large quiet center with enough contrast for a white semantic HTML settings window.
Style/medium: premium realistic atmospheric photography; calm and trustworthy, not cinematic science fiction
Composition/framing: exact 16:9 landscape; full-bleed; reserve the central 55% as low-detail, quiet, moderately dark negative space; preserve a useful centered narrow crop for 390px and 320px mobile
Lighting/mood: soft moonlit perimeter clouds, restrained depth, subdued contrast, related to the Whisperfield dawn material family
Constraints: no patterned stars, horizon, landscape, objects, UI, people, generated text, letters, logos, watermarks, moon disk, fantasy elements, or clipped critical forms. Crop-safe for desktop and narrow mobile containers.
Delivery intent: production atmospheric plate behind a real white settings window.
```

### Closing sky

```text
Use case: photorealistic-natural
Asset type: responsive 16:9 production closing call-to-action overlay-photo plate
Primary request: Create a soft sunrise cloud plate with pale blue upper sky, warm peach and coral light near the lower edge, luminous ivory clouds framing the sides, and a broad clean overlay-safe center for dark headline copy and three compact semantic HTML buttons.
Style/medium: premium restrained realistic product photography with gentle atmospheric depth
Composition/framing: exact 16:9 landscape; full-bleed; keep the central 58% calm, bright, low-detail, and readable for dark text; preserve the same useful centered copy-safe region in narrow 390px and 320px mobile crops
Lighting/mood: bright but not washed out, quiet sunrise optimism, warm coral dawn distinct from the product daylight plate
Constraints: no horizon, landscape, objects, UI, people, generated text, letters, logos, watermarks, sun disk, frames, or clipped critical cloud forms. Crop-safe at 1440px, 390px, and 320px.
Delivery intent: production atmospheric plate behind semantic HTML copy and buttons.
```

### Fictional avatar sheet

```text
Use case: photorealistic-natural
Asset type: clean 3×2 photo-card source sheet for six fictional customer avatars
Primary request: Create six distinct fictional professional profile portraits for a voice-workflow frontend lab: diverse adults across age, gender presentation, and skin tone, with friendly natural expressions and contemporary independent maker, designer, researcher, developer, writer, and studio-founder energy.
Style/medium: realistic editorial headshot photography; coherent visual family; no imitation or identification of real people
Composition/framing: exact 3:2 landscape source sheet arranged as a strict 3 columns × 2 rows grid of six equal square cells; exactly one person per cell; shoulder-up framing; centered face-safe crop; full head and hair visible; generous separation and gutters; no overlapping or merged cells; each portrait fully contained within its own cell
Lighting/mood: consistent soft daylight; neutral off-white or pale-lavender backgrounds; simple modern unbranded clothing
Constraints: no text, names, letters, logos, watermarks, UI, decorative borders, merged faces, clipped heads, overlapping cells, duplicate people, extra people, malformed facial features, or recognizable public figures. Ensure all six identities, clothing silhouettes, hairstyles, ages, and backgrounds are clearly differentiated while remaining coherent.
Delivery intent: raw production source sheet to crop into six 1:1 WebP avatars that remain readable at 56px.
```

## Mark selection and redraw

- Superseded candidate: the top-left field-furrow cell of `whisperfield-mark-candidates.png` was initially traced and promoted, but Mahiro rejected its rendered navigation lockup as materially weaker and less compact than the reference role. The source sheet remains provenance, not current direction.
- Current mark: a manually authored bold W-field monogram plus coral thought point. Its simple silhouette is readable as both the product initial and a focused field marker at 16px; it does not reuse VoiceOS logo geometry, a microphone, speech bubble, soundwave, or Apple silhouette.
- Redraw method: direct 64×64 SVG path construction with one black filled W-field path and one coral circle; no raster pixels or external font outlines are embedded.
- Promoted file: `public/assets/generated/whisperfield-mark.svg`, 64×64 viewBox, SHA-256 `bbecc5f2aa7fec9013869a138712db379ff8aac7559c60cf544de27f8d087cef`.
- Role lockups: the full header/footer assets combine the selected mark with a rasterized SF system wordmark at retina delivery density, so the header can swap between compact and full assets without recomposing text in CSS. Dark lockup: 551×103, SHA-256 `a40268a5842daf67e21eedf72efa49d424fca3449c41f2b85d074d756df6c137`; light lockup: 551×103, SHA-256 `a473e0c2660f8171933cf22675f122c26e079897b72262b122022861aa6f03c4`. The light compact SVG is SHA-256 `b9708788f73f4079bc6ed4d933b8963226ce839bbd552a2a2220578b2c58309d`.
- Rejected candidates: top-right was too close to directional emission/sunburst language; bottom-left read as an aperture/vortex cliché; bottom-right was too close to a wave/soundwave cliché. They remain only in the raw source sheet.

## Cloud dicut and WebP promotion

The 1254×1254 source was split into four exact 627×627 cells. The installed Codex imagegen helper sampled the real border keys (`#0bf70f` and `#0bf80f`) instead of assuming nominal `#00ff00`. Final masters used auto-key border sampling, soft matte, transparent threshold 48, opaque threshold 160, despill, and one-pixel edge contraction. Each master was trimmed, scaled within 720×520, given 24px transparent safety padding, and corner-anchored on an 800×600 4:3 canvas. Delivery used `cwebp -lossless -exact -z 9 -alpha_q 100`.

| master | dimensions | master SHA-256 | promoted delivery | delivery SHA-256 |
| --- | --- | --- | --- | --- |
| `assets/imagegen/masters/cloud-top-left.png` | 627×627 sRGBA | `b8d20daaa08f309fe1a249a51d4c922fee9f3cef55bcdb9e571844bed78cbb3b` | `public/assets/generated/cloud-top-left.webp` (800×600 sRGBA) | `cfa9cf7235373896915215f3cc563d5ef77be70e54ef558b4b810010aed57c42` |
| `assets/imagegen/masters/cloud-top-right.png` | 627×627 sRGBA | `efb07f4eff40ae95e01a36426497d790945d9bf927df70e9e47763118f52f66c` | `public/assets/generated/cloud-top-right.webp` (800×600 sRGBA) | `191714c4651524d41818b55608d7177c519f3b001e87f5265473729926c2c4c1` |
| `assets/imagegen/masters/cloud-bottom-left.png` | 627×627 sRGBA | `cedba668038ff9328f12c2447f0906e914140a2d93dacfee47c87ae35d455249` | `public/assets/generated/cloud-bottom-left.webp` (800×600 sRGBA) | `5348c999086e6b0ac92f5f933baaaec9be8871b313edb1aac3f2df3c574acd4a` |
| `assets/imagegen/masters/cloud-bottom-right.png` | 627×627 sRGBA | `746c2bf071d26649c5cc8ae1cc71f92dbbae9026f0a0d1dcce2750df0196b7be` | `public/assets/generated/cloud-bottom-right.webp` (800×600 sRGBA) | `715f409168e94460027280a33bedbcf9dd317e1e5123d31cf95ebcd04398aebd` |

Direct inspection was repeated on the four final WebPs plus white, `#171927`, and checker composites. `webpinfo` reports `Alpha: 1` for every delivery.

## Avatar crops

The 1536×1024 sheet was cropped from the six visually verified cells at 490×490 using offsets `(16,15)`, `(523,15)`, `(1030,15)`, `(16,521)`, `(523,521)`, and `(1030,521)`. Each crop was Lanczos-resized to 256×256 and encoded with `cwebp -q 90 -m 6 -sharp_yuv`.

| delivery | dimensions | SHA-256 | inspection |
| --- | --- | --- | --- |
| `public/assets/generated/avatar-01.webp` | 256×256 RGB | `49c14ceb9febb8feabe2ac7f09158acb782293d4deabe12c2dabc5e2e161d3d2` | accepted at source and 56px |
| `public/assets/generated/avatar-02.webp` | 256×256 RGB | `a0807d1209240544aa231b73266c818c3de2c14ce215d4d231acb973e95cfca6` | accepted at source and 56px |
| `public/assets/generated/avatar-03.webp` | 256×256 RGB | `2148a50acfc8e588e3566033c551b2923b2731f78ea2a9b312e0840b1b3735b5` | accepted at source and 56px |
| `public/assets/generated/avatar-04.webp` | 256×256 RGB | `b6792448c969d3193955c37ce22803c53172e4a85d747ff7bafee53b0cbad7e9` | accepted at source and 56px |
| `public/assets/generated/avatar-05.webp` | 256×256 RGB | `e51b88c904f1dc1a9ef6acefb10a715e0182a1e4eb825012ac26288090b3f11a` | accepted at source and 56px |
| `public/assets/generated/avatar-06.webp` | 256×256 RGB | `2df221dddc5e769aa8b004a2b52e4a43af56f210611dc9fa77dca0db4f613768` | accepted at source and 56px |

All six faces were opened individually. No merged, clipped, duplicate, overlapping, or malformed portrait was found, so no avatar regeneration was required.

## Atmospheric plate promotion

Each raw 1672×941 source was center-covered to an exact 1600×900 16:9 delivery and encoded with `cwebp -q 86 -m 6 -sharp_yuv`. QA uses the actual final WebPs: desktop 640×360 previews plus centered cover crops at 390×600 and 320×568.

| delivery | dimensions | SHA-256 | crop inspection |
| --- | --- | --- | --- |
| `public/assets/generated/product-sky.webp` | 1600×900 RGB | `98e9fd4383b268567ee8812e8d474b824a65bc7e443f6a5122baf6c784c4a13f` | accepted; open powder-blue/lilac center remains clear on desktop and both mobile crops |
| `public/assets/generated/privacy-sky.webp` | 1600×900 RGB | `22727ee099d9fbc6de102c843fb8bcca7b928f525f8af66ca5194887e1e9a559` | accepted; quiet indigo center supports a white settings window on all crops |
| `public/assets/generated/closing-sky.webp` | 1600×900 RGB | `7d9082458590c02fefcaa72544def0b968f6cc72f3bfd8ed72a5aa7ff1b5d278` | accepted; pale central sunrise remains copy-safe on all crops |

## Rejected derivations

- The first 4:3 cloud canvas attempt accidentally filled transparent padding opaquely. `webpinfo` reported `Alpha: 0`; it was rejected and overwritten before promotion.
- The first helper settings (transparent 12 / opaque 220) left low-alpha horizontal matte bands on direct-file inspection. Those masters were rejected and replaced.
- `assets/imagegen/rejected/cloud-top-left-overaggressive-t72-o160-master.png` (627×627, SHA-256 `d67c34dcbd6ac8848aeadb28c85dac1da7fb251b37cd530b1525513121fb6011`) and `...-delivery.png` (800×600, SHA-256 `dfde1524d771c1f905d3d53a4f0d1d3efc511dca85625f5362e241234d1b89d0`) document a stronger threshold trial that removed more wisps than necessary.
- `assets/imagegen/rejected/cloud-top-left-lossy-blocking.webp` (800×600, SHA-256 `2576b48275dbc0f6923b336e33193a5e103af2f7c7552041c778ad4aef0dda67`) documents a lossy alpha export with visible block artifacts.
- `assets/imagegen/rejected/cloud-top-left-magick-smear.webp` (800×600, SHA-256 `2472c10f527d42a474c99ddf5aef8095a190897719d4891f265b4eecd824421b`) documents an alternate lossless encoder that showed transparent-RGB smearing in direct inspection.
- Default lossless `cwebp` without `-exact` also showed hidden-RGB smearing in the direct viewer. It was overwritten; exact-lossless WebP was the accepted export.
- No raw imagegen family was rejected or regenerated: every first source passed its family contract after honest derived-file cleanup.

## QA evidence

| QA artifact | dimensions | SHA-256 | coverage |
| --- | --- | --- | --- |
| `assets/imagegen/qa/raw-sources-contact-sheet.jpg` | 1200×1170 | `02922a3eaaedf3b2194e225989c2f52878ab367db0fd939e86af7e12ad93a699` | all six preserved raw imagegen sources |
| `assets/imagegen/qa/final-delivery-contact-sheet.jpg` | 960×1150 | `ef45cc5b800c7f79c7247d6c0a7049ef6f7524ecd3f333e0c683b0d3adfdd2de` | SVG mark raster preview, three plates, four clouds, six avatars |
| `assets/imagegen/qa/cloud-alpha-contact-sheet.png` | 1080×1200 | `31bea32742424c5346702a96b6d4add52c1ecafa13954be290c532b8150e98d4` | final cloud WebPs over white, dark, checker |
| `assets/imagegen/qa/avatar-source-sheet-preview.jpg` | 1152×768 | `2a754e098bd63000b209647d8e608315a8697be9a72124d555098952e5c3d2b2` | raw six-avatar source |
| `assets/imagegen/qa/avatar-delivery-contact-sheet.jpg` | 720×500 | `eddd0a98aef3013ad53c3d86e192e6fc95c7a5a544fe4a6c9d199abdf7b6a918` | six final 256px crops |
| `assets/imagegen/qa/avatar-56px-contact-sheet.png` | 540×280 | `d3c7b97b0c28d33650a2557e4a32e12d97376f5f5b1d449f4a0cdc8936f15978` | all faces at actual 56px |
| `assets/imagegen/qa/plate-center-crops-contact-sheet.jpg` | 1040×1080 | `14c0f0f41c596b23e604bd7c6fea7257eb06c3ccd3bca7396c739c345c0b9f19` | desktop, 390×600, 320×568 crops for all plates |
| `assets/imagegen/qa/mark-size-preview.png` | 420×180 | `9eccb76c108065bc5b72307ac20bb56d3893b401bf6b0bb9c39c0d7d978e2f9e` | current mark at 16px, 24px, 64px |
| `assets/imagegen/qa/mark-monochrome-preview.png` | 512×512 | `b6a14fd125dede2bdfd9b335f4ad65a6b8f4f86fb0e81bc72b021324a3e2acd5` | current monochrome readability |
| `assets/imagegen/qa/whisperfield-mark-512.png` | 512×512 | `7ae7c0315cb15e9369f98639158f66e7fec0ab4f2a4343c227fcfb44357c4348` | direct rasterization of the promoted SVG for visual inspection |
| `assets/imagegen/qa/brand-lockup-preview.png` | 720×280 | `11383381a387549e0fc82f5fa78f8d99da9493ab7d91449a5e8c6f8ed8ce5d5d` | compact/full brand assets on matched light and dark surfaces |

Individual desktop and mobile plate crop files are preserved under `assets/imagegen/qa/plate-crops/`. All canonical delivery WebPs were opened directly after export; contact sheets were supporting evidence only.

| individual plate QA | dimensions | SHA-256 |
| --- | --- | --- |
| `plate-crops/product-sky-desktop-16x9.jpg` | 640×360 | `6f271362190f1321c1c2812d87912527433371cfb6cffa1d7200af0e030b9765` |
| `plate-crops/product-sky-mobile-390x600.jpg` | 390×600 | `444f13186ddcddc5cc7332195c754ea3e1e5ba47939cc952c90f0fc45435c89b` |
| `plate-crops/product-sky-mobile-320x568.jpg` | 320×568 | `d552e8dc95b12317f2dd8382445fc159dddb3d17d97cc0eab962003aa4f546b1` |
| `plate-crops/privacy-sky-desktop-16x9.jpg` | 640×360 | `c709d65f7de0240054b8f67b9811f54fd77a3b71bb280a9bf91246b061830c96` |
| `plate-crops/privacy-sky-mobile-390x600.jpg` | 390×600 | `0db6aea0dcf02fc47bf6f9c72e3df0e8e717c915114d59584e0ad0bc7f284a8e` |
| `plate-crops/privacy-sky-mobile-320x568.jpg` | 320×568 | `889f921b5a15ee47851bd4555e13c9a4256ba024c831b9c0278959e29bd001fc` |
| `plate-crops/closing-sky-desktop-16x9.jpg` | 640×360 | `04c4b3cdbbb7af934c9f3e1a0a11dc65badf409546b340e0f7191ec3dd01d271` |
| `plate-crops/closing-sky-mobile-390x600.jpg` | 390×600 | `e0c06996cd646bf9721b1e20fd059cdbe11b8d944be5b95752794abc660acae1` |
| `plate-crops/closing-sky-mobile-320x568.jpg` | 320×568 | `0099236eaa51ef272feaf1fd88aac75d6d7028aeca5159a1851b726acf9751ba` |

## Open-source icons

No open-source icons or downloaded assets were used in this generated-asset pass.
