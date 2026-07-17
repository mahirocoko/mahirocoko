# A01 Runtime WebP QA

## Files

- Source: `apps/frontend-labs/chiang-mai-journal/assets/imagegen/sources/cover-b/source.png`
- Runtime candidate: `apps/frontend-labs/chiang-mai-journal/public/assets/editorial/issue-01/cover-collage-wide.webp`
- Review comparison: `source-vs-runtime-comparison.png`

## Dimensions, format, and bytes

| File | Dimensions | Format / channels | Bytes | SHA-256 |
| --- | ---: | --- | ---: | --- |
| Source PNG | 1536 × 1024 | RGB, no alpha | 3,075,079 | `203c71e5d846d012472aec5c8cca0c858951761430a5f9cf717f6780579e9c75` |
| Runtime WebP | 1536 × 1024 | Lossy VP8 WebP, RGB/YUV, alpha 0 | 452,306 | `b93b0095d723b08d689ecc85c5e681bb1ce0e33d34e714897e0a7c5dfdb98eb7` |
| Review comparison PNG | 1440 × 840 | RGB, no alpha | 1,900,464 | `d30e4b8789d43dc06c333f848b2abecb17509aace6e2ca7335b88515a2cdf8fc` |

## Conversion

- Tool: `cwebp` 1.6.0; libsharpyuv 0.4.2.
- Settings: `-q 92 -m 6 -mt -sharp_yuv`.
- No crop, resize, sharpening, denoising, recoloring, regeneration, or content edits.
- The source remained byte-for-byte unchanged.
- WebP is 452,306 bytes, below the practical 500 KiB ceiling.

## Visual review

Reviewed the actual runtime WebP against the PNG at native 1536 × 1024 and at a 1440 × 960 target-size preview.

- Paper grain: retained across the calm cream field; no visible block breakup or banding at target size. Fine micro-variation is naturally slightly less exact than the PNG because the delivery file is lossy.
- Brush edges: black brush sweep remains crisp with its dry, broken edge and scattered flecks; no visible ringing or material-edge halo.
- Halftone: black dot fields remain distinct at native inspection and readable at target size; no visible collapse into a muddy patch.
- Red/indigo separation: controlled lacquer red and deep indigo remain distinct from the cream paper and one another; no visible chroma bleed affecting the collage boundaries.
- Material edges: wood, metal, paper tears, masking strips, and frame edges remain visually intact; composition and crop are unchanged.

## Limitation

This is a lossy WebP encode. Pixel identity is not expected, and the smallest paper-grain variations may differ from the PNG under close pixel-level comparison. The selected quality preserves the visible editorial texture and material hierarchy while staying below 500 KiB.
