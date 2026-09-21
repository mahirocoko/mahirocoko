# Vessel Browser-QA Comparative Report: Candidate A vs. Candidate B
**Date:** 2026-09-21  
**Lane:** Independent read-only browser QA (blind evaluation)  
**Scope:** Strict technical readiness disproof & contract verification across Candidate A (`http://127.0.0.1:8766`) and Candidate B (`http://127.0.0.1:8767`).

---

## 1. Test Matrix & Protocol

Evaluated in a serialized, clean Chrome DevTools session using exact viewport emulation matching real device metrics without synthetic full-page stitching:
- `/` at 1440×900 and 390×844
- `/website/` at 1440×900 (top, mid, bot slices after measuring `scrollHeight`), 820×1180, and 390×844 (top, mid, bot slices)
- `/app/` at 1440×900 and 390×844

---

## 2. Dimensions & Overflow Measurements

| Surface / Route | Viewport | Candidate A Dimensions (`clientWidth` × `scrollHeight`) | Candidate A Overflow | Candidate B Dimensions (`clientWidth` × `scrollHeight`) | Candidate B Overflow |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Launchpad (`/`)** | 1440×900 | 1440 × 900 (`scrollWidth`: 1440) | **PASS** (no horizontal or vertical overflow) | 1440 × 900 (`scrollWidth`: 1440) | **PASS** (no horizontal or vertical overflow) |
| **Launchpad (`/`)** | 390×844 | 390 × 844 (`scrollWidth`: 390) | **PASS** (clean single-column stack) | 390 × 844 (`scrollWidth`: 390) | **PASS** (clean single-column stack) |
| **Website (`/website/`)** | 1440×900 | 1440 × 4928 (`scrollWidth`: 1440) | **PASS** (no horizontal overflow) | 1440 × 3934 (`scrollWidth`: 1440) | **PASS** (no horizontal overflow) |
| **Website (`/website/`)** | 820×1180 | 820 × 4555 (`scrollWidth`: 820) | **PASS** (no horizontal overflow) | 820 × 4259 (`scrollWidth`: 820) | **PASS** (no horizontal overflow) |
| **Website (`/website/`)** | 390×844 | 390 × 5634 (`scrollWidth`: 390) | **PASS** (no horizontal overflow) | 390 × 4911 (`scrollWidth`: 390) | **PASS** (no horizontal overflow) |
| **App Study (`/app/`)** | 1440×900 | 1440 × 910 (`scrollWidth`: 1440) | **NON-BLOCKING DEFECT**: Minor 10px page vertical overflow (`scrollHeight` 910 > `innerHeight` 900) caused by scenarios pill row padding. | 1440 × 900 (`scrollWidth`: 1440) | **PASS**: Exact fit (900px `scrollHeight`), no page overflow. |
| **App Study (`/app/`)** | 390×844 | 390 × 947 (`scrollWidth`: 390) | **PASS**: Outer page has 0 horizontal overflow. Inner workbench scroller `.app-stage__scroll` has `scrollWidth: 680`, `clientWidth: 360`. Primary action is centered at `x: 285px` and immediately visible and reachable. | **NON-BLOCKING DEFECT**: Outer page `scrollWidth: 390`. Inner workbench scroller `.app-pan` has `scrollWidth: 680`, `clientWidth: 358`. Primary action button ("Drag derivative to destination") starts at `x: 477.4px`, rendering it **completely off-screen horizontally on initial load** until the user pans sideways. |

---

## 3. Console Signatures (Before & After Interactions)

### Candidate A (`http://127.0.0.1:8766`)
- **Initial Load (`/`, `/website/`, `/app/`)**:
  - `[debug] [vite] connecting...`
  - `[debug] [vite] connected.`
  - `[info] %cDownload the React DevTools for a better development experience...`
  - **Zero** 404s, **Zero** unhandled exceptions, **Zero** console warnings.
- **After Website & App Interactions**:
  - Remained clean across all interactions.
  - Zero unhandled errors during slider dragging, keyboard navigation, scenario switching, or derivative creation.

### Candidate B (`http://127.0.0.1:8767`)
- **Initial Load (`/`, `/website/`, `/app/`)**:
  - `[debug] [vite] connecting...`
  - `[debug] [vite] connected.`
  - `[info] %cDownload the React DevTools for a better development experience...`
  - **404 Resource Error on `/`**: `GET http://127.0.0.1:8767/favicon.ico [404 Not Found]` (`msgid=21`).
  - **Accessibility Issue on `/website/`**: `[issue] A form field element should have an id or name attribute (count: 1)` (`msgid=25`).
