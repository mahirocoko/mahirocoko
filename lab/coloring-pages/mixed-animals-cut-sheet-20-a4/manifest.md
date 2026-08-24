# Mixed Animals 20-Up A4 Cut Sheet

## Human-selected contract

- One A4 portrait page
- 20 different cute animals in a 4 × 5 grid
- Mixed animal families: pets, farm, wild, woodland, polar, and sea
- Same friendly coloring-book style as the accepted six-animal sheet
- Full-body isolated animal only: no props, scenery, ground, plants, water, labels, or decorative elements
- Thin light-gray rectangular cut guide around every animal
- Children can color each animal and cut each grid cell apart

## Print contract

- Final raster: 2480 × 3508 px, 300 DPI
- Final PDF: one A4 page, 210 × 297 mm
- Pure-white background
- Bold smooth black outlines, large open coloring areas, minimal internal detail
- Keep every ear, horn, wing, flipper, paw, hoof, foot, fin, and tail fully visible
- No color, gray fill, shading, gradient, hatching, halftone, text, letters, numbers, logos, signatures, or watermarks

## Animals

1. Kitten
2. Puppy
3. Bunny
4. Panda
5. Fox
6. Bear cub
7. Lion cub
8. Baby elephant
9. Baby giraffe
10. Monkey
11. Calf
12. Piglet
13. Lamb
14. Duckling
15. Baby penguin
16. Baby turtle
17. Baby dolphin
18. Koala
19. Baby zebra
20. Raccoon

## Source and promotion

- Source requirement: 20 independent hosted `image_generation` calls
- Procedural or SVG replacement is not allowed for source art
- Provider raw rasters remain immutable under `raw/`
- Main agent owns deterministic trimming, 4 × 5 composition, A4 normalization, full-size visual QA, and promotion
- Provider session: `01a03303-0f10-7862-ba90-0e11e8fa1271`
- Generation result: 18 original hosted calls succeeded; the original fawn call was rejected by provider output-safety
- Recovery: fawn was replaced with a baby zebra, then zebra and raccoon succeeded through two additional hosted `image_generation` calls in the same session
- Source status: complete, 20 verified provider PNGs under `raw/`
- Normalization: provider alpha was flattened onto white before black/white thresholding so semi-transparent gray fills do not consume coloring areas
- Composition: complete, 4 × 5 grid with thin light-gray cut guides
- Visual QA: complete; the full A4 sheet and all five rows were inspected at readable scale for anatomy, clipping, line clarity, gray fill, unwanted scenery, and cut-guide separation
- Delivery status: accepted by Mahiro on 2026-08-24
