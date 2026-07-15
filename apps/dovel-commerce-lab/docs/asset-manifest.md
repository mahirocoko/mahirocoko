# DOVEL product asset manifest

Status: production-candidate generation contract for a fictional commerce lab. No asset is promoted until visual QA on the target page.

## Brand material contract

- Product family: modular desk rail and attachable focus tools.
- Material language: bead-blasted graphite and warm silver anodized aluminum, warm ash wood, restrained vermilion detail.
- Form language: precise chamfers, quiet radii, visible attachment seams, compact proportions, no copied Apple hardware or branded third-party objects.
- Lighting: soft directional studio daylight with legible material edges; no neon, glassmorphism, dramatic smoke, or sci-fi glow.
- Generated raster must contain no text, logos, watermarks, fake labels, UI, hands, cables, or unrelated desk clutter.

## Deliverables

| filename | role | ratio | format | source strategy | expected QA checks | promotion status |
| --- | --- | --- | --- | --- | --- | --- |
| `dovel-system-hero.webp` | first-viewport product proof showing rail + three attached modules | 16:10 | WebP | imagegen full-bleed editorial product render | desktop/mobile crop, product fully visible, copy-safe upper-left, no fake branding, readable attachment relationship | rejected; V2 image-edit transport blocked; runtime uses composed accepted product renders |
| `arc-dock.webp` | product-card render for angled charging dock module | 4:5 | WebP | imagegen isolated studio product render | silhouette, no clipping, consistent family/materials, card crop | runtime-promoted after desktop/mobile crop QA |
| `halo-light.webp` | product-card render for slim rail-mounted task light | 4:5 | WebP | imagegen isolated studio product render | full lamp visible, no Apple-like form, card crop, no glow bloom | runtime-promoted with centered-crop constraint |
| `pocket-tray.webp` | product-card render for shallow ash/aluminum tray | 4:5 | WebP | imagegen isolated studio product render | readable tray depth, material separation, card crop | runtime-promoted after desktop/mobile crop QA |

## QA surfaces

- Warm bone `#ebe7de`
- Carbon `#171816`
- Product card crop at desktop 4:5 and mobile 1:1
- Hero crop at 1440×1000 and 390×844

## Source and provenance

- Intended generator lane: Codex image generation, `gpt-5.6-sol`, high reasoning.
- Scratch source directory: `.asset-work/codex-source/` (ignored).
- Runtime candidate directory after main-agent inspection: `public/assets/products/`.
- This is an original fictional brand system. Do not use third-party product photography or copy recognizable product trade dress.
