# Vite React TS Profile

## Code Style Guide
- Keep app code under `src/` and keep aliases predictable (`@/` to `src/` when configured).
- Keep strict TypeScript enabled; avoid weakening compiler checks for convenience.

## Navigation and Screen Rules
- Keep routing explicit (for example React Router in SPA mode) with one clear route registration entry.
- Keep screen orchestration in route modules and reusable UI in components.

## Testing Rules
- Prefer Vitest + Testing Library with one shared setup file (`test/setup.ts` or `src/test/setup.ts`).
- Keep fast local feedback by running targeted tests before full suite.

## State and Data Rules
- Prefer React Query for server-state and Zustand/Context for local state, not ad-hoc mixed patterns.
- Keep API integration in service modules and centralize auth header/token behavior.

## Implementation Patterns
- Pattern: route module uses query/mutation hooks and delegates integration to services.
- Pattern: provider composition is rooted once in app shell/root.

## Anti-Patterns
- Do not scatter env var access across many files; centralize where possible.
- Do not tie core logic to build tool internals when plain TS modules are enough.
