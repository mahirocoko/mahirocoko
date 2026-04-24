# Frontend Design Skill Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the local `frontend-design` skill so it reads like a taste-first frontend design doctrine while preserving the current repo-local prompt-composition commands and script architecture.

**Architecture:** Keep the existing Bun script, fixture manifest, and repo-local prompt assets intact as the execution surface, but move them behind a stronger `SKILL.md` doctrine that leads with design stance, workflow, and anti-slop guardrails. Add lightweight structural verification for the rewritten skill document so the new surface stays intentional instead of drifting back into a CLI-only wrapper.

**Tech Stack:** Markdown skill docs, Bun TypeScript scripts, existing fixture-based validator, repo-local JSON prompt assets.

---

## File map

- Modify: `.agents/skills/frontend-design/SKILL.md`
  - Rewrite the skill surface into the approved manifesto-first hybrid structure.
- Modify: `.agents/skills/frontend-design/README.md`
  - Align the package spec with the new skill identity and clarify what stays unchanged operationally.
- Modify: `.agents/skills/frontend-design/scripts/validate-frontend-design.ts`
  - Add structural validation for `SKILL.md` headings/markers alongside the existing command-behavior checks.
- Modify: `.agents/skills/frontend-design/fixtures/frontend-design.json`
  - Add validation expectations for the rewritten skill surface if the validator continues using manifest-driven assertions.
- Optional verify-only read: `.agents/skills/frontend-design/scripts/main.ts`
  - Do not change unless the rewritten doc creates a command contract mismatch that must be corrected.

### Task 1: Lock down the new `SKILL.md` doctrine

**Files:**
- Modify: `.agents/skills/frontend-design/SKILL.md`
- Reference: `docs/superpowers/specs/2026-04-23-frontend-design-skill-redesign-design.md`

- [ ] **Step 1: Read the approved design spec and capture the exact section order to implement**

Copy this checklist into your working notes before editing:

```md
- Purpose / when to use
- Default stance
- Design principles
- Anti-slop / forbidden patterns
- Workflow
- Execution surface
- Boundaries and repo constraints
```

Expected result: you have the final target section order in front of you and will not improvise a different structure while editing.

- [ ] **Step 2: Write the failing structural check for the new skill surface**

Before rewriting the skill, add a failing validation assertion to `.agents/skills/frontend-design/scripts/validate-frontend-design.ts` that checks for the new section markers in `SKILL.md`.

Add constants and a helper like this near the existing repo-root constants and helper section:

```ts
const FRONTEND_DESIGN_SKILL_PATH = join(REPO_ROOT, ".agents", "skills", "frontend-design", "SKILL.md")

const REQUIRED_SKILL_MARKERS = [
  "# /frontend-design",
  "## Purpose / when to use",
  "## Default stance",
  "## Design principles",
  "## Anti-slop / forbidden patterns",
  "## Workflow",
  "## Execution surface",
  "## Boundaries and repo constraints",
]

function assertSkillDocumentShape(): void {
  assertFileExists(FRONTEND_DESIGN_SKILL_PATH, "frontend-design skill")

  const skillDocument = readFileSync(FRONTEND_DESIGN_SKILL_PATH, "utf8")

  assertContainsAll(skillDocument, REQUIRED_SKILL_MARKERS, "skill-document")
  assertInOrder(skillDocument, REQUIRED_SKILL_MARKERS, "skill-document")
}
```

Then call it near the start of `main()` after the existing `assertFileExists(...)` checks:

```ts
assertFileExists(FIXTURE_PATH, "Fixture manifest")
assertFileExists(FRONTEND_DESIGN_SCRIPT, "frontend-design script")
assertSkillDocumentShape()
```

- [ ] **Step 3: Run the validator to confirm the new structural check fails against the old skill**

Run:

```bash
bun .agents/skills/frontend-design/scripts/validate-frontend-design.ts
```

Expected: FAIL because the current `SKILL.md` does not yet contain the new required headings.

- [ ] **Step 4: Rewrite `.agents/skills/frontend-design/SKILL.md` to match the approved doctrine**

Replace the current thin command-led body with a structure like this, keeping the frontmatter fields intact:

