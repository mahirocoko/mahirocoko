# Frontend Design Skill Redesign

Date: 2026-04-23
Status: approved design
Scope: redesign the local `frontend-design` skill so it feels closer to the reference skills while preserving the repo's existing local prompt-composition architecture.

## Summary

Redesign `.agents/skills/frontend-design/SKILL.md` as a manifesto-first hybrid skill.

The rewritten skill should lead with design judgment, taste, and anti-generic guardrails, then expose the existing repo-local prompt composition tools as a secondary execution surface. The local Bun script and prompt assets remain the operational backbone, but the skill's visible identity shifts from "CLI wrapper" to "frontend design operator manual."

## Problem

The current `frontend-design` skill is structurally consistent with the repo's thin-wrapper pattern, but it reads mostly as a deterministic command surface:

- `list`
- `search`
- `compose`

That makes it useful as a local prompt utility, but it does not yet feel like the kind of opinionated frontend-design skill represented by the reference materials. The strongest voice in the current version is operational control rather than design judgment.

## Design goal

The new skill should feel like a hybrid of three qualities:

1. **Anthropic-style compact design doctrine**
   - concise, high-signal, design-forward
   - pushes toward memorable output instead of generic polish

2. **Impeccable-style context discipline**
   - inspect local context before making aesthetic decisions
   - use stronger workflow framing and explicit quality checks

3. **Taste-skill-style concrete guardrails**
   - make aesthetic heuristics explicit
   - use negative constraints to prevent weak AI output

The chosen direction is a **hybrid, with taste guidance first and tooling second**.

## Non-goals

This redesign should **not**:

- replace the existing repo-local Bun script architecture
- introduce remote fetches, caches, or reporting layers
- turn the skill into a heavy multi-script package unrelated to current repo conventions
- remove the deterministic prompt composition contract

## Constraints from the current repo

The redesign should preserve the following current architecture:

- skill file: `.agents/skills/frontend-design/SKILL.md`
- implementation surface: `.agents/skills/frontend-design/scripts/main.ts`
- validation harness: `.agents/skills/frontend-design/scripts/validate-frontend-design.ts`
- canonical prompt assets in `docs/design-prompts/`
- repo-local, read-only posture
- fixed composition order for prompt assembly

This keeps the implementation aligned with sibling skills such as `design-md`, while making the skill surface itself substantially richer.

## Proposed architecture

The redesigned skill should use a two-layer architecture with one coherent voice.

### Layer 1: design doctrine

This is the part the model should absorb first. It defines:

- when to use the skill
- what quality bar it enforces
- how to form a visual point of view
- what kinds of output count as generic or weak
- how to pressure-test a direction before implementation

This layer is responsible for changing the feel of the skill.

### Layer 2: execution surface

This layer exposes the existing local tools and prompt assets:

- `list`
- `search <query>`
- `compose --general <key> [--direction <key> ...] [--prompt <id> ...] [--handoff <path>]`

These commands remain available, but they are reframed as support tools the skill may use after a design direction is already clear.

## Recommended workflow inside the skill

The new skill should guide the model through this sequence:

1. **Inspect context first**
   - read the current page, component, or surrounding UI
   - extract brand, product, and interaction cues from the local repo
   - ground design recommendations in existing context

2. **Choose a visual thesis**
   - define what the design should feel like
   - state the dominant visual idea clearly
   - prefer one strong direction over multiple weak ones

3. **Run anti-slop checks**
   - check for generic AI design patterns
   - reject ornamental choices that do not strengthen hierarchy or identity
   - force explicit judgment on typography, spacing, hierarchy, motion, and color restraint

4. **Use local prompt tooling only when helpful**
   - search or compose local prompt assets to support the chosen direction
   - keep the prompt assembly subservient to design judgment rather than the other way around

This yields a clear order of operations:

**context → design judgment → guardrail check → local prompt support**

## Recommended `SKILL.md` structure

The rewritten skill should roughly follow this shape:

1. **Purpose / when to use**
2. **Default stance**
3. **Design principles**
4. **Anti-slop / forbidden patterns**
5. **Workflow**
6. **Execution surface**
7. **Boundaries and repo constraints**

### 1. Purpose / when to use

Clarify that this skill is for raising frontend quality, shaping UI direction, and avoiding generic output. It is not only for assembling prompt fragments.

### 2. Default stance

State the skill's default behavior explicitly:

- taste-first
- strong point of view
- fewer, stronger visual ideas
- no generic AI prettification

### 3. Design principles

Cover the core frontend design axes:

- typography
- spacing and rhythm
- hierarchy and density
- color discipline
- interaction states
- motion and restraint
- responsiveness

The principles should stay concise but specific enough to guide real output.

### 4. Anti-slop / forbidden patterns

This section should explicitly ban or challenge weak defaults such as:

- decorative gradients without structural purpose
- random accent colors with no hierarchy role
- weak spacing systems hidden behind borders or shadows
- overused glassmorphism or blur without concept fit
- motion that looks expensive but communicates nothing
- soft, vague type hierarchy
- excessive visual noise instead of one dominant idea

This is one of the most important changes because the reference skills all use negative constraints to enforce taste.

### 5. Workflow

Document the thought process the skill should follow:

- inspect context
- identify cues
- form a visual thesis
- pressure-test the thesis
- use local tools if needed

This gives the skill a stronger operational rhythm without making it as heavy as a full protocol skill.

### 6. Execution surface

Preserve the current command documentation, but move it later in the file. The commands should be presented as deterministic repo-local helpers, not the main identity of the skill.

### 7. Boundaries and repo constraints

Keep the current operational limits explicit:

- repo-local only
- no remote fetches
- no cache writes
- read-only prompt asset usage
- handoff caveats for sandbox content under `apps/design-prompts`

## Voice and tone

The rewritten skill should sound:

- more opinionated than the current version
- more design-literate than tool-literate
- concise rather than bloated
- confident, but still grounded in repo constraints

It should not become theatrical or vague. The prose needs to carry clear standards, not just aesthetic mood.

## What should remain unchanged

The following should remain stable unless later implementation evidence forces a change:

- the Bun-based execution surface
- the local JSON prompt inventory as canonical prompt input
- the validation harness inside the skill package
- the fixed composition order
- the repo-local safety posture

## What should change

The redesign should directly change:

- the ordering of information in `SKILL.md`
- the voice of the skill
- the amount of design judgment surfaced in the skill itself
- the explicit quality heuristics and anti-slop guardrails
- the framing of the command surface from primary identity to secondary support layer

## Acceptance criteria for the redesign

The redesign should be considered successful when:

1. Reading `SKILL.md` feels like reading a frontend design doctrine first, not a CLI help page.
2. The skill clearly expresses a taste bar and rejects generic AI design patterns.
3. The workflow order is explicit: context before direction, direction before prompt composition.
4. The current local script architecture remains intact and understandable.
5. The execution commands are still documented, but no longer dominate the skill's identity.
6. The result feels closer to the linked reference skills while still fitting this repo's thinner architecture.

## Implementation notes for the later planning step

When this moves into planning and implementation, the work should likely focus on:

- rewriting `.agents/skills/frontend-design/SKILL.md`
- deciding whether `README.md` also needs alignment updates
- preserving or lightly adjusting script help text only if the new skill wording requires it
- verifying that validation expectations still match the rewritten skill surface

No implementation changes are part of this design document.
