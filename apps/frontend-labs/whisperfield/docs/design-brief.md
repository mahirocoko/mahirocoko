# Whisperfield — VoiceOS anatomy study

## Current reality

- This is a standalone learning lab under `apps/frontend-labs/`, not a VoiceOS product, download mirror, or production service.
- Reference observed on 2026-07-19 at `https://www.voiceos.com/` through Playwright and HiroHiro QA control. HiroHiro captured every material section, computed button surfaces, and timed Agent/Dictation states.
- The reference is a roughly 7,600px white landing page with a fixed website frame and nine material sections: Hero, time-saving comparison, Agent Mode demo, Dictation Mode demo, privacy settings, testimonial rail, pricing, hotkey CTA, contextual closing CTA, then a directory footer.
- The downloaded production bundle was inspected after the first rendered pass exposed runtime-fidelity gaps. No VoiceOS source code, logos, screenshots, customer identities, testimonials, download links, app icons, or product assets are copied into Whisperfield; observed contracts are independently reimplemented with original content and assets.

## Design read

Build a high-fidelity anatomy and motion study for a fictional voice-workflow product called **Whisperfield**. Preserve the reference's calm Mac-product pacing, generous white space, centered hierarchy, liquid/glass button material, embedded product-demo windows, timed scenario choreography, and complete website frame. Replace the recognizable cloud/logo/app/testimonial asset system with original imagegen sources, a generated-and-redrawn mark, fictional avatar proof, licensed open-source icons, fictional demo copy, and HTML-authored product surfaces.

Taste thesis: Whisperfield should feel quiet, capable, and immediately understandable so a visitor can see voice moving work forward without the page becoming a copied VoiceOS skin, an AI dashboard, or a loud gradient SaaS landing page.

## Mode and composition strategy

- **Mode:** reference-driven learning lab.
- **Strategy:** preserve visible anatomy, button material, motion jobs, and proof pacing; adapt identity, media, copy, and implementation; reject copied assets, real-customer claims, executable downloads, payment behavior, and source-specific integrations.
- **Reference fit:** exemplary for calm full-page pacing and product-proof framing; unproven as a reusable visual identity outside this voice-product job.

## Keep / Adapt / Reject

| Reference anatomy | Decision | Whisperfield implementation |
| --- | --- | --- |
| Fixed desktop navigation and compact mobile menu | Keep | Original wordmark, internal anchors, accessible non-modal disclosure navigation |
| Full-viewport Hero with orbiting tool trail | Adapt | Inline animated text path, moving open-source icon trail, generated transparent cloud corners, waveform pill, and liquid download button |
| Before/after time-saving comparison | Keep | Original twelve-step to one-sentence planning example over a generated sky plate |
| Large Agent Mode window with selectable scenarios | Adapt | Visibility-gated six-scenario carousel with separate Calendar, Messages, Mail, Notes, Linear, and Search mini-app runtimes |
| Dictation demo plus auto-format side card | Adapt | Source-shaped Dictation Mode with two authored scenarios, staged cloud/app/pill runtime, dock, and Auto Formats card |
| Privacy settings over a dark media plate | Keep | Local-first settings tabs over an original generated night-sky plate |
| Auto-moving testimonial wall | Adapt | Fictional lab field notes with six generated fictional-avatar crops; no real people or external posts |
| Pricing comparison and monthly/annual toggle | Adapt | Clearly labelled demo access cards; no checkout or live commercial claim |
| Hotkey CTA and contextual closing CTA | Keep | Clickable `fn` visual demo with bounded speech bubbles, liquid preview-pack download, generated sunrise plate, and three contextual research links |
| Directory footer | Keep | Exact desktop/mobile row ownership, monospace three-group directory, centered original brand role, truthful copyright/utilities, and reference attribution |
| VoiceOS logos, customer identities/quotes, cloud pixels, app-icon files, installer, and source code | Reject | Never copied or fetched at runtime; equivalent roles are generated, authored, or imported from documented open-source packages |

## Structure

1. Fixed website frame
2. Hero — promise, generated mark/clouds, animated text path, moving integration trail, liquid download CTA
3. Time saved — old workflow versus one spoken instruction
4. Agent Mode — large product window and scenario controls
5. Dictation Mode — cloud product frame plus Auto Formats card
6. Privacy — four real tabs with visible settings-state changes
7. Field Notes — fictional marquee cards
8. Pricing — monthly/annual visual state, explicitly non-live and without card CTA
9. Hotkey demo — click the `fn` key to trigger a bounded local visual state
10. Contextual closing CTA with generated media and research links
11. Complete responsive footer

## Visual and interaction system

