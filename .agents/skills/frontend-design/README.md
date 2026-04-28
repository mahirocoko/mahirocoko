# frontend-design skill spec

This skill provides a lean portable way to inspect and compose bundled frontend design prompt assets, plus a structured brief scaffold for turning prompt stacks and workspace-local or skill-local references into implementation-ready frontend design direction without adding remote fetches, caching, or generation layers.

## Goals

- Keep one deterministic local implementation for `list`, `search`, and `compose`
- Add `brief` as a separate design-brief workflow without changing `compose` output
- Read canonical prompt assets from `resources/prompt-assets/design-prompts.json`
- Read reusable prompt fragments from `resources/prompt-assets/design-skill-prompts.json`
- Optionally append one workspace-local or skill-local handoff file during composition
- Keep the skill wrapper thin and the script read-only
- Keep visual taste doctrine as an explicit guardrail in `brief`; pair with `uncodixify` when implementing or revamping UI output
- Keep design judgment in docs and agent synthesis rather than adding heuristic extraction logic to the script

## Chosen architecture

- **UX surface:** local skill wrapper via `SKILL.md`
- **Execution surface:** skill-owned script at `scripts/main.ts`
- **Inputs:** bundled JSON prompt assets plus optional workspace-local or skill-local handoff/reference text

This mirrors the existing thin-wrapper posture used by `design-md`, but stays narrower: no remote catalog, no cache, and no side effects.

The guiding boundary is:

```txt
script = scaffolding
docs = judgment
agent = synthesis
```

`scripts/main.ts` should not become a design analyzer. It may validate paths, load prompt assets, preserve ordering, and print a repeatable scaffold. Taste decisions and reference interpretation live in `resources/brief-workflow.md`.

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
- Rejects unknown keys, duplicate flags where not allowed, unsupported arguments, and handoff paths outside the current workspace or skill bundle

### `brief --general <key> [--direction <key> ...] [--prompt <id> ...] [--handoff <path>] [--reference <path> ...]`

- Requires exactly one `--general <key>`
- Uses the same canonical prompt assets as `compose`
- Adds optional workspace-local or skill-local `--reference` files as evidence for manual anatomy synthesis
- Prints a structured Markdown brief scaffold instead of a concatenated prompt stack
- Labels bundled sample inputs as reference or sandbox material rather than canonical prompt truth
- Keeps `asset-designer`, `web-asset-prompts`, and `uncodixify` roles explicit in the output

## Composition order

The script composes prompt content in a fixed, documented order:

1. `generalSystemPrompt`
2. `generalSystemPrompts[generalKey]`
3. `directionSystemPrompts[directionKey]` for each `--direction` in CLI order
4. `prompt_lines` for each `--prompt` entry in CLI order
5. optional handoff file contents from `--handoff`

## Handoff posture

- `--handoff` is read-only and must stay inside the current workspace or the skill bundle
- Relative handoff paths may resolve from the current working directory or skill root
- If the resolved file lives under `resources/reference-excerpts/`, the output marks it as skill-local sample input only
- Files in that sample area are not treated as validated prompt canon
- Portable sample handoff: `resources/reference-excerpts/wellness-handoff-excerpt.md`

## Reference posture

- `--reference` is read-only and must stay inside the current workspace or the skill bundle
- References are evidence for design anatomy, not canonical prompt assets
- Bundled reference excerpts and external prompt corpora are useful for implementation-grade specificity, especially fonts, media roles, animation timing, section anatomy, and responsive constraints
- Do not import reference-corpus aesthetics directly into canon: liquid glass, pill navigation, cinematic dark SaaS styling, giant video heroes, hover-scale decoration, glows, and generic premium gradients are risks to filter through `uncodixify`
- Use `asset-designer` when a brief implies a multi-asset plan; use `web-asset-prompts` when writing or rewriting a single image-generation prompt

## Workflow doctrine

- Detailed workflow: `resources/brief-workflow.md`
- Use the workflow to manually synthesize references into design direction
- Avoid adding automatic extraction heuristics unless the behavior is purely deterministic and covered by validation

The design follows the public skill-pattern norm: a short skill entrypoint, optional loaded references, deterministic scripts only for repeatable mechanics, and Markdown workflow docs for judgment.

## Validation harness

- Validation lives inside the skill, not under a host app folder
- Fixture manifest: `fixtures/frontend-design.json`
- Validator script: `scripts/validate-frontend-design.ts`
- Run it with:

```bash
bun scripts/validate-frontend-design.ts
```

- The harness validates command behavior, required markers, and compose ordering
- `resources/reference-excerpts/*` remains sample/reference input only even when referenced by validation fixtures

## Acceptance criteria

- `bun scripts/main.ts list` prints the available bundled prompt inventory
- `bun scripts/main.ts search hero` returns relevant grouped matches
- `bun scripts/main.ts compose --general hero` prints the baseline plus the selected general prompt
- `bun scripts/main.ts compose --general hero --direction animate --prompt css-border-gradient` preserves the requested order
- `bun scripts/main.ts brief --general hero --reference resources/reference-excerpts/velorah-anatomy.md` prints a structured brief scaffold and labels the reference as non-canonical evidence
- `bun scripts/validate-frontend-design.ts` passes the in-skill validation cases
- Changed files have zero new diagnostics
