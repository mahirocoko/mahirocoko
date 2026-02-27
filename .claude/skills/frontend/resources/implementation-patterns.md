# Implementation Patterns

## Page Orchestrator Pattern

```tsx
const DashboardPage = () => {
  return <main>Dashboard</main>
}

export default DashboardPage
```

## Layout Guard Pattern

```tsx
export function AuthLayout({ children }: { children: React.ReactNode }) {
  const isAuth = useAuthStore((state) => state.isAuth())

  if (!isAuth) {
    return <NavigateToLogin />
  }

  return <>{children}</>
}
```

## Root Bootstrap Pattern

```tsx
export function AppRoot({ children }: { children: React.ReactNode }) {
  return (
    <PageProvider>{children}</PageProvider>
  )
}
```

## React Query Utility Pattern

```ts
// app/utils/react-query/get-query-client.ts
import { QueryClient, isServer } from '@tanstack/react-query'

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

export const getQueryClient = () => {
  if (isServer) return makeQueryClient()
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient
}
```

```ts
// app/utils/react-query/index.ts
export { getQueryClient } from './get-query-client'
```

## Component/Hook Section Order

1. `_Ref`
2. `_State`
3. `_Query`
4. `_Mutation`
5. `_Memo`
6. `_Callback`
7. `_Form`
8. `_Event`
9. `_Effect`

## Test Pattern

```tsx
import { render, screen } from '@testing-library/react'

describe('Page', () => {
  it('renders heading', () => {
    render(<h1>Heading</h1>)
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })
})
```

## Store Pattern

```ts
import { create } from 'zustand'

type UIState = {
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (value) => set({ sidebarOpen: value }),
}))
```

## Service Pattern

```ts
import { supabase } from '@/services/supabase'

export class GoalService {
  static async getAll() {
    const { data, error } = await supabase.from('goals').select('*')
    if (error) throw error
    return data ?? []
  }
}
```

## Base Transport Pattern

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

## Mutation Pattern

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCreateGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: GoalService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })
}
```

## Error Boundary + Feedback Pattern

```tsx
export function RouteErrorBoundary() {
  return <main>Something went wrong. Please try again.</main>
}

export function showRequestError(message: string) {
  toast.error(message)
}
```

## Feature Slice Pattern

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

## Action File Pattern

```ts
// actions/create-order.ts
export async function createOrderAction(input: CreateOrderInput) {
  return OrderService.create(input)
}
```

## Component System Pattern (shadcn-style, adaptable)

### Keep base primitives stable

```text
src/
  components/
    ui/              # upstream/base primitives
      button.tsx
      card.tsx
    custom/          # app-level wrappers/compositions
      loading-button.tsx
```

Guideline:
- Treat `components/ui/` as base primitives
- Put product-specific behavior in wrapper/composed components
- Keep design-system backend consistent per project (for example Base UI or Radix), avoid mixing primitive stacks in one app

### Variant Pattern

```ts
import { cva } from 'class-variance-authority'

export const buttonVariants = cva('inline-flex items-center justify-center rounded-md', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground',
      outline: 'border border-input',
    },
    size: {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 px-3',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})
```

### Wrapper Composition Pattern

```tsx
import { Button } from '@/components/ui/button'

interface ILoadingButtonProps {
  loading?: boolean
  children: React.ReactNode
  onClick?: () => void
}

export function LoadingButton({ loading = false, children, onClick }: ILoadingButtonProps) {
  return (
    <Button disabled={loading} onClick={onClick}>
      {loading ? 'Loading...' : children}
    </Button>
  )
}
```
