# Verification Cadence

- Always run lint, format, typecheck, and test
- Run build when routing/build config changed, before release, or for production-sensitive changes

## Minimal Gate (if scripts differ)

- If project has no `format` script, run lint + typecheck + test
- If project has no `typecheck` script, run equivalent static analysis command
- If project has no unit test setup yet, run smoke test plus build before merge

## Runtime Examples

Using npm:

```bash
npm run lint && npm run format && npm run typecheck && npm run test
```

Using pnpm:

```bash
pnpm lint && pnpm format && pnpm typecheck && pnpm test
```

Using yarn:

```bash
yarn lint && yarn format && yarn typecheck && yarn test
```

Using bun:

```bash
bun run lint && bun run format && bun run typecheck && bun run test
```

## Build Trigger Checklist

Run build when at least one is true:

- route definitions changed
- bundler/runtime config changed
- environment variable contract changed
- release branch or production deployment target

## Cleanup Safety Sweep

After deleting routes/modules/components:

- Run a reference sweep for stale imports/usages before full gate.
- Remove or update tests tied to deleted modules.
- Re-run typecheck immediately after sweep to catch orphaned symbols early.

Suggested sweep commands:

```bash
rg "deleted-module-name|DeletedSymbol|old/route/path" app test
```

## Token Enforcement Sweep

Before final verification, scan for direct palette classes in app code.

Preferred: semantic tokens (for example `bg-background`, `text-foreground`, `border-border`).
Avoid: direct palette/absolute color classes (for example `text-slate-900`, `bg-emerald-50`, `text-white`, `bg-black/50`).

Suggested scan:

```bash
rg "(text|bg|border|from|to|via)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]{2,3}" app
rg "(text|bg|border|from|to|via)-(white|black)(/[0-9]+)?" app
```

## Vite Type Conflict Triage

When TypeScript reports plugin overload/type mismatch in `vite.config.ts`:

1. Confirm active Vite graph first:

```bash
pnpm why vite
```

2. If graph is correct but editor still errors, refresh local install state and TS cache:

```bash
pnpm install --force
```

3. Restart TypeScript server in editor before changing package versions.

Rule: do dependency-graph proof first; avoid immediate manifest surgery.
