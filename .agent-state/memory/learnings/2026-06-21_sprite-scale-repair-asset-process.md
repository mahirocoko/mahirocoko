# Lesson Learned — Sprite generation needs asset-director workflow before imagegen

Tags: `sprites`, `asset-designer`, `imagegen`, `qa`, `mahiro-white-cat-samurai`

## Lesson

For sprite-sheet and mascot generation work, start as an asset director, not as a prompt runner. Before spawning Codex/imagegen lanes, define an asset manifest with role, frame count, layout, source/raw preservation, extraction strategy, output filenames, and QA gates. Use `asset-designer` first, then use prompt-writing guidance for the per-lane prompts.

## What triggered this

During the Mahiro White Cat Samurai walking sprite session, I ran several 4-lane imagegen experiments before properly using `asset-designer`. Mahiro corrected that this kind of work needs an asset workflow. The first rounds were harder to compare because lanes differed by too many variables, and one evaluation was unclear: I called Lane D “not recommended” even though it was strong for character stability but failed the exact frame-count contract.

## Durable rule

For future sprite/mascot generation:

1. Write a manifest first.
2. Keep lane contracts identical; vary only one small emphasis per lane.
3. Preserve raw imagegen outputs unchanged.
4. Separate candidate success from fallback/QA artifacts.
5. Score candidates across explicit axes: identity, motion, scale, count/layout, cutout, provenance.
6. If a good candidate only has local measurable drift, repair with shared-scale/baseline normalization before launching more broad imagegen runs.

## Applied this session

The final useful output was `docs/sprites/analysis/walk-c-scale-repair/`, derived from the selected C candidate. I deleted prior experiment folders after preserving C, normalized frames to a shared height and baseline, applied a light magenta defringe pass, and produced before/after QA assets without editing runtime files.
