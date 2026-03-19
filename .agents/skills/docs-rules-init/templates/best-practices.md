# Best Practices

## Code Quality

### Always Run Verification Commands

```bash
[verified verification command sequence]
```

### Type Exports

Always export types alongside implementations:

```tsx
// Correct
export { MyComponent, type IMyComponentProps }

// Incorrect
export { MyComponent }
```

### Avoid `any`

Prefer `unknown` or proper types:

```ts
// Avoid
const data: any = fetchData()

// Better
const data: unknown = fetchData()

// Best
const data: IMyData = fetchData()
```

## Component Best Practices

### Keep Components Small

```tsx
// Too large
const DashboardPage = () => {
  // 500+ lines mixing layout, cards, filters, and actions
}

// Better
const DashboardPage = () => {
  return (
    <div>
      <DashboardHeader />
      <DashboardMetrics />
      <DashboardContent />
    </div>
  )
}
```

### Prefer Composition

```tsx
// Too many props
interface IComplexCardProps extends ComponentProps<'div'> {
  showHeader?: boolean
  headerTitle?: string
  showFooter?: boolean
}

// Better composition
const Card = ({ children }: ICardProps) => <div>{children}</div>
const CardHeader = ({ children }: ICardHeaderProps) => <header>{children}</header>
const CardFooter = ({ children }: ICardFooterProps) => <footer>{children}</footer>
```

## Service Best Practices

### Keep Transport Out of Components

```tsx
// Avoid ad hoc direct calls once a shared query pattern exists
const handleSubmit = async () => {
  await EmployeeService.update(id, payload)
}

// Prefer the repo's query or mutation pattern
const mutation = useMutation({
  mutationFn: (payload) => EmployeeService.update(id, payload),
})
```

## Styling Best Practices

### Use `cn()` for Class Merging

```tsx
import { cn } from '@/utils/cn'

<div className={cn('base-class', className)} />
```

### Semantic Tokens Over Raw Palette

```tsx
// Avoid
<div className="bg-white text-black">Content</div>

// Prefer
<div className="bg-card text-card-foreground">Content</div>
```

## State Management Best Practices

### Server State in the Server-State Layer

```tsx
[repo-faithful query example]
```

### Client State in the Client-State Layer

```tsx
[repo-faithful selector example]
```

## Development Workflow

1. Make changes
2. Run the repo's verification commands
3. Run i18n extraction if copy changed
4. Run build when the task requires it
5. Commit changes

## Common Pitfalls to Avoid

### Forgetting to Export Types

```tsx
// Type not exported
export { MyComponent }

// Type exported
export { MyComponent, type IMyComponentProps }
```

## Summary Checklist

Before committing:

- [ ] Ran the repo's verification commands
- [ ] Ran i18n extraction if changing copy
- [ ] Exported types alongside implementations
- [ ] Used the repo's class-merging utility when needed
- [ ] Used selectors for client-state stores
