# รอยเมือง — Codex Imagegen Prompts

## A01 · Desktop cover collage source

Selection result: **cover-b / Constructed collage**. Cover A remains alternate/diagnostic history.

**Asset mode:** hero image / constructed journal image  
**Recommended ratio:** 3:2 landscape, target source 1536×1024 or larger  
**Output format:** full-bleed PNG source  
**Delivery intent:** independent source candidate; not runtime-promoted

### Same-prompt source-lane prompt

```text
You are one isolated Codex imagegen source lane for the Roi Mueang (`รอยเมือง`) Chiang Mai journal frontend lab.

Read these contracts before generating:
- apps/frontend-labs/chiang-mai-journal/docs/design-brief.md
- apps/frontend-labs/chiang-mai-journal/docs/asset-manifest.md

Lane identity is available in the environment variable ROI_IMAGEGEN_LANE. You may write only under:
apps/frontend-labs/chiang-mai-journal/assets/imagegen/sources/$ROI_IMAGEGEN_LANE/

Task: use actual image generation to create one original A01 desktop cover-collage source. Do not create the artwork procedurally with SVG, Canvas, PIL, ImageMagick, CSS, or drawing scripts. This is an imagegen source pass.

Create a 3:2 full-bleed constructed editorial collage for a fictional Thai-first contemporary culture journal about Chiang Mai, Issue 01 `เมืองที่ทำด้วยมือ`. The image should interpret a city still shaped by hand through an anonymous workshop threshold, a blank hand-painted sign substrate with cropped non-legible brush marks, matte wood/paper/metal fragments, a narrow alley or shophouse geometry, and evidence of making or repair. Treat the scene as visibly assembled editorial art rather than documentary photography: deliberate paper edges, restrained offset-print misregistration, subtle halftone/ink grain, layered crops, and coherent depth without scrapbook clutter.

Visual grammar: warm northern daylight without golden nostalgia; uncoated-paper warmth; ink black; controlled lacquer red; restrained deep indigo; material surfaces that remain inspectable. Place the denser subject/collage cluster around center-right and preserve a calmer upper-left/left-center region for a large authored Thai headline crossing into the image. Keep all critical objects away from the outer 8% crop boundary so the composition survives responsive framing.

Hard exclusions: no legible Thai or Latin text, no logos, no watermarks, no real business identity, no famous landmark, no temple, no mountain panorama, no café shorthand, no lantern/festival cliché, no luxury-gold Lanna ornament, no identifiable real person, no fake interview portrait, no tourism-poster composition, no generated webpage, and no imitation of a living artist's signature style.

Save the generated source as `source.png` in your lane folder. Also write `provenance.md` with the lane name, model, generation call/result path, the exact prompt used, source dimensions, and an honest self-check against every hard exclusion. Do not clean, crop, resize, optimize, promote, or modify application code. Do not read another lane's output and do not choose yourself as the winner.
```

### Selection checks

- Reads as constructed editorial imagery, not fake reporting or tourism advertising
- Calm headline-safe area remains usable at the real open-issue spread
- Chiang Mai context comes from material/spatial relationships, not landmark shorthand
- No readable generated lettering or accidental brand identity
- Paper, lacquer red, indigo, wood, metal, and brush-mark language feels like one family
- 3:2 source remains crop-safe at desktop widths before A02 mobile composition begins

## Completed responsive/article batch

Promotion result: A02, A03, A07, and A08 passed main-agent source inspection plus separate Codex cleanup/QA and are runtime-promoted. The prompts below remain the role contract; source-specific paths, rejected attempts, and hashes live in each provenance file.

### A02 · Matched mobile cover composition

**Asset mode:** hero image  
**Recommended ratio:** 4:5 portrait, target source 1024×1280 or larger  
**Output format:** full-bleed PNG source  
**Delivery intent:** mobile source candidate; not a mechanical crop

```text
Using the selected A01 cover-b source as the visual reference, generate a separately art-directed 4:5 portrait cover for the same fictional Roi Mueang issue. Preserve the uncoated-paper field, lacquer red, deep indigo, halftone, alley fragment, blank sign substrate, brush, wood, metal, and visibly constructed editorial-collage grammar. Recompose rather than crop: keep the workshop/sign cluster large and inspectable in the lower-center/right, retain a clear city fragment, preserve calm breathing room around the upper-left `01` marker area, and keep critical material detail away from the outer 8%. No readable text, logo, watermark, real business, landmark, temple, mountain, café shorthand, identifiable person, fake documentary claim, or living-artist imitation. Produce one full-bleed 4:5 PNG source only; do not resize A01 or touch runtime files.
```

### A03 · Chapter 01 lettering collage

**Asset mode:** journal image  
**Recommended ratio:** 4:5 portrait  
**Output format:** full-bleed PNG source

```text
Create a 4:5 constructed editorial collage for Chapter 01, `ตัวอักษรของเมือง`, in the selected Roi Mueang visual family. Focus on a blank hand-painted sign substrate, close brush and paint evidence, masking edges, wood/metal supports, cropped non-legible strokes, and one narrow urban threshold fragment. Make the making process materially inspectable without showing generated words or a fake real sign. Use warm paper, ink black, lacquer red, restrained indigo, subtle halftone, and deliberate paper assembly. No readable text, logo, watermark, real shop, portrait, tourism icon, or artist-style imitation. Keep the central subject strong enough for the article masthead and leave safe caption/crop boundaries.
```

### A07 / A08 · Lettering object-study pair

**Asset mode:** journal image / object study  
**Recommended ratios:** A07 3:2 landscape; A08 4:5 portrait  
**Output format:** two separately generated full-bleed PNG sources

```text
Create a matched object-study pair for the Roi Mueang Chapter 01 article: one 3:2 landscape source and one separately composed 4:5 portrait source. Study brush bristles, a lacquer-red paint trace, an indigo dry-brush edge, worn sign substrate, masking paper, and small metal/wood repair details under warm natural light. The scene should feel like editorial material research, not product advertising or documentary evidence. Keep objects fully readable with calm negative space and restrained staging. No readable lettering, labels, logos, hands with anatomical errors, cast marketing gloss, tourism cues, or artist-style imitation. Generate each ratio independently; do not mechanically crop one into the other.
```
