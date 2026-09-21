# Vessel Visual Lab

Status: **Frontend interaction study — truthful product contract aligned**

Vessel is a provisional original macOS utility concept for inspecting one outgoing image or PDF, previewing explicit derivative transformations, and dragging the resulting derivative to its destination while leaving the original source untouched.

This lab delivers two static frontend studies inside an independently runnable Vite/React package, following the Less Borders v2 visual direction (reduced border density, micro-hierarchy via typography, tint, and optical spacing):

1. **Responsive Product-Marketing Study** (`/website/`): Editorial concept presentation featuring Header + Hero anatomy, interactive Optic Blade comparison with the shared mountain landscape asset, direct metadata audit sample, color gamut demonstration, 3-step derivative recipe concept, protected source invariant, 4-step lifecycle, technical evidence status table, honest limitations FAQ, and truthful CTAs.
2. **macOS Application Interface Study** (`/app/`): Interactive desktop study centered on the 680×440 Mac preflight instrument concept. Features 6 simulated operational states (Ready, Empty Deck, Inspecting, Unsupported Format, Source Modified, Destination Error), recipe checkbox controls with dynamic metric recalculation, keyboard-operable Optic Blade, Clear Deck, Load Sample Asset, and truthful drag-out simulation.
3. **Restrained Root Launchpad** (`/`): Lightweight index linking to both studies and the existing `/review/` evidence page.

## Direction Ownership & Visual Status

- Product direction: selected by Mahiro on 2026-09-20.
- Visual-taste owner: Agy/Gemini 3.8 Flash High.
- Product and visual advisor: GPT-6 Astra High.
- Image-generation provider: Codex native image generation.
- Implementation writer: Agy/Gemini 3.8 Flash High.
- Approval status: Only the Less Borders v2 raster reference direction is human-approved by Mahiro. Whole-surface frontend implementation review remains pending.

## Evidence & Contract Boundaries

### 1. Current UI Evidence
- Working frontend UI anatomy, responsive composition, and styling across desktop and mobile.
- Six simulated application lifecycle states demonstrating interface states and guards.
- Keyboard-operable Optic Blade slider comparing Display P3 sample against sRGB simulation.
- Reactive checkbox controls demonstrating dynamic derivative metric recalculation.
- Truthful simulation toasts and copy boundaries explaining that no filesystem modifications occur.

### 2. Intended Product Contract
- Local single-asset image/PDF preflight concept targeting PNG, JPEG, and single-page PDF.
- Expose available metadata, dimensions, byte size, and color-profile facts.
- Explicit user-selected derivative transformations: Strip EXIF & Location Tags, Convert Gamut to sRGB, and Optimize Delivery Copy.
- Protected Source Invariant: original source file must remain strictly untouched on disk.
- Ephemeral derivative creation with drag-out delivery directly to drop targets.
- Local-first architecture targeting zero network calls and zero telemetry.

### 3. Not Established Yet
- Native backend file processing and image transformation engines.
- True CoreGraphics, binary parser, or format re-encoding integrations.
- File system descriptor enforcement or OS-level read-only locks.
- Real OS pasteboard drag-promise (drag-out) implementation.
- Broad format support: RAW containers, animated formats, multi-page PDF reflow, and batch processing are out of scope.
- Automated or universal PII detection in image pixel data.

## Validation & Commands

Run within `apps/frontend-labs/vessel-visual-lab/`:

```bash
cp .env.example .env.local
# Set VESSEL_DEV_ALLOWED_HOSTS to the exact Tailscale or proxy hostname.

pnpm install
pnpm typecheck
pnpm test
pnpm lint
pnpm build
```

`VESSEL_DEV_ALLOWED_HOSTS` accepts a comma-separated hostname list. It is read by
the Vite config only and is not exposed to client-side code. Local values belong
in `.env.local`; `.env.example` documents the required setup.

## Model comparison archive

`comparisons/2026-09-21/` preserves the blind Cursor Kimi K3 Max versus Cursor
Grok 4.6 High first-shot comparison. It includes the exact shared prompt, raw
candidate source, candidate reports, browser-QA report, input hashes, and
Mahiro's tie verdict. Neither candidate is the canonical implementation.

## Structure

```text
apps/frontend-labs/vessel-visual-lab/
├── index.html                  # Root launchpad
├── website/                    # Product-marketing study (/website/)
│   ├── index.html
│   ├── main.tsx
│   ├── website-app.tsx
│   └── website-styles.css
├── app/                        # macOS application study (/app/)
│   ├── index.html
│   ├── main.tsx
│   ├── app-workbench.tsx
│   └── app-styles.css
├── src/
│   ├── launchpad/              # Launchpad components & styles
│   └── test/                   # Focused Vitest test suites
├── public/assets/
│   └── vessel-landscape.png   # Shared production visual asset
├── review/
│   └── index.html              # Visual direction review & provenance evidence
└── visual-direction/           # Codex raw & less-borders raw authority images
```
