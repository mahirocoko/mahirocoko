# Mahiro Cat Samurai Animation Rig

This pack turns the traced 64×80 Mahiro Cat Samurai still sprite into a practical animation-ready layer rig.

## Final still source

- `source/neutral-base-64x80.png` — self-contained neutral source frame for this rig pack

## Rig layers

Two layer styles are provided:

- `layers/full-canvas/*.png` — every part is 64×80 with transparent padding. Easiest for CSS/canvas compositing and frame-by-frame editing.
- `layers/cropped/*.png` — trimmed part crops. Useful for Aseprite/import workflows.

Back-to-front draw order:

1. `tail`
2. `katana-back`
3. `torso-kimono`
4. `obi-belt`
5. `left-foot`
6. `right-foot`
7. `front-sleeve`
8. `head`
9. `face-features`

## Rig data

- `rig.json` defines canvas, baseline, bounds, pivots, part paths, and starter idle/walk transform notes.

## QA

- `output/assembled-neutral.png` — recomposed neutral frame from layers.
- `qa/assembled-neutral-preview-4x.png`
- `qa/rig-contact-sheet.png`
- `qa/rig-overlay-board.png`

## Polished idle loop

- `frames/idle-6f/frame-00.png` … `frame-05.png` — separate 64×80 idle frames built from rig layers.
- `output/idle-polished-6f-strip.png` — 6-frame horizontal strip.
- `output/idle-polished-6f.gif` — 1x animated GIF.
- `qa/idle-polished-6f-strip-preview-4x.png` and `qa/idle-polished-6f-preview-4x.gif` — review previews.

Motion: subtle body/head bob, robe sleeve follow-through, tail sway, and one short blink frame. The blink is a separate face-features layer with a shorter GIF delay so it reads as a quick blink.

## Honest status

This is animation-ready as a **layered 2D sprite rig**, not a bone-rigged Spine/Rive file. It is ready for:

- hand-animating idle/walk/action frames in Aseprite/LibreSprite,
- generating frame sheets by transforming layers,
- using `rig.json` pivots as the source of truth for procedural animation.

Before production animation, manually clean overlap seams around the head/torso/tail masks after choosing the exact motion style.

Blink source: `layers/full-canvas/face-features-blink.png`.
