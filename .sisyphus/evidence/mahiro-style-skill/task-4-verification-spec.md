# Task 4 Verification Spec - Mahiro Style Skill Restructure

## Goal

Define a strict, agent-executable verification harness for the skill rewrite. This spec is design-only (no scripts), and is intended to be executed later by Task 14/final QA.

## Constraints

- Zero human judgment in pass/fail checks; each check must have binary outcomes.
- Markdown/text files in this environment do not have local LSP support; heading/schema checks must use content validation instead of LSP diagnostics.
- Guard specifically against stale canonical dependencies on `examples/`, `resources/guide.md`, and `resources/README.md`.

## Verification Inputs and Outputs

- Scope root: `.agents/skills/mahiro-style/`
- Evidence root: `.sisyphus/evidence/mahiro-style-skill/`
- Output style: one evidence file per check plus one aggregate run log.
- Exit behavior:
  - Exit code `0`: all checks pass.
  - Non-zero exit: stop and mark failed check ID.

## Canonical Target Contract (for structure/smoke assertions)

The rewrite is considered structurally ready only when these canonical docs exist:

- `.agents/skills/mahiro-style/SKILL.md`
- `.agents/skills/mahiro-style/README.md`
- `.agents/skills/mahiro-style/foundations/README.md`
- `.agents/skills/mahiro-style/foundations/overview.md`
- `.agents/skills/mahiro-style/foundations/precedence.md`
- `.agents/skills/mahiro-style/foundations/project-structure.md`
- `.agents/skills/mahiro-style/foundations/code-style.md`
- `.agents/skills/mahiro-style/foundations/review-checklist.md`
- `.agents/skills/mahiro-style/patterns/README.md`
- `.agents/skills/mahiro-style/patterns/components.md`
- `.agents/skills/mahiro-style/patterns/hooks.md`
- `.agents/skills/mahiro-style/patterns/route-boundaries.md`
- `.agents/skills/mahiro-style/patterns/shared-ui-boundaries.md`
- `.agents/skills/mahiro-style/patterns/naming.md`
- `.agents/skills/mahiro-style/patterns/services.md`
- `.agents/skills/mahiro-style/patterns/stores-state.md`
- `.agents/skills/mahiro-style/patterns/constants-i18n.md`
- `.agents/skills/mahiro-style/patterns/best-practices.md`

## Verification Matrix

| ID | Class | Tooling | Steps | Pass Criteria | Evidence |
|---|---|---|---|---|---|
| V-01 | Structure/file existence | Bash (`test -f`) | Assert each path in the canonical target contract exists. | Every expected file exists exactly once. | `.sisyphus/evidence/mahiro-style-skill/task-4-structure.txt` |
| V-02 | Heading/schema consistency | Read + Grep | For each canonical page, verify required headings are present: `## Intent`, `## Non-negotiable`, `## Preference`, `## Contextual`, `## Examples`, `## Anti-Examples`. | No canonical page is missing required headings (except hub docs where schema is not required). | `.sisyphus/evidence/mahiro-style-skill/task-4-schema-headings.txt` |
| V-03 | Precedence completeness | Read + Grep | Validate precedence order text exists and is explicit in `foundations/precedence.md`: `AGENTS.md -> other repo-local instruction files -> established repo patterns -> Mahiro fallback doctrine`. | Full order appears; no ambiguous modifiers (`usually`, `generally`, `prefer`). | `.sisyphus/evidence/mahiro-style-skill/task-4-precedence-order.txt` |
| V-04 | Stale reference guards | Grep | Search skill tree for `examples/`, `resources/guide.md`, `resources/README.md`. | No canonical/hub docs depend on these paths as primary reading. Compatibility mentions must include `deprecated` text. | `.sisyphus/evidence/mahiro-style-skill/task-4-stale-references.txt` |
| V-05 | Link integrity | Markdown link checker + Bash | Run link checker against `.agents/skills/mahiro-style/**/*.md` and capture output. | Zero broken internal links; zero missing anchors. | `.sisyphus/evidence/mahiro-style-skill/task-4-links.txt` |
| V-06 | Smoke retrieval (happy path + edge path) | Prompt harness + deterministic winner assertion | Execute smoke prompts S-01..S-08 below and compare observed top doc+heading to expected winner. | Every prompt resolves to exact expected winning doc and heading. | `.sisyphus/evidence/mahiro-style-skill/task-4-smoke-retrieval.txt` |
| V-07 | Failure-mode (intentional break) | Controlled temp edit + rerun target check | Introduce one controlled break (e.g., remove required heading or add stale `examples/` ref), rerun relevant check, then restore and rerun. | Broken state fails; restored state passes. | `.sisyphus/evidence/mahiro-style-skill/task-4-failure-mode.txt` |

