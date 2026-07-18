# Trionn architecture study → Resonant Atlas

## Evidence boundary

- **Codrops case study:** [The Architecture Behind Trionn: Coordinating GSAP, Three.js, Lenis, and Web Audio](https://tympanus.net/codrops/2026/07/15/the-architecture-behind-trionn-coordinating-gsap-three-js-lenis-and-web-audio/), published July 15, 2026.
- **Live reference:** [trionn.com](https://trionn.com/), observed July 18, 2026 at desktop 1440 × 1000 plus mobile 390 × 844 with reduced motion.
- **Source status:** the case study exposes selected snippets and file names, but no public source repository or reusable code license was established during this study. No Trionn code or assets were copied.
- **Retention:** project-shared implementation analysis only; article bodies, screenshots, fonts, models, images, audio, and client assets are not retained.

## Complete visible anatomy map

| Reference role | Decision | Resonant Atlas translation |
| --- | --- | --- |
| Navigation + explicit sound control | Keep | Stable section navigation and sound-off-by-default control; mobile keeps all three section links. |
| DOM proposition over a spatial hero | Adapt | Original tone field and instrument proposition; no Trionn symbol, copy, layout, or interaction sequence. |
| Shared interaction state across layers | Keep | One user gesture coordinates the bounded Three.js field, Web Audio tone, and visible study state. |
| Facts / studio proof | Adapt | Verifiable runtime facts: synthesis source, supported input, consent, and fallback behavior. |
| Selected work grid | Adapt | Three playable tone studies sharing one contract, each with its own rhythm and visual response. |
| Long Services image-sequence scroll | Reject | No 371-frame preload, video surrogate, or long asset-heavy pin. A lighter score uses one normalized progress value. |
| Reusable scroll choreography | Keep | GSAP owns section reveal and score progress; mobile and reduced motion use distinct settled behavior. |
| Continuous WebGL everywhere | Reject | One lazy scene only. Rendering pauses offscreen and when the page is hidden; WebGL loss reveals a DOM fallback. |
| Audio coupled to actual interaction | Keep | Short synthesized tones begin only after explicit consent; no autoplay or recorded effects. |
| Agency testimonials, awards, and client conversion | Reject | No invented social proof, service claims, leads, or commercial conversion contract. |
| Interactive footer spectacle | Adapt | A quiet closing tone reuses the existing instrument contract instead of introducing another render system. |
| Signature brand symbol and visual trade dress | Reject | Original rings, field diagrams, paper/ink/cobalt/vermilion/acid system, and product-specific copy. |

## Transferable architecture lessons

1. Give DOM, spatial rendering, timing, and sound explicit owners before synchronizing them.
2. Share normalized intent or progress—not implementation details—between layers.
3. Use one clock where timing must align, but do not force every transition into that clock.
4. Make expensive work lazy, visibility-aware, disposable, and independent from semantic content.
5. Treat sound as consented interaction feedback, not atmosphere that starts on load.
6. Branch mobile and reduced-motion behavior intentionally instead of scaling desktop values down.
7. Production polish comes from lifecycle and interruption handling as much as the visible effect.
