# Generation Rules

These rules control how the skill writes each page.

## Global Rules

- Use reference repos for grammar, not facts.
- Prefer source-faithful boilerplates over improvised document shapes.
- Keep current state separate from preferred direction.
- If a pattern is weak or incomplete, soften the wording.
- If a page would mostly be speculation, skip it.
- Commands must come from the repo, not from habit.
- Prefer repo-local doctrine over imported taste.

## Boilerplate Rule

- Start from the closest template under `templates/`.
- Preserve canonical section order unless the target repo has a strong local reason to differ.
- Replace repo facts, commands, paths, and stack-specific examples.
- Remove sections that do not fit the target repo instead of collapsing the page into a generic summary.
- Keep the final page reading like a sibling of the reference docs family, not like a newly invented outline.

## React-First Rule

- For React repos, prefer the React-shaped boilerplates in this skill over neutral framework language.
- Keep examples grounded in real React patterns: component props, hooks, route files, query hooks, Zustand selectors, and client-side i18n where applicable.
- If the repo is React but the current codebase is still small, keep the React grammar and trim sections rather than replacing the page with a generic summary.

## High-Risk Pages

- `docs/commit-guide.md` must not invent enforced conventions from thin air. If there is no `.git` history, no commitlint, and no hook config, keep the guide explicitly conservative and say it reflects a suggested local baseline rather than observed enforced policy.
- `docs/development-commands.md` should mirror the reference grammar closely: prefer `Quick Start`, `Building`, `Linting & Formatting`, `Type Checking`, `Internationalization`, `Dependency Management`, and `Verification Cadence` when they fit the repo.
- `docs/patterns/services-pattern.md` should keep the service-doc shape even when the repo's service layer is still small; trim sections carefully instead of collapsing the page into a short summary.

## Reality Labels

Use these labels as needed inside pages:

- `Current reality`
- `Preferred direction`
- `Not established yet`
- `If introduced later` or `Adoption triggers`

## Hard Do-Not Rules

- do not guess commands
- do not invent architecture
- do not copy reference repo facts into the target repo
- do not over-document future plans as if they are current behavior
- do not use `grep_app_searchGitHub`, `context7_*`, `webfetch`, `websearch_*`, or subagents for this skill
- do not run `pnpm dev`, `npm run dev`, `vite`, or other long-running local servers
- do not use `sg`
- do not replace template grammar with a new improvised summary format
