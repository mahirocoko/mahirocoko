# Mahiro Cat Samurai Sprite Pack

Game-ready prototype sprite pack for Mahiro's white-cat samurai mascot.

## Contract

- Frame size: `128x128`
- Runtime strips: `runtime/<action>.png` and `runtime/<action>.webp`
- Source sheets: `sources/<action>-source.png`
- Preview GIFs: `previews/<action>.gif`
- Manifest: `manifest.json`

## Actions

| action | frames | fps | role |
| --- | ---: | ---: | --- |
| `idle` | 6 | 6 | rig-based idle loop |
| `run` | 6 | 8 | template-driven bipedal sword run cycle |
| `walk` | 6 | 6 | bipedal exploration walk |
| `dash` | 4 | 10 | samurai dash burst |
| `guard` | 4 | 8 | guard block stance |
| `slash` | 5 | 10 | template-driven sword slash attack, trimmed duplicate |
| `hurt` | 4 | 7 | template-driven hurt reaction |

## Notes

- Generated one action at a time with Codex imagegen. Current action sheets were regenerated from `public/assets/mahiro-cat-samurai-character-template-master-neutral-512.png` as the character/style master.
- `idle` now uses the local `main-character-animation-rig` output normalized into the existing `128x128` runtime contract.
- Runtime strips are component-cut, chroma-key cleaned, and normalized to transparent `128x128` cells.
- `previews/all-actions-preview.png` is the quick QA board.
- Preview GIFs are exported as full-frame GIFs with `Dispose: Background`; runtime PNG/WebP strips remain the source of truth for game use.
- `run` was regenerated as a bipedal two-leg sword run using the master character template; `slash` runtime strips intentionally trim one generated duplicate post-slash pose.
- This is a template-driven playable prototype. The latest pass prioritizes the approved `mahiro-cat-samurai-sprite.png` character line/detail style, then normalizes each action into transparent `128x128` runtime cells.
- Additional actions (`walk`, `dash`, `guard`) expand the pack toward basic 2D gameplay vocabulary.
