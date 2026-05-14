# How To Write A Good AGENTS.md

`AGENTS.md` should be an operational guide for coding agents. It is not a README replacement. Its job is to help an agent make correct decisions quickly inside this repo.

## Core Principles

1. Be specific, not aspirational.
   Avoid vague rules like "follow best practices." Prefer concrete instructions such as "Run `pnpm typecheck` after changing TypeScript files."

2. Prefer executable truth.
   Include real commands, real paths, real package names, and real workflows. Agents are most reliable when instructions map directly to actions.

3. Keep instructions scoped.
   Use root-level `AGENTS.md` for repo-wide rules. Add nested `AGENTS.md` files for package-specific, app-specific, or service-specific behavior.

4. Explain non-obvious rules briefly.
   If a rule may look unusual, add one sentence explaining why. This helps agents make better decisions in edge cases.

5. Turn prohibitions into workflows.
   Do not only say what is forbidden. Say what to do instead.

   Bad:

   ```md
   - Never edit generated files.
   ```

   Better:

   ```md
   - Do not edit files in `src/generated/`; update the schema in `schema/` and run `pnpm generate`.
   ```

6. Make verification explicit.
   "Verify your work" is too vague. List the commands agents should run for different kinds of changes.

7. Keep it maintainable.
   `AGENTS.md` should evolve as agents make mistakes or discover repo-specific workflows. Add rules only when they prevent real confusion or repeated errors.

## Recommended Structure

```md
# Agent Instructions

## Project Overview

- Briefly describe what this repo is.
- List the main apps/packages and where they live.

## Setup

- Install dependencies with `...`.
- Start the dev server with `...`.

## Codebase Search

- Use semantic search for broad exploration when available.
- Use `rg` for exact text, symbols, filenames, and regex search.

## Implementation Rules

- Document repo-specific conventions.
- Mention preferred libraries, patterns, boundaries, and naming rules.
- Avoid generic advice that applies to every project.

## Testing And Verification

- List exact commands for linting, typechecking, tests, builds, and formatting.
- Explain which commands are required for which kinds of changes.
- If a command cannot run, the agent must report the blocker.

## Safety Rules

- Never commit secrets.
- Never force-push.
- Never run destructive commands without explicit approval.
- Never merge PRs without human approval.

## Git Workflow

- Branch naming rules.
- Commit expectations.
- PR expectations.
```

## Good Instruction Examples

```md
## Testing And Verification

- After changing TypeScript, run `pnpm typecheck`.
- After changing UI components, run `pnpm test --filter web`.
- After changing API behavior, run `pnpm test --filter api`.
- Before declaring the task done, report which checks were run.
- If a check cannot run, explain why and mention the risk.
```

```md
## Implementation Rules

- Use existing service helpers in `src/services/` before adding new API clients.
- Keep database access inside `src/db/`; do not query the database directly from route handlers.
- Use `date-fns` for date handling. Do not add `moment`.
- Do not edit generated files in `src/generated/`; update the source schema and run `pnpm generate`.
```

```md
## Safety

- Never commit `.env`, credentials, tokens, private keys, or local config files.
- Never use `git push --force`.
- Never run destructive database migrations without explicit human approval.
- Before deleting files or directories, confirm they are not user-created or make a backup.
```

## Anti-Patterns To Avoid

- Long philosophical rules with no direct action.
- Generic advice like "write clean code" or "use best practices."
- Outdated commands that no longer work.
- Rules that conflict with each other.
- Huge documents that repeat the README.
- Instructions that force the agent to ask permission for every small decision.
- Prohibitions without an approved alternative.

## Rule Of Thumb

A good `AGENTS.md` answers:

- Where is the important code?
- How should the agent search the repo?
- What patterns should the agent follow?
- What should the agent avoid?
- How should the agent verify work?
- When must the agent ask a human?

If an instruction does not help answer one of those questions, it probably belongs somewhere else.
