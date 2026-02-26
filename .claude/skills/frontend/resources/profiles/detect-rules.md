# Profile Detection Rules

`/frontend` resolves stack profile in this order:

1. Forced profile from args (highest priority)
2. Auto-detection from current project files/dependencies
3. No profile (core rules only)

## Forced Args
- `next` -> `next`
- `vite`, `vite-react-ts`, `react-ts` -> `vite-react-ts`
- `rr`, `react-router`, `react-router-framework`, `reactrouter` -> `react-router-framework`

## Auto-Detection Signals

### next
- `next.config.js|mjs|ts|cjs` exists, or
- `next` dependency exists

### react-router-framework
- `react-router.config.ts|js|mjs|cjs` exists, or
- package scripts contain `react-router `, or
- `@react-router/dev` dependency exists

### vite-react-ts
- `vite.config.ts|js|mjs|cjs` exists, and
- `vite` dependency exists, and
- `react` dependency exists

## Notes
- Profiles add stack-specific guidance on top of core rules.
- Core style stays stable; profile adds constraints for framework/runtime behavior.
