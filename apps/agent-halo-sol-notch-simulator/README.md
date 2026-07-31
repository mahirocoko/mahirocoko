# Agent Halo — Notch simulator landing

A self-contained Vite + React + TypeScript landing page for
[Agent Halo](https://github.com/mahirocoko/agent-halo), a local-first macOS
companion for Letta Code.

This standalone implementation combines the accepted Kimi visual direction
with a production-hardened interactive notch preview. Its visual language uses
a compact white header, centered moderate hero, orange accent, hairline
borders, soft shadows, seven-feature index, five proof stories, centered final
CTA, and compact footer. It has no runtime or build dependency on sibling
experiment apps.

## Production engineering pass

- Session state truth and independent Pomodoro timer truth are encoded as a
  focused discriminated union outside the rendering component.
- The radio controller keeps selection and focus synchronized for Arrow keys,
  Home, End, and pointer activation while respecting modifier shortcuts.
- State changes use one atomic polite status announcement; visible state copy
  is not also exposed as a competing live region.
- Every inherited proof image has intrinsic dimensions to reserve its exact
  aspect ratio before lazy loading.
- Escape closes the mobile navigation and restores focus to its trigger.
- K3's existing reduced-motion behavior covers reveal, glow, notch geometry,
  and state-content transitions.

## Simulator placement and anatomy

The simulator is a single compact section (`#preview`) placed between the
`Hero` and the `FeatureIndex`, with a **Preview** link added to the header
nav. It is one white proof-frame card in the same material language as the
page's `ShotFrame` screenshots:

- A light macOS menu-bar strip (off-white, hairline bottom border) with the
  app menu on the left and a local-bridge status on the right (both hidden on
  small screens).
- A black notch pill hanging from the strip's top-center — black because real
  MacBook notches are black; it is a small truthful element, not a dark
  section. It expands downward in place to show the selected state, with a
  compact 300ms size transition and a 250ms content fade.
- A radio-pill controller row beneath, and a live caption describing the
  selected state truthfully.

## Simulator truth boundaries

- **Clearly labelled preview.** The section heading, intro copy, and the
  figcaption all state it is a simulated, display-only preview — not a live
  Letta session and not connected to any real data.
- **Truthful states only.** The six states map to the real session status
  union in the Agent Halo desktop app
  (`apps/desktop/src/features/session/types.ts`: `idle | working | attention |
  done | error`) plus the independent local Pomodoro
  (`apps/desktop/src/features/pomodoro/`). Semantic colors are preserved:
  attention orange, done green, error red, working calm, idle muted. Pomodoro
  copy explicitly states it is a local timer independent of Letta session
  truth.
- **No fake control.** There are no Approve/Deny, kill-process, stop-timer, or
  end-session actions. The notch is display-only; the focus/navigation
  behavior of the real app is described in the Needs-attention caption as
  documentation, not offered as a working control.
- **Real proof intact.** The hero proof frame and all five proof rows still
  use the real browser-proof screenshots. The simulator is additive and
  erases no real product proof.

## Accessibility and mobile

- The controller is a `role="radiogroup"` of `role="radio"` buttons with
  `aria-checked`, roving tabindex, Arrow/Home/End keyboard navigation, and
  visible `focus-visible` rings.
- State changes are announced once through an atomic polite status region.
- All motion (scroll reveal, notch expand, content fade) collapses under
  `prefers-reduced-motion` via the page's existing global rule.
- At 390px the menu-bar extras hide, the notch is width-capped to the card,
  and the controller pills wrap — no horizontal overflow, no dashboard
  sprawl.
- Nothing auto-plays or steals focus; the initial state is a static
  "Working" preview.

## Commands

```bash
pnpm install
pnpm dev         # local dev server
pnpm typecheck   # tsc -b
pnpm lint        # eslint .
pnpm build       # typecheck + production build
pnpm preview     # serve the production build
```

## Asset provenance

All assets in `public/assets/` were copied from the Agent Halo source repository
(`mahirocoko/agent-halo`) and verified byte-for-byte during the design-to-
production pipeline. The promoted app is now self-contained; historical
comparison candidates are not required. These are Agent Halo's own materials:

| File | Source | Notes |
| --- | --- | --- |
| `agent-halo-app-icon-256.png` | `apps/desktop/assets/agent-halo-app-icon.png` | Real app icon, downscaled to 256px |
| `favicon-64.png` | `apps/desktop/assets/agent-halo-app-icon.png` | Same icon, 64px favicon |
| `screenshot-attention-open.png` | `.agent-state/qa/scorpion-runtime/attention-open.png` | Browser-proof capture: needs-input attention |
| `screenshot-sessions-working.png` | `.agent-state/qa/scorpion-runtime/long-llm-open.png` | Browser-proof capture: live working session |
| `screenshot-error-open.png` | `.agent-state/qa/scorpion-runtime/error-open.png` | Browser-proof capture: error/attention state |
| `screenshot-done-open.png` | `.agent-state/qa/scorpion-runtime/done-open.png` | Browser-proof capture: completed session |
| `screenshot-runtime.png` | `.agent-state/artifacts/local-services/runtime-processes-tabs-1280.png` | Browser-proof capture: Runtime tab |
| `screenshot-services.png` | `.agent-state/artifacts/local-services/services-top-level-web-frontends-1280.png` | Browser-proof capture: Services tab |

No TranslateAir text, screenshots, logos, badges, or other third-party assets
are used. The notch simulator is drawn with original markup and Tailwind
utilities; all icons are the page's original inline SVGs.

## Truthful limitations

- Agent Halo is an actively used personal macOS app, not a public packaged
  release. This page deliberately avoids download counts, ratings, customer
  claims, and any hosted-service wording.
- The screenshots are real local browser-proof captures of the app; final
  native behavior is validated in the installed Tauri app, not here.
- The notch simulator is a static, simulated preview. Its state contents are
  representative copy, not live data, and it performs no actions.

## Direction additions

1. New `#preview` section with the interactive notch simulator (above).
2. **Preview** link added to the header navigation (desktop and mobile).
3. Two new theme tokens (`--color-halo-red`, `--color-halo-red-soft`) so the
   Error state can use a restrained red; a `notch-pop` keyframe for the
   state-content entrance.
4. Package renamed to `agent-halo-sol-notch-simulator`.

Everything else preserves the accepted Kimi page's copy, structure,
components, and styling.

## Promotion evidence

- `pnpm typecheck`, `pnpm lint`, and `pnpm build` passed.
- Full-page desktop and 390px mobile comparisons between the locked K3
  direction and this production implementation had zero differing pixels.
- Working, Done, and Error state captures were pixel-identical. Remaining
  state differences were below repeated-capture browser nondeterminism.
- Keyboard state navigation, live announcements, mobile Escape/focus return,
  asset loading, overflow, and browser-console checks passed.
