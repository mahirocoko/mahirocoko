# Frontend Guide

Use this when `AGENTS.md` is unavailable. Section names match the primary guide so output shape stays identical.

See `resources/README.md` for the pattern-specific document map.
Use detailed examples from:

- `resources/code-style.md`
- `resources/i18n.md`
- `resources/testing.md`
- `resources/state-data.md`
- `resources/implementation-patterns.md`
- `resources/review-checklist.md`

## Overview

This fallback is distilled from Mahiro's current working style and split into:
- `Non-negotiable` = do this by default
- `Preference` = preferred unless project constraints differ
- `Contextual` = apply only when stack/context matches

Priority order when rules conflict:
1. Token-first consistency
2. Existing project architecture boundaries
3. Local style preferences

## Code Style Guide

- Non-negotiable: 2-space indentation, single quotes, line width around 120
- Non-negotiable: use `import type` for type-only imports
- Non-negotiable: keep files kebab-case and constants SCREAMING_SNAKE_CASE
- Non-negotiable: interface names use `I` prefix
- Non-negotiable: type aliases do not use `I` prefix
- Non-negotiable: in UI classes, prefer semantic tokens (`bg-background`, `text-foreground`, `border-border`) over direct palette/absolute color classes
- Preference: page files use explicit component declaration (`const Page = () => ...`) then `export default Page`
- Preference: component files use named export when the folder convention supports it
- Contextual: Lingui-first copy (`t` and `Trans`) with Thai source strings when Thai is source locale

## Navigation and Screen Rules

- Non-negotiable: keep route modules in `app/routes/` as page orchestration units
- Non-negotiable: keep reusable UI in `app/components/` and do not push page logic into shared UI
- Preference: route discovery should stay file-based and centralized in one routing entry
- Preference: keep auth shell decision in root (authenticated layout vs guest outlet)
- Contextual (React Router framework): keep document assets (fonts/favicon/link tags) in `app/root.tsx` via `links()` and render `<Links />` in `<head>`
- Contextual: put landing redirects in index route (for example, auth + bootstrap redirect flow)

## Testing Rules

- Non-negotiable: keep tests outside route discovery paths (`test/` or `__tests__/` in non-route dirs)
- Non-negotiable: deterministic tests only (no hidden time/network coupling)
- Non-negotiable: run quality gate before PR -> `lint`, `typecheck`, `test`
- Preference: keep one setup file for shared test env (for example `test/setup.ts`)
- Contextual: when using Vitest + jsdom, wire DOM assertions once via `@testing-library/jest-dom`

## State and Data Rules

- Non-negotiable: split server-state and client-state responsibilities clearly
- Non-negotiable: keep API/data calls in service modules, not inline inside presentational UI
- Non-negotiable: keep global providers in app root shell
- Non-negotiable: keep providers organized in `app/providers/` with barrel exports for stable imports
- Non-negotiable: create React Query clients via utility boundary (`app/utils/react-query/get-query-client.ts`), not ad-hoc in multiple modules
- Preference: server-state via React Query and local app state via Zustand
- Preference: auth token/session sync should be centralized (hook/store boundary), not scattered in pages
- Contextual: persist only required store fields with explicit partialization

## Implementation Patterns

### Page Orchestrator Pattern

```tsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const GoalsPage = () => {
  const queryClient = useQueryClient()

  const { data: goals = [] } = useQuery({
    queryKey: ['goals'],
    queryFn: () => GoalService.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: GoalService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals'] }),
  })

  void createMutation

  return <main>{goals.length}</main>
}

export default GoalsPage
```

### Layout Guard Pattern

```tsx
export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const isAuth = useAuthStore((state) => state.isAuth())

  if (!isAuth) {
    return <NavigateToLogin />
  }

  return <>{children}</>
}
```

### Root Bootstrap Pattern

```tsx
export const AppRoot = ({ children }: { children: React.ReactNode }) => {
  return (
    <I18nProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>{children}</ToastProvider>
      </QueryClientProvider>
    </I18nProvider>
  )
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

### Service Pattern (Supabase-first)

```ts
import { supabase } from '@/services/supabase'

export class GoalService {
  static async getAll() {
    const { data, error } = await supabase.from('goals').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data ?? []
  }
}
```

### Base Transport Pattern

```ts
export async function postJSON<T>(url: string, body: unknown, token?: string): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error('Request failed')
  }

  return (await response.json()) as T
}
```

### Store Pattern (auth/session sync)

```ts
import { create } from 'zustand'
import { supabase } from '@/services/supabase'

export const useAuthStore = create<{ accessToken: string }>(() => ({ accessToken: '' }))

void supabase.auth.getSession().then(({ data }) => {
  useAuthStore.setState({ accessToken: data.session?.access_token ?? '' })
})
```

### Provider Composition Pattern

```tsx
export const PageProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient()

  return (
    <I18nProvider i18n={i18n}>
      <ConfigProvider>
        <PopupProvider>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </PopupProvider>
      </ConfigProvider>
    </I18nProvider>
  )
}
```

### Error Boundary + Feedback Pattern

```tsx
export const RouteErrorBoundary = () => {
  return <main>Something went wrong. Please try again.</main>
}

export function showRequestError(message: string) {
  toast.error(message)
}
```

### Feature Slice Pattern

```text
src/
  features/
    orders/
      pages/
      services/
      hooks/
      components/
      types/
```

### Action File Pattern

```ts
// actions/create-order.ts
export async function createOrderAction(input: CreateOrderInput) {
  return OrderService.create(input)
}
```

## Anti-Patterns

- Non-negotiable: do not place tests in `app/routes/`
- Non-negotiable: do not bypass type safety with `any`
- Non-negotiable: do not mix multiple formatter/linter stacks or multiple lockfiles
- Preference: do not call backend directly in route/component body without service boundary
- Preference: do not spread auth state logic across many modules when one hook/store boundary is enough

## Verification Cadence

- Always run: lint, format, typecheck, and test
- Run build for routing/build changes, release prep, or production-sensitive PRs
- After route/module deletion: run reference sweep (`rg` in `app` + `test`) before full gate
- Before final check: scan app code for direct palette classes and replace with semantic tokens
- For Vite plugin type mismatch: verify graph with `pnpm why vite`, then reinstall/TS-server refresh before version changes

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
