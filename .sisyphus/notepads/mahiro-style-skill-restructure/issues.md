# 2026-03-08 - Task 1 inventory/crosswalk issues

- IA-dependent ownership ambiguity remains for naming guidance (`examples/naming.md`): final canonical home is either `foundations/code-style.md` or a dedicated `patterns/naming.md`. Crosswalk marks both pending Task 2 IA lock.
- `resources/guide.md` retirement behavior needs explicit migration window decision in later tasks (compatibility shim duration and removal trigger) to avoid prolonged dual-source risk.
- Verification constraint note: `lsp_diagnostics` cannot run on `.md`/`.txt` in this environment (no LSP server configured for these extensions). Task evidence uses explicit inventory coverage checks instead.
- IA note, not a blocker: the target-state artifact uses a `compatibility/` bucket for redirect docs, but later migration tasks still need to decide whether compatibility is implemented via new redirect files or via temporarily retained legacy paths.
- IA risk to watch in later rewrites: `patterns/best-practices.md` can become duplicative if it repeats child-page doctrine instead of staying a synthesis and routing page.
- Task 4 introduced a provisional canonical path contract (e.g., `foundations/*`, `patterns/*`) for smoke winners; if Task 2 final IA names differ, Task 4 spec must be revised before Task 14 to avoid false negatives.
- Link-check command/tool selection is intentionally left implementation-neutral in Task 4 design; Task 14 must pin one deterministic checker and output format to keep evidence diff-friendly.

# 2026-03-08 - Task 3 precedence doctrine issues

- No blocking issue found while drafting the doctrine artifact.
- Follow-up note for later rewrite: the final hub and foundation pages must repeat the same four-level order verbatim, or drift will reintroduce ambiguity between `CLAUDE.md`-style files and repo patterns.
- Task 4 retry correction applied: provisional canonical path mismatches were removed and verification spec now tracks Task 2 IA names exactly (`foundations/*`, `patterns/*`, `review-checklist.md`, `stores-state.md`, and thick-route ownership at `patterns/route-boundaries.md`).

# 2026-03-08 - Task 5 hub rewrite issues

- No blocking issue found while rewriting `SKILL.md`.
- Follow-up risk for later tasks: once canonical pages land, their filenames and headings need to stay aligned with the hub map, or retrieval smoke checks will fail on path drift rather than doctrine quality.
- Drift fix note: the first hub rewrite incorrectly invented `foundations/anti-patterns.md`; Task 5 correction must keep anti-pattern retrieval under approved IA owners such as `foundations/review-checklist.md` and `patterns/best-practices.md`.

# 2026-03-08 - Task 6 README rewrite issues

- No blocking issue found while rewriting `README.md`.
- Follow-up risk for later tasks: the README now points readers at `foundations/*` and `patterns/*`, so those canonical pages and headings need to stay aligned with the promised structure.
- Verification constraint remains unchanged: stale-reference cleanup in this task is README-scoped only; wider `examples/` retirement still belongs to later cleanup work.

# 2026-03-08 - Task 7 Foundations rewrite issues

- No blocking issue found while rewriting the five Foundations files.
- Verification constraint remains: markdown files in this environment do not report useful local LSP diagnostics, so schema and stale-reference validation must stay content-based.
- Follow-up risk for later tasks: retrieval smoke checks depend on the headings `## Precedence Order`, `## Feature Structure and Ownership`, and `## Imports and Type Shape` staying stable.

# 2026-03-08 - Task 8 review checklist rewrite issues

- No blocking issue found while rewriting `foundations/review-checklist.md`.
- Verification constraint remains unchanged: markdown files in this environment may not provide meaningful local LSP diagnostics, so heading and stale-reference validation stays grep-based.
- Follow-up risk for later tasks: canonical retrieval assumes `foundations/review-checklist.md` remains the single owner for review posture and embedded anti-pattern checks, not a router back to legacy `resources/anti-patterns.md`.

# 2026-03-08 - Task 9 pattern rewrite issues

- No blocking issue found while rewriting the Pattern pages.
- Verification constraint remains unchanged: markdown files in this environment still need content-based schema checks because local LSP diagnostics are not meaningful for `.md` files.
- Follow-up risk for later tasks: retrieval smoke checks depend on the headings `## Hook Boundaries`, `## Service Responsibilities`, `## State Placement and Provider Scope`, and `## Thin Route Boundary Rules` staying stable.

# 2026-03-08 - Task 10 constants+i18n doctrine issues

- No blocking issue found while rewriting `patterns/constants-i18n.md`.
- Verification constraint remains unchanged: markdown files here are still validated by content checks, because local LSP support for `.md` is not available in this environment.
- Follow-up risk for later tasks: if the future `patterns/README.md` or smoke retrieval contract uses a different heading than `## Render Boundary and Translation Responsibility`, Task 4 smoke expectations must be updated in lockstep to avoid false failures.

# 2026-03-08 - Canonical path casing correction issue note

- Resolved drift: canonical directory casing is now `foundations/` and `patterns/` across active docs and evidence artifacts.
- Superseded path contract: prior uppercase canonical references (`Foundations/`, `Patterns/`) are historical only and must not be reused in active guidance.
