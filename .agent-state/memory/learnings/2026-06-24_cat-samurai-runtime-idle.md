# Learning: Cat Samurai runtime idle replacement

Tags: sprite, animation-rig, runtime-contract, imagegen-reference, pixel-art

When replacing a runtime sprite action, check the runtime contract before moving assets. In `mahirocoko`, the Mahiro Cat Samurai runtime pack uses `public/sprites/mahiro-cat-samurai/manifest.json` with `128x128` cells, fixed-width strips, PNG/WebP runtime outputs, preview GIFs, source sheets, and an all-actions preview. A `64x80` authored rig strip is not directly swappable until it is scaled/padded into the existing cell contract.

For tiny pixel-character blinks, do not erase open eyes and draw long black bars. That produces a weird static face. Better: use imagegen or hand-drawn expression reference to understand eyelid/brow shape, then redraw a dedicated `face-features-blink` layer aligned to the real eye position. In the GIF, make the blink frame short so it reads as a blink rather than a held expression.

Codex imagegen is useful as reference material, but final runtime assets should come from the deterministic rig when visual fidelity matters. If Codex CLI shows inline generated images but no saved file appears, inspect the rollout JSONL for `image_generation_call.result` and decode the base64 payload; do not trust stale files under `~/.codex/generated_images` without visual verification.

Durable workflow for future sprite swaps:
1. Read the manifest/runtime contract first.
2. Normalize authored frames to that contract in a temp folder.
3. Visually compare old vs proposed runtime strips.
4. Replace runtime PNG/WebP, preview GIF, source, manifest notes, and aggregate preview together.
5. Cleanup experiments so only the working source-of-truth pack remains.
