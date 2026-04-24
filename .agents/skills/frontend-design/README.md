# frontend-design skill spec

This skill provides a lean repo-local way to inspect and compose frontend design prompt assets without adding remote fetches, caching, or generation layers.

## Goals

- Keep one deterministic local implementation for `list`, `search`, and `compose`
- Read canonical prompt assets from `docs/design-prompts/design-prompts.json`
- Read reusable prompt fragments from `docs/design-prompts/design-skill-prompts.json`
- Optionally append one repo-local handoff file during composition
- Keep the skill wrapper thin and the script read-only
- Keep visual taste doctrine out of this wrapper; pair with `uncodixify` only when implementing or revamping UI output

## Chosen architecture

- **UX surface:** local skill wrapper via `SKILL.md`
- **Execution surface:** repo-owned script at `scripts/main.ts`
- **Inputs:** repo-local JSON prompt assets plus optional repo-local handoff text

This mirrors the existing thin-wrapper posture used by `design-md`, but stays narrower: no remote catalog, no cache, and no side effects.

## Commands

### `list`

- Loads both local prompt asset files
- Prints available general prompt keys
- Prints available direction keys
- Prints available reusable prompt entry IDs with labels and tags

### `search <query>`

- Searches general prompt keys and content
- Searches direction keys and content
- Searches reusable prompt entry IDs, labels, descriptions, tags, and prompt lines
- Prints grouped matches to stdout

### `compose --general <key> [--direction <key> ...] [--prompt <id> ...] [--handoff <path>]`

- Requires exactly one `--general <key>`
- Appends directions in the same order they are passed
- Appends reusable prompt entries in the same order they are passed
- Appends optional handoff content last
- Rejects unknown keys, duplicate flags where not allowed, unsupported arguments, and handoff paths outside the repo

## Composition order

The script composes prompt content in a fixed, documented order:

1. `generalSystemPrompt`
2. `generalSystemPrompts[generalKey]`
3. `directionSystemPrompts[directionKey]` for each `--direction` in CLI order
4. `prompt_lines` for each `--prompt` entry in CLI order
5. optional handoff file contents from `--handoff`

## Handoff posture

- `--handoff` is read-only and repo-local only
- Relative handoff paths may resolve from the current working directory or repo root
- If the resolved file lives under `apps/design-prompts/`, the output marks it as sandbox input only
- Files in that sandbox area are not treated as validated prompt canon
- Example lab handoff (documented in-repo): `apps/design-prompts/lab02/full-page-handoff.md` for the eco-car landing prompt package; see `apps/design-prompts/lab02/README.md` for the suggested `compose` flags

## Validation harness

- Validation lives inside the skill, not under `apps/design-prompts`
- Fixture manifest: `.agents/skills/frontend-design/fixtures/frontend-design.json`
- Validator script: `.agents/skills/frontend-design/scripts/validate-frontend-design.ts`
- Run it with:

```bash
bun .agents/skills/frontend-design/scripts/validate-frontend-design.ts
```

- The harness validates command behavior, required markers, and compose ordering
- `apps/design-prompts/*` remains sandbox input only even when referenced by validation fixtures

## Acceptance criteria

- `bun .agents/skills/frontend-design/scripts/main.ts list` prints the available local prompt inventory
- `bun .agents/skills/frontend-design/scripts/main.ts search hero` returns relevant grouped matches
- `bun .agents/skills/frontend-design/scripts/main.ts compose --general hero` prints the baseline plus the selected general prompt
- `bun .agents/skills/frontend-design/scripts/main.ts compose --general hero --direction animate --prompt css-border-gradient` preserves the requested order
- `bun .agents/skills/frontend-design/scripts/validate-frontend-design.ts` passes the in-skill validation cases
- Changed files have zero new diagnostics
