# Lab05 Asset Manifest

Intent: generate raster assets for an image-led Jasper-inspired marketing AI landing page.

Inputs: `../home.jpg` reference plus the existing `index.html` structure.

Asset roles: full-bleed hero background, product marketer image crop, product UI preview, trust/security illustration, resource thumbnail system.

Recommended workflow:
1. Preserve `home.jpg` unchanged as the source reference.
2. Use `imagegen` raster assets as the primary page imagery.
3. Keep assets text-free where possible so page copy remains real HTML.
4. Test assets on desktop and mobile crop containers.
5. Keep all files under `assets/` so the page can open directly from disk.

Prompts needed: completed with the built-in `imagegen` tool. The hand-authored SVG files remain as fallback/source-direction references, but `index.html` now uses `assets/generated/*.png`.

| filename | role | ratio | format | source strategy | expected QA checks | notes |
| --- | --- | --- | --- | --- | --- | --- |
| `generated/hero-ai-field.png` | full-bleed hero image | about 21:9 | PNG | built-in `imagegen`, copied from `$CODEX_HOME/generated_images` | readable overlay area, no text baked into image, works at desktop and mobile crop | peach/purple field, perspective grid, floating product tiles |
| `generated/solution-product-marketer.png` | editorial product marketer crop | 16:10 | PNG | built-in `imagegen`, copied from `$CODEX_HOME/generated_images` | subject not clipped, soft crop works inside rounded frame, no fake text | replaces CSS-only portrait panel |
| `generated/marketing-editor-stack.png` | product UI panel stack | 16:9 | PNG | built-in `imagegen`, copied from `$CODEX_HOME/generated_images` | no real UI text required, crisp panel edges, legible at section size | supports AI toolkit section |
| `generated/trust-security-stack.png` | trust/security illustration | 4:3 | PNG | built-in `imagegen`, copied from `$CODEX_HOME/generated_images` | security panels remain visible at mobile scale, no layout text baked in | supports trust foundation section |
| `generated/resource-thumbnail-system.png` | reusable resource thumbnail mood | 16:10 | PNG | built-in `imagegen`, copied from `$CODEX_HOME/generated_images` | crop-safe, calm line art, no placeholder labels | used as visual language reference for resource cards |

Risks: raster files are larger than SVG and should be compressed if this becomes production work. The current files prioritize design fidelity for the lab.
