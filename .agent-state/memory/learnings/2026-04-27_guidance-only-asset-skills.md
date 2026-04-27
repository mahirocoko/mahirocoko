---
tags:
  - skills
  - image-assets
  - prompt-engineering
  - web-assets
---

# Guidance-only asset skills need clear boundaries

For image asset workflows, keep prompt doctrine separate from asset delivery workflow.

`web-asset-prompts` should stay focused on rewriting generic image-generation requests into production-ready prompt specs: ratios, crop safety, transparent cutouts, chroma-key cutout sources, overlay-safe negative space, and final transparent trimming guidance.

`asset-designer` should stay focused on planning and reviewing the asset lifecycle: whether the user provided an image, whether to cut out or generate, how to separate subject/shadow/background layers, what deliverables to produce, and how to QA assets on real web backgrounds.

Important production distinction: source images for extraction often need generous padding, especially chroma-key sources, but final transparent deliverables should usually be trimmed to visible subject bounds unless layout-safe padding is intentionally required.
