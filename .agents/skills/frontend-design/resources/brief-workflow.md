# Frontend Design Brief Workflow

This workflow keeps `frontend-design` intentionally judgment-led.

The script may list assets, compose prompt stacks, and print a brief scaffold. The agent does the design work: reading references, naming the page job, deciding what to inherit, filtering generic AI aesthetics, and translating the result into implementation constraints.

## Operating principle

```txt
script = scaffolding
docs = judgment
agent = synthesis
```

Do not turn `brief` into a heuristic extractor, design scorer, or taste classifier. If a future change starts adding complex inference rules to `scripts/main.ts`, move that behavior back into this workflow document unless it is purely deterministic file handling.

This mirrors the healthiest public skill patterns: keep the entrypoint small, load detailed references only when relevant, use scripts for deterministic mechanics, and leave taste/workflow judgment in Markdown instructions.

## Inputs

- Canonical prompt assets: `resources/prompt-assets/design-prompts.json`
- Reusable prompt fragments: `resources/prompt-assets/design-skill-prompts.json`
- Optional handoff: workspace-local product/context notes or skill-local sample handoffs
- Optional references: workspace-local reference files or bundled excerpts under `resources/reference-excerpts/`

References are evidence, not canon.

## Manual synthesis sequence

1. **Name the job** — decide whether the work is a hero, landing page, feature section, branding board, mobile screen, motion piece, or asset-backed composition.
2. **Extract anatomy** — from references, keep structure: section order, typography roles, media roles, motion purpose, responsive constraints, and component responsibilities.
3. **Reject aesthetic leakage** — do not copy liquid glass, pill navigation, cinematic dark SaaS, giant video hero, glow, hover-scale, or “premium” gradients just because they appear in a reference.
4. **Write the brief** — convert the prompt stack and references into an implementation direction with IA, design-system cues, media guidance, asset needs, and constraints.
5. **Route specialist work** — use `uncodixify` for taste cleanup, `asset-designer` for asset packs/manifests, and `web-asset-prompts` for individual generated-image prompts.

## Reference review checklist

Before implementation, review every reference with this split:

| Decision | Question | Default |
| --- | --- | --- |
| Keep | Does this improve page job, hierarchy, comprehension, or brand clarity? | Keep structural ideas, not decoration. |
| Reject | Is this an AI-default flourish such as liquid glass, pill nav, glow, generic dark SaaS, or hover scale? | Reject unless the product explicitly requires it. |
| Route to asset-designer | Does this imply multiple media files, crop variants, foreground/background layers, shadows, or delivery formats? | Make an asset plan first. |
| Route to web-asset-prompts | Does this need one generated image, cutout, background, or card image prompt? | Write a focused per-asset prompt. |
| Route to uncodixify | Does the brief inherit visual moves that may look generated? | Filter after intent is clear. |

If a reference contains an exact implementation recipe, decide whether it is **structure**, **asset requirement**, or **style leakage** before copying it into an implementation prompt.

## Reference corpus posture

Use bundled non-canonical excerpts or external prompt corpora as references for **specificity**, not taste.

Borrow:

- explicit section contracts
- font and type-role clarity
- media/background role descriptions
- motion timing and fallback detail
- implementation constraints that prevent ambiguity

Do not borrow by default:

- liquid-glass as a universal material
- rounded/pill navigation as a default
- cinematic dark SaaS styling
- huge decorative video heroes
- hover scale as a routine interaction
- generic “premium” glow/gradient systems

## Manual example: `velorah-anatomy.md`

Reference: `resources/reference-excerpts/velorah-anatomy.md`

Keep as anatomy:

- single-screen hero job with clear nav / headline / support copy / CTA roles
- explicit media role for a full-viewport background video
- font role split: display face for logo/headline, body face for nav/copy
- concrete responsive hierarchy notes for headline sizing and supporting copy
- fade-rise timing as a simple entrance sequence

Reject or reinterpret:

- `liquid-glass` navigation and CTA as a default material
- `rounded-full` CTA/nav treatment unless brand requires a pill system
- hover `scale-[1.03]` as routine interaction
- giant cinematic video hero if the product needs content density or accessibility over atmosphere

Route:

- background video role -> `asset-designer` if the project needs media sourcing, poster frames, crops, or fallbacks
- single poster/background generation -> `web-asset-prompts`
- final UI pass -> `uncodixify` to prevent glass/pill/cinematic defaults from leaking into canon

## Manual example: `liquid-glass-agency-anatomy.md`

Reference: `resources/reference-excerpts/liquid-glass-agency-anatomy.md`

Keep as anatomy:

- high-specificity token block showing how fonts, colors, radius, glass variables, and media URLs were declared
- distinction between subtle and strong material variants, even if the material itself is rejected
- explicit asset/media inventory for hero, start, stats, and CTA/footer sections
- multi-section landing-page decomposition with implementation constraints

Reject or reinterpret:

- `--radius: 9999px` as a global default
- liquid glass as the core visual language
- repeated blur/glass variants across all sections
- luxury/editorial/dark premium framing unless that is the actual brand direction

Route:

- media inventory -> `asset-designer` for poster/fallback/crop/delivery planning
- individual generated backgrounds or posters -> `web-asset-prompts`
- material/radius/interaction cleanup -> `uncodixify`

## Output expectation

A good brief should let an implementer answer:

- What is the page or section supposed to do?
- Which reference parts are structural and which are just style?
- What visual system is intended?
- What media/assets are needed and who owns them?
- What AI-default moves must be filtered out?
- What implementation constraints must not be invented?

If those answers are missing, run `brief` again only as a scaffold and complete the missing judgment manually. Do not add a new script heuristic to guess it.
