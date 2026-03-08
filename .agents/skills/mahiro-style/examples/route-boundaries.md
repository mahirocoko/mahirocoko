# route boundaries

## Goal

Keep route files as orchestration units, not dumping grounds.

## Do

Keep the route focused on composition and hand off config-heavy or presentational sections.

```tsx
import { approvalOverviewCards } from '@/constants/approval-overview'
import { ApprovalOverviewSection } from '@/components/approval/approval-overview-section'

const Page = () => {
  return (
    <main>
      <ApprovalOverviewSection items={approvalOverviewCards} />
    </main>
  )
}

export default Page
```

## Avoid

Keeping contracts, mock data, tone maps, and full rendering all in one giant route file.

```tsx
type ApprovalItem = {
  title: string
  count: string
}

const toneMap = {
  pending: '...'
}

const items = [
  { title: 'A', count: '1' },
  { title: 'B', count: '2' },
]

const Page = () => {
  return (
    <main>
      {items.map((item) => (
        <div key={item.title}>{item.title}</div>
      ))}
    </main>
  )
}

export default Page
```

## Why

- thinner route files are easier to scan
- config becomes reusable
- review gets easier because ownership is clearer
