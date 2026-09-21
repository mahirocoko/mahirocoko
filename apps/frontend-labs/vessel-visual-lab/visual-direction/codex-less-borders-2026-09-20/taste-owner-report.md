# Vessel Visual Direction: Border Density Correction Author Report

## 1. Overview
In accordance with Mahiro's visual direction feedback (*"ส่วนตัวมองว่า อาจจะลด border ลง เช่นพวก badge เป็นต้น"*), this bounded authoring pass produces two standalone reference-edit image generation prompts. The goal is a paint and material correction that reduces redundant micro-border density to achieve Apple-like surface calmness while freezing all composition, hierarchy, typography, copy, imagery, Optic Blade anatomy, and product truth.

---

## 2. Generated Prompts & Artifact Hashes

| Artifact Path | SHA-256 Hash |
| :--- | :--- |
| `/tmp/vessel-website-less-borders.prompt.txt` | `9ad51520c510f4b93567fbc94106372565e10bc4ea80a9074ba053b7b498a80e` |
| `/tmp/vessel-app-less-borders.prompt.txt` | `be5300278b4399bcc1e936341a2cced54982bdfa188f21051cfa3cbe94a86be7` |

---

## 3. Compact List of Protected Invariants

### A. Website (`vessel-website-less-borders.prompt.txt`)
- **Direct Reference**: Strictly bound to `/Users/mahiro/Git/me/mahirocoko/apps/frontend-labs/vessel-visual-lab/visual-direction/codex-raw-2026-09-20/website/raw.png`.
- **Canvas & Framing**: Flat straight-on 2D desktop browser viewport at 1440x900 resolution; pure stark off-white background (`#FBFBFD`); no 3D device mockup or angled hardware chassis.
- **Composition & Geometry**: 56px fixed top navigation bar, 120px macro-space hero, centered headline and paragraph, dual pill button cluster, 1040x480px elevated preview card with 20px rounded corners, and bottom continuity guide (`01 / DIRECT METADATA AUDIT`).
- **Verbatim Copy**: All titles, descriptions, telemetry labels, byte numbers, and section markers are frozen exactly as in the accepted direction.
- **Typography**: Geometric neo-grotesque sans-serif with tight negative tracking (-0.035em), weights strictly 400 Regular and 500 Medium, tabular figures with slashed zeros.
- **Image Asset & Optic Blade**: High-resolution mountain range and lake reflection asset split vertically; razor-thin 1px vertical hairline; 28px circular frosted thumb grip with precision crosshair reticle.
- **Primary Actions & Palette**: Solid deep obsidian (`#0A0A0C`) buttons; color roles for text, warning amber, and verification emerald preserved.

### B. App (`vessel-app-less-borders.prompt.txt`)
- **Direct Reference**: Strictly bound to `/Users/mahiro/Git/me/mahirocoko/apps/frontend-labs/vessel-visual-lab/visual-direction/codex-raw-2026-09-20/app/raw.png`.
- **Canvas & Framing**: Single compact macOS utility window (680px by 440px) centered orthographically on neutral dark slate studio background (`#121214`).
- **Window Architecture**: Floating HUD window with 18px corner radius, deep ebonite glass substrate (`#16161A`), subtle 1px perimeter highlight stroke (`rgba(255, 255, 255, 0.12)`), deep drop shadow, and three authentic window controls.
- **Topology**: Two-column workbench (240px telemetry sidebar left, 440px optical inspection canvas right) and 52px bottom action bar.
- **Verbatim Copy**: All titles, metadata labels, dimensions, recipe labels, and action text are frozen exactly as in the accepted direction.
- **Typography**: Neo-grotesque sans-serif (400 Regular and 500 Medium); monospaced tabular figures with slashed zeros.
- **Image Asset & Optic Blade**: Sunset mountain range and lake reflection inspection asset; 1px vertical Optic Blade hairline at 55% horizontal position; center 28px frosted circle thumb grip with precision cyan reticle.
- **Interactive Controls**: Interactive squircle checkboxes (solid blue fill, white checkmarks); solid high-contrast pill action button (`#F5F5F7` fill, `#0A0A0C` text) "Drag Derivative to Destination ➔".

