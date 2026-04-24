# Learning: image models compress full-page UI

**Date**: 2026-04-24
**Tags**: gpt-image, ui-reference, frontend-design, uncodixify, spacing, typography

## Insight

Image models tend to optimize for a complete composition inside one fixed ratio. When asked to show a full landing page or many sections in one image, they usually compress spacing and padding before they drop content.

This means a generated image can look visually complete while still being a bad reference for page pacing.

## Practical rule

For UI reference generation, prefer section clusters over whole-page images:

- upper page: navigation, hero, first content band
- mid page: quote, gallery, protocol, supporting sections
- lower page: products, testimonial, journal, CTA, footer

If spacing is the problem, show fewer sections with more breathing room. Do not keep asking for a full-page image and expect the model to preserve scroll rhythm.

## Reuse

When updating prompt or skill doctrine, encode this as a workflow rule rather than only a style rule: split the generation unit before tightening adjectives.
