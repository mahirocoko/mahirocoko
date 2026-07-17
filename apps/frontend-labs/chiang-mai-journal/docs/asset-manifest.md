# รอยเมือง — Codex Imagegen Asset Manifest

Status: first-slice runtime family complete (A01/A02/A03/A07/A08). A04-A06 are deferred with their unopened chapters.

## Ownership and folders

- Codex imagegen owns source generation.
- A separate cleanup/dicut lane owns alpha, crop, edge, and residue work when required.
- The main agent owns comparison, selection, provenance, runtime promotion, and in-page QA.
- Planned source root: `assets/imagegen/sources/<job-id>/`
- Planned QA root: `assets/imagegen/qa/<job-id>/`
- Planned runtime root: `public/assets/editorial/issue-01/`

## Shared visual contract

- Fictional contemporary Chiang Mai editorial interpretation, not documentary evidence.
- Warm daylight, uncoated paper, ink black, controlled lacquer red, and restrained deep indigo.
- Constructed collage should show deliberate crop, paper boundary, print registration, and visible editorial assembly without scrapbook clutter.
- Object studies should feel inspectable and materially specific, with restrained staging rather than product-advertising gloss.
- No legible generated Thai/Latin text, logos, watermarks, real business names, famous landmarks, temples, mountain panoramas, café shorthand, or identifiable real people.
- For lettering scenes, show brushes, painted strokes, blank sign substrates, masks, and cropped non-legible marks; authored words belong in HTML.
- Do not request or imitate a living artist's signature style.

## Planned assets

| ID | Runtime filename | Role | Source ratio | Target proof | Generation lane | Status |
| --- | --- | --- | --- | --- | --- | --- |
| A01 | `cover-collage-wide.webp` | Desktop open-issue cover collage | 3:2 | 1440px first viewport | Codex source comparison A/B | runtime-promoted from source B |
| A02 | `cover-collage-portrait.webp` | Mobile cover composition, art-directed rather than mechanically cropped | 4:5 | 390px and 320px first viewport | Codex matched mobile source | runtime-promoted |
| A03 | `chapter-lettering-collage.webp` | Chapter 01 / article lead context | 4:5 | Article masthead | Codex collage lane | runtime-promoted |
| A04 | `chapter-makers-object-study.webp` | Chapter 02 object/hand study | 4:5 | No current runtime slot | Codex object-study lane | deferred until Chapter 02 scope |
| A05 | `chapter-materials-object-study.webp` | Chapter 03 material taxonomy | 1:1 | No current runtime slot | Codex object-study lane | deferred until Chapter 03 scope |
| A06 | `chapter-thresholds-collage.webp` | Chapter 04 spatial collage | 3:2 | No current runtime slot | Codex collage lane | deferred until Chapter 04 scope |
| A07 | `article-lettering-detail-wide.webp` | Feature article material interruption | 3:2 | Desktop article body | Codex object-study lane | runtime-promoted |
| A08 | `article-lettering-detail-portrait.webp` | Feature article narrow/mobile material interruption | 4:5 | 390px and 320px article | Codex matched object-study source | runtime-promoted |

## Source-generation plan

1. Two isolated same-contract Codex imagegen lanes produced A01 candidates; Mahiro selected cover B.
2. A02 was generated as a new portrait composition from the selected family, not cropped from A01.
3. A03 and the independently generated A07/A08 pair were produced in separate role lanes. One wrong-ratio A08 attempt was rejected before the accepted portrait source.
4. Every promoted source records prompt, output path, dimensions, hash, and review status.
5. Separate Codex asset-designer lanes own exact geometry, WebP optimization, source/runtime comparison, and QA reports.
6. A04-A06 remain ungenerated until their chapters establish real runtime roles.

## A01 source selection

- **Selected:** `assets/imagegen/sources/cover-b/source.png`
- **Alternate/history:** `assets/imagegen/sources/cover-a/source.png`
- **Decision:** Mahiro selected B after both sources were rendered uncropped inside the Maitree + Anuphan issue spread.
- **Winning relationship:** B reads as a deliberately constructed editorial image rather than a workshop photograph. Its alley fragment, blank sign substrate, brush, paper, metal, print marks, and calm headline field connect more directly to `รอยเมือง` and the open-issue anatomy.
- **Useful A strength:** stronger photographic/material immediacy. Keep it as diagnostic history or a possible later article reference; `not selected` is not a universal rejection of that visual family.
- **Runtime output:** `public/assets/editorial/issue-01/cover-collage-wide.webp`, 1536×1024, 452,306 bytes, quality 92 WebP with sharp YUV.
- **Cleanup/QA:** a separate Codex Luna/medium asset-designer lane preserved composition/dimensions, compared PNG and WebP at native/target size, and recorded evidence under `assets/imagegen/qa/cover-b-runtime/`.
- **Known limitation:** the runtime file is a lossy encode; the smallest paper-grain variations can differ under pixel-level inspection while visible texture/material hierarchy remains preserved.
- **Rendered evidence:** `docs/qa/implementation/` proves the promoted desktop/mobile cover, article lead, and object-study pair in the actual Home/article flow. The earlier `a01-wide-source-mobile-diagnostic.png` remains historical evidence of why A02 required separate art direction.

## A02/A03/A07/A08 promotion

| Asset | Accepted source | Runtime geometry | Runtime bytes | Runtime SHA-256 |
| --- | --- | ---: | ---: | --- |
| A02 | `sources/a02-mobile/source.png` (`1122×1402`) | `1120×1400` | 424,274 | `01ad2decae013822a26c0dbcd45fcb570c95bba901fb119a210862a0eb79cd4a` |
| A03 | `sources/a03-lettering/source.png` (`1122×1402`) | `1120×1400` | 437,602 | `dd244407b0346e636af4c565a3f11329942263b5a35449a2a62302b24c6245f3` |
| A07 | `sources/a07-a08-object/source-wide.png` (`1536×1024`) | `1536×1024` | 479,182 | `d9483742816cca18aaaf32782074337aaac3cb9cab618108721af89b4a447083` |
| A08 | `sources/a07-a08-object/source-portrait.png` (`1122×1402`) | `1120×1400` | 468,240 | `560091319e75106779e340e788e22ce70d55efb4cb3f5618a1671710e958dbd2` |

A02/A03/A08 use an exact `1120x1400+1+1` center crop that removes one generated pixel from every outer edge without resampling. All four WebPs use quality 90, method 6, and sharp YUV. Native/target-size source comparisons passed; expected lossy micro-variation remains limited to fine grain and isolated halftone pixels. Evidence: `assets/imagegen/qa/a02-a03-runtime/` and `assets/imagegen/qa/a07-a08-runtime/`.

## QA and promotion gates

- Inspect actual files, not contact sheets alone.
- Compare desktop/mobile crops inside the real issue spread and article figures.
- Check for generated text, accidental logos, broken hands/tools, implausible object joins, tourist shorthand, and inconsistent paper/color grammar.
- Confirm captions and disclosures remain visible when media fails.
- Preserve source job, model, prompt, candidate, cleanup method, and rejection reason in a generated provenance record.
- Runtime promotion requires accepted visual fit, valid dimensions/format, practical file size, no text residue, and successful light/paper-background crop review.
- `approved reference` is not the same status as `runtime promoted`.
