# Code Style Guide

- Use 2-space indentation
- Prefer single quotes in JS/TS/TSX
- Keep line width around 120 chars
- Prefer `import type` for type-only imports
- Keep file names kebab-case where possible
- Let formatter control commas/spacing
- Use `I` prefix for interface names (required)

## Type Naming (Required)

- Interface: `I` + PascalCase (for example `IUserProfileProps`)
- Type alias: PascalCase (for example `UserProfileState`)
- Enum: PascalCase for enum name, SCREAMING_SNAKE_CASE or PascalCase for members per project rules

```ts
// Required interface naming
interface IButtonProps {
  disabled?: boolean
}

// Type aliases remain PascalCase without I prefix
type ButtonVariant = 'primary' | 'secondary'
```

## Language-Neutral Principles

- Keep functions small and purpose-driven
- Prefer explicit names over abbreviations
- Keep data mapping separate from rendering
- Prefer pure utility functions for reusable logic

## Example: Import Order

```ts
// 1) external imports
import { useEffect, useState } from 'react'

// 2) internal alias imports
import { useAuth } from '@/hooks/auth/use-auth'
import { cn } from '@/utils/cn'

// 3) relative imports
import './widget.css'
```

## Example: Component Skeleton

```tsx
import type { ComponentProps } from 'react'
import { useEffect, useRef, useState } from 'react'

interface IWidgetProps extends ComponentProps<'div'> {}

const Widget = ({ className, ...props }: IWidgetProps) => {
  // _Ref
  const previousValue = useRef<string | null>(null)

  // _State
  const [isOpen, setIsOpen] = useState(false)

  // _Event
  const handleClose = () => setIsOpen(false)

  // _Effect
  useEffect(() => {
    previousValue.current = isOpen ? 'open' : 'closed'
  }, [isOpen])

  return (
    <div className={className} {...props}>
      <button onClick={handleClose} type="button">Close</button>
    </div>
  )
}

export { Widget }
```

## Example: Utility Function

```ts
type Employee = { firstName: string; lastName: string }

export function fullName(employee: Employee): string {
  return `${employee.firstName} ${employee.lastName}`
}
```
