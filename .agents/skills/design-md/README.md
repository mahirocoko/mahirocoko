# design-md skill spec

This skill provides a repo-local way to discover, cache, list, search, and sync public `DESIGN.md` files from `getdesign.md`.

## Goals

- Keep one deterministic local implementation for `sync`, `list`, and `search`
- Use `awesome-design-md` as the discovery catalog
- Use `getdesign.md/design-md/<slug>/DESIGN.md` as the raw content source
- Cache synced files under the current repo's `.agent-state/`

## Chosen architecture

- **UX surface:** local skill wrapper via `SKILL.md`
- **Execution surface:** repo-owned script at `scripts/main.ts`
- **Store:** `.agent-state/design-md/`

This mirrors the existing repo pattern where the skill stays thin and deterministic work lives in a local script.

## Local store

```text
.agent-state/design-md/
  catalog.json
  sync-state.json
  brands/
    airbnb/
      DESIGN.md
      meta.json
```

## Commands

### `list`

- Reads cached `catalog.json` if present
- Falls back to live catalog discovery when cache does not exist
- Renders grouped output by category

### `search <query>`

- Searches slug, brand name, category, summary
- Adds a score boost when cached `DESIGN.md` content contains the query

### `sync [slug ...]`

- Discovers the current catalog
- Syncs every brand when no slug is provided
- Syncs only selected brands when slugs are provided
- Writes raw `DESIGN.md` plus `meta.json` per brand
- Writes `catalog.json` and `sync-state.json`

## Discovery source order

1. Local tracked repo: `.agent-state/learn/VoltAgent/awesome-design-md/origin/README.md`
2. Remote fallback: `https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/README.md`

## Acceptance criteria

- `bun .agents/skills/design-md/scripts/main.ts list` returns grouped catalog output
- `bun .agents/skills/design-md/scripts/main.ts sync airbnb` writes cached files under `.agent-state/design-md/brands/airbnb/`
- `bun .agents/skills/design-md/scripts/main.ts search airbnb` finds the synced brand
- Changed files have zero new diagnostics
