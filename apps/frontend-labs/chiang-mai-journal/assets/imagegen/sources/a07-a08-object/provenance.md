# A07 / A08 object-study source provenance

Generated: 2026-07-17 (Asia/Bangkok)

## Shared generation context

- Workflow: OpenAI built-in `image_gen` tool, one independent call per composition; a targeted second A08 call was made after rejecting the first portrait attempt for the wrong ratio and insufficient width.
- Model: the built-in tool did not surface an underlying model identifier; no CLI/API fallback was used.
- Visual-family reference only: `apps/frontend-labs/chiang-mai-journal/assets/imagegen/sources/cover-b/source.png`
- No crop, resize, cleanup, optimization, compositing, procedural drawing, or runtime promotion was applied to either selected PNG.

## A07 selected wide source

- Saved file: `source-wide.png`
- Native dimensions: 1536 × 1024 px (3:2 landscape)
- SHA-256: `10f23815f21a179d36c61839ff8548d73619376c7f8fb655871ee6ba87dfcea6`
- Built-in generation result: `/Users/mahiro/.codex/generated_images/019f6ec1-2c45-7651-bb79-10d2f0f60677/exec-47959dea-948f-4550-9176-63cd90df142f.png`

### Exact prompt

```text
Use case: photorealistic-natural
Asset type: Roi Mueang Chapter 01 editorial journal image / A07 lettering object study, full-bleed PNG source
Input images: Image 1 is a visual-family reference only, not an edit target. Preserve its warm uncoated-paper field, ink-black structure, controlled lacquer red, restrained deep indigo, subtle halftone/print grain, tactile material specificity, and visibly assembled editorial restraint. Create a new independent composition.
Primary request: Create one original 3:2 landscape object-study image at 1536×1024 or larger. Study brush bristles, a lacquer-red paint trace, an indigo dry-brush edge, a worn completely blank sign substrate, masking paper, and small metal-and-wood repair details under warm natural daylight.
Scene/backdrop: a calm editorial material-research tabletop/board arrangement with layered paper boundaries and evidence of use; contemporary Chiang Mai is suggested only through material relationships, never through landmarks or tourism shorthand.
Subject: one used broad sign-painter brush with individually readable bristles, cropped non-letterforming lacquer-red paint residue, an indigo dry-brush edge, a worn blank matte sign panel, torn masking paper, small aged metal fasteners/brackets and repaired wood joins.
Style/medium: materially realistic editorial object photography fused subtly with the selected reference’s constructed print-collage grammar; observant and tactile, not product advertising and not documentary evidence.
Composition/framing: 3:2 landscape, independently composed; objects fully readable, restrained staging, calm negative space across roughly one third of the frame, coherent depth, critical objects away from the outer 8%, no crowded flat-lay catalogue.
Lighting/mood: warm natural side light, quiet, current, unglamorous; soft believable shadows with no polished studio sheen.
Color palette: warm paper beige, ink black, controlled lacquer red, restrained deep indigo, aged wood and oxidized metal.
Materials/textures: frayed brush bristles, matte dried paint, fibrous masking paper, abraded unlettered sign substrate, subtle wood grain, worn metal repair hardware, light halftone and print-registration texture.
Text: none.
Constraints: the sign substrate must be completely blank; all paint marks must be abstract cropped traces that cannot be read as characters; preserve calm editorial negative space and inspectable object scale.
Avoid: readable lettering of any language; letterlike glyphs; labels; logos; watermarks; recognizable real business; hands, arms, people, or anatomy; marketing gloss; product-advertising styling; fake documentary evidence; tourism cues; landmarks; temples; mountains; café shorthand; lantern or festival clichés; generated webpage or interface; imitation of any living artist; broken tools; implausible object joins; excessive scrapbook clutter.
```

## A08 selected portrait source

- Saved file: `source-portrait.png`
- Native dimensions: 1122 × 1402 px (portrait; imagegen returned a two-pixel variance from mathematically exact 4:5, ratio 0.800285 versus 0.8; both axes exceed the requested 1024 × 1280 minimum)
- SHA-256: `3081fe6939abdf7ee96afd3d6c02a470eeef3a96fc474e3844f391cecd675473`
- Built-in generation result: `/Users/mahiro/.codex/generated_images/019f6ec1-2c45-7651-bb79-10d2f0f60677/exec-1b17e333-a416-4a31-bb27-cef7f18249dc.png`

### Exact prompt

```text
Use case: photorealistic-natural
Asset type: Roi Mueang Chapter 01 A08 editorial object-study PNG source.
Canvas invariant: generate natively on an EXACT 1024×1280 pixel canvas, ratio EXACTLY 4:5 portrait. Do not output 2:3, 3:4, square, or any other ratio. Do not crop, resize, extend, or derive another generated image.
Input image role: Image 1 is only the visual-family reference. Make a wholly new, portrait-native composition that carries its warm uncoated paper, ink black, controlled lacquer red, restrained deep indigo, subtle halftone grain, tactile wear, and visibly assembled editorial restraint.
Primary scene: a calm vertical editorial material-research study under warm natural side light. Arrange one used sign-painter brush with individually legible bristles, a worn completely blank matte sign substrate with a repaired wood frame, fibrous masking-paper pieces, a cropped abstract lacquer-red paint trace, a clearly visible indigo dry-brush edge, and a few small aged metal brackets/fasteners and wood repair blocks.
Composition: exact 4:5 portrait. Build an asymmetric vertical rhythm unique to this image: place the repaired blank panel across the lower-middle, the brush diagonally or horizontally near its upper edge, and the masking paper and small repair hardware as restrained secondary details. Preserve a large calm uncoated-paper field in the upper third. Keep every critical object inside the outer 8% safety boundary and at an inspectable scale. This must not resemble a cropped landscape flat lay.
Style: materially realistic editorial object photography subtly fused with constructed print-collage grammar; quiet material research, current and unglamorous; not advertising, not a catalogue, not documentary evidence.
Materials and palette: frayed natural bristles, matte dried lacquer-red paint, indigo pigment dragged dry across fibrous paper, abraded blank sign board, torn masking fibers, worn brown wood, oxidized dark metal, warm beige paper, ink-black halftone.
Text: none. The sign substrate must be entirely blank. Paint marks must be cropped abstract traces that cannot be interpreted as letters or glyphs.
Hard exclusions: any readable Thai or Latin lettering; letterlike marks; labels; logos; watermarks; real business identity; hands, arms, people, or anatomy; marketing gloss; product-advertising staging; tourism cues; landmark, temple, mountain, café, lantern, or festival shorthand; fake documentary claims; generated webpage/interface; broken tools; impossible joins; clutter; living-artist imitation.
```

