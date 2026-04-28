---
name: frontend-design
description: List, search, compose, and scaffold disciplined frontend design briefs from bundled design prompt assets. Use when you want a lean portable prompt helper or a brief-first workflow without remote fetches or cache writes.
---

# /frontend-design

Use this skill when you want a thin portable wrapper around bundled design prompt assets, or when you need to turn visual/reference material into a disciplined frontend design brief before implementation.

This skill is intentionally lean. It delegates all deterministic work to the skill-local script at `scripts/main.ts`.

Design judgment stays in the skill workflow, not in the script. The `brief` command is a scaffold, not a heuristic extractor. Use `resources/brief-workflow.md` as the operating doctrine when turning references into implementation direction.

## Command shape

```bash
bun scripts/main.ts <command> [args]
```

Commands:

- `list`
- `search <query>`
- `compose --general <key> [--direction <key> ...] [--prompt <id> ...] [--handoff <path>]`
- `brief --general <key> [--direction <key> ...] [--prompt <id> ...] [--handoff <path>] [--reference <path> ...]`

## Examples

```bash
bun scripts/main.ts list

bun scripts/main.ts search hero

bun scripts/main.ts compose \
  --general hero \
  --direction animate \
  --direction design-details \
  --prompt css-border-gradient

bun scripts/main.ts compose \
  --general landing-page \
  --prompt agency-grid-layout-minimal \
  --handoff resources/reference-excerpts/wellness-handoff-excerpt.md

bun scripts/main.ts brief \
  --general hero \
  --direction animate \
  --prompt image-first-grid-layout \
  --reference resources/reference-excerpts/velorah-anatomy.md
```

## Composition order

The compose command prints sections in this order:

1. shared baseline: `design-prompts.json#generalSystemPrompt`
2. selected general prompt: `design-prompts.json#generalSystemPrompts.<key>`
3. selected direction prompts in CLI order: `design-prompts.json#directionSystemPrompts.<key>`
4. selected reusable prompt entries in CLI order: `design-skill-prompts.json#<id>.prompt_lines`
5. optional workspace-local or skill-local handoff file content

## Brief workflow

Use `brief` when you have a prompt stack, handoff, or reference file and need a structured design-direction scaffold before implementation.

The brief command does **not** replace `compose`. It keeps canonical prompt assets separate from reference evidence and prints a Markdown scaffold with:

1. intent / page job
2. selected direction modifiers
3. selected reusable prompt fragments
4. visual reference anatomy
5. information architecture
6. design system cues
7. motion / media guidance
8. asset needs
9. uncodixify guardrails
10. implementation constraints

Treat bundled reference excerpts and external prompt corpora as reference anatomy only. Borrow specificity around fonts, media, motion timing, section jobs, and responsive constraints; do not copy liquid-glass, pill-nav, cinematic dark SaaS, or giant video hero aesthetics unless the product explicitly requires them.

### Script boundary

Keep this boundary strict:

```txt
script = scaffolding
docs = judgment
agent = synthesis
```

Do not add complex extraction heuristics, taste scoring, or automatic design classification to `scripts/main.ts`. If design logic is not deterministic file handling, keep it in `resources/brief-workflow.md` and apply it as agent judgment.

## Notes

- Reads only bundled prompt assets from `resources/prompt-assets`
- Does not fetch remote content, write caches, or generate reports
- `--handoff` may read a workspace-local or skill-local file and appends its content last
- `--reference` may read workspace-local or skill-local files for `brief`; references are evidence, not prompt canon
- `resources/reference-excerpts/*` is bundled non-canonical evidence only and should not be treated as validated prompt canon
- External prompt corpora are reference evidence only and should not be promoted into canonical prompt assets as-is
- Skill-owned validation lives at `scripts/validate-frontend-design.ts`
- For actual UI generation or revamps, pair this with `uncodixify` so composed prompt output is filtered through a restrained, non-generic frontend aesthetic.
- When prompt assets call for remote images or asset URLs, use real reachable URLs only. Never invent image URLs or assume variants exist without checking.
- Pair with `asset-designer` when the brief implies an asset pack or media delivery plan; pair with `web-asset-prompts` when the next step is rewriting a single image-generation prompt.

ARGUMENTS: $ARGUMENTS
