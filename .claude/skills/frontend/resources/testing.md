# Testing Rules

- Place tests under `test/` or outside route discovery paths
- Keep tests deterministic
- Avoid network calls in unit tests without mocks

## Test Types

- Unit: render and behavior in isolation
- Integration: multiple modules collaborating (for example route + store + API mock)
- E2E: smoke paths only for critical user journeys

## Example: Component Test

```tsx
import { render, screen } from '@testing-library/react'

import { Badge } from '@/components/badge'

describe('Badge', () => {
  it('renders label', () => {
    render(<Badge>Active</Badge>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })
})
```

## Example: Mocking Network

```ts
vi.spyOn(global, 'fetch').mockResolvedValue(
  new Response(JSON.stringify({ ok: true }), { status: 200 }),
)
```

## Example: Error Path Test

```tsx
import { render, screen } from '@testing-library/react'

it('shows retry on request failure', async () => {
  vi.spyOn(global, 'fetch').mockRejectedValue(new Error('network'))
  render(<button>Retry</button>)
  expect(screen.getByText('Retry')).toBeInTheDocument()
})
```
