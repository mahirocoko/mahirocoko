# A01 Imagegen Source Provenance

- Lane: `cover-b`
- Asset: A01 desktop open-issue cover collage source
- Final source: `apps/frontend-labs/chiang-mai-journal/assets/imagegen/sources/cover-b/source.png`
- Model: OpenAI image generation through the built-in `image_gen` tool; the backend model identifier was not exposed by the tool result.
- Final generation call: built-in `image_gen` edit call using the immediately preceding generated image as its sole image input (`num_last_images_to_include: 1`)
- Final generation result path: `/Users/mahiro/.codex/generated_images/019f6e75-13db-7a40-8b11-074a4f2ab219/exec-fd514649-96e3-4002-be82-fc261ec81936.png`
- Base generation result path: `/Users/mahiro/.codex/generated_images/019f6e75-13db-7a40-8b11-074a4f2ab219/exec-aacad601-9a24-47b9-815d-43e03eeb026b.png`
- Source dimensions: 1536 × 1024 pixels (3:2)
- Format: PNG
- SHA-256: `203c71e5d846d012472aec5c8cca0c858951761430a5f9cf717f6780579e9c75`
- Local processing: none. The final generated PNG was copied byte-for-byte to `source.png`; it was not cleaned, cropped, resized, optimized, or otherwise modified.

## Exact base-generation prompt

```text
Use case: stylized-concept
Asset type: A01 desktop open-issue cover collage source for a Thai-first contemporary culture journal frontend
Primary request: Create one original 3:2 full-bleed constructed editorial collage for the fictional Chiang Mai journal รอยเมือง, Issue 01 concept “a city still shaped by hand.” This must read as visibly assembled editorial art, not documentary photography and not a tourism poster.
Scene/backdrop: An anonymous workshop threshold opening onto narrow alley or shophouse geometry in contemporary Chiang Mai, assembled from layered photographic-looking crops and tactile paper pieces. Include a blank hand-painted sign substrate carrying only cropped, abstract, non-linguistic brush marks; matte wood, uncoated paper, and worn metal fragments; and clear evidence of making or repair such as a patched joint, masking edge, brush, clamp, mended panel, or work-worn surface. No people are necessary.
Subject: The workshop threshold, blank sign substrate, material fragments, and repair evidence form one coherent spatial scene with inspectable surfaces and believable object joins.
Style/medium: Sophisticated constructed editorial collage with deliberate paper edges, restrained offset-print misregistration, subtle halftone and ink grain, layered crops, matte print character, coherent depth, and disciplined visual hierarchy. Contemporary and observant, never nostalgic, decorative, glossy, precious, or scrapbook-cluttered.
Composition/framing: Exact landscape 3:2 aspect ratio, full bleed. Place the denser subject/collage cluster around center-right. Preserve a calmer upper-left and left-center field with low visual noise and sufficient tonal continuity for a large authored Thai HTML headline to cross into the image later. Keep every critical object comfortably inside the inner 84% safe area, away from the outer 8% crop boundary on all sides. Use layered alley/shophouse planes to guide the eye toward center-right. No border, no mockup, no page frame.
Lighting/mood: Warm northern daylight without golden-hour glow or sepia nostalgia; clear gentle daylight with restrained shadows; tactile, current, quietly industrious.
Color palette: Warm uncoated-paper cream, ink black, controlled lacquer red accents, restrained deep indigo, natural matte wood and aged metal. Red and indigo remain accents, not dominant fields.
Materials/textures: Inspectable matte wood grain, fibrous paper edges, brushed or oxidized metal, dry paint, masking residue, patched joins, subtle ink grain and halftone dots; avoid excessive distressing.
Text: Render no readable writing at all. The sign substrate must remain blank except for a few cropped non-legible brush gestures that cannot be interpreted as Thai, Latin, numerals, or symbols.
Constraints: Original fictional scene; anonymous place; no identifiable real person; no generated webpage or UI; coherent depth without collage clutter; all key elements crop-safe.
Avoid: any legible Thai or Latin text; letters; numbers; logos; trademarks; watermarks; signatures; real business identity; famous landmark; temple; religious architecture; mountain panorama; café shorthand; coffee cups; lanterns; festival imagery; tourism-poster composition; luxury-gold Lanna ornament; identifiable real person; portrait; fake interview portrait; documentary-news claim; generic craft catalogue styling; scrapbook clutter; glossy advertising polish; imitation of any living artist’s signature style.
```

