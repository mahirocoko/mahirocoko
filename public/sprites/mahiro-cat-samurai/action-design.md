# Mahiro Cat Samurai Action Design

Character/style master: `public/assets/mahiro-cat-samurai-character-template-master-neutral-512.png`.

Design rule: preserve the approved white-cat samurai line/detail feel, but each action should be compact, silhouette-readable, and normalized into transparent `128x128` runtime cells.

## Existing actions

| action | frames | purpose | notes |
| --- | ---: | --- | --- |
| `idle` | 6 | standing loop | blink/breathe loop |
| `run` | 6 | bipedal sword run | two-leg run while holding sword/scabbard close |
| `slash` | 5 | attack | trimmed duplicate post-slash pose |
| `hurt` | 4 | hit reaction | cute fluster/recover |

## Proposed expansion actions

| action | frames | purpose | pose design |
| --- | ---: | --- | --- |
| `walk` | 6 | calm movement/exploration | two-leg walk with sword held close, small step cycle, less forward lean than run |
| `dash` | 4 | fast samurai burst | crouch → forward streak pose → low dash → recover; compact tail/robe, no long motion trails |
| `guard` | 4 | block/defense | draw sword up/forward, guarded stance, small impact-ready pose |
| `jump` | 6 | platform/action movement | crouch → takeoff → rise → apex → fall → landing; sword held close |
| `victory` | 4 | positive/emote state | relax → tiny smile → sword/hand lift → return; restrained, not goofy |
| `down` | 4 | fail/knockdown state | stagger → fall/sit → down/dizzy → still; cute non-gory fail state |

## QA rules

- Runtime PNG/WebP strips are the game source of truth.
- GIF previews must use full-frame export with `Dispose: Background`.
- If a GIF looks ghosted/overlapped, inspect disposal before regenerating art.
- Prefer one action per generated source sheet.
- Reject sources with edge-touching, duplicate heads, hidden legs for locomotion actions, or inconsistent character identity.
