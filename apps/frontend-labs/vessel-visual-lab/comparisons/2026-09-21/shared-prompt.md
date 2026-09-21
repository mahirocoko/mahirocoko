You are one independent visual implementation candidate in a blind two-model A/B comparison. Work only inside your current workspace. Do not inspect, read, search, write, or reference any parent/sibling/external workspace. Do not ask who the other model is and do not assume another candidate's decisions. Do not spawn subagents or reviewers, use image generation, browse the web, install dependencies, modify package versions, commit, push, or deploy.

MISSION
Create your own complete static-first frontend interpretation of Vessel as two coherent surfaces in this existing standalone Vite/React package:
1. A full responsive product-marketing website at `/website/`.
2. A full interactive macOS application-interface study at `/app/`.
Also create a restrained root launchpad at `/` linking both surfaces.

DIRECT VISUAL AUTHORITY
Before any code write, inspect both raw images directly with your available image-viewing capability:
- `references/website.png`
- `references/app.png`
If you cannot actually inspect both raw images, write `REPORT.md` with status `BLOCKED_RAW_REFERENCE_UNAVAILABLE` and stop before visual implementation. Do not replace unavailable images with a prose-derived visual summary.

The raw images are composition and visual-language authorities, not runtime page backgrounds. Rebuild the UI with semantic React/HTML/CSS. Use `public/assets/vessel-landscape.png` as the shared clean semantic image asset inside the real Optic Blade and inspection surfaces.

VISUAL OWNERSHIP
You own the implementation-ready visual interpretation from the raw references. Preserve their load-bearing character:
- Less Borders v2 restraint: hierarchy through spacing, typography, tint, opacity, and material rather than grids of outlined cards/badges.
- Off-white optical/editorial website.
- Deep ebonite compact macOS instrument.
- Restrained cyan, amber, and emerald status language.
- Optic Blade as the shared source/derivative signature.
Do not copy Apple branding, logos, proprietary imagery, SF Symbols, or claim SF Pro. Do not introduce a generic SaaS/card-grid design, oversized secondary headings, or unrelated aesthetic. No motion pass yet: static responsive composition must stand on its own.

PRODUCT TRUTH
Vessel is a provisional local single-asset preflight concept for PNG, JPEG, and single-page PDF. Intended product behavior:
- expose available metadata, dimensions, byte size, and color-profile facts;
- let the user select explicit derivative steps such as removing metadata/location tags, previewing sRGB conversion, and optimizing a delivery copy;
- preserve the original source as a required future native invariant;
- preview source versus derivative and drag the derivative out.
Current work is only a frontend visual/interaction study. All file facts, profiles, tag counts, sizes, savings, and error states are fictional samples/simulations. Do not claim implemented parsers, native filesystem behavior, real export, universal PII detection, universal format support, guaranteed safety, verified zero-network native behavior, hidden source mutation, Swift/Rust/CoreGraphics/Oxipng architecture, or a working download.

WEBSITE SCOPE
Create a complete story, not only a hero:
- header/navigation and a strong Header + Hero derived from the website reference;
- semantic Optic Blade proof using the clean landscape asset and visible sample/simulation labels;
- metadata/privacy audit demonstration with explicit fictional-sample disclosure;
- color/profile demonstration that says CSS preview is not native conversion proof;
- explicit derivative recipe and protected-source target invariant;
- stage → inspect → choose → drag-out lifecycle;
- local-first target boundary, intended input scope, and honest limitations/FAQ;
- truthful final CTA to open the app study, never a fake production download.
Recompose at desktop 1440px, tablet 820px, and phone 390px. Mobile must remain readable without whole-page horizontal overflow; do not merely shrink the desktop page.

APP SCOPE
Create a complete interactive study around the reference's compact 680×440 desktop-native workbench:
- preserve a realistic Mac-window instrument, source facts, recipe controls, Optic Blade, derivative telemetry, and source-protection target note;
- demonstrate at least six coherent states: Ready, Empty, Inspecting, Unsupported, Source Changed, Destination Unavailable;
- recipe checkboxes update sample derivative telemetry;
- Optic Blade works with pointer and keyboard;
- Clear Deck and Load Sample Asset work;
- derivative action shows a non-blocking notice that this frontend study creates/exports no file;
- status meaning does not rely on color alone;
- at 390px, deliberately frame/pan the desktop-native utility rather than pretending it is a mobile app;
- no label collision, clipped telemetry, hidden action, or whole-page overflow.

ENGINEERING CONTRACT
- Use the existing exact package versions and package manager. Do not install or change dependencies.
- React components/hooks are arrow functions. Authored interfaces use `I` prefixes. Filenames are kebab-case.
- No external font/CDN/runtime/network dependency. No Tailwind.
- Use semantic landmarks, real controls, labels, visible focus, accessible status announcements, correct heading order, and keyboard-operable comparison controls.
- Keep source files owner-local and focused. Create focused Vitest/Testing Library coverage for navigation/product-truth guards and app interactions.
- You may modify any file inside the current workspace except `references/**`, `public/assets/vessel-landscape.png`, `pnpm-lock.yaml`, and `node_modules`. Never write outside the current workspace.

VALIDATION
Run from this workspace:
- `pnpm typecheck`
- `pnpm test`
- `pnpm lint`
- `pnpm build`
Fix your own source/build/test defects within scope. Do not run browser automation or grade your own visual quality; the controller will render both candidates independently afterward.

REPORT
Write `REPORT.md` with:
- status;
- files created/changed;
- design interpretation and deliberate tradeoffs;
- command results;
- exact remaining limitations.
Do not mention or compare against any other candidate. Finish only after the report exists.