## Required Heading Schema by Page Class

- Canonical doctrine pages (`foundations/*`, `patterns/*`):
  - `## Intent`
  - `## Non-negotiable`
  - `## Preference`
  - `## Contextual`
  - `## Examples`
  - `## Anti-Examples`
- Hub docs (`SKILL.md`, `README.md`): exempt from the six-heading schema; they must contain routing map sections and precedence surface links.

## Smoke Prompt Set (Exact Winner Contract)

Each smoke prompt must produce one winning destination in `{doc path, heading}` form.

| ID | Prompt | Expected Winning Doc | Expected Winning Heading |
|---|---|---|---|
| S-01 | "Which rule wins when repo AGENTS conflicts with Mahiro style?" | `.agents/skills/mahiro-style/foundations/precedence.md` | `## Precedence Order` |
| S-02 | "How should Mahiro structure a new feature module and where should constants live?" | `.agents/skills/mahiro-style/foundations/project-structure.md` | `## Feature Structure and Ownership` |
| S-03 | "What import and type-shape defaults should I follow before touching code?" | `.agents/skills/mahiro-style/foundations/code-style.md` | `## Imports and Type Shape` |
| S-04 | "Should this hook call services directly or through boundaries?" | `.agents/skills/mahiro-style/patterns/hooks.md` | `## Hook Boundaries` |
| S-05 | "Where should API transport and mapping logic live?" | `.agents/skills/mahiro-style/patterns/services.md` | `## Service Responsibilities` |
| S-06 | "What is the recommended split between global state and local UI state?" | `.agents/skills/mahiro-style/patterns/stores-state.md` | `## State Placement and Provider Scope` |
| S-07 | "When do I keep copy in React vs extract descriptors with msg for Lingui?" | `.agents/skills/mahiro-style/patterns/constants-i18n.md` | `## Render Boundary and Translation Responsibility` |
| S-08 (edge) | "How do we reject thick-route files and enforce route/component boundaries?" | `.agents/skills/mahiro-style/patterns/route-boundaries.md` | `## Thin Route Boundary Rules` |

## Failure-Mode Test Design

At least one of the following intentional failures must be run:

1. Schema failure:
   - Remove `## Anti-Examples` from one canonical page.
   - Expect V-02 failure with explicit missing heading report.
   - Restore heading and rerun; expect pass.
2. Stale reference failure:
   - Add temporary line in `SKILL.md` pointing to `examples/README.md` as required reading.
   - Expect V-04 failure with exact offending line path.
   - Restore and rerun; expect pass.

## Execution Order for Later Task 14

1. V-01 structure
2. V-02 schema/headings
3. V-03 precedence completeness
4. V-04 stale references
5. V-05 links
6. V-06 smoke retrieval
7. V-07 intentional failure-mode (break then restore)

Stop on first failure and persist evidence from completed checks.

## Aggregate Evidence Contract

Task 14 should also emit:

- `.sisyphus/evidence/mahiro-style-skill/task-14-full-verification.txt`

This aggregate file must include:

- check IDs executed in order
- pass/fail for each check
- failing file/path/heading details (if any)
- final exit code