- **After Website & App Interactions**:
  - Radio buttons in `/app/` trigger accessibility warnings because `<input type="radio">` tags lack `id` attributes matching labels.
  - No fatal script crashes.

---

## 4. Interaction Outcomes

### A. Website Interactions

| Interaction Task | Candidate A | Candidate B | Findings / Comparison |
| :--- | :--- | :--- | :--- |
| **Optic Blade Keyboard Navigation** | Focused `.optic-blade__handle` (`role="slider"`). ArrowRight changed `aria-valuenow` 50 → 52 → 54. | Focused `.optic-blade__slider` (`role="slider"`). ArrowRight changed `aria-valuenow` 50 → 52. | Both support step-based arrow navigation and ARIA attribute synchronization. |
| **Optic Blade Pointer Interaction** | Pointer drag on container / handle dynamically recalculates slider position and sets style `left: 75%`. | Pointer drag on slider dynamically recalculates slider position and sets style `left: 75%`. | Both handle pointer input correctly. |
| **Same-Page Anchor Navigation** | Clicked `#faq` → jumped to `scrollY: 3844`. Returned to top (`scrollY: 0`). | Clicked `#faq` → jumped to `scrollY: 2905`. Returned to top (`scrollY: 0`). | Both pass anchor jump and scroll-to-top. |
| **FAQ / Disclosure Interaction** | Implemented as native `<details class="faq__item">`. Clicked to expand question "Is Vessel a finished product?" → exposed full answer text. | Implemented as static `<dl class="faq">` definition list (not expandable `<details>`). Opened `<details class="nav-more">` for mobile menu successfully. | Candidate A provides interactive collapsible FAQ items. Candidate B uses static `<dl>` for FAQ and `<details>` for mobile nav. |
| **App-Study CTA Resolution** | Resolves to `http://127.0.0.1:8766/app/` (all 4 CTAs tested). No third-party hosts or production promises. | Resolves to `http://127.0.0.1:8767/app/` (all CTAs tested). No third-party hosts or production promises. | Both pass CTA resolution truthfully. |
| **Disclosures & Simulation Truth** | Explicit copy visible: *"Fictional sample. The derivative side is a CSS-simulated preview — no file is rendered, converted, or exported by this study."* | Explicit copy visible: *"Fictional sample for this frontend study. Facts are simulated, not parsed from disk... The split preview is a CSS filter on the same PNG."* | Both pass simulation disclosures clearly. |

### B. App Interactions & Six Required States

