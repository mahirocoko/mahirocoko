# A07 / A08 runtime cleanup and optimization report

Generated: 2026-07-17 (Asia/Bangkok)

## Deliverables

| Asset | Geometry | Bytes | SHA-256 | Source operation |
| --- | ---: | ---: | --- | --- |
| `article-lettering-detail-wide.webp` | 1536 × 1024 | 479,182 | `d9483742816cca18aaaf32782074337aaac3cb9cab618108721af89b4a447083` | No crop, no resize; encode only |
| `article-lettering-detail-portrait.webp` | 1120 × 1400 | 468,240 | `560091319e75106779e340e788e22ce70d55efb4cb3f5618a1671710e958dbd2` | Crop `1120x1400+1+1`: remove exactly one pixel from left, top, right, and bottom; no resampling |

Both runtime files are 8-bit sRGB lossy WebP and remain below the 500 KiB limit.

## Tools and settings

- ImageMagick `magick`: A08 geometry-only crop with `-crop 1120x1400+1+1 +repage`; no color, sharpen, denoise, or resampling operation.
- Google `cwebp`: `-q 90 -m 6 -sharp_yuv` for both runtime encodes.
- ImageMagick `identify`, `file`, `sha256sum`: dimensions, format, size, and hash verification.
- ImageMagick `compare -metric RMSE/PSNR`: source-to-runtime checks at identical final dimensions.
- Comparison plates are compact QA evidence only; they are stored in this QA folder and are not runtime assets.

## Crop geometry

- A07: source `1536x1024` → runtime `1536x1024`; pixel geometry unchanged.
- A08: source `1122x1402` → intermediate QA crop `1120x1400+1+1` → runtime `1120x1400`; the source crop is the one-pixel perimeter removal required by the task.

## Findings

- Native-size inspection and compact target-size inspection were performed on the actual WebPs, not only on source previews.
- Brush bristles remain individually readable; paper grain and fibrous masking paper remain visible.
- Halftone structure, lacquer-red and deep-indigo separation, worn blank sign fields, and metal/wood edges remain visually present.
- No composition/content edits, recoloring, sharpening, denoising, regeneration, or source mutation were performed.
- A07 source/runtime RMSE: `691.64 (0.0105537)`; PSNR: `39.5319 (0.329432)`.
- A08 cropped-source/runtime RMSE: `679.66 (0.0103709)`; PSNR: `39.6836 (0.330697)`.

## Limitations

- WebP is lossy, so fine pixel-level paper-grain and smallest paint variations are not identical to PNG source pixels; the visible material hierarchy survived review.
- A08 runtime is intentionally `1120x1400`, not the source's near-4:5 `1122x1402`, because the requested one-pixel-per-edge crop was applied without rescaling.
- QA comparison plates are review aids and should not be used as application assets.

## Unchanged source hashes

| Source | Dimensions | SHA-256 |
| --- | ---: | --- |
| `source-wide.png` | 1536 × 1024 | `10f23815f21a179d36c61839ff8548d73619376c7f8fb655871ee6ba87dfcea6` |
| `source-portrait.png` | 1122 × 1402 | `3081fe6939abdf7ee96afd3d6c02a470eeef3a96fc474e3844f391cecd675473` |

## QA evidence

- `a07-source-vs-runtime-native.png`
- `a08-source-vs-runtime-native.png`
- `a07-source-vs-runtime-target.png`
- `a08-source-vs-runtime-target.png`
- `a08-crop-check.png` (geometry checkpoint used as the A08 encode input)
