# A03 Lettering Collage — Source Provenance

- Asset: A03 / Chapter 01 lettering collage
- Lane: `a03-lettering`
- Model: OpenAI `gpt-image-2` via the built-in `image_gen` tool
- Generation mode: new raster generation with one visual-family reference
- Reference input: `apps/frontend-labs/chiang-mai-journal/assets/imagegen/sources/cover-b/source.png` (selected A01 cover-b; visual-family reference only)
- Generation result: `/Users/mahiro/.codex/generated_images/019f6ec1-2c45-7d02-b1bb-0a7d4aeb85a3/exec-6ce127f5-8041-4aa9-bc8f-14bf61071b30.png`
- Saved source: `apps/frontend-labs/chiang-mai-journal/assets/imagegen/sources/a03-lettering/source.png`
- Dimensions: 1122 × 1402 px (native near-exact 4:5 portrait output; larger than 1024 × 1280)
- Format: PNG
- SHA-256: `7c6682e057d21293be00e50cb49f167b81d4ca0d4820c342607f6c70ee289a3d`

## Exact prompt

```text
Use case: stylized-concept
Asset type: full-bleed editorial journal image for the Chapter 01 article masthead
Primary request: Create one original 4:5 portrait constructed editorial collage for Roi Mueang Chapter 01, “ตัวอักษรของเมือง”. This is a new composition, not an edit or crop of the reference.
Input images: Image 1 is the selected A01 cover-b visual-family reference only. Carry forward its restrained constructed-collage grammar, material honesty, palette, paper field, visible assembly, and calm editorial pacing; do not duplicate its layout.
Scene/backdrop: A warm uncoated-paper field assembled with deliberate torn and masked paper boundaries. Include exactly one narrow anonymous urban threshold fragment—cropped wall, shutter, doorway edge, or pavement seam—small enough to remain contextual and never read as a real identifiable shop.
Subject: A strong central blank hand-painted sign substrate under construction, with its making process materially inspectable: close brush bristles with wet and dry paint evidence, masking-tape edges, cropped abstract non-legible brush strokes, worn wood and oxidized metal supports, clamps or repair plates, and layered paper test pieces. The substrate must remain unmistakably blank and fictional, never a fake completed sign.
Style/medium: tactile contemporary editorial collage combining photographic material detail with visible paper assembly, restrained offset-print registration, subtle halftone and ink grain; coherent depth, not scrapbook clutter and not documentary reporting.
Composition/framing: exact 4:5 portrait canvas, 1024×1280 or larger. Keep the sign-making cluster dominant and centered for an article masthead. Preserve calm safe boundaries around the outer 8% for responsive crop and captions. Ensure brush, masking edges, wood/metal joins, and paint traces remain inspectable at masthead size. Avoid placing critical detail at the frame edges.
Lighting/mood: warm natural daylight, observant and current, never golden nostalgia or advertising gloss.
Color palette: warm paper, ink black, controlled lacquer red, restrained deep indigo, muted wood and oxidized metal.
Materials/textures: uncoated fiber paper, matte worn wood, scuffed sign board, oxidized metal, masking tape, bristle detail, dry-brush drag, small lacquer-red paint traces, indigo edge, subtle halftone.
Text: no text of any kind; no letters, numerals, pseudo-writing, glyphs, labels, signatures, or typographic marks.
Constraints: one full-bleed portrait source; strong central subject; deliberate paper assembly; visually related to Image 1 without copying it; fictional editorial interpretation only; make the process of painting and assembling a sign physically legible while the sign itself stays blank.
Avoid: readable or unreadable word-like text, Thai or Latin characters, logos, watermarks, signatures, real shop or business identity, completed fake real sign, portrait, person, hands, tourism icon, temple, landmark, mountain panorama, café shorthand, lantern or festival cliché, luxury-gold ornament, generated webpage, UI, poster typography, decorative frame, excessive collage clutter, anatomically broken tools, implausible joins, and imitation of any living artist’s style.
```

## Self-check

- Pass — Central subject is a strong blank sign substrate with inspectable masking tape, wood frame, metal plates/clamp, brushes, paint traces, and paper tests.
- Pass — One narrow anonymous shutter/pavement threshold fragment appears at the right edge; it contains no business identity or documentary claim.
- Pass — Palette stays within warm paper, ink black, controlled lacquer red, restrained indigo, wood, and oxidized metal.
- Pass — Visible torn-paper assembly and subtle halftone are present without dense scrapbook clutter.
- Pass — No readable text, pseudo-writing, letters, numerals, logo, signature, or watermark is visible.
- Pass — No real shop, completed fake sign, portrait, person, hands, tourism icon, temple, landmark, mountain panorama, café shorthand, lantern/festival motif, or luxury-gold ornament is visible.
- Pass — No webpage, UI, or poster typography is present.
- Pass — Brush and hardware geometry appears plausible; no anatomical subject is present.
- Pass — The image does not request or visibly imitate a living artist's signature style.
- Pass — The dominant cluster remains central and the blank substrate has comfortable caption/crop boundaries; only non-critical paper fields bleed to the outer edges.
- Note — The built-in generator returned a native 1122 × 1402 px canvas, which is within a fraction of a pixel of exact 4:5 at this integer size and exceeds the requested minimum dimensions. No crop, resize, cleanup, optimization, or promotion was applied.
