# Frontend Labs

Standalone frontend product and design experiments live here.

Each lab owns its runtime, package manager files, assets, tests, and product-specific documentation. This directory is an organizational collection, not a shared application workspace or design-system package.

## Labs

| Lab | Purpose | Status |
| --- | --- | --- |
| [`dovel-commerce`](./dovel-commerce/) | Premium modular-desk commerce proof with a configurable Three.js/GLB Builder | Accepted working lab |
| [`chiang-mai-journal`](./chiang-mai-journal/) | Thai-first contemporary Chiang Mai culture journal, working brand `รอยเมือง` | Completed Home + Chapter 01 first slice |
| [`nudge-gallery`](./nudge-gallery/) | Original interaction-study gallery with accessible previews and reduced-motion fallback | Initial working slice |
| [`resonant-atlas`](./resonant-atlas/) | Original browser instrument coordinating DOM, Three.js, GSAP, Lenis, and opt-in Web Audio | Review candidate |

## Current lab — Chiang Mai culture journal

Status: Home + complete Chapter 01 article implemented and verified with a responsive Codex image family. Chapters 02–04 remain intentionally unopened rather than presented as complete.

- **Working brand:** **รอยเมือง** — the journal reads Chiang Mai through marks made by hands, materials, lettering, use, and time. The name should visibly shape the issue/chapter spine rather than survive as a detachable logo treatment.
- **Product shape:** a Thai-first contemporary culture journal about Chiang Mai, not a generic tourism guide.
- **Editorial lens:** neighborhoods, makers, ordinary objects, signage, markets, studios, materials, and current city life rather than a temple–mountain–café checklist.
- **Visual direction:** Thai Modern Vernacular Editorial—warm print rhythm, controlled lacquer-red/indigo accents, strong Thai headline composition, assertive image crops, chapter-based reading, and one persistent issue/chapter spine.
- **Color hierarchy:** warm uncoated-paper and ink-black surfaces with lacquer red as the functional lead for issue markers, the chapter spine, current state, links, and primary actions. Deep indigo is a controlled secondary editorial tone, never a competing full-page accent.
- **Typography direction:** selected Maitree for Thai headlines, issue titles, and pull quotes with Anuphan Variable for body copy, captions, navigation, and metadata. Matched desktop/mobile specimens and the later whole-page hierarchy audit define the current scale contract.
- **Restraint boundary:** no ready-made Lanna ornament, luxury-gold nostalgia, OTOP styling, postcard collage, or English-first layout translated into Thai afterward.
- **Primary action:** enter the current issue, then open a feature story or visual essay.
- **Opening composition:** an open-issue spread. A narrow issue/chapter spine carries `รอยเมือง`, issue number, and Chiang Mai context; the Thai issue title crosses into the constructed cover collage, with a compact chapter index completing the first viewport. Mobile preserves the proof role as issue strip → title → collage → chapter index rather than shrinking the desktop spread.
- **First slice:** Home plus one complete feature article, enough to prove both issue composition and long-form Thai reading without pretending the full four-chapter issue exists.
- **Folder:** `apps/frontend-labs/chiang-mai-journal/` remains stable even if the working brand changes later.

### Issue 01 — เมืองที่ทำด้วยมือ

The first issue studies contemporary Chiang Mai through the people, materials, lettering, and in-between spaces that are still shaped by hand. It should feel observant and specific, not nostalgic or promotional.

Working chapter map:

1. **ตัวอักษรของเมือง** — hand-painted signs, storefront language, print, and everyday typography.
2. **มือที่ยังทำอยู่** — makers, repair work, small studios, and processes that remain physically legible.
3. **วัสดุที่เดินทาง** — wood, paper, clay, metal, and textiles moving between workshop, market, and home.
4. **พื้นที่ระหว่างทาง** — alleys, shophouses, markets, thresholds, and informal spaces connecting the city.

The chapter names and story inventory remain working editorial structure until real or explicitly fictional source material is defined.

### Completed Codex imagegen lane

Codex imagegen is implemented as production-tracked source work, not an optional mood-board step.

Selected and runtime-promoted image system: **constructed editorial collage + object studies**.

- Constructed city scenes provide spatial context through deliberate crops, paper boundaries, print texture, and visible editorial assembly rather than fake documentary realism.
- Object studies provide close, inspectable views of tools, materials, lettering fragments, surfaces, and signs of use.
- Both families must share one color/material/lighting grammar and support cover, chapter opener, visual-essay sequence, supporting crop, and mobile-safe roles.
- Generated people, businesses, interviews, and locations must remain clearly fictional composites unless separately grounded in real, sourced material.

1. Define an asset manifest before generation: editorial role, target section, ratio, crop/safe zone, source status, and desktop/mobile proof.
2. Generate original image families by role—hero/cover, feature story, visual essay, and supporting crops—rather than generating one full webpage and slicing it apart.
3. Keep Thai/English copy out of generated pixels; authored text stays semantic HTML. Any accidental generated lettering is a rejection or cleanup issue.
4. Preserve lane provenance and separate source generation, dicut/cleanup when needed, multi-background/crop QA, and runtime promotion.
5. Avoid copying a living artist's signature style or presenting invented documentary scenes as real Chiang Mai reportage. Generated imagery must be labelled and art-directed as fictional/editorial lab material.

## Adding a lab

```text
apps/frontend-labs/<site-slug>/
```

- Use a descriptive kebab-case folder name.
- Keep the lab independently runnable from its own directory.
- Keep product-specific components, assets, and visual language inside the owning lab.
- Add the lab to this index with a truthful status.
- Extract shared packages only after at least two labs prove the same reusable ownership boundary.