```md
---
name: frontend-design
description: Use when you need stronger frontend design judgment, anti-generic UI direction, and repo-local prompt support from docs/design-prompts.
---

# /frontend-design

Use this skill when you need to raise the visual quality of a frontend, choose a clearer interface direction, or avoid generic AI design output.

## Purpose / when to use

- Use when refining the look, feel, rhythm, and interaction quality of a UI.
- Use when an interface needs a stronger point of view, not just implementation polish.
- Use when repo-local prompt assets from `docs/design-prompts` can help support a design direction.

## Default stance

- Taste first. Commands second.
- Prefer one strong visual idea over several weak ones.
- Push toward clarity, hierarchy, and memorable restraint.
- Do not settle for generic AI prettification.

## Design principles

- Let spacing and typography carry more of the hierarchy than borders and decoration.
- Make the primary interaction and visual thesis obvious within a quick scan.
- Keep color disciplined; accents must serve hierarchy or meaning.
- Use motion to clarify state, focus, and sequence rather than to add cost.
- Prefer coherent systems over isolated flashy moments.

## Anti-slop / forbidden patterns

- Decorative gradients without structural purpose.
- Random accent colors that do not map to hierarchy.
- Over-soft type scales and vague emphasis.
- Blur, glass, or shadow used as a substitute for layout clarity.
- Motion that looks impressive but communicates nothing.
- Visual noise that hides the dominant idea.

## Workflow

1. Inspect the current UI, nearby code, and product cues first.
2. State the visual thesis in plain language.
3. Pressure-test that thesis against hierarchy, rhythm, responsiveness, and interaction.
4. Use local prompt assets only after the direction is clear.

## Execution surface

The deterministic local helper remains:

```bash
bun .agents/skills/frontend-design/scripts/main.ts <command> [args]
```

Commands:

- `list`
- `search <query>`
- `compose --general <key> [--direction <key> ...] [--prompt <id> ...] [--handoff <path>]`

Composition order:

1. shared baseline: `design-prompts.json#generalSystemPrompt`
2. selected general prompt
3. selected direction prompts in CLI order
4. selected reusable prompt entries in CLI order
5. optional repo-local handoff file content

## Boundaries and repo constraints

- Reads only repo-local prompt assets from `docs/design-prompts`.
- Does not fetch remote content or write caches.
- `--handoff` must remain repo-local.
- `apps/design-prompts/*` stays sandbox input only.

ARGUMENTS: $ARGUMENTS
```

Do not copy the spec verbatim; use it to produce a tighter final skill document in this shape.

- [ ] **Step 5: Read the rewritten `SKILL.md` and check that the commands now support the doctrine instead of dominating it**

Run:

```bash
python - <<'PY'
from pathlib import Path
text = Path('.agents/skills/frontend-design/SKILL.md').read_text()
for marker in [
    '## Purpose / when to use',
    '## Default stance',
    '## Design principles',
    '## Anti-slop / forbidden patterns',
    '## Workflow',
    '## Execution surface',
    '## Boundaries and repo constraints',
]:
    print(marker, text.find(marker))
PY
```

Expected: each marker prints a non-negative index, and `## Execution surface` appears after the doctrine sections.

- [ ] **Step 6: Run the validator again to confirm the new skill structure passes**

Run:

```bash
bun .agents/skills/frontend-design/scripts/validate-frontend-design.ts
```

Expected: PASS, including the new `skill-document` structure checks and all existing command-behavior cases.

- [ ] **Step 7: Commit the doctrine rewrite**

Run:

```bash
git add .agents/skills/frontend-design/SKILL.md .agents/skills/frontend-design/scripts/validate-frontend-design.ts
git commit -m "feat: redesign frontend-design skill doctrine"
```

### Task 2: Align the local skill README with the new identity

**Files:**
- Modify: `.agents/skills/frontend-design/README.md`

- [ ] **Step 1: Write the failing check in prose before editing the README**

Use this checklist while reviewing the current README:

```md
- Does it describe the skill as only a thin wrapper?
- Does it explain the new doctrine-first / tooling-second posture?
- Does it preserve the execution architecture and safety boundaries?
```

Expected: the current README fails the second check.

- [ ] **Step 2: Rewrite the intro and goals sections to reflect the new posture**

Update the opening section so it reads more like this:

```md
# frontend-design skill spec

This skill provides a repo-local frontend design doctrine with deterministic prompt-composition support. It leads with design judgment, anti-generic guardrails, and workflow guidance, while preserving the existing Bun script and prompt inventory as a secondary execution surface.

## Goals

- Raise frontend design quality with stronger local guidance
- Keep one deterministic local implementation for `list`, `search`, and `compose`
- Read canonical prompt assets from `docs/design-prompts/design-prompts.json`
- Read reusable prompt fragments from `docs/design-prompts/design-skill-prompts.json`
- Preserve repo-local, read-only behavior with no remote fetches or cache writes
```