| State / Feature | Candidate A (`http://127.0.0.1:8766`) | Candidate B (`http://127.0.0.1:8767`) | Defect / Difference |
| :--- | :--- | :--- | :--- |
| **Ready** | Status: `● Ready — source protected`. Textual meaning explicit. Full telemetry displayed. Primary button: "Create derivative copy" enabled. | Status: `Ready. Sample asset staged.` Textual meaning explicit. Primary action: "Drag derivative to destination" enabled. | **DEFECT on Candidate B**: Candidate B's telemetry string inside Optic Blade (`.telemetry`) overflows container `.optic-blade` by 112px on the left (`leftDiff: 112px`), causing the text "Derivative: 1.1 MB (" to be clipped off. |
| **Empty** | Status: `○ Empty — load a sample to begin`. Source card displays placeholder and "Load Sample Asset" button. Blade shows "No source on the deck". | Status: `Empty. Fictional sample...` Workbench shows empty well with "Load sample asset" button. | Both pass. |
| **Inspecting** | Status: `◌ Inspecting — reading metadata…`. Optic blade shows cyan overlay with text "Inspecting…". Timed simulation lasts 900ms before auto-transitioning to Ready. | Status: `Inspecting sample facts… no parser is running. This is a simulated hold state.` Persistent hold until radio change. | Both provide clear textual indicators of inspecting state. |
| **Unsupported** | Status: `▲ Unsupported — PNG, JPEG, single-page PDF only`. Blade placeholder shows amber notice: "Unsupported type: TIFF is outside this study's PNG · JPEG · single-page PDF scope." Source card shows `field-notes.tiff`. | Status: `This staged sample is treated as unsupported...` Banner: "Unsupported in this concept — Intended input scope: PNG, JPEG, and single-page PDF." Source file shows `album-spread.pdf`. | Both pass with textual warning icons and unambiguous explanations. |
| **Source Changed** | Status: `▲ Source changed — re-inspect before deriving`. Blade overlay shows amber badge: "Source changed — re-inspect". Primary derivative action disabled. | Status: `Source changed. Fictional sample...` Top banner: "Source changed — staged facts may be stale. Reload the sample. Simulation only." | Both pass. |
| **Destination Unavailable** | Status: `▲ Destination unavailable — choose another folder`. Note above button: "Destination: ~/Exports — unavailable". Primary button disabled. | Status: `Destination unavailable. Fictional sample...` Top banner: "Destination unavailable. This browser study has nowhere to drop a file." Drag action disabled. | Both pass. |
| **Recipe Toggles & Telemetry** | Toggling each of the 3 recipe checkboxes updates telemetry dynamically in a dedicated panel without clipping. | Toggling checkboxes updates telemetry text string dynamically. | **DEFECT on Candidate B**: As noted, telemetry string is styled with `white-space: nowrap` and is clipped by 112px on the left edge inside the 680px window. |
| **Clear Deck & Load Sample** | Clicking "Clear Deck" resets deck to Empty state. Clicking "Load Sample Asset" initiates inspection and populates source asset. | Clicking "Clear deck (Esc)" resets deck to Empty. Clicking "Load sample asset" returns to Ready. | Both pass. |
| **Derivative Export Notice** | Clicking "Create derivative copy" presents a non-blocking toast notice: *"Frontend study — no file is created or exported. In the target design, the original would stay exactly where it is."* with dismiss button. | Clicking "Drag derivative to destination" in Ready state displays inline notice: *"This frontend study creates and exports no file."* | Both truthfully disclaim file generation in non-blocking manner. |
| **390px Mobile Viewport Framing** | Outer page has 0 horizontal overflow. Inner scroller contains 680px window. "Load Sample Asset" / primary buttons are positioned within initial viewport (`x: 285px`). | Outer page has 0 horizontal overflow. Inner scroller contains 680px window. Primary action button is placed at `x: 477.4px` (outside the 390px viewport width), requiring horizontal pan to discover and click. | Candidate A primary action is reachable without panning; Candidate B requires sideways scroll to reach the action. |

---

## 5. Product Truth Findings

Neither candidate presents mock parsers, filesystem access, export capabilities, download links, network zero-proof, or native architecture as shipped facts:
- **Candidate A**:
  - Landing: *"A local-first preflight concept for PNG, JPEG, and single-page PDF — presented as two frontend studies. All file facts are fictional samples; nothing here parses, creates, or exports a real file."*
  - Website: *"Fictional sample. The derivative side is a CSS-simulated preview — no file is rendered, converted, or exported by this study."*
  - App: *"Frontend interaction study — simulated states and fictional samples. No file is parsed, created, or exported."*
- **Candidate B**:
  - Landing: *"A local single-asset preflight concept. Two surfaces, one shared landscape, no production download. Facts are simulated, not parsed from disk."*
  - Website: *"Does this parse my files? No. Every dimension, tag count, and saving figure is a fictional sample."*
  - App: *"This frontend study creates and exports no file."*

---

## 6. Screenshot Manifest

Evidence captured and archived under `/tmp/vessel-cursor-ab-browser-qa-2026-09-21/`:

### Candidate A (`candidate-a/`)
1. `landing-1440x900.png` — Launchpad at 1440×900
2. `landing-390x844.png` — Launchpad at 390×844
3. `website-1440x900-top.png` — Website top slice at 1440×900 (`scrollY: 0`)
4. `website-1440x900-mid.png` — Website middle slice at 1440×900 (`scrollY: 2014`)
5. `website-1440x900-bot.png` — Website bottom slice at 1440×900 (`scrollY: 4028`)
6. `website-820x1180.png` — Website at 820×1180
7. `website-390x844-top.png` — Website top slice at 390×844 (`scrollY: 0`)
8. `website-390x844-mid.png` — Website middle slice at 390×844 (`scrollY: 2395`)
9. `website-390x844-bot.png` — Website bottom slice at 390×844 (`scrollY: 4790`)
10. `website-optic-blade.png` — Optic blade keyboard/pointer interaction
11. `website-faq-open.png` — Collapsible FAQ `<details>` opened
12. `app-1440x900.png` — App desktop instrument at 1440×900
13. `app-390x844.png` — App framed inner scroller at 390×844
14. `app-state-ready.png` — Ready state with populated source and telemetry
15. `app-state-empty.png` — Empty deck state with prompt
16. `app-state-inspecting.png` — Inspecting state with overlay and spinner symbol
17. `app-state-unsupported.png` — Unsupported TIFF scenario with amber indicator
18. `app-state-source-changed.png` — Staged asset changed warning
19. `app-state-destination-unavailable.png` — Destination error warning
20. `app-export-notice.png` — Non-blocking derivative notice toast

