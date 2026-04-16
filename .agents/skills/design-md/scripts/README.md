# design-md scripts

Local script entrypoint for the `design-md` skill.

## Usage

```bash
bun .agents/skills/design-md/scripts/main.ts list
bun .agents/skills/design-md/scripts/main.ts search airbnb
bun .agents/skills/design-md/scripts/main.ts sync airbnb
```

## Notes

- Catalog discovery prefers `.agent-state/learn/VoltAgent/awesome-design-md/origin/README.md`
- Remote fallback uses the public GitHub raw README
- Synced files are cached in `.agent-state/design-md/`
