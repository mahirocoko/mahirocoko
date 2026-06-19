# GIF preview disposal can fake sprite overlap

## Context

While generating the Mahiro white-cat samurai sprite pack, the `run` animation looked like frames were overlapping or ghosting even after regenerating a cleaner 6-frame gameplay run cycle.

The actual issue was partly in the GIF preview export, not only in the sprite source.

## What happened

Preview GIFs had frames exported with:

```text
Dispose: Undefined
```

Some GIF viewers can interpret this as “draw the next frame on top of the previous canvas” instead of clearing the previous frame. That makes a sprite preview look like it has overlapping body parts or stale frame trails, even when the runtime strip is fine.

## Correct preview export

For sprite QA GIFs, export full-frame previews with explicit disposal:

```bash
magick -dispose Background -delay <centiseconds> -loop 0 frames/*.png preview.gif
```

Avoid using `-layers OptimizeTransparency` for QA previews unless disposal behavior is verified, because partial-frame optimization can make the preview lie about the actual runtime strip.

## Rule

Runtime strips (`runtime/*.png` / `runtime/*.webp`) are the source of truth for games. GIFs are preview artifacts only.

Before judging animation quality from a GIF:

1. Check GIF disposal metadata with `magick identify -verbose preview.gif`.
2. Confirm every frame has `Dispose: Background` or another explicit clear/replace behavior.
3. If the GIF looks like overlapping frames, regenerate it as full-frame before regenerating source art.
4. Then inspect the runtime strip/contact sheet separately.

## Durable lesson

Do not assume a choppy/ghosted GIF means the generated sprite source is bad. First verify whether the preview GIF is clearing the frame canvas correctly.
