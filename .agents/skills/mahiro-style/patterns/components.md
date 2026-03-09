# Components

## Intent

This page owns component conventions, extraction posture, and the split between presentational components and domain-aware components.

Use it when the question is whether code should stay in a route or screen, move into a component, or split into a presentational shell plus a domain wrapper.

## Detect

- Component named `Section`, `Content`, `CardList`, or another shape-only word with no domain signal
- Presentational component imports a service class, calls `fetch`, or performs navigation
- Component receives more than five tightly-coupled props that mirror its parent's internal state
- Route file defines full rendering tree, config maps, and domain types instead of composing components

## Component Boundaries

Mahiro-style components should make ownership visible.

- A presentational component mostly explains structure, styling, and slots.
- A domain-aware component can know feature concepts, domain copy, and screen-specific composition.
- The component boundary should reduce noise without hiding where the business decision really lives.

## Non-negotiable

- Keep component files responsible for one clear UI job.
- Extract a component when it clarifies ownership, not just when a file gets long.
- Keep presentational components free from transport logic, store mutation wiring, and route orchestration.
- Let domain-aware components carry feature vocabulary when the UI is meaningfully tied to that domain.
- Do not use this page to decide shared UI reuse thresholds across features, that belongs to `shared-ui-boundaries.md`.

## Preference

- Prefer components whose names reveal the screen section or domain job, such as `ApprovalOverviewSection` or `DashboardLayoutHeader`.
- Prefer passing already-shaped props instead of making a component derive feature meaning from raw backend payloads.
- Prefer extracting large visual sections, card groups, filter bars, and tables into components before a route becomes difficult to scan.
- Prefer small wrapper components when a shared primitive needs domain-specific labels, icons, or mapping.

## Contextual

- A token-first app can keep shared primitives generic while screen-specific layout wrappers and domain sections stay feature-aware.
- A larger app can let domain components, layout components, and reusable UI all coexist as long as each tier keeps a readable job.
- A monorepo can keep package-level shared UI while app-level components still own product wording and feature composition.
- Local snippet, formatter, and export conventions are repo-owned concerns. Follow those locally, then shape the component boundary with this doctrine.

## Examples

- A route hands shaped props to a domain section instead of mixing card config, status mapping, and JSX layout in the route file.

```tsx
import { DashboardSummarySection } from '@/components/dashboard/dashboard-summary-section'
import { dashboardSummaryCards } from '@/constants/dashboard-summary'

const Page = () => {
  return (
    <main>
      <DashboardSummarySection items={dashboardSummaryCards} />
    </main>
  )
}
```

- A presentational component accepts domain-neutral props. A feature wrapper maps domain meaning into those props.

```tsx
interface IStatusBadgeProps {
  label: string
  tone: 'info' | 'warning' | 'success'
}

const StatusBadge = ({ label, tone }: IStatusBadgeProps) => {
  return <span data-tone={tone}>{label}</span>
}
```

```tsx
const ApprovalStatusCell = ({ status }: { status: ApprovalStatus }) => {
  const { t } = useLingui()
  return (
    <StatusBadge
      label={t(getApprovalLabel(status))}
      tone={getApprovalTone(status)}
    />
  )
}
```

- A domain-aware section component owns its own query wiring and layout while the route stays thin.

```tsx
const DashboardMetricsSection = () => {
  const metricsQuery = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: DashboardService.getMetrics,
  })

  if (metricsQuery.isLoading) return <MetricsSkeleton />

  return (
    <div className="grid grid-cols-3 gap-4">
      {metricsQuery.data?.items.map((metric) => (
        <MetricCard key={metric.id} {...metric} />
      ))}
    </div>
  )
}
```

## Anti-Examples

- A component called `Section` or `CardList` that only makes sense if the reader already knows the route.

```tsx
const Section = ({ data }: { data: unknown[] }) => {
  return <div>{/* what domain? what screen? */}</div>
}
```

- A presentational component that imports a service, fetches its own data, and silently decides screen navigation.

```tsx
const UserAvatar = ({ userId }: { userId: string }) => {
  const router = useRouter()
  const userQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: () => UserService.getById(userId),
  })

  return (
    <img
      src={userQuery.data?.avatar}
      onClick={() => router.push(`/users/${userId}`)}
    />
  )
}
```

- Extracting a component that still depends on half the route file's local variables, making ownership harder to read rather than easier.

```tsx
const OrderSummary = ({
  items, totals, discounts, shippingMethod, 
  onApplyDiscount, onRemoveItem, onUpdateQuantity,
  isEditing, setIsEditing, validationErrors,
}: OrderSummaryProps) => {
  // still tightly coupled to the route's internal state
}
```

- Pushing shared UI leakage questions into this page instead of resolving them in `shared-ui-boundaries.md`.
