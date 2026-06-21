# Walk C Scale Repair

This folder keeps the selected **lane C** walk candidate and locally repairs the perceived frame-to-frame scale drift.

## What changed

- Source preserved: `source/lane-c-selected-sprite-sheet-6f.png`
- Final repaired sheet: `sprite-sheet-6f.png`
- Final repaired frames: `frames-repaired/frame-01.png` … `frame-06.png`
- Preview: `preview.gif`, `preview-dark.png`
- QA: `qa/before-after-dark.png`

## Repair method

The selected C sheet was split into six `128x128` frames. Each alpha crop was normalized to a shared `113px` content height, then placed on a fixed baseline inside a `128x128` transparent canvas. This avoids per-frame arbitrary zoom while removing the most obvious height/scale pulsing.

## QA note

Height and baseline are now locked. Width still varies by pose, especially the final recover frame, but that is mostly silhouette/stride variation rather than camera zoom. Runtime assets were not edited. A light #ff00ff-family defringe pass was applied after height-lock normalization.

`qa/before-after-dark.png`: top = original C, bottom = repaired.
