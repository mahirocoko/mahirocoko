# Cute Animals A4 Coloring Pages

## Asset contract

- Purpose: printable coloring pages for children, assumed age 4–7 for this first batch
- Format: A4 portrait, 210 × 297 mm, normalized to 2480 × 3508 px at 300 DPI
- Style: cute friendly animals, bold clean black outlines, white background, large open coloring areas
- Print safety: keep important line art at least 12 mm from every paper edge
- Exclude: color, gray fill, shading, gradients, hatching, tiny textures, text, letters, numbers, logos, signatures, watermarks, borders, cropped anatomy
- Source requirement: imagegen-generated raster, then deterministic A4 normalization
- Promotion gate: inspect every generated page at full size and as a contact sheet before marking printable

## Planned pages

1. Kitten playing with a ball of yarn
2. Puppy sitting beside a simple toy ball
3. Bunny holding two large carrots
4. Baby elephant greeting a large butterfly
5. Bear cub beside a simple honey jar with no label
6. Baby penguin holding one small fish on a simple ice patch

## Status

- Agy/Gemini prompt consultation: blocked after one bounded retry by account eligibility verification; no recommendation was returned
- Raw image generation: complete; six independent hosted `image_generation` calls through Codex GPT-5.6 Sol High
- Provider session: `01a032f2-7ec0-78c0-b9e4-95d06125e8bc`
- Raw source dimensions: 1054 × 1492 px
- A4 normalization: complete; six PNGs at 2480 × 3508 px with 300 DPI metadata
- Visual QA: complete; all six full-size pages and the contact sheet were inspected for clear anatomy, page-edge safety, simple coloring regions, and unwanted text/color
- Combined print PDF: complete; six A4 pages at 595.2 × 841.92 points

## Delivery

- `print-a4/`: individual print-ready PNG pages
- `cute-animals-coloring-pages-a4.pdf`: combined six-page print PDF
- `qa/contact-sheet.png`: review overview only; not intended for coloring or printing as individual pages
- Print the PDF at **Actual Size / 100%**, A4 portrait, with printer scaling disabled
