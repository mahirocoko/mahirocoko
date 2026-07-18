# Website frame is product anatomy

**Date**: 2026-07-18  
**Tags**: frontend-design, website-frame, navigation, mobile-drawer, footer, rendered-qa, human-review

## Lesson

For a full-page website, “whole-page anatomy” must include the **website frame**:

- header/navigation behavior across top and scrolled states;
- a mobile navigation equivalent rather than hidden desktop links;
- drawer/menu interaction truth, including Escape, focus return, and scroll lock;
- footer information architecture that closes the site’s real navigation, utility, trust, provenance, contact, or legal needs.

A visually polished Hero-to-CTA sequence can still feel incomplete when its navbar is only an opening brand strip or its footer is only metadata. This is not a mandate to use the same navbar/footer pattern everywhere. The durable rule is to choose the frame intentionally from the product job and prove it at desktop/mobile states.

## Evidence

Resonant Atlas initially passed automated checks and an independent visual review, but Mahiro accepted the creativity while rejecting the navbar and footer as insufficiently website-like. The corrected fixed desktop navigation, native modal mobile drawer, and full responsive footer resolved the mismatch without changing the accepted central composition.

## Procedure

1. Add `Header/Nav` and `Footer` to the pre-code Keep/Adapt/Reject map.
2. Record static/sticky/fixed ownership and why.
3. Record the mobile equivalent and interaction contract.
4. Define the footer’s truthful closing jobs; do not add unsupported contact/legal/trust content.
5. Capture top, meaningful scroll, mobile closed/open, desktop footer, and mobile footer evidence.
6. Keep human acceptance separate from agent-claimed readiness.

## Durable destination

Promoted to `mahiro-skills` `frontend-design` in v0.1.64 as the Website Frame Gate. `studying-codrops` remains unchanged because the research workflow was not the failing owner.