- [ ] **Step 3: Add a short section explaining the doctrine-first architecture**

Insert a section after `## Chosen architecture` like this:

```md
## Skill posture

- `SKILL.md` is the doctrine surface: design stance, anti-slop rules, workflow, and boundaries.
- `scripts/main.ts` is the deterministic execution surface for local prompt support.
- The script architecture stays thin; the skill surface becomes richer and more opinionated.
```

- [ ] **Step 4: Re-read the README for contradictions against the approved spec**

Check specifically that the README does **not** describe the wrapper as intentionally lean in a way that conflicts with the new doctrine-first skill surface.

Expected: the README now preserves the same operations while describing a richer visible skill identity.

- [ ] **Step 5: Run the validator to confirm README edits did not break the package unexpectedly**

Run:

```bash
bun .agents/skills/frontend-design/scripts/validate-frontend-design.ts
```

Expected: PASS.

- [ ] **Step 6: Commit the README alignment**

Run:

```bash
git add .agents/skills/frontend-design/README.md
git commit -m "docs: align frontend-design skill spec"
```

### Task 3: Tighten verification and finish the redesign safely

**Files:**
- Modify: `.agents/skills/frontend-design/fixtures/frontend-design.json` (only if needed)
- Verify: `.agents/skills/frontend-design/SKILL.md`
- Verify: `.agents/skills/frontend-design/README.md`
- Verify: `.agents/skills/frontend-design/scripts/validate-frontend-design.ts`

- [ ] **Step 1: Decide whether the fixture manifest needs a skill-surface case**

Review whether the validator changes from Task 1 are enough. If the validator already hardcodes `REQUIRED_SKILL_MARKERS`, leave the fixture file untouched. If you prefer manifest-driven verification, add a case to `.agents/skills/frontend-design/fixtures/frontend-design.json` that asserts the doctrine headings are present and in order.

If you choose the manifest-driven route, add a fixture shaped like this:

```json
{
  "id": "skill-surface-shape",
  "args": ["list"],
  "expectExitCode": 0,
  "expectContains": ["# frontend-design list"],
  "expectInOrder": ["# frontend-design list"],
  "rejectContains": []
}
```

and pair it with a validator-side `assertSkillDocumentShape()` call so command checks and skill-doc checks both remain covered.

- [ ] **Step 2: Run a focused diagnostics pass on the changed TypeScript file**

Run your TypeScript diagnostics tool on:

```text
.agents/skills/frontend-design/scripts/validate-frontend-design.ts
```

Expected: zero errors.

- [ ] **Step 3: Run the full validator one more time as the package acceptance test**

Run:

```bash
bun .agents/skills/frontend-design/scripts/validate-frontend-design.ts
```

Expected: PASS and a final line similar to:

```text
Validated <n> frontend-design cases.
```

- [ ] **Step 4: Inspect the final diff to ensure `scripts/main.ts` stayed untouched unless strictly needed**

Run:

```bash
git diff -- .agents/skills/frontend-design/SKILL.md .agents/skills/frontend-design/README.md .agents/skills/frontend-design/scripts/validate-frontend-design.ts .agents/skills/frontend-design/fixtures/frontend-design.json .agents/skills/frontend-design/scripts/main.ts
```

Expected: `scripts/main.ts` is unchanged unless a real contract mismatch forced a minimal edit.

- [ ] **Step 5: Commit the verification cleanup if Task 3 changed tracked files**

If Task 3 changed `fixtures/frontend-design.json`, run:

```bash
git add .agents/skills/frontend-design/fixtures/frontend-design.json .agents/skills/frontend-design/scripts/validate-frontend-design.ts
git commit -m "test: tighten frontend-design skill verification"
```

If Task 3 was verify-only, do not create an extra commit.

- [ ] **Step 6: Produce the final verification summary for handoff**

Write this exact checklist into your handoff note or PR description:

```md
- `SKILL.md` now leads with design doctrine, workflow, and anti-slop guidance.
- The Bun command surface remains documented as a secondary execution layer.
- Repo-local and read-only constraints are still explicit.
- Validator passes after the rewrite.
- `scripts/main.ts` remained unchanged unless required by a proven contract mismatch.
```

This is the final acceptance summary for the redesign.
