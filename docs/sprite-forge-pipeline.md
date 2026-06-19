# Sprite Forge Pipeline

This document is the durable operating guide for Mahiro's `sprite-forge` subagent and for any main-agent work that touches mascots, pixel sprites, sprite sheets, compact companion animation, or runtime UI animation assets.

It was written after learning from:

- `.agent-state/learn/chongdashu/ai-game-spritesheets/repo.md`
- `.agent-state/learn/chongdashu/ai-pixel-snapped-game-sprites/repo.md`

Those repos are not runnable libraries. They are prompt/reference workflow repos. Their useful lesson is the pipeline shape: AI generation is only one stage; runtime-safe sprites require references, action vocabulary, post-processing, normalization, and QA.

## Current stance

Use `sprite-forge` as a specialist subagent under the main persistent agent. Do **not** create a separate persistent Letta agent unless sprite/asset direction becomes a long-running independent product with its own memory, roadmap, and cross-project asset library.

Why:

- Sprite work still needs project context, repo constraints, and Mahiro taste from the main agent.
- The specialist should be sharp, but not disconnected from the product owner context.
- Provenance and runtime decisions should stay visible to the main agent.

## Source-of-truth order

1. Current repo files/docs and runtime implementation
2. Mahiro's prompt/reference images/screenshots
3. Project brand/design docs
4. Existing asset manifests/README/source images
5. Learned sprite/pixel pipeline rules from this document
6. General sprite craft and Mahiro taste

Never copy a reference pack's pixels or aesthetic wholesale unless the license and user intent explicitly allow it. Use references for animation grammar, frame progression, silhouette checks, and QA expectations.

## When to use sprite-forge

Use it for:

- mascot creation or redesign
- pixel sprite-sheet analysis
- action-separated animation sets
- compact status/row companion animations
- imagegen prompt design for sprites
- chroma-key or transparent post-processing
- frame cutting / component recovery
- runtime atlas/manifest contract design
- visual QA for actual UI display sizes

Do not use it for generic frontend UI polish unless the task specifically involves sprite/mascot/animated asset work.

## Core principle

AI-generated sprites are **raw material**, not final runtime assets.

A good sprite pipeline is staged:

```text
reference + product brief
  -> action vocabulary
  -> one-action source generation
  -> source/provenance capture
  -> pixel snap or cleanup
  -> component-based frame recovery
  -> runtime normalization
  -> manifest/contract update
  -> contact sheet + GIF/display QA
  -> app build/install verification when relevant
```

## Reference analysis checklist

Before generating or cutting anything, inspect references for:

- action vocabulary: idle, walk, run, attack/work, hurt/error, dust/transition, waiting/coffee, etc.
- frame counts per action
- row/column meaning: row = action, row = variant, columns = frames, or per-action files
- baseline and anchor behavior
- silhouette size and camera angle
- palette and contrast
- effect components: steam, sparks, dust, impact marks
- actual intended display size, not just source canvas size

Important correction from Agent Halo: when the reference is an action-separated game sheet, do not reinterpret it as one mascot row with random poses. Keep action semantics intact.

## Contract choices

Choose the runtime model deliberately.

### Per-action files

Best for UI status mascots and small companion animations.

Example:

```text
mascots/session-cat/
  idle.webp
  work.webp
  coffee.webp
  hurt.webp
  dust.webp
  manifest.json
```

Pros:

- easiest to regenerate one action at a time
- small CSS/state mapping
- less risk of bad combined-sheet crops

### Row = action atlas

Best when matching game-style spritesheets or a runtime expects one atlas.

Pros:

- familiar game asset shape
- compact single file

Risk:

- imagegen often produces imperfect grids; still may need component recovery before packing.

### Row = variant atlas

Use only when stable character variants matter more than action vocabulary. Do not force this model onto game/action references.

## Image generation rules

Generate important actions one at a time when quality matters.

Prompt must include:

- project/product identity
- mascot identity
- exact action name
- exact frame count
- one horizontal row only, unless intentionally making a row-action atlas
- consistent baseline, scale, camera angle, and padding
- target display readability, such as `40x30 px` row display and `32x24 px` compact display
- true pixel-art or explicit non-pixel style
- transparent or flat chroma background
- no text, labels, watermarks, frame numbers, speech bubbles, fake UI, or oversized effects

For pixel-art output, prefer simple readable silhouette over decorative detail. Over-detailed AI pixel art often becomes mixels and fails when normalized.

## Provenance rules

Report exactly what happened:

- direct generated file used
- inline image extracted from CLI/session log
- generated image used only as visual reference
- local Pillow/ImageMagick reconstruction
- hand-authored prototype

Never claim direct imagegen output was used unless an accessible generated file or extracted embedded payload was actually used and post-processed.

