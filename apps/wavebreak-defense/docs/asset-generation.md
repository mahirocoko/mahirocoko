# Wavebreak Defense Asset Generation

This project is a Phaser 3.90 Vite game with a fixed world size of `1024x640`.
Generate shipped playfield art against that coordinate system so path points,
build spots, and HUD hit targets stay aligned.

## Current Runtime Contract

- Map: loaded as a single image key `map-base` from `/assets/map/wavebreak-forest-base.png`.
- World size: `GAME_WIDTH = 1024`, `GAME_HEIGHT = 640`.
- Path and build spots: authored in world coordinates in `src/game/content/map.ts`.
- Towers and enemies: loaded with `this.load.image(...)` and rendered as static `Image` objects.
- UI icons and menu frames: rendered by DOM HUD from `/assets/menu/generated/...`.

## Next Map Direction

Use a hybrid map first:

- `public/assets/map/wavebreak-forest-base.png`: baked ground, path, low vegetation, and non-interactive lighting.
- Optional future props under `public/assets/props/<prop-name>/prop.png`: only for objects that need collision, occlusion, reuse, animation, or independent placement.
- Optional metadata under `src/game/content/map-props.ts` or JSON only after the scene actually renders props separately.

Generate the base map at exactly `1024x640` or `2048x1280`. Avoid 16:9 source images because Phaser currently stretches the image to `1024x640`.

## Next Sprite Direction

Keep current shipped assets as transparent PNGs while the game uses `this.add.image`.
When adding animation, generate spritesheets and update the Phaser loader to `this.load.spritesheet(...)` with fixed frame sizes.

Recommended sprite specs:

- Towers: transparent single PNGs, square canvas, visual body centered with a stable bottom anchor.
- Enemies: transparent single PNGs for now; future walk loops should be `4x4` top-down sheets with shared scale.
- Projectiles and impacts: separate transparent sheets, usually `1x4` projectile loops and `2x2` impact bursts.
- Props: transparent single PNGs with no edge touching; store deterministic cleanup metadata next to the source output while iterating in `tmp/`.
- FX: transparent single PNGs under `public/assets/fx/` while Phaser renders them as short-lived image sprites. Move to spritesheets only when `GameScene` keeps persistent sprite objects instead of rebuilding view objects every frame.

## Current Sprite Pass

The shipped sprite PNGs are generated as static, transparent, single-frame assets because `GameScene` currently loads them with `this.load.image(...)`.

- `runner.png`: 160x160, coral-red bark imp enemy.
- `skitter.png`: 160x160, amber chitin crawler enemy.
- `brute.png`: 180x180, heavy bark-and-copper golem enemy.
- `warden.png`: 240x240, corrupted root guardian boss enemy.
- `spark-spire.png`: 256x256, copper lightning pylon tower.
- `stone-thumper.png`: 256x256, stone-and-bronze mortar tower.
- `frost-bloom.png`: 256x256, icy crystal flower tower.
- `crystal-base.png`: 280x280, teal crystal objective base.

Raw generation outputs, prompts, transparent processed frames, and `pipeline-meta.json` QC files live in `tmp/wavebreak-sprite-pass/` during local iteration. Do not load those temp files from Phaser.

## Current FX Pass

Combat FX are generated as static transparent PNGs and rendered by `GameScene` with per-frame rotation, alpha, and scale.

- `spark-projectile.png`: 96x96 cyan lightning projectile.
- `spark-impact.png`: 128x128 cyan electric hit burst.
- `thumper-projectile.png`: 96x96 stone shell projectile.
- `thumper-impact.png`: 128x128 earth shock splash burst.
- `frost-projectile.png`: 96x96 cyan ice shard projectile.
- `frost-impact.png`: 128x128 radial frost bloom hit burst.

The simulation stores projectile `kind` and short-lived `hitEffects` so Phaser can choose the correct FX asset without guessing from color values.

## Generation QA

- Map dimensions match `1024x640` or an exact 2x scale.
- Transparent PNG sprites have alpha channels.
- Generated sprite frames do not touch cell edges.
- Phaser asset keys and file paths match `GameScene.preload()`.
- Build spot circles remain readable and clickable after replacing map art.
- Path centerline remains visually aligned with `PATH` in `src/game/content/map.ts`.
