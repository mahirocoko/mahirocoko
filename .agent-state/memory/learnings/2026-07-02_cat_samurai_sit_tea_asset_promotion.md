# Lesson: Promote generated sprite assets with named runtime contracts and honest draft status

Tags: sprite-workflow, asset-promotion, runtime-assets, cat-samurai, provenance

## Context

After Mahiro approved the clean Mahiro Cat Samurai sit-tea animation, the asset needed to move from `.agent-state/sprite-workflow/jobs/...` into `public/assets`. The existing generic promotion helper was not safe for a shared flat runtime folder because it copied `manifest.json` and `frames/*` directly.

## Lesson

Promotion is part of the asset contract. For shared runtime folders, use explicit names:

- `<asset-name>-sprite-sheet.png`
- `<asset-name>-preview.gif`
- `<asset-name>-manifest.json`

The manifest should record `production-draft` when the asset is approved for runtime use but still imagegen-derived or not final hand-authored pixel art.

## Practical Rule

When promoting sprite assets:

1. Confirm approval references the exact candidate path.
2. Copy only final runtime artifacts, not raw job folders.
3. Use named files to avoid collisions.
4. Include source workflow, winner source, cleanup mode, QA report paths, and notes in the manifest.
5. Keep the retrospective/learning notes near the commit so future agents know why the asset exists and what its limitations are.

## Applied Asset

Approved/promoted asset:

- `public/assets/mahiro-cat-samurai-sit-tea-clean-sprite-sheet.png`
- `public/assets/mahiro-cat-samurai-sit-tea-clean-preview.gif`
- `public/assets/mahiro-cat-samurai-sit-tea-clean-manifest.json`