Keep source PNGs in a durable project-approved folder such as `generated-images/` or `assets/mascots/source/`, unless the repo has a different convention.

## Post-processing pipeline

### 1. Chroma/alpha cleanup

- remove flat chroma background or clean transparency
- remove fringe pixels around the mascot
- preserve intentional small effects only when they belong to a frame

### 2. Pixel snap / native-grid recovery

Use when the target is true pixel-art style.

Goals:

- remove fake soft pixel texture
- recover/choose native logical grid
- nearest-neighbor scale to runtime source size
- keep hard square edges and limited palette

### 3. Frame recovery

Do not trust imagegen grid math blindly.

Preferred approach for loose generated sheets:

1. remove/chroma-key background
2. detect connected components
3. identify main mascot components as frame anchors
4. sort anchors by x/y according to action layout
5. merge intentional nearby effect components into the correct frame
6. discard random stray marks
7. normalize each recovered frame into the runtime cell box

Fixed-grid cutting is acceptable only when the source grid is actually exact and verified.

### 4. Runtime normalization

- pack frames into exact cell dimensions
- lock foot/bottom baseline
- keep scale and padding consistent
- output optimized WebP/PNG according to repo support
- keep PNG fallback if the runtime or browser support story needs it

## Manifest recommendation

If the asset set is likely to grow, add or maintain a small machine-readable manifest.

Minimum fields:

```json
{
  "action": "work",
  "frames": 8,
  "fps": 8,
  "sourceFrame": { "width": 80, "height": 60 },
  "displayFrame": { "width": 40, "height": 30 },
  "sheet": { "width": 640, "height": 60, "columns": 8, "rows": 1 },
  "anchor": { "x": 40, "y": 59, "semantic": "foot-baseline" },
  "background": "transparent",
  "provenance": "codex-imagegen-extracted + pillow-component-cut"
}
```

Keep it minimal. Do not create dead documentation if nothing will read or maintain it.


### GIF preview disposal

GIF previews can lie if frame disposal is not explicit. A preview exported with `Dispose: Undefined` may be rendered by some viewers as incremental drawing over the previous frame, making a clean runtime strip look like it has overlapping/ghosted frames.

For sprite QA GIFs, prefer full-frame exports with explicit disposal:

```bash
magick -dispose Background -delay <centiseconds> -loop 0 frames/*.png preview.gif
```

Avoid `-layers OptimizeTransparency` for review GIFs unless disposal behavior is verified. Runtime PNG/WebP strips remain the source of truth; GIFs are only review artifacts. If an animation appears to overlap, inspect `magick identify -verbose preview.gif` before regenerating the source art.

## QA checklist

Before calling sprite work done:

- source files preserved
- runtime files generated in expected format
- dimensions match contract
- frame count matches code/CSS/manifest
- sheet/cell math is exact
- transparency/chroma is clean
- baseline and scale do not drift
- effects belong to the intended frames
- contact sheet exists for review
- GIF or animated preview exists when useful
- visual check at actual display sizes
- dark and light surface checks when relevant
- compact status display checked separately if it exists
- repo verification command passed

For app work, inspect the installed/native app when browser preview cannot prove native behavior.

## Agent Halo application notes

Current Agent Halo sprite direction should use this pipeline next.

Known current contract from memory:

- runtime assets: `apps/desktop/public/mascots/session-cat/`
- source images: `generated-images/`
- runtime frame: `80x60`
- row display: `40x30`
- compact notch/activity display: `32x24`
- current actions: `idle`, `walk`, `work`, `coffee`, `hurt`, `dust`
- live mapping: `working -> work`, `waiting -> coffee`, `error -> hurt`, idle/done -> idle

Next quality direction:

1. Re-open the current app assets and runtime code before changing anything.
2. Preserve existing dirty source/runtime files.
3. Decide which action is weakest at actual display size.
4. Regenerate one action at a time.
5. Use component recovery and baseline normalization, not fixed-grid cutting.
6. Add or update manifest/provenance if the repo contract supports it.
7. Check row and compact displays separately.

## Anti-patterns

Avoid:

- one-shot giant sheets for all important actions
- remixing third-party sprite packs into a “new” mascot without explicit intent/license clarity
- deleting reference folders as temp
- accepting fake pixel-art texture as final
- fixed-grid cropping loose AI sheets
- adding random accessories to create “variants”
- shipping visual changes without runtime-size QA
- stale summaries that describe a previous sprite pass instead of the latest diff

## Output format for sprite-forge

When analyzing only:

1. Current contract
2. Reference/action read
3. Mismatch/risk
4. Recommended sprite contract
5. Generation/post-processing plan
6. Verification plan

When implementing:

1. Changed files
2. Source strategy and provenance
3. Runtime contract verification
4. Commands run and results
5. Visual caveats / next judgment step
