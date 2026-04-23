# frontend-design scripts

Local script entrypoint for the `frontend-design` skill.

## Usage

```bash
bun .agents/skills/frontend-design/scripts/main.ts list
bun .agents/skills/frontend-design/scripts/main.ts search hero
bun .agents/skills/frontend-design/scripts/main.ts compose --general hero
bun .agents/skills/frontend-design/scripts/main.ts compose --general hero --direction animate --prompt css-border-gradient
bun .agents/skills/frontend-design/scripts/validate-frontend-design.ts
```

## Notes

- Reads only local assets from `docs/design-prompts/`
- Keeps composition order deterministic and visible in stdout
- Supports one optional repo-local `--handoff` file
- Treats `apps/design-prompts/lab01` as sandbox input only
- Does not write `.agent-state`, fetch remote content, or mutate prompt assets
- Validation fixtures live at `.agents/skills/frontend-design/fixtures/frontend-design.json`
