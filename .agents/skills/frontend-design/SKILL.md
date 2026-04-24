---
name: frontend-design
description: List, search, and compose repo-local frontend design prompt assets from docs/design-prompts. Use when you want a lean project-local prompt helper without remote fetches or cache writes.
---

# /frontend-design

Use this skill when you want a thin repo-local wrapper around the design prompt assets in `docs/design-prompts`.

This skill is intentionally lean. It delegates all deterministic work to the local script at `.agents/skills/frontend-design/scripts/main.ts`.

## Command shape

```bash
bun .agents/skills/frontend-design/scripts/main.ts <command> [args]
```

Commands:

- `list`
- `search <query>`
- `compose --general <key> [--direction <key> ...] [--prompt <id> ...] [--handoff <path>]`

## Examples

```bash
bun .agents/skills/frontend-design/scripts/main.ts list

bun .agents/skills/frontend-design/scripts/main.ts search hero

bun .agents/skills/frontend-design/scripts/main.ts compose \
  --general hero \
  --direction animate \
  --direction design-details \
  --prompt css-border-gradient

bun .agents/skills/frontend-design/scripts/main.ts compose \
  --general landing-page \
  --prompt agency-grid-layout-minimal \
  --handoff apps/design-prompts/lab01/prompt.txt
```

## Composition order

The compose command prints sections in this order:

1. shared baseline: `design-prompts.json#generalSystemPrompt`
2. selected general prompt: `design-prompts.json#generalSystemPrompts.<key>`
3. selected direction prompts in CLI order: `design-prompts.json#directionSystemPrompts.<key>`
4. selected reusable prompt entries in CLI order: `design-skill-prompts.json#<id>.prompt_lines`
5. optional repo-local handoff file content

## Notes

- Reads only local prompt assets from `docs/design-prompts`
- Does not fetch remote content, write caches, or generate reports
- `--handoff` may read a repo-local file and appends its content last
- `apps/design-prompts/lab01` is sandbox input only and should not be treated as validated prompt canon
- Skill-owned validation lives at `.agents/skills/frontend-design/scripts/validate-frontend-design.ts`
- For actual UI generation or revamps, pair this with `uncodixify` so composed prompt output is filtered through a restrained, non-generic frontend aesthetic.
- When prompt assets call for remote images or asset URLs, use real reachable URLs only. Never invent image URLs or assume variants exist without checking.

ARGUMENTS: $ARGUMENTS
