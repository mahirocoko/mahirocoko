# Lesson Learned: React Router Framework Migration Needs Full Runtime Verification

Tags: react-router, framework-mode, hydration, pnpm, hono, verification

When migrating an app from a Vite SPA to React Router framework mode, the migration is not finished when TypeScript and build are green. The critical lesson from this session is that framework-mode correctness depends on several runtime-specific contracts that are easy to miss during a code-only pass.

The most concrete example was the hydration failure. In framework mode, `src/entry.client.tsx` must call `hydrateRoot(document, ...)`, not `hydrateRoot(document.getElementById('root')!, ...)`. That difference looks small, but it breaks the app in dev with `Target container is not a DOM element.` The second major lesson is that `ssr: false` does not mean “no server assumptions.” React Router still expects framework-compatible runtime/tooling pieces such as `@react-router/node`, generated types, and correct root/route module layout. The third lesson is that package manager migration has to be treated as part of runtime verification, not as metadata cleanup. Scripts, docs, lockfiles, local install state, and any user-facing hints all need to match the chosen package manager.

Practical rule going forward: for React Router framework migrations, always verify four layers before calling the work done: `typegen`, `typecheck`, `build`, and an actual dev/prod smoke test. If any one of those is skipped, the migration is still provisional.
