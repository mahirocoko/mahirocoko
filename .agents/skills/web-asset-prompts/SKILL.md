---
name: web-asset-prompts
description: Turn generic image-generation requests into production-ready web asset prompts. Use for transparent cutouts, aspect ratios, crop safety, overlay-safe card images, and website-ready raster asset sets.
---

# /web-asset-prompts

Use this skill when generated images must work as real website assets, not just attractive standalone pictures.

It converts vague image requests into production web asset specs with explicit use case, asset type, aspect ratio, crop safety, transparency needs, safe padding, and constraints.

## Command shape

```bash
bun .agents/skills/web-asset-prompts/scripts/main.ts <command> [args]
```

Commands:

- `list` — show supported asset modes and ratio presets
- `compose <mode> <request>` — print a production prompt for one asset
- `check <prompt>` — review whether a prompt contains web-asset usability markers

Supported modes:

- `photo-card` — full-bleed editorial/card image
- `overlay-photo` — image with text-safe negative space
- `cutout` — transparent PNG compositing asset
- `product-cutout` — transparent PNG product/package asset
- `ingredient-cutout` — transparent PNG ingredient/object asset
- `journal-image` — editorial article/card image
- `hero-image` — large website hero image

## Examples

```bash
bun .agents/skills/web-asset-prompts/scripts/main.ts list

bun .agents/skills/web-asset-prompts/scripts/main.ts compose cutout "olive leaf branch for botanical nutrition website"

bun .agents/skills/web-asset-prompts/scripts/main.ts compose overlay-photo "calm wellness portrait for landing page card"

bun .agents/skills/web-asset-prompts/scripts/main.ts check "premium avocado image, no text"
```

## Production web asset rules

Always decide the asset's web role before writing the prompt.

### Transparent cutouts

Use for objects that need to be placed on cards, grids, product sections, CTA panels, or layered compositions.

Required prompt markers:

- transparent PNG cutout
- isolated object
- no background
- generous padding
- subject fully visible
- clean silhouette
- no cast shadow
- no floor plane
- centered web compositing asset

Default ratios:

- product/object cutout: `4:5`
- ingredient/object cutout: `1:1`
- tall decorative cutout: `3:4`

### Full-bleed web photos

Use for hero cards, editorial cards, journal cards, and photographic backgrounds.

Required prompt markers:

- editorial web card image
- explicit aspect ratio
- crop-safe composition
- no text, no logo, no watermark
- subject not touching edges
- usable at responsive breakpoints

Add `overlay-safe negative space` when text or gradients may sit over the image.

Default ratios:

- card photo: `4:5` or `3:4`
- journal image: `16:10`
- hero image: `16:9` or `21:9`
- square gallery card: `1:1`

## Avoid

- vague “beautiful image” prompts without web role
- cropped products, clipped leaves, or subjects touching the canvas edge
- busy scenes that fight text overlays
- generated text, fake labels, logos, or watermarks
- strong shadows on transparent cutouts unless the shadow is meant to be composited separately
- perspective that makes product/object cutouts hard to place in a layout

## Pairing

- Pair with `imagegen` when actually generating raster assets.
- Pair with `frontend-design` when asset prompts come from a landing-page handoff.
- Pair with `uncodixify` when generated assets are part of a frontend revamp and the visual system needs restraint.

ARGUMENTS: $ARGUMENTS