## Rejected A08 attempt

- Not copied into this lane.
- Built-in generation result: `/Users/mahiro/.codex/generated_images/019f6ec1-2c45-7651-bb79-10d2f0f60677/exec-6eee091b-41bc-4187-8cbb-9c0e048ed995.png`
- Native dimensions: 1003 × 1568 px
- SHA-256: `ce436cd644ae8397dfb8cb44e57a4ec4f4abf7e60792f30895c6f53a54cb1077`
- Rejection reason: the image was independently composed and visually on-contract, but its approximately 2:3 ratio and 1003 px width failed the required 4:5 / 1024 px minimum. It was not cropped or resized.

### Exact rejected prompt

```text
Use case: photorealistic-natural
Asset type: Roi Mueang Chapter 01 editorial journal image / A08 lettering object study, full-bleed PNG source
Input images: Image 1 is a visual-family reference only, not an edit target. Preserve its warm uncoated-paper field, ink-black structure, controlled lacquer red, restrained deep indigo, subtle halftone/print grain, tactile material specificity, and visibly assembled editorial restraint. Create a new independent composition and do not crop or reproduce any A07 layout.
Primary request: Create one original separately composed 4:5 portrait object-study image at 1024×1280 or larger. Study brush bristles, a lacquer-red paint trace, an indigo dry-brush edge, a worn completely blank sign substrate, masking paper, and small metal-and-wood repair details under warm natural daylight.
Scene/backdrop: a vertical editorial material-research arrangement built from paper boundaries, an upright repaired blank substrate, and evidence of use; contemporary Chiang Mai is suggested only through material relationships, never through landmarks or tourism shorthand.
Subject: one used narrow-to-medium sign-painter brush with individually readable bristles, cropped non-letterforming lacquer-red paint residue, an indigo dry-brush edge, a worn blank matte sign panel, folded and torn masking paper, small aged metal fasteners/brackets and repaired wood joins.
Style/medium: materially realistic editorial object photography fused subtly with the selected reference’s constructed print-collage grammar; observant and tactile, not product advertising and not documentary evidence.
Composition/framing: 4:5 portrait, designed natively for a narrow article figure; an upright blank substrate anchors the lower-middle while the brush, masking paper, repair details, red trace, and indigo edge form a quiet asymmetric vertical rhythm; all objects fully readable; generous calm negative space in the upper portion; critical objects away from the outer 8%; distinctly recomposed rather than a landscape crop.
Lighting/mood: warm natural side light, quiet, current, unglamorous; soft believable shadows with no polished studio sheen.
Color palette: warm paper beige, ink black, controlled lacquer red, restrained deep indigo, aged wood and oxidized metal.
Materials/textures: frayed brush bristles, matte dried paint, fibrous masking paper, abraded unlettered sign substrate, subtle wood grain, worn metal repair hardware, light halftone and print-registration texture.
Text: none.
Constraints: the sign substrate must be completely blank; all paint marks must be abstract cropped traces that cannot be read as characters; preserve calm editorial negative space and inspectable object scale; composition must be genuinely portrait-native and independent.
Avoid: readable lettering of any language; letterlike glyphs; labels; logos; watermarks; recognizable real business; hands, arms, people, or anatomy; marketing gloss; product-advertising styling; fake documentary evidence; tourism cues; landmarks; temples; mountains; café shorthand; lantern or festival clichés; generated webpage or interface; imitation of any living artist; broken tools; implausible object joins; excessive scrapbook clutter; any mechanical crop or direct duplication of the landscape composition.
```

## Honest visual self-check

- A07 and A08 are visibly related through warm uncoated paper, lacquer red, restrained indigo, ink/halftone texture, worn wood, dark metal, and blank sign substrate.
- The selected A08 is separately generated and portrait-native; it is not a crop, resize, extension, or edit of A07.
- Brush bristles, dry paint, masking paper, blank substrate, and repair hardware remain inspectable in both files. A07 uses a broad vertical brush beside a landscape panel; A08 uses a horizontal brush above a lower-set portrait arrangement.
- No readable lettering, labels, logos, watermarks, real-business identifiers, generated webpage/interface, or authored words were observed.
- No person, hand, arm, anatomy, landmark, temple, mountain, café cue, lantern/festival cue, or other tourism shorthand was observed.
- Lighting is warm and natural with matte wear rather than cast marketing gloss. The arrangements read as constructed editorial material studies rather than product advertising or documentary proof.
- Paint traces are abstract and non-letterforming; the sign fields are blank and worn.
- No obvious broken brush geometry, implausible object joins, or living-artist signature imitation was observed.
- Caveat: A08's native generator output is 1122 × 1402 rather than mathematically exact 4:5 by two pixels; it was retained untouched to respect the no-crop/no-resize source-lane constraint.
