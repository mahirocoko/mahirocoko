# Brand Skill Generator Scripts

This skill wraps the local CLI implemented under the skill root.

## Usage

```bash
bun .agents/skills/brand-skill-generator/scripts/main.ts --help

bun .agents/skills/brand-skill-generator/scripts/main.ts inspect \
  --brand "Acme" \
  --website https://acme.com \
  --docs ./brand

bun --cwd .agents/skills/brand-skill-generator run brand-skill:help
bun --cwd .agents/skills/brand-skill-generator run typecheck
```

## Notes

- The wrapper exists so the skill has a stable script entrypoint
- Core implementation lives in `.agents/skills/brand-skill-generator/`
- Package-local config lives in `.agents/skills/brand-skill-generator/package.json`
- Use `bun --cwd .agents/skills/brand-skill-generator run typecheck` after structural changes
