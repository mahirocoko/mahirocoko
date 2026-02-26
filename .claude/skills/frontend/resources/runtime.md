# Runtime Fallback

Primary:

```bash
bun scripts/main.ts "$ARGUMENTS"
```

Fallback:

```bash
npx tsx scripts/main.ts "$ARGUMENTS"
```

Requirements:

- Node.js available
- `tsx` available via `npx` (or installed via project package manager)