### Candidate B (`candidate-b/`)
1. `landing-1440x900.png` — Launchpad at 1440×900
2. `landing-390x844.png` — Launchpad at 390×844
3. `website-1440x900-top.png` — Website top slice at 1440×900 (`scrollY: 0`)
4. `website-1440x900-mid.png` — Website middle slice at 1440×900 (`scrollY: 1517`)
5. `website-1440x900-bot.png` — Website bottom slice at 1440×900 (`scrollY: 3034`)
6. `website-820x1180.png` — Website at 820×1180
7. `website-390x844-top.png` — Website top slice at 390×844 (`scrollY: 0`)
8. `website-390x844-mid.png` — Website middle slice at 390×844 (`scrollY: 2034`)
9. `website-390x844-bot.png` — Website bottom slice at 390×844 (`scrollY: 4067`)
10. `website-optic-blade.png` — Optic blade keyboard/pointer interaction
11. `website-faq-open.png` — Mobile menu `<details>` opened
12. `app-1440x900.png` — App workbench at 1440×900 (displays telemetry clipping)
13. `app-390x844.png` — App workbench at 390×844 (primary action off-screen to right)
14. `app-state-ready.png` — Ready state
15. `app-state-empty.png` — Empty state
16. `app-state-inspecting.png` — Inspecting simulated state
17. `app-state-unsupported.png` — Unsupported asset state
18. `app-state-source-changed.png` — Stale source warning banner
19. `app-state-destination-unavailable.png` — Destination unavailable banner
20. `app-export-notice.png` — Non-blocking export notice

---

## 7. Categorized Findings

### Candidate A (`http://127.0.0.1:8766`)
- **BLOCKING DEFECTS**: **None**.
- **NON-BLOCKING DEFECTS**:
  - **Minor Vertical Overflow on App Study**: At 1440×900, `/app/` outer document has `scrollHeight: 910px` (10px excess), producing a slight vertical scrollbar on the outer viewport.
- **PASS**:
  - Clean console across all routes and interactions (0 errors, 0 warnings).
  - No horizontal overflow on any route at any viewport.
  - Optic blade operates smoothly via keyboard (2% increment) and pointer drag.
  - Interactive collapsible FAQ items.
  - All 6 app states provide clear textual meaning and distinct icons (`○`, `◌`, `●`, `▲`).
  - Recipe toggles cleanly update 3 separate telemetry rows without clipping or layout shift.
  - Primary button reachable immediately on 390px viewport without horizontal panning.
  - Non-blocking export disclosure truthfully disclaims file creation.

### Candidate B (`http://127.0.0.1:8767`)
- **BLOCKING DEFECTS**: **None**.
- **NON-BLOCKING DEFECTS**:
  - **Telemetry Text Clipped by 112px in App Study**: In `/app/`, the single-line telemetry string (`Derivative: 1.1 MB (saved 87%) · 0 metadata tags...`) is placed with `white-space: nowrap` inside the Optic Blade container (`overflow: hidden`). The caption's left edge starts at `x: 471.9px`, while the container left is `x: 584px`, clipping 112px of text on the left ("Derivative: 1.1 MB (").
  - **404 Console Error on Launchpad**: `/favicon.ico` returns HTTP 404 on `/`.
  - **Accessibility Console Warnings**: Missing `id` attributes on form elements / radio inputs on `/website/` and `/app/`.
  - **Mobile 390px Primary Action Off-Screen**: At 390×844 in `/app/`, the primary action button ("Drag derivative to destination") starts at `x: 477.4px`, rendering it completely outside the 390px initial viewport. Users must discover and scroll the inner `.app-pan` scroller horizontally to locate the action.
- **PASS**:
  - Zero whole-page horizontal overflow.
  - Optic blade keyboard arrow keys and pointer drag functional.
  - All 6 required app states present with explicit textual descriptions.
  - Clear deck and load sample workflows functional.
  - Truthful product disclosures on all surfaces.
