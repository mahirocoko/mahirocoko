# Resonant Atlas

Resonant Atlas is an original browser-instrument frontend lab about the trace a gesture leaves across geometry, motion, and synthesized sound.

## Product contract

- **Primary object:** a spatial tone field that can be bent visually and plucked through a real control.
- **Signature relationship:** gesture → shared signal → geometry and sound → visible release.
- **Presentation shape:** proposition, architecture proof, coordinated score, three playable studies, production assurances, and a closing tone.
- **Website frame:** fixed desktop navigation, native modal mobile drawer, and a complete responsive footer directory with real page and instrument controls.
- **Audio boundary:** Web Audio is synthesized in real time and starts only after explicit user input. There are no recordings or autoplay.
- **Motion boundary:** semantic content is complete before animation. Reduced motion keeps every message and control, disables smooth scrolling, and settles the spatial field.
- **WebGL boundary:** the Three.js scene is decorative and replaceable. It caps DPR, pauses offscreen/when hidden, disposes resources, and has a composed DOM fallback.

## Architecture

- React owns semantic content, controls, and state.
- GSAP owns coordinated reveal and score progress; it does not own every visual change.
- Lenis is synchronized to the GSAP ticker on fine-pointer, non-reduced-motion devices. Native scrolling remains the touch/reduced fallback.
- Three.js owns one bounded hero scene with direct lifecycle and render-loop control.
- Web Audio owns opt-in synthesized tones behind one small engine.

## Commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm preview
```

## Review targets

- Desktop: 1440 × 1000
- Mobile: 390 × 844 and 320 × 700
- Normal and `prefers-reduced-motion: reduce`
- Keyboard focus and sound opt-in
- WebGL failure fallback and horizontal-overflow checks

Current learning translation is documented in [`docs/study-notes.md`](./docs/study-notes.md). The latest claimed desktop/mobile evidence and checks are in [`docs/qa/`](./docs/qa/).

This lab uses no copied brand assets, recordings, models, images, shaders, or source code.
