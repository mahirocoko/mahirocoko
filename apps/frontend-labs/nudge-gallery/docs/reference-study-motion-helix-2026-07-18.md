# Motion Helix + Codrops study — session evidence

## Scope

Study the interaction-gallery product anatomy behind Motion’s Helix section and select bounded, original DOM/CSS/React adaptations for Nudge. This is a session-local reference study, not permission to copy Motion copy, photos, mechanism constants, prompt/spec content, brand, or commerce UI.

Observation date: 2026-07-18. Reference: `https://www.motionin.design/gallery/helix`.

## Live observations

| Unit | Observed evidence | Nudge decision |
| --- | --- | --- |
| Full-viewport primary demonstration | A labelled region presents a moving photo field before product prose. | **Adapt:** one original, focussed gallery demonstration as product proof. |
| Semantic prints | Individual moving prints are descriptive buttons in the accessibility tree. | **Keep:** each Nudge preview/detail remains keyboard-addressable; do not use canvas-only media. |
| Compact control cluster | More, Replay, Share, Copy Prompt, and save controls stay secondary to the stage. | **Adapt:** Replay resets decorative motion; Copy Prompt is direct and does not need a floating paywall. |
| Copy Prompt access path | Unauthenticated Copy Prompt opens commercial access overlay and a long `helix.md` preview. | **Reject product contract:** Nudge has free original prompts, a visible no-payment boundary, and no copied implementation spec. |
| Reduced motion | Emulation produced a composed stable stage with selectable prints. | **Keep:** reduced motion shows all content in a settled readable state. |
| Interaction risk | Continuous movement made automated hover targeting unstable; mobile still said “Hover a print.” | **Reject:** Nudge uses stable targets, tap/focus-equivalent selection, and device-neutral instructions. |

## Codrops evidence

| Source | Transferable claim | Decision |
| --- | --- | --- |
| [CSS Scroll/View Animations](https://tympanus.net/codrops/2024/01/17/a-practical-introduction-to-scroll-driven-animations-with-css-scroll-and-view/) | Enhance enters with `animation-timeline` only under feature and reduced-motion guards. | **Adapt:** readable static layout first; short reveal is progressive only. |
| [Sticky Section Animation Ideas](https://tympanus.net/codrops/2024/01/31/on-scroll-animation-ideas-for-sticky-sections/) | Stacking can focus one active artifact. | **Adapt narrowly:** prompt panel can be visually prominent without pinning navigation or copy actions. |
| [React Slider Parallax Hover](https://tympanus.net/codrops/2019/08/20/react-slider-with-parallax-hover-effects/) | Pointer CSS variables can add shallow depth over explicit control state. | **Adapt:** fine-pointer-only, bounded 2–6px visual depth, reset on leave. |
| [Consecutive Scroll Animations](https://tympanus.net/codrops/2024/11/20/consecutive-scroll-animations-with-one-element/) | Reversible sequences can make state legible. | **Reject mechanism:** no GSAP/Flip dependency; retain only an explicit, deterministic Replay action. |

## Original Nudge section map

| Nudge role | Keep / adapt / reject | Contract |
| --- | --- | --- |
| Gallery | Adapt | Six original named interactive sections, each with its own generated card image and free implementation prompt. |
| Detail | Adapt | Shareable route, stable live stage, short intent/constraint copy, and one selectable prompt panel. |
| Prompt copy | Adapt | Clipboard success/failure feedback plus visible selectable fallback. No gated copied prompts or commerce overlay. |
| Motion | Adapt | CSS/React visual enhancement, one meaningful interaction per section, Replay for decorative reset, and settled reduced-motion path. |
| Asset family | Adapt | Original Codex-generated Field Archive stills by independent role; no reference-image derivatives. |
| Pricing/paywall | Reject | Nudge is a learning lab, not a live marketplace. |

## Evidence limits

- Motion’s exact photo focus/centering, Replay timing, and prompt source are not reused or reverse engineered.
- Codrops article claims are cited as technique evidence; code, imagery, and distinctive demo composition are not reused.
- Current browser support for scroll-driven CSS is progressive-only; no Nudge comprehension or controls rely on it.
