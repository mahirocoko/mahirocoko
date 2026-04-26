---
tags:
  - image-generation
  - web-assets
  - skills
  - prompt-engineering
---

# Web asset prompts need production roles

Generic image prompts can produce attractive images that are difficult to use in a website. Production web asset prompts should start by naming the asset role: transparent cutout, product cutout, ingredient cutout, overlay-safe photo, full-bleed card image, journal image, or hero image.

For cutouts, require transparent PNG, isolated object, no background, generous padding, full subject visibility, clean silhouette, no cast shadow, and no floor plane. For photos, require explicit aspect ratio, crop-safe composition, subject edge safety, no text/logo/watermark, and overlay-safe negative space when text may sit above the image.

The reusable doctrine was encoded in `.agents/skills/web-asset-prompts/`, but the v0 skill should be treated as a foundation. It still needs fixtures, marker validation, and backend-specific prompt variants before it can be trusted as production-grade.
