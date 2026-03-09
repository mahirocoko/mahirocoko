---
query: "วิธีการเขียน skill ที่เพิ่งได้เรียนรู้ vercel-labs/agent-skills และ anthropics/skills ไปอยากเอามาปรับใช้กับ mahiro-style ด้วยน้า"
target: "mahirocoko"
mode: deep
timestamp: 2026-03-09 15:34
---

# Trace: skill writing patterns for mahiro-style

**Target**: mahirocoko
**Mode**: deep
**Time**: 2026-03-09 15:34

## Oracle Results

Oracle search was low-signal for this exact question, but it still surfaced useful local memory clusters around:

- `ψ/memory/retrospectives/2026-03/03/15.25_skill-ecosystem-deep-dive.md` - previous multi-repo skill comparison work
- `ψ/memory/learnings/2026-03-03_skill-repository-archetypes.md` - build-tool vs production-capability vs knowledge-base archetypes
- `ψ/memory/learnings/2026-03-08_mahiro-style-needs-real-refactor-feedback-loops.md` - doctrine should grow from real refactors
- `ψ/memory/learnings/2026-03-09_mahiro-style-doctrine-refinement-through-console-layout-review.md` - recent concrete refinement rules for ownership and i18n posture

## Files Found

### Local `mahiro-style` contract

- `.agents/skills/mahiro-style/SKILL.md` - thin hub pattern with precedence, retrieval lenses, and document map
- `.agents/skills/mahiro-style/README.md` - human-facing overview and hybrid posture
- `.agents/skills/mahiro-style/foundations/precedence.md` - explicit conflict-resolution policy
- `.agents/skills/mahiro-style/foundations/review-checklist.md` - operational review lens
- `.agents/skills/mahiro-style/patterns/constants-i18n.md` - stable owner-page format with examples and anti-examples
- `.agents/skills/mahiro-style/resources/README.md` - compatibility redirect layer, explicitly non-canonical
- `.agents/skills/mahiro-style/examples/README.md` - examples tree retained for history, canonical examples embedded in owner docs

### Local memory and handoff evidence

- `ψ/memory/learnings/2026-02-26_frontend-skill-structure-resources-examples.md` - layered skill contract: `SKILL.md`, `scripts/`, `resources/`, `examples/`
- `ψ/memory/learnings/2026-03-03_skill-repository-archetypes.md` - external repo comparison lens
- `ψ/memory/learnings/2026-03-08_mahiro-style-needs-real-refactor-feedback-loops.md` - `mahiro-style` should be shaped by live refactor pressure
- `ψ/memory/learnings/2026-03-09_mahiro-style-doctrine-refinement-through-console-layout-review.md` - owner-local data, naming, and `t` vs `msg` refinements
- `ψ/inbox/handoff/2026-03-08_16-49_console-refactor-and-mahiro-style-follow-up.md` - explicit next step to sharpen `mahiro-style` from real review findings

### Learned external repo docs

- `ψ/learn/vercel-labs/agent-skills/repo.md`
- `ψ/learn/vercel-labs/agent-skills/2026-03-09/1508_ARCHITECTURE.md`
- `ψ/learn/vercel-labs/agent-skills/2026-03-09/1508_API-SURFACE.md`
- `ψ/learn/vercel-labs/agent-skills/2026-03-09/1508_TESTING.md`
- `ψ/learn/anthropics/skills/repo.md`
- `ψ/learn/anthropics/skills/2026-03-09/1511_QUICK-REFERENCE.md`
- `ψ/learn/anthropics/skills/2026-03-09/1511_API-SURFACE.md`
- `ψ/learn/anthropics/skills/origin/skills/skill-creator/SKILL.md`
- `ψ/learn/anthropics/skills/origin/template/SKILL.md`
- `ψ/learn/anthropics/skills/origin/.claude-plugin/marketplace.json`

## Git History

Recent local history shows the skill has already been moving toward this shape:

- `4ba4563` - `rrr: deep analysis - mahiro-style-doctrine-refinement`
- `499dfb7` - `docs: 📝 refine mahiro-style guidance`
- `fdcdb80` - `chore: 🔧 consolidate mahiro-style skill links`
- `3878cac` - major `mahiro-style` restructure into foundations/patterns
- `ea910a5` - `chore: 🔧 replace frontend skill with mahiro-style`
- `f9f80f9` - `feat: ✨ evolve frontend doctrine skill`

