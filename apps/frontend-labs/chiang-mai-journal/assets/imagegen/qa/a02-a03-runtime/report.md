# A02/A03 Runtime WebP Cleanup Report

Date: 2026-07-17

## Outputs

| Asset | Runtime dimensions | Bytes | SHA-256 |
| --- | ---: | ---: | --- |
| `cover-collage-portrait.webp` | 1120 × 1400 | 424,274 | `01ad2decae013822a26c0dbcd45fcb570c95bba901fb119a210862a0eb79cd4a` |
| `chapter-lettering-collage.webp` | 1120 × 1400 | 437,602 | `dd244407b0346e636af4c565a3f11329942263b5a35449a2a62302b24c6245f3` |

Both outputs are WebP, RGB/sRGB, and below the 500 KiB limit.

## Crop geometry

- Input dimensions: 1122 × 1402 px for both sources.
- Operation: exact center crop `1120x1400+1+1`.
- Removed pixels: left column x=0, right column x=1121, top row y=0, bottom row y=1401.
- No rescaling, rotation, retouching, sharpening, denoising, recoloring, regeneration, or content edits.
- Pixel identity check between each source crop and its crop intermediate: ImageMagick AE metric `0`.

## Conversion and QA

- Crop tool: ImageMagick 7.1.2-18 (`magick`), `-crop 1120x1400+1+1 +repage`.
- Encoder: `cwebp` 1.6.0 / libsharpyuv 0.4.2.
- Settings: WebP lossy quality `90`, method `6`, `-sharp_yuv`.
- The runtime WebPs were decoded back to raster and compared against the exact cropped intermediates at 1120 × 1400.
- Compact visual comparisons were inspected at 560 × 700 per side (source crop left, decoded runtime right):
  - `cover-collage-portrait-source-vs-runtime.png`
  - `chapter-lettering-collage-source-vs-runtime.png`

## Findings and limitations

- The crop preserves the accepted composition; only the one-pixel outer bleed on each edge is removed.
- Paper grain, brush edges, halftone, controlled red/indigo separation, wood grain, and metal edges remain visually present at native and comparison sizes.
- The WebP encode introduces expected small lossy differences in fine grain and isolated halftone pixels. This is visible only as micro-variation; the material hierarchy and edge structure remain intact.
- No content was added or removed beyond the explicitly requested outer-edge crop.

## Source immutability confirmation

The source files were not modified. Their post-conversion SHA-256 hashes match the provenance records exactly:

- A02 `source.png`: `b5c636be4305614a9233f72437e39f3a7cc626f6143dbc5a96e8e127c9c7cab2`
- A03 `source.png`: `7c6682e057d21293be00e50cb49f167b81d4ca0d4820c342607f6c70ee289a3d`

No app, docs, or provenance files were edited, and no commit was created.