## Exact final reframing prompt

```text
Edit the previously generated A01 cover collage with one targeted composition correction only.

Preserve the same anonymous contemporary Chiang Mai workshop-threshold scene, blank sign substrate with cropped non-legible black brush gesture, matte wood/paper/metal fragments, narrow alley geometry, evidence of making and repair, warm northern daylight, warm uncoated-paper cream, ink black, controlled lacquer red, restrained deep indigo, subtle halftone and offset-print grain, and calm upper-left/left-center headline field.

Reframe the entire constructed collage so every critical object is clearly inside an inner 84% crop-safe area: move and slightly scale the dense center-right cluster inward so the sign frame, repair hardware, brush container, wood panels, red/indigo fragments, and alley opening all have at least 8% breathing room from every outer edge. Extend the calm paper-and-workshop environment naturally around the perimeter. Maintain exact landscape 3:2 full-bleed composition and keep the dense focal cluster center-right. Do not add a border, page frame, mockup, new objects, people, or extra clutter.

The result must remain visibly assembled editorial collage rather than documentary photography, with deliberate torn paper boundaries and restrained print misregistration, but coherent spatial depth and inspectable material surfaces.

Render no readable writing at all. Preserve only abstract, cropped, non-linguistic brush marks that cannot be interpreted as Thai, Latin, numerals, or symbols.

Avoid: any legible Thai or Latin text; letters; numbers; logos; trademarks; watermarks; signatures; real business identity; famous landmark; temple; religious architecture; mountain panorama; café shorthand; coffee cups; lanterns; festival imagery; tourism-poster composition; luxury-gold Lanna ornament; identifiable real person; portrait; fake interview portrait; documentary-news claim; scrapbook clutter; glossy advertising polish; imitation of any living artist’s signature style.
```

## Honest self-check

- No legible Thai or Latin text: pass. The sign contains one broad abstract black brush sweep and non-linguistic color blocks; no readable letters, words, or numerals are visible.
- No logos: pass. No brand mark or recognizable logo is visible.
- No watermarks: pass. No watermark or generator mark is visible.
- No real business identity: pass. The workshop/shophouse setting is anonymous, and no business name, address, or identifying sign is present.
- No famous landmark: pass. The scene contains only generic workshop and alley geometry.
- No temple: pass. No temple or religious structure is visible.
- No mountain panorama: pass. No mountain or panoramic landscape is visible.
- No café shorthand: pass. No café interior, coffee cup, espresso equipment, menu board, or café-brand cue is visible.
- No lantern/festival cliché: pass. No lantern, festival decoration, parade, or celebratory motif is visible.
- No luxury-gold Lanna ornament: pass. No gold ornament or decorative Lanna motif is visible.
- No identifiable real person: pass. No person appears in the image.
- No fake interview portrait: pass. No portrait or interview framing appears.
- No tourism-poster composition: pass. The image is a restrained material/editorial construction with no scenic landmark, promotional copy, or destination-poster framing.
- No generated webpage: pass. The image is a standalone editorial collage and contains no browser, interface, layout mockup, or UI controls.
- No imitation of a living artist's signature style: pass by prompt and process. No artist was named or supplied as a style reference; the request used general editorial-collage and print-process vocabulary only.

Additional contract check: the main workshop/sign/alley cluster is center-right and visibly separated from the outer crop boundary; only non-critical decorative paper, color, and halftone fragments enter the outer 8% bleed area. The upper-left and left-center remain calm enough for authored HTML headline placement.
