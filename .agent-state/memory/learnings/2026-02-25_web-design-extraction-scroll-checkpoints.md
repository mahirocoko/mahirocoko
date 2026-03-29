# Web Design Extraction Works Better with Scroll Checkpoints

When recreating a live website in a design canvas, single screenshots are not enough. The most stable workflow is to capture multiple scroll checkpoints and map the page as a sequence of transitions, not isolated sections.

## Pattern
- Capture viewport references at consistent scroll intervals.
- Identify section boundaries and transition cues (hard cuts, peeking cards, interstitial text).
- Recreate structure and spacing first.
- Tune typography hierarchy second.
- Apply color and decorative fidelity last.

## Why it works
Many modern pages rely on perceived motion (sticky overlays, reveal cadence, pseudo-parallax). Even without implementing motion itself, the static composition at key scroll points contains enough information to reconstruct intent.

## Practical rule
If a block looks "off," do not immediately tweak colors. First verify:
1) vertical rhythm,
2) anchor points (top/center/bottom),
3) relative scale between heading, body, and containers.

Color correction should be the final pass.
