# Brainstorming Skill And Console Scope Corrections

Source: `rrr --deep: github.com/mahirocoko/mahirocoko`
Date: 2026-03-11

## Patterns

### 1. Skill bundles are stronger than prompt-only skills
Confidence: high

When a new capability is meant to be reused, it should ship as a bundle: policy, examples, references, runtime helpers, and tool entrypoints together. The brainstorming skill became much more credible because it was not just a `SKILL.md`; it also had a visual-companion playbook, scripts, and a runnable server path. That matches the stronger packaging pattern already used by `agent-browser`.

### 2. Shell-first reset beats polishing the wrong dashboard
Confidence: high

If the feature hierarchy is still unclear, polishing route content is often wasted motion. Resetting each console page to the same `Coming soon` state made the shell the real design surface again and removed stale mock content that was silently steering design decisions.

### 3. Accent requests must stay accent-scoped
Confidence: high

If the user asks for sidebar accent tuning, only accent-adjacent tokens should move unless they explicitly widen the request. Retuning `--sidebar`, `--sidebar-foreground`, and `--sidebar-border` without explicit permission is overreach even when the broader palette looks internally consistent.

### 4. Local code-shape preference outranks generic cleanup instincts
Confidence: high

For this repo, UI class readability is best served by `cn(...)` inline at the render site, not by extracting one-off class constants outside the component. The mistake was not using `cn(...)`; the mistake was moving one-off class groupings into pseudo-reusable constants with no semantic boundary.

### 5. Correction loops are reusable design signals
Confidence: medium

Repeated user pushback often points to a real repo rule that is not fully encoded yet. In this session, repeated corrections around sidebar scope and class-shape readability were not noise; they were the fastest path to a more accurate local doctrine.

## Mistakes

- I treated a visual reference as stronger than the repo’s design-system baseline.
- I widened token scope from accent-only tuning to family-level retuning.
- I reviewed delegated work more for visible plausibility than for local code-shape correctness.

## Reusable Solutions

- Before changing tokens, classify the request as one of: structure, accent, surface, or ownership.
- Before extracting a repeated class list, ask whether it expresses a reusable semantic contract or merely repeats in one file.
- When a route family is in design limbo, collapse every page body to the same placeholder and preserve only the shell.

## Connections To Past Learnings

- `2026-03-04_base-ui-structure-before-styling.md`
- `2026-02-24_design-system-token-alignment-with-locked-grid.md`
- `2026-03-02_feedback-first-token-iteration-beats-theory.md`
- `2026-03-10_console-employees-alignment-and-scope-discipline.md`

## Core Lesson

Owner-local preference plus narrow scope beats elegant overreach. In UI work, many bad changes still look plausible. The reliable path is to stabilize structure first, then change only the semantic layer the user actually asked for, and keep code shape aligned with the repo’s lived readability preferences rather than with generic cleanup habits.
