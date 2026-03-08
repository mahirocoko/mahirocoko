# shared ui boundaries

## Goal

Keep reusable UI generic and push business logic outward.

## Do

Let shared UI express presentation only.

```tsx
interface IStatusBadgeProps {
  label: string
  tone: 'info' | 'warning' | 'success'
}

const StatusBadge = ({ label, tone }: IStatusBadgeProps) => {
  return <span data-tone={tone}>{label}</span>
}
```

Then let the feature decide business mapping.

```tsx
const ApprovalStatusCell = ({ status }: { status: ApprovalStatus }) => {
  return <StatusBadge label={getApprovalLabel(status)} tone={getApprovalTone(status)} />
}
```

## Avoid

Hardcoding page-specific workflow logic into a shared primitive.

```tsx
const StatusBadge = ({ status }: { status: ApprovalStatus }) => {
  if (status === 'pending-payroll-review') {
    return <span>รอ payroll ตรวจ</span>
  }

  if (status === 'rejected-by-people-ops') {
    return <span>People Ops ปฏิเสธ</span>
  }

  return <span>สถานะ</span>
}
```

## Why

- shared UI remains reusable
- business rules stay near the feature
- future domains do not inherit accidental coupling