- Background: white with restrained warm-violet atmospheric glow only around media moments.
- Typography: system/SF-like stack; one strong display tier, calm body copy, compact labels.
- Typography calibration: VoiceOS evidence uses normal navigation tracking and `-.03em` for the 64px Hero heading. Whisperfield keeps major display/section headings near that role-specific value instead of the earlier `-.055em` to `-.09em` compression.
- Surfaces: white product windows, 1px cool-gray borders, restrained shadows, 16–22px radii.
- Asset replacement: six raw imagegen families produce the historical mark candidates, four alpha cloud corners, three atmospheric plates, and six fictional avatars. Foreground review superseded the initial field-furrow mark with an authored W-field family: compact dark/light SVGs plus dedicated full dark/light lockups. Product screenshots are rendered from the semantic runtime instead of generated UI text.
- Icons: Lucide ISC interface glyphs plus CC0 Simple Icons SVG data for descriptive example destinations; exact package/version/imports are documented.
- Buttons: 44px black header download, 68px animated liquid/glass CTA, source-sized 32px Dictation/Agent arrows, compact segmented billing toggle, and glass closing links.
- Motion: 35-second SVG text travel, a 30-second staggered cubic-Bézier icon runtime driven by `requestAnimationFrame` and `ResizeObserver`, independent 14–17-second cloud drift, liquid conic-border rotation, waveform/notch bars, visibility-gated 9.5–11-second Agent scenarios, 8.5-second staged Dictation cycle, 95-second testimonial marquee, and bounded `fn` speech bubbles. Reduced motion stops decorative/automatic lanes while preserving controls and a readable completed state.
- Hero flow anatomy: a clipped full-height text curve owns the left half, converges on an 88×40 central pill, and hands off to a dense 28px app-icon stream across the right half. Desktop uses all 17 authored integration roles; ≤540px uses a bounded seven-icon subset. The runtime interpolates the captured seven-point cubic path and edge fades instead of relying on the superseded CSS `offset-path` approximation.
- Time comparison contract: desktop panels are a fixed 470px high at a 30/70 ratio with 12px gap, 26px radius, a manually scrollable dotted step rail, and a separately owned Mac/notch result stage. Mobile becomes a 360px manual panel followed by a minimum-280px result panel.
- Agent contract: the shared 960px 16:10 frame owns wallpaper, dock, carousel, visibility observer, cycle timing, and progress. Six scenario-specific mini-app components own their own staged `idle → recording → processing → card → complete → done → flat` presentation rather than swapping copy inside one generic card. Arrow/pause targets are source-sized 32px while dot targets use a 24×32 inactive / 48×32 active rhythm.
- Whole-page vertical ownership is explicit rather than incidental: desktop section heights are 900 / 770 / 1000 / 924 / 792 / 680 / ~844 / 550 / 552; mobile is 844 / 924.5 / ~734.5 / ~986 / ~767 / ~620 / ~1116 / ~520 / ~566. Detailed contracts and acceptance status live in `docs/qa/whole-page-parity-matrix.md`.
- Website frame calibration: desktop uses the observed transparent 124px fixed frame, centered 1280px container, 32px/24px/16px outer rhythm, 76px inner row, 16px navigation, 32px action gaps, and 44px black CTA. Mobile retains the same frame hierarchy with a compact rounded dropdown instead of a full-screen replacement surface.
- Footer calibration: desktop owns exactly 180px directory + 320px brand + 60px copyright/utilities; mobile owns 312px two-column directory + 106px compact brand + 116px stacked bottom row. Whisperfield content/assets remain original while the closing anatomy follows the reference.
- Responsive: desktop media windows retain breadth; mobile becomes a vertical proof sequence without horizontal page overflow. Primary navigation remains available through the compact rounded disclosure panel.

## Product-truth boundary

- Whisperfield is fictional and the pricing/access surface is a visual demo only.
- Download buttons deliver a real ZIP containing only original generated/authored preview assets and a README. They never deliver software, an executable, or an installer.
- Buttons do not collect payment, authenticate, or claim production availability.
- Privacy copy describes the lab's fictional interface, not a real service guarantee.
- Field notes are fictional composites and visibly labelled as lab notes.

## Verification

- Unit tests: semantic page anatomy, navigation dialog, carousel states, privacy tabs, pricing state, and hotkey state.
- Commands: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.
- Browser: 1440×1000, 390×844, 320×700, reduced motion, mobile menu, Agent/Dictation timed and explicit states, privacy trusted click, pricing trusted click, liquid hover, hotkey active state, footer, ZIP route/integrity, console/network, and horizontal overflow.
- HiroHiro: every source and implementation section, computed button exports, timed Hero/Agent/Dictation states, open-source/download hrefs, and trusted interaction postconditions.
- Every verdict remains scoped; browser output cannot prove a native voice product.
