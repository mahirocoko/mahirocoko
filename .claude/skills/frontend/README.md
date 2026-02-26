# frontend skill

This skill outputs frontend coding conventions and implementation patterns from project docs, with a consistent section layout for onboarding.

## Overview

The skill reads:

1. `AGENTS.md` (primary source)
2. `resources/guide.md` (fallback source when `AGENTS.md` is unavailable)

`resources/guide.md` is the fallback source.

## When to use

- Onboarding new contributors/agents
- Aligning implementation to project conventions
- Quickly checking route/test/state patterns before coding

## How It Works

1. **Source selection**
   - Uses `AGENTS.md` as primary source
   - Falls back to `resources/guide.md` when `AGENTS.md` is unavailable

2. **Section rendering**
   - Renders stable sections in fixed order for predictable output

3. **Focus mode**
   - Applies keyword-based line extraction when arguments are provided

4. **Runtime fallback**
   - Runs with Bun by default, supports Node + `tsx` fallback

## Usage

```bash
/frontend
/frontend route
/frontend test
/frontend state
/frontend style
/frontend patterns
/frontend verify
/frontend anti
```

See runnable prompt examples in `examples/README.md`.

## Arguments

- `style` - focus on code style conventions
- `navigation` or `route` - focus on navigation/screen organization
- `test` - focus on testing patterns and rules
- `state` or `data` - focus on state and data boundaries
- `patterns` - focus on implementation patterns/examples
- `anti` - focus on anti-patterns
- `verify` - focus on verification cadence
- Any free-form text is also supported (substring search in source docs)

## Output Structure

- Code Style Guide
- Navigation and Screen Rules
- Testing Rules
- State and Data Rules
- Implementation Patterns
- Anti-Patterns

With an argument, the skill adds a `Focus` section with matching lines.

## Runtime Compatibility

Primary runner:

```bash
bun scripts/main.ts "$ARGUMENTS"
```

Fallback runner:

```bash
npx tsx scripts/main.ts "$ARGUMENTS"
```

Package manager is not fixed by this skill. Use the package manager selected by each project.

## Maintenance Notes

- Keep `AGENTS.md` current; it is the source of truth
- Keep `resources/guide.md` generic and runtime-neutral
- Keep i18n conventions aligned to Lingui (`resources/i18n.md`)
- Keep supporting resource docs in sync (`resources/code-style.md`, `resources/testing.md`, etc.)
- Keep section headings identical across both docs

## Troubleshooting

- `AGENTS.md not found` in output: run the skill in a project folder that includes `AGENTS.md`
- Focus output too noisy: use narrower arguments like `style`, `test`, `state`, `patterns`
- Bun unavailable: run fallback `npx tsx scripts/main.ts "$ARGUMENTS"`
