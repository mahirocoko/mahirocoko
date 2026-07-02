# Learning: proper-pixel-art as a sprite/imagegen post-processing reference

Tags: learn, proper-pixel-art, sprite-workflow, pixel-art, image-processing

`KennethJAllen/proper-pixel-art` is useful for Mahiro's sprite workflows because it treats generated-looking pixel art as a cleanup/post-processing problem rather than a prompt-only problem. Its core idea is to detect an implied pixel grid/mesh in a noisy high-resolution image, collapse each cell to one color, preserve/reconstruct alpha, and optionally upscale for preview.

Important takeaway for `sprite-workflow`: keep deterministic post-processing and human visual QA separate. Automated steps can normalize grids, colors, alpha, center, and slivers, but final readability still needs visual review at target size.

Second-pass focused docs added for updating `sprite-workflow`:

- `.agent-state/learn/KennethJAllen/proper-pixel-art/2026-07-02/1000_ALGORITHM-PIPELINE-DEEPDIVE.md`
- `.agent-state/learn/KennethJAllen/proper-pixel-art/2026-07-02/1000_VALIDATION-QA-DEEPDIVE.md`
- `.agent-state/learn/KennethJAllen/proper-pixel-art/2026-07-02/1000_TEMPORAL-VIDEO-DEEPDIVE.md`
- `.agent-state/learn/KennethJAllen/proper-pixel-art/2026-07-02/1000_SPRITE-WORKFLOW-ADAPTATION-PLAN.md`
- `.agent-state/learn/KennethJAllen/proper-pixel-art/2026-07-02/1000_SPRITE-WORKFLOW-UPDATE-BRIEF.md`

Recommended next `sprite-workflow` patch: add `references/pixel-cleanup.md`, add an optional `pixel-cleanup.py` wrapper around installed `proper-pixel-art`/`ppa` or `uvx`, and add synthetic tests for blocker behavior + fake command output. Do not vendor `proper-pixel-art` internals yet.
