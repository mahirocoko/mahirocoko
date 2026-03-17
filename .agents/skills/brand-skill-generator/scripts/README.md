# Brand Skill Generator Scripts

This skill wraps the local CLI implemented under the skill root.

## Usage

```bash
bun .agents/skills/brand-skill-generator/scripts/main.ts --help

bun .agents/skills/brand-skill-generator/scripts/main.ts inspect \
  --brand "Acme" \
  --website https://acme.com \
  --website-role live-product \
  --docs ./brand

bun .agents/skills/brand-skill-generator/scripts/main.ts refresh \
  --brand "Acme" \
  --brief "Simple personal finance app with a white-and-blue visual system" \
  --write-brief-doc \
  --screenshots ./captures \
  --code ./app

bun --cwd .agents/skills/brand-skill-generator run brand-skill:help
bun --cwd .agents/skills/brand-skill-generator run typecheck
```

## Notes

- The wrapper exists so the skill has a stable script entrypoint
- Core implementation lives in `.agents/skills/brand-skill-generator/`
- Package-local config lives in `.agents/skills/brand-skill-generator/package.json`
- Use `bun --cwd .agents/skills/brand-skill-generator run typecheck` after structural changes
- The current CLI now runs intake preflight before engine execution
- Use source roles when a website or reference is ambiguous
- Mood-reference websites are excluded from engine execution in v2 to avoid lexical drift
