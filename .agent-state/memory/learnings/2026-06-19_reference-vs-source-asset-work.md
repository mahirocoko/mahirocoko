---
tags: [asset-design, sprite-forge, reference-vs-source, gif-preview, codex-imagegen]
---
# Reference images are not source pixels by default

## Lesson

When Mahiro provides an image/GIF as a reference, treat it as style/mood/composition guidance unless he explicitly asks to reuse the actual pixels. A polished direct composite can still be wrong if the user's intent was “make something new in this direction.”

## Evidence from session

During the `mahirocoko` profile asset work, `public/r2z_Fm.gif` was added as a pixel-art environment reference. I initially used its autumn forest scene directly as the background for `cat-avatar.gif` and `mahiro-profile-card.gif`. Mahiro corrected that the GIF was only a ref and that the desired background should be new, closer in tone to `public/mahiro-profile-pixel-art.png`. The corrected pass generated/extracted a new moonlit sakura garden background plate and rebuilt the avatar/card from that.

## Future behavior

- Before producing assets, label each input as `reference`, `source material`, or `final/runtime asset`.
- If the user says “ref”, do not crop/composite/use the image directly unless asked.
- Prefer generating a new plate in the referenced style when the target asset is a background/card/avatar.
- Preserve provenance: do not claim imagegen produced a file unless an accessible file or extracted rollout payload exists.
- Keep project memory concise; put general asset/sprite lessons in focused reusable memory notes.
