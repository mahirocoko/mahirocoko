---
name: design-md
description: Sync, list, and search public DESIGN.md brands from getdesign.md into repo-local .agent-state cache. Use when you want to browse brand slugs, fetch DESIGN.md files, or keep a local catalog in sync.
---

# /design-md

Use this skill when you want a repo-local catalog of public `DESIGN.md` files.

This skill is intentionally thin. It delegates all deterministic work to the local script at `.agents/skills/design-md/scripts/main.ts`.

## Command shape

```bash
bun .agents/skills/design-md/scripts/main.ts <command> [args]
```

Commands:

- `list`
- `search <query>`
- `sync [slug ...]`

## Examples

```bash
bun .agents/skills/design-md/scripts/main.ts list

bun .agents/skills/design-md/scripts/main.ts search airbnb

bun .agents/skills/design-md/scripts/main.ts sync airbnb

bun .agents/skills/design-md/scripts/main.ts sync
```

## Local store

The script writes cache data under:

```text
.agent-state/design-md/
```

## Notes

- Catalog discovery prefers the local tracked `awesome-design-md` repo when available
- Raw content sync uses `https://getdesign.md/design-md/<slug>/DESIGN.md`
- The script is the source of truth for parsing, storage, and ranking

ARGUMENTS: $ARGUMENTS
