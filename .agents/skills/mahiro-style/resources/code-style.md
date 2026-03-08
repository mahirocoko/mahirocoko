# Code Style

## Naming

- Use `I` prefix for `interface` names
- Do not use `I` prefix for `type` aliases
- Prefer domain names over generic names
- Keep filenames kebab-case where practical

Good:

- `IConsoleMetric`
- `approval-queue-card.tsx`
- `attendance-summary.tsx`

Weak:

- `MetricType`
- `data.ts`
- `helper.tsx`

## Imports

- Use `import type` for type-only imports
- Group imports so the file purpose is easy to read
- Avoid stale imports after refactors

## Internal Section Order

When a component or hook grows, keep this order:

1. `_Ref`
2. `_State`
3. `_Query`
4. `_Mutation`
5. `_Memo`
6. `_Callback`
7. `_Form`
8. `_Event`
9. `_Effect`

Use section comments only when they make the file easier to scan.

## File Shape

- Prefer files where the top half explains what the file is for
- Avoid mixing style maps, mock data, domain contracts, and large JSX blocks in the same screen file if they can be split cleanly
