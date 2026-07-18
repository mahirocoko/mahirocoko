# Resonant Atlas review evidence

Claimed review candidate captured from the production build on July 18, 2026. These files are implementation evidence, not human acceptance.

## Viewports and states

- `desktop-hero-1440x1000.png` — first viewport with the fixed desktop navigation and lazy Three.js field settled.
- `desktop-footer-1440x1000.png` — complete website footer with site directory, instrument controls, provenance, and utility row.
- `desktop-score-1440x1000.png` — shared-progress score body.
- `desktop-studies-1440x1000.png` — all three instrument studies and controls.
- `desktop-system-1440x1000.png` — architecture and runtime ownership section.
- `mobile-hero-390x844.png` — fixed compact navigation, proposition, action, and field entry.
- `mobile-drawer-390x844.png` — modal mobile navigation with site links, instrument controls, focus containment, and Escape close.
- `mobile-footer-390x844.png` — stacked mobile footer directory and utility controls.
- `mobile-studies-390x844.png` — single-column playable study rhythm.
- `mobile-reduced-webgl-fallback-320x700.png` — reduced motion plus forced WebGL context-loss fallback.

## Automated and browser evidence

- ESLint: pass, no issues.
- TypeScript: pass.
- Vitest: 5/5 pass.
- Vite production build: pass; semantic entry is 114.74 kB gzip and the lazy WebGL field is 136.20 kB gzip.
- axe-core 4.12.1: zero violations at 1440 × 1000, 390 × 844, and with the modal navigation open.
- Browser console: zero errors and warnings after production reload.
- Horizontal overflow: zero at 1440, 390, and 320 CSS pixels.
- Navigation: desktop header remains fixed at `top: 0`; mobile uses a native modal drawer, locks background scroll, closes with Escape, and restores focus.
- Reduced motion: no hidden reveal content; native scrolling remains active.
- Keyboard: the field control retains focus and arrow keys bend the field without scrolling the page.
- WebGL loss: context-loss event exposes the composed DOM fallback without hiding semantic content.
- Audio: sound remains off until explicit input; playing a study changes the pressed instrument to `Play again`.
