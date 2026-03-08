# Review Checklist

Use this for fast style review.

## File shape

- Is each file single-purpose?
- Are route files thinner after the change?
- Are extracted modules named by domain, not by convenience?

## Types and naming

- Do interfaces use `I` prefix?
- Do type aliases avoid `I` prefix?
- Are names specific enough to stand on their own?

## Boundaries

- Did reusable UI stay generic?
- Did config move to the right module?
- Is there one source of truth for route or nav metadata?

## I18n

- Did constants extraction preserve translation flow?
- Are strings still aligned with repo Lingui posture?

## Final smell test

- Does this look like a deliberate refactor or a pile of moved code?
- Would Mahiro immediately know where to edit the next change?
