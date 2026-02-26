# Frontend Guide

Use this when `AGENTS.md` is unavailable. Section names match the primary guide so output shape stays identical.

See `resources/README.md` for the pattern-specific document map.
Use detailed examples from:

- `resources/code-style.md`
- `resources/i18n.md`
- `resources/testing.md`
- `resources/state-data.md`
- `resources/implementation-patterns.md`

## Overview

This document is intentionally runtime-neutral and package-manager-neutral.
Use it as a baseline for any frontend project, then override with project-specific rules in `AGENTS.md`.

## Code Style Guide

- Use 2-space indentation
- Use single quotes in JS/TS/TSX
- Keep line width <= 120 where practical
- Prefer `import type` for type-only imports
- Keep file names kebab-case where possible
- Let formatter handle trailing commas and spacing
- Use `I` prefix for interface names (required)
- Use Lingui for internationalization (`t` macro / `Trans`)

## Navigation and Screen Rules

- Keep navigation strategy consistent across the app
- Separate screen-level concerns from reusable UI components
- Keep framework-specific routing details in project docs, not in generic style rules

## Testing Rules

- Place tests under `test/` or outside route discovery paths
- Keep tests deterministic
- Avoid network in unit tests without mocks

## State and Data Rules

- Use the server-state library already chosen by the project (for example React Query, SWR, Apollo)
- Use one local-state strategy consistently (for example Context, Zustand, Redux Toolkit)
- Keep shared providers in the app root shell
- Keep API access in dedicated modules, not inline in UI components

## Implementation Patterns

### Route Pattern

```tsx
export default function SomeRoute() {
  return <main>...</main>
}
```

### Component/Hook Section Order

1. `_Ref`
2. `_State`
3. `_Query`
4. `_Mutation`
5. `_Memo`
6. `_Callback`
7. `_Form`
8. `_Event`
9. `_Effect`

### Test Pattern

```tsx
import { render, screen } from '@testing-library/react'

describe('Page', () => {
  it('renders heading', () => {
    render(<h1>Heading</h1>)
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })
})
```

### Data Pattern

```ts
export async function fetchEmployees() {
  const response = await fetch('/api/employees')
  if (!response.ok) {
    throw new Error('Failed to fetch employees')
  }
  return response.json()
}
```

### i18n Pattern (Lingui)

```tsx
import { Trans, useLingui } from '@lingui/react/macro'

export function WelcomeMessage() {
  const { t } = useLingui()

  return (
    <section>
      <h1>{t`Welcome`}</h1>
      <Trans>
        Please review <strong>your profile</strong> before continuing.
      </Trans>
    </section>
  )
}
```

### Component System Pattern (shadcn-style)

```tsx
import { Button } from '@/components/ui/button'

interface ILoadingButtonProps {
  loading?: boolean
  children: React.ReactNode
}

export function LoadingButton({ loading = false, children }: ILoadingButtonProps) {
  return <Button disabled={loading}>{loading ? 'Loading...' : children}</Button>
}
```

## Anti-Patterns

- Do not place tests in `app/routes/`
- Do not bypass type safety with `any`
- Do not add formatter/linter tools that conflict with current setup
- Do not mix multiple lockfiles in the same repository

## Verification Cadence

- Always run: lint, format, typecheck, and test
- Run build for routing/build changes, release prep, or production-sensitive PRs

### Command Examples (choose your project runtime)

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

## Runtime Fallback

If Bun is unavailable:

```bash
npx tsx scripts/main.ts "$ARGUMENTS"
```

Requirements:

- Node.js available
- `tsx` available via `npx` (or install with your project package manager)
