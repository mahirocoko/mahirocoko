# A02 mobile cover source provenance

- Asset: `A02 · cover-collage-portrait`
- Lane: `a02-mobile`
- Generation mode: OpenAI built-in `image_gen` tool, single referenced-image generation
- Model: built-in `image_gen`; the concrete model identifier was not exposed by the tool result
- Reference image: `apps/frontend-labs/chiang-mai-journal/assets/imagegen/sources/cover-b/source.png` (visual-family reference only, not an edit target)
- Generation result path: `/Users/mahiro/.codex/generated_images/019f6ec1-2c45-7981-ac0b-24e2351576fe/exec-7abe356a-8f09-444e-954f-536952d25ff1.png`
- Saved source: `apps/frontend-labs/chiang-mai-journal/assets/imagegen/sources/a02-mobile/source.png`
- Dimensions: 1122 × 1402 px PNG (portrait; effectively 4:5, with the generator returning a one-pixel rounding difference from an exact 4:5 ratio)
- SHA-256: `b5c636be4305614a9233f72437e39f3a7cc626f6143dbc5a96e8e127c9c7cab2`

## Exact prompt

```text
Use case: stylized-concept
Asset type: A02 mobile cover source for the fictional Roi Mueang contemporary Chiang Mai editorial journal, full-bleed 4:5 portrait PNG, composed natively for portrait.
Input image: Image 1 is the selected A01 cover-b visual-family reference only. Generate a new original composition; do not crop, resize, extend, or directly edit the reference.

Primary request: Create one separately art-directed portrait constructed editorial collage about an anonymous city workshop threshold and the material evidence of making and repair. Preserve the visual-family grammar visible in Image 1: a broad warm uncoated-paper field; controlled lacquer-red and deep-indigo torn/painted accents; ink-black halftone and dry-brush marks; a clear narrow anonymous alley or shophouse fragment; a large blank hand-painted sign substrate; real brush bristles in a worn metal container; matte wood, paper, and oxidized metal; visible layered editorial assembly, irregular paper boundaries, subtle offset-print misregistration, and coherent physical depth.

Composition/framing: Native 4:5 portrait composition, not a mechanical crop. Keep the workshop/sign construction large, dominant, materially inspectable, and visually coherent in the lower-center to lower-right. The blank sign substrate should remain a major focal plane. Retain a clear, narrow city/alley fragment integrated beside or behind the workshop construction. Preserve generous calm breathing room in the upper-left for a separately authored HTML issue marker; render no marker, numerals, letters, or glyph-like symbols there. Keep every critical object and material detail comfortably inside the outer 8% safe boundary. Balance the vertical frame with paper field rather than scrapbook clutter. Full-bleed image with no border or mockup presentation.

Lighting/mood: Warm neutral northern daylight, quiet and observant, contemporary and tactile; no golden nostalgia, romance, tourist advertising, or luxury polish.

Color palette: Warm cream uncoated paper, ink black, controlled lacquer red, restrained deep indigo, weathered brown wood, muted oxidized metal.

Materials/textures: Inspectable paper fiber, wood grain, worn paint, brush bristles, metal oxidation, torn paper edges, restrained halftone dots, subtle ink grain, very slight print registration shifts. Make the scene visibly constructed editorial art, not a documentary photograph and not a generated webpage.

Text: none. The blank sign must remain genuinely blank apart from abstract cropped brush swaths that cannot be mistaken for writing. No readable Thai or Latin text, no numbers, no pseudo-lettering, no logo, no label, no watermark, no signature.

Hard exclusions: no real business or business identity; no famous landmark; no temple; no mountain panorama; no cafe shorthand; no coffee cup; no lantern or festival cliché; no luxury-gold Lanna ornament; no identifiable person or human figure; no fake portrait or fake documentary claim; no tourism-poster composition; no generated webpage or UI; no imitation of any living artist's signature style. Avoid broken or implausibly joined tools, wood, metal, or architectural fragments.
```

## Honest exclusion and crop self-check

- Readable Thai/Latin text, numbers, pseudo-lettering, logo, label, watermark, or signature: none observed. The sign carries one abstract black dry-brush swath and non-linguistic red/indigo paper shapes only.
- Real business or identifiable place: none observed. The alley/shophouse fragment is anonymous and contains no readable signage or distinctive landmark.
- Landmark, temple, mountain, cafe shorthand, coffee cup, lantern/festival cliché, or luxury-gold Lanna ornament: none observed.
- Identifiable person, portrait, or documentary claim: none observed; no people appear. The image reads as constructed editorial collage rather than claimed reportage.
- Generated webpage/UI: none observed.
- Living-artist imitation: no artist was named or requested; no intentional imitation was used.
- Material plausibility: the sign frame, clamp, brushes, paint can, wood backing, metal grille, and alley architecture appear coherent on visual inspection. No obvious broken tool or impossible join was observed.
- Portrait recomposition: the alley and workshop/sign elements are rearranged as a portrait composition rather than delivered as a crop of A01. The main sign/workshop cluster remains large in the lower-center/right, and the city fragment remains clear to its left.
- Upper-left marker area: a broad calm paper field is preserved. No `01` marker is baked into the image; authored issue text can remain in HTML.
- Outer 8% crop safety: the blank sign, brush can, main wood/metal construction, and readable alley fragment remain inside the safe area. Decorative halftone and torn color-paper fragments intentionally enter the bleed at the top, left, right, and bottom edges; these are non-critical. The extreme edge accents may crop without losing material meaning.
- Ratio note: the tool returned 1122 × 1402 px, which is 0.04% wider than mathematically exact 4:5. No crop, resize, cleanup, or optimization was applied in this source lane.
