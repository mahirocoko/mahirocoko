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
