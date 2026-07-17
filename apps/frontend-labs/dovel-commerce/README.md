# DOVEL Commerce Lab

A standalone fictional commerce concept that tests a complete premium storefront and a web-native modular desk configurator.

Collection path: `apps/frontend-labs/dovel-commerce/`

> **Working name only:** DOVEL has not received legal, trademark, domain, or store-name clearance. This is not a live store and no checkout or payment exists.

## Brand read

- **Brand:** DOVEL — modular desk objects.
- **Tagline:** Objects that click into focus.
- **Product object:** one slim desk-edge rail plus Arc Dock, Halo Light, and Pocket Tray modules.
- **Signature relationship:** modules stay visually and behaviorally attached to the same rail while configuration changes around them.
- **Material language:** bead-blasted graphite and warm silver aluminum, pale ash, restrained vermilion attachment detail.
- **Restraint boundary:** no Apple imitation, fake macOS windows, glassmorphism, decorative dashboards, bento grids, or effect stacking.

## Product truth

Everything here is fictional concept content. Product dimensions, prices, policies, material construction, compatibility, and service behavior exist only to make the commerce flow testable. They are not manufacturing, certification, sustainability, warranty, shipping, or legal claims.

## Functional inventory

- responsive commerce header and mobile navigation
- search dialog with filtering, focus return, and Escape handling
- product collection with finish selection and add-to-bag
- Starter 01 buying-path bridge with rail, module, desk-fit, compatibility, and concept-total guidance
- product-detail dialog with specifications, compatibility, finish choice, and cart handoff
- application-style System Builder with rail sizes, finishes, module toggles, live total, and a real configurable Three.js/GLB product preview
- native shared-object card ↔ detail transitions plus deterministic hero/rail seating feedback
- dedicated Hero timeline coordinating masked typography, product-card seating, rail/latches, CTA/spec, and system note
- GSAP + ScrollTrigger section choreography with masked typography lines, bounded staging, and one-shot viewport triggers
- local motion groups for offer cells, product cards, Builder mechanics/controls, materials, search replacement, mobile navigation/cart, and PDP content lock-in
- cart drawer with quantity, remove, subtotal, empty state, focus handling, and disabled concept checkout
- product-led finish/mechanical-seat proof, restrained field notes, prototype policy, and footer information surfaces
- image loading/failure fallback, reduced-motion path, keyboard focus, desktop and mobile layouts

## Interaction evidence

Codrops influenced the mechanism-level principles of **state continuity** and **one coherent motion relationship**: an object should remain identifiable while selection or layout changes around it, and motion should clarify section hierarchy rather than stack spectacle. DOVEL adapts those principles through the native View Transitions API for product card ↔ detail continuity, a real GLB-backed Three.js Builder preview, short authored seating/latch feedback, and pinned GSAP + ScrollTrigger choreography for one-shot section introductions. ScrollTrigger does not scrub typography or own scrolling; there is no ScrollSmoother, scroll hijacking, or copied Codrops animation sequence. Unsupported WebGL uses the prior CSS concept geometry, unsupported View Transition browsers fall back to immediate state changes, and `prefers-reduced-motion` removes pointer parallax and settles model/configuration changes immediately.

## Product assets

Runtime product assets:

- `public/assets/products/arc-dock.webp`
- `public/assets/products/halo-light.webp`
- `public/assets/products/pocket-tray.webp`
- `public/assets/models/dovel-system-01.glb`

The contract and generation prompts live in `docs/asset-manifest.md` and `docs/imagegen-prompts.md`. The three card renders were generated independently with Codex image generation, visually inspected, checked in desktop/mobile crops, and then promoted. The first combined hero candidate was rejected for product-family and mobile-crop drift; two multi-reference V2 attempts were blocked by the image-edits transport. The first viewport therefore composes the three accepted product renders around an authored rail instead of promoting a rejected hero. Every image surface retains an intentional CSS fallback and never shows a broken-image icon.

## Commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm model:build
pnpm model:check
pnpm typecheck
pnpm test
pnpm build
```

Development runs at `http://localhost:4176`.

## Verification targets

- 1440×1000 desktop
- 390×844 mobile
- product finish and add-to-bag flow
- configurator state, total, and cart handoff
- search, cart focus return, Escape, quantity, remove, empty state
- missing product images
- `prefers-reduced-motion: reduce`
- no horizontal overflow or console errors
