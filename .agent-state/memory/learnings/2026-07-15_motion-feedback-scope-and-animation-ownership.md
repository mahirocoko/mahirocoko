# Motion feedback scope and animation ownership

Tags: `frontend`, `motion`, `gsap`, `scrolltrigger`, `scope`, `hero`, `accessibility`, `qa`

## Durable lesson

Ambiguous design feedback inherits the currently active work lane.

If the conversation is explicitly about motion and the owner says a surface “overall still does not pass,” first interpret that as the complete motion experience—timing, sequencing, coverage, transitions, and settled state—not as permission to redesign composition, replace assets, or change product proof.

Before crossing from motion into anatomy/assets, ask one bounded question:

> Do you mean the overall motion sequence, or should I reopen the visual composition too?

## Motion ownership model

Do not force all animation through one mechanism.

- **Native View Transitions**: identity continuity between product card and PDP.
- **Dedicated load timeline**: first-viewport Hero where typography, media, rail, labels, CTA, and supporting proof must share one clock.
- **ScrollTrigger section timeline**: section heading/copy entrances.
- **Local viewport groups**: cards, rows, and footer content that would otherwise finish before entering view.
- **Surface-specific timeline**: Builder canvas/rail/modules/controls, where product mechanics determine choreography.
- **CSS state transition**: module attach/detach, hover, search replacement, nav/cart panel seating.

Tool choice follows this contract. CSS alone is enough for isolated state changes; GSAP is justified when sequencing, labels, responsive timelines, cleanup, and multiple dependent surfaces matter. Avoid ScrollSmoother and scroll hijacking unless separately required.

## Required motion QA states

For non-trivial motion, verify:

1. initial frame
2. meaningful mid-frame
3. settled frame and inline-style cleanup
4. fast scroll and back-scroll
5. viewport bottom reachability
6. mobile and narrow layout
7. `prefers-reduced-motion`
8. missing/failed image fallback
9. console warnings and overflow
10. focus/keyboard behavior where surfaces are interactive

Scope every PASS verdict to the exact surface and states reviewed.

## Browser-special spacing

`legend` does not always obey fieldset padding like an ordinary block. A `width: 100%` legend may touch or overflow the fieldset edge, and parent top padding may not create visible text inset. Give the legend direct spacing ownership (`width: fit-content`, explicit top/bottom padding) and verify rendered bounds rather than trusting the box model by inspection.

## Recovery rule

When a polished implementation was built from a scope misunderstanding:

1. acknowledge the exact interpretation error
2. expose keep/revert choices
3. follow the owner's selection
4. remove all unapproved assets/docs/code
5. verify no stale artifacts remain
6. continue on the corrected lane without defending sunk work

