# Whisperfield whole-page implementation evidence

Status: implementation candidate. Mahiro foreground acceptance remains open.

## Process correction

The previous report overclaimed whole-page fidelity after rebuilding only Header, Hero, Time, Agent, and Footer. Pricing foreground evidence disproved that claim: Writing, Privacy, Notes, Pricing, Hotkey, and Closing still used generic legacy anatomy.

This pass did not patch Pricing alone. It:

1. mapped every remaining VoiceOS section from the complete downloaded runtime and matched 1512/390 rendered captures;
2. rebuilt all six remaining sections as owner-local components;
3. recalibrated Time and Agent to the source's exact desktop/mobile vertical ownership;
4. reduced `src/app.tsx` to page composition;
5. replaced the legacy 3,000+ line stylesheet with a minimal global `base.css` plus the active fidelity contracts;
6. captured paired section evidence for the entire page.

The acceptance contract is `docs/qa/whole-page-parity-matrix.md`. Tests/build alone do not close foreground fidelity.

## Active source ownership

- `src/app.tsx` — composition only.
- `src/base.css` — reset, tokens, focus, screen-reader utility, and shared integration-icon atoms.
- `src/critical-fidelity.css` — active VoiceOS-shaped geometry/material/responsive/motion contracts.
- `src/components/hero-section.tsx`
- `src/components/time-savings.tsx`
- `src/components/agent-mode.tsx`
- `src/components/writing-section.tsx`
- `src/components/privacy-section.tsx`
- `src/components/field-notes.tsx`
- `src/components/pricing-section.tsx`
- `src/components/hotkey-section.tsx`
- `src/components/closing-section.tsx`
- `src/components/site-footer.tsx`

The superseded `src/styles.css` and legacy `writing-section`, `privacy-section`, `notes-section`, `access-section`, `hotkey-section`, `closing-section`, `section-intro`, and generic product-window DOM were removed rather than left underneath new overrides.

## Geometry evidence

VoiceOS target → Whisperfield candidate, in page order:

| Section | Desktop | Mobile 390 |
| --- | ---: | ---: |
| Hero | 900 → 900 | 844 → 844 |
| Time | 770 → 770 | 924.5 → 924.5 |
| Agent | 1000 → 1000 | 734.5 → 734.78 |
| Dictation | 924 → 924 | 986.25 → 987 |
| Privacy | 791.63 → 792 | 767.13 → 768 |
| Wall of Love | 680 → 680 | 620.38 → 621 |
| Pricing | 843.75 → 845 | 1115.5 → 1117 |
| Hotkey | 550 → 550 | 520.23 → 523.48 |
| Closing | 552 → 552 | 566 → 567 |
| Footer | 560 → 560 | ~534 → 534 |

Whole page:

- 1512px: 7,573px high; `scrollWidth === innerWidth`; overflow `0`.
- 390px: 7,621px high; `scrollWidth === innerWidth`; overflow `0`.
- 320px reduced motion: 7,795px high; overflow `0`.

## Browser state evidence

One Chromium session was used at a time and closed after each run.

- Navbar: full state has zero glass filter layers; compact state mounts one filter plus the complete four-layer glass stack at 672×76.
- Liquid CTA: hover computes `.975` compression and moves the detached shadow pseudo from 24px to 18px at opacity `1`.
- Agent: all six buttons become the sole `aria-pressed=true` scenario; manual selection exposes Play state.
- Dictation: visibility-gated `idle → shortcut → recording → typing → done`; recording state exposes app opacity `1` and a 102px pill; manual scenario selection persists.
- Privacy: General, Privacy, Profiles, and Advanced all select successfully.
- Wall of Love: pause sets `aria-pressed=true` and computed marquee play state `paused`; default duration is 95 seconds.
- Pricing: Annual defaults to `$11.99`; Monthly exposes `$29.99`; pricing contains zero links/checkout CTA.
- Hotkey: clicking `fn` sets pressed state and creates seven bounded speech bubbles.
- Closing: exactly three truthful external research links.
- Preview ZIP route: HTTP 200; archive integrity passes.
- Mobile menu: first link receives focus; Escape closes the panel and restores focus to the trigger.
- Reduced motion: Hero SMIL count `0`, seven static destination icons, Dictation readable completed app, Agent/Notes animation names `none`.
- Browser console: zero errors and zero warnings in final probes.

## Automated evidence

- ESLint: pass
- TypeScript: pass
- Vitest: 11/11 pass, including Dictation staging, all four Privacy tabs, Notes pause, and bounded hotkey reset
- Vite production build: pass
- ZIP integrity: pass
- HTML: `dist/index.html`, SHA-256 `aec2ac00f9def7ba56900767d158925db2ca0fddb404b3fb328c52c6f624b2f1`
- CSS: `dist/assets/index-Cm6-SWFK.css`, SHA-256 `8d014f1ccb65fec00db4641c13f2cd9d39ca523e6755f9a1b2b1ff2236a01ca1`
- JS: `dist/assets/index-C9V9YcoU.js`, SHA-256 `e76bfc85df0a5fedae58dc15a0709d3e4b928d2c925328868b59f660fb1b45c4`

Removing the dead legacy stylesheet reduced production CSS from the interim 109.83kB build to 59.67kB while preserving measured section geometry and zero overflow.

## Tracked rendered evidence

In every parity sheet, VoiceOS is the left column and Whisperfield is the right column. Branding, copy, media, proof identities, and downloadable assets are intentionally original.

| File | Coverage |
| --- | --- |
| `whole-page-parity-desktop-a.jpg` | Hero, Time, Agent, Dictation, Privacy |
| `whole-page-parity-desktop-b.jpg` | Wall, Pricing, Hotkey, Closing, Footer |
| `whole-page-parity-mobile-a.jpg` | mobile Hero, Time, Agent, Dictation, Privacy |
| `whole-page-parity-mobile-b.jpg` | mobile Wall, Pricing, Hotkey, Closing, Footer |
| `desktop-full-1512.png` | complete final desktop composition |
| `mobile-full-390.png` | complete final mobile composition |
| `mobile-reduced-full-320.png` | complete reduced-motion 320px composition |
| `glass-button-exact-contact-sheet.jpg` | detached shadow normal/hover ownership |
| `glass-header-transition-contact-sheet.jpg` | full/compact desktop/mobile navbar states |

Superseded pre-rebuild screenshots showing the old `$14`/card-CTA Pricing surface and generic legacy sections were deleted so they cannot be mistaken for current evidence.

## Independent review

- Full-page UI review: **PASS at BLOCKER/HIGH threshold** after reviewing every row of all four desktop/mobile parity sheets and source ownership. No unreviewed section was promoted into the verdict.
- Read-only verifier: pricing hierarchy/no-CTA, component extraction, minimal base ownership, Dictation staging, four Privacy tabs, 95s Notes contract, bounded hotkey, and semantic footer were verified from source. It correctly caught stale pre-rebuild QA imagery; those artifacts were deleted. Its height caveat was source-only because browser use was intentionally prohibited in that lane; the explicit rendered measurements and paired captures above provide the missing runtime evidence.

## Product and evidence limits

- Whisperfield is a fictional browser learning lab, not a working voice product.
- Pricing is a visual state only; there is no checkout, payment, subscription, authentication, or account behavior.
- Preview downloads contain only original authored/generated assets and documentation, never software or an installer.
- VoiceOS assets, customer identities, quotes, and installer behavior are not shipped by Whisperfield.
- Independent review does not replace Mahiro foreground acceptance, which remains the final visual gate.
