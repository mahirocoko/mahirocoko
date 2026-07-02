# Lesson: Sprite dicut + animation QA needs detail-preserving defaults and motion-stability checks

Tags: sprite-workflow, dicut, chroma-key, animation-qa, visual-honesty, cat-samurai

## Context

During Mahiro Cat Samurai sit-tea asset production, a generated 8-frame animation initially looked acceptable by script QA, but repeated human review exposed multiple workflow blind spots: magenta spill cleanup was overvalued from dark previews, and one frame could pass center checks while still visually popping because its alpha bounds were wider.

## Durable Lesson

For generated mascot sprites, asset QA must preserve character detail before optimizing for clean edges. If the subject has pink/magenta details near a magenta chroma key, `edge-connected` should be the default cleanup mode when both modes pass. `spill` is only a fallback when it clearly improves light/dark/checker previews without erasing real detail.

For subtle animations, center drift is not enough. QA must also check alpha-bounds x/y/width/height ranges and adjacent-frame visual continuity. A stable-looking loop may require repeating a settle frame or replacing a noisy intermediate frame rather than preserving every generated frame.

## Practical Rules

- Do not choose dicut mode from dark preview alone.
- Compare light, dark, checker, and source-detail preservation.
- Use master-sprite-first before generating animation.
- Inspect adjacent-frame zooms for idle/sip/breathing loops.
- Treat script QA as a warning system, not final production approval.
- Promote assets with explicit names and manifests; avoid generic `public/assets/manifest.json` or `public/assets/frames/*` copies.

## Tooling Follow-ups

- Add adjacent-frame zoom/contact generator.
- Add motion-jitter report with neighbor deltas.
- Add safe named-promotion helper for sprite sheets.
- Keep visual honesty reports in job outboxes.
