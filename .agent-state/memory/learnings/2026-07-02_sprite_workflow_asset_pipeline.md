# Learning: sprite-workflow needs pipeline gates plus visual taste gates

Tags: sprite-workflow, asset-pipeline, chroma-key, imagegen, QA, Mahiro Cat Samurai

## Lesson

For generated sprite sheets, do not treat imagegen output as production until it passes a real pipeline and a human visual gate. The correct order is:

1. Choose/keep the best overall motion candidate.
2. Extract with deterministic chroma/alpha tooling.
3. Generate light/dark/checker previews.
4. Run dimension, center drift, appendage/tail, and detached-sliver QA.
5. Center-align or clear extraction artifacts if needed.
6. Only then promote to public/runtime assets.

Do not swap to a worse candidate just because one detail such as a tail is more visible. Fix extraction or regenerate with a better prompt instead.

## Evidence from this session

- The kneel animation initially lost tail/detail through manual crop/trim cleanup.
- Swapping to a raw candidate with more tail made motion/silhouette worse; Mahiro correctly called it out.
- Adding `extract-chroma-sheet.py`, `make-qa-previews.py`, `qa-sprite-sheet.py`, `score-candidates.py`, and `center-align-frames.py` made the workflow more repeatable.
- The sword-sakura test technically passed pipeline checks but was visually weak, so it was deleted rather than committed.

## Durable behavior change

Future sprite work should use `sprite-workflow` as a contract-first asset pipeline and should explicitly separate:

- machine QA: size, alpha, slivers, center drift, appendages
- visual QA: silhouette, motion readability, identity preservation, effect taste at target size
- promotion decision: only after both gates pass

For effects close to the chroma key color, use another key color or separate effect layer to avoid deleting petals/glow while removing background.
