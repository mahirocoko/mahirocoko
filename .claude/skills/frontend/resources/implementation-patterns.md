# Implementation Patterns

## Route Pattern

```tsx
export default function SomeRoute() {
  return <main>...</main>
}
```

### Route Pattern with Typed Props

```tsx
import type { Route } from './+types/dashboard'

export default function DashboardRoute(_props: Route.ComponentProps) {
  return <main>Dashboard</main>
}
```

### Route Pattern with Error Guard

```tsx
export default function EmployeeRoute() {
  return <main>Employees</main>
}

export function ErrorBoundary() {
  return <main>Something went wrong</main>
}
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
type Employee = { id: string; name: string }

export async function getEmployees(): Promise<Employee[]> {
  const response = await fetch('/api/employees')
  if (!response.ok) {
    throw new Error('Failed to load employees')
  }
  return response.json()
}
```

## Mutation Pattern

```ts
type CreateEmployeeInput = { name: string }

export async function createEmployee(input: CreateEmployeeInput) {
  const response = await fetch('/api/employees', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!response.ok) {
    throw new Error('Failed to create employee')
  }
  return response.json()
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