---

## 4. Targeted Border Reductions (Material & Paint Corrections)

### Website Surface:
1. **Category Badge**: Removed 1px outline stroke around `LOCAL SINGLE-ASSET PREFLIGHT`; converted to an unboxed capsule or soft neutral tinted pill with zero outline rim.
2. **Left Telemetry Badges**: Removed 1px hairline border strokes from `SOURCE: ORIGINAL (UNTOUCHED)`, `2560 × 1600 PX`, `8.4 MB`, `COLOR: DISPLAY P3`; rendered as borderless dark translucent frosted pills.
3. **Left Warning Badge**: Removed bright 1px amber border stroke from `12 METADATA TAGS DETECTED (EXIF / GPS / DEVICE)`; rendered as a borderless soft translucent amber wash pill (`rgba(255, 149, 0, 0.16)`) with crisp amber text.
4. **Optic Blade Badge**: Removed hairline border stroke around `P3 ➔ sRGB`; rendered as a borderless frosted translucent micro-capsule.
5. **Right Telemetry Badges**: Removed 1px emerald border strokes from `DERIVATIVE PREVIEW`, `1.2 MB (-85%)`, `COLOR: sRGB IEC61966`, `METADATA: STRIPPED`; rendered as borderless calm emerald/mint translucent tinted pills (`rgba(52, 199, 89, 0.14)`).
6. **Search Pill**: Removed visible hairline stroke on `⌘K Search`; converted to a quiet borderless tinted container.

### App Workbench Surface:
1. **Title Bar Badge**: Removed 1px outline stroke from `LOCAL ONLY`; converted to an unboxed monospaced tag or borderless soft translucent pill (`rgba(255, 255, 255, 0.06)`).
2. **Metadata Facts Box**: Removed 1px perimeter box around inspectable facts (`EXIF Geotag`, `Device`, `Software`); grouped cleanly via spacing and a borderless subtle tonal surface (`#141418` fill).
3. **Sidebar Privacy Badge**: Removed bright amber outline stroke from `3 Privacy Tags`; converted to a borderless soft translucent amber wash pill (`rgba(255, 159, 10, 0.16)`).
4. **Canvas Source Badge**: Removed 1px amber border stroke from `Display P3 (Wide Gamut)`; rendered as a borderless dark translucent pill with subtle amber tint fill.
5. **Optic Blade Micro-Capsule**: Removed outline stroke from `1.0× OPTIC BLADE`; rendered as a borderless dark frosted glass micro-capsule.
6. **Canvas Derivative Badge**: Removed 1px emerald border stroke from `sRGB IEC61966-2.1`; rendered as a borderless dark translucent pill with subtle emerald tint fill.
7. **Bottom Canvas Telemetry Strip**: Removed 1px hairline outline border from `Derivative: 1.1 MB (Saved 87%) • 0 Metadata Tags`; rendered as a borderless dark frosted glass pill (`rgba(16, 16, 20, 0.75)` with backdrop blur and soft shadow).
8. **Secondary Action Button**: Removed rounded-rectangle outline stroke from `Clear Deck (Esc)`; converted to a clean unboxed ghost button (plain muted text `#A1A1AA`, zero perimeter stroke).

---

## 5. Structural Boundaries Retained
Borders are strictly preserved where they communicate true structural and interactive boundaries:
- Top navigation bar 1px bottom divider (`#E5E5EA`) [Website]
- Elevated workbench preview card 1px outer hairline (`rgba(0,0,0,0.08)`) and ambient shadow [Website]
- Secondary button control hairline stroke on `View Technical Specs` [Website]
- Outer perimeter highlight stroke (`rgba(255, 255, 255, 0.12)`) and ambient shadow of floating macOS window [App]
- 1px vertical column divider (`rgba(255, 255, 255, 0.08)`) between sidebar and canvas [App]
- 1px horizontal hairline divider above bottom action bar [App]
- Razor-thin 1px vertical Optic Blade hairline and center circular thumb grip reticle [Both]
- Squircle checkbox boundaries in recipe checklist [App]