Pattern: the repo has already moved from a broad frontend skill toward a dedicated, layered, Mahiro-specific doctrine system.

## GitHub Issues/PRs

High-signal external change pressure from `anthropics/skills`:

- `#249` - `skill-creator` incorrectly prohibits optional frontmatter fields allowed by spec
- `#239` - generated `SKILL.md` fails validation because YAML description is parsed as a list
- `#230` - skill creation flow should produce a package artifact, not only `SKILL.md`
- `#518` - eval loop rough edges around grading paths, naming assumptions, and baseline quality

Related broader signals from the librarian pass:

- `#202` - `skill-creator` should be updated to best practice
- `#290` - add dedicated skill-debugger for trigger failures
- `#311`, `#394`, `#336` - pressure to support spec-compliant and platform-specific frontmatter cleanly

Meaning: frontmatter correctness, trigger quality, and packaging/validation are active pressure points in the wider skill ecosystem.

## Cross-Repo Matches

### From `vercel-labs/agent-skills`

- Treat `SKILL.md` as the thin activation surface and push deeper doctrine into canonical docs or generated outputs.
- Keep the skill content as the product; build tooling is optional and only justified when it prevents drift or generates real value.
- Validation can be script/build oriented rather than classic unit tests when the artifact is documentation.
- Be tolerant of ecosystem drift such as `scripts/` vs `resources/`; canonical identity should come from `SKILL.md`, not README naming.

### From `anthropics/skills`

- Keep the minimal skill contract clear: `name` + `description` are core, with optional spec/platform extensions where needed.
- Treat `description` as the primary trigger surface; make it concrete, intent-rich, and written for actual user prompts.
- Keep the root skill concise and use progressive disclosure: `SKILL.md` first, then references/resources only as needed.
- If a skill reaches shareable maturity, validation and packaging become part of the finished artifact, not an afterthought.

### Local fit for `mahiro-style`

- `mahiro-style` is not a build-tool repo and not a production-capability skill; it is a knowledge-base skill with some operational routing behavior.
- That means it should borrow structure, trigger quality, and validation discipline from the external repos, but keep its real value in the opinionated doctrine pages and review lens.

## Oracle Memory

Most relevant local memory patterns:

- Skill structure should be layered and explicit: `SKILL.md`, references/resources, examples, optional scripts.
- Triggering should be natural-intent-first, with deterministic fallback when exact retrieval is weak.
- Examples and compatibility layers help portability, but canonical doctrine should live in a single owner page to avoid drift.
- `mahiro-style` only becomes trustworthy when updated from real refactor disagreement, not from abstract taste alone.

## Summary

The strongest adaptation rule is: keep `mahiro-style` as a **thin, triggerable hub over canonical doctrine pages**, not as a giant all-in-one manifesto.

What to borrow from the ecosystem:

1. From `anthropics/skills`: make frontmatter conservative and portable, quote the `description`, keep it short, and write it for real trigger boundaries.
2. From `anthropics/skills`: if we ever want to distribute `mahiro-style`, treat validation and packaging as part of done.
3. From `vercel-labs/agent-skills`: preserve the thin entrypoint plus canonical-doc architecture; do not duplicate doctrine in multiple files.
4. From both repos: keep progressive disclosure strong - root file for routing, deeper files for detail.

What to preserve as uniquely Mahiro:

1. Local repo doctrine always wins over cross-repo taste.
2. Rules should map to ownership, naming, i18n posture, and real refactor pressure - not generic code-style aesthetics.
3. `Do / Avoid` examples are required because abstract style prose drifts too easily.

Best next enhancement directions for `mahiro-style`:

1. Tighten the frontmatter `description` so triggering is more explicit around review/refactor/alignment requests.
2. Add a compact authoring or maintenance checklist page for future `mahiro-style` updates.
3. Define a lightweight local validation rule set for the skill: canonical owner pages, no doctrine duplication, examples embedded in owner docs, precedence always explicit.
4. Continue refining the doctrine only through live repo review loops such as the current `haabiz-hrm-fe` console follow-up.
