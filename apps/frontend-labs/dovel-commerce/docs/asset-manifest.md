# DOVEL product asset manifest

Status: accepted runtime asset contract for a fictional commerce lab. Every promoted asset passed its relevant model/image and target-page QA.

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
| `dovel-system-01.glb` | live System Builder model containing the rail and all three configurable modules | 120cm baseline | GLB 2.0 | original procedural Three.js mesh informed by the three promoted single-view product renders | semantic nodes/materials, finite desk-safe bounds, deterministic hash, file-size ceiling, no textures/external fetches, V1/V2 silhouette comparison, desktop/mobile runtime readability | V2 runtime-promoted; model contract/check passes; foreground-accepted 2026-07-16 |

## QA surfaces

- Warm bone `#ebe7de`
- Carbon `#171816`
- Product card crop at desktop 4:5 and mobile 1:1
- Hero crop at 1440×1000 and 390×844

## Source and provenance

- Intended generator lane: Codex image generation, `gpt-5.6-sol`, high reasoning.
- Scratch source directory: `.asset-work/codex-source/` (ignored).
- Runtime candidate directory after main-agent inspection: `public/assets/products/`.
- Runtime 3D model and reproducible source contract: `public/assets/models/dovel-system-01.glb`, `scripts/build-dovel-system-model.mjs`, and `docs/model-contract.md`.
- This is an original fictional brand system. Do not use third-party product photography or copy recognizable product trade dress.
