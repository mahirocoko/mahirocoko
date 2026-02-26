# Next Profile

## Code Style Guide
- Keep Server Components as default; add `'use client'` only where interactivity/browser APIs are needed.
- Keep server-only code in server files and avoid importing it into client components.

## Navigation and Screen Rules
- Use App Router conventions (`app/**/page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`).
- Keep route groups and nested layouts intentional; avoid deep ad-hoc directory nesting.
- Keep navigation state/client effects inside client components and pass data from server boundaries.

## Testing Rules
- Cover critical server-client boundaries (server fetch + hydrated client interaction).
- Mock `next/navigation` and `next/headers` when unit-testing route logic in isolation.

## State and Data Rules
- Prefer server data fetching first; use client-side cache/state only for interactive flows.
- Keep mutations in server actions or dedicated API/service boundaries, not inline random handlers.

## Implementation Patterns
- Pattern: `page.tsx` composes data and UI; `loading.tsx`/`error.tsx` handle route-level UX states.
- Pattern: colocate feature components under route segment with clear server/client split.

## Anti-Patterns
- Do not mark whole trees as client by default.
- Do not fetch the same data redundantly in multiple nested client components.
