# interface vs type

## Goal

Keep object contracts readable and consistent with repo conventions.

## Do

Use `interface` for named object contracts that describe a stable shape.

```ts
interface IApprovalQueueItem {
  id: string
  title: string
  status: 'pending' | 'approved' | 'rejected'
}

interface IApprovalQueueCardProps {
  item: IApprovalQueueItem
  onOpen: (id: string) => void
}
```

Use `type` for unions, mapped types, and utility-style combinations.

```ts
type ApprovalStatus = 'pending' | 'approved' | 'rejected'

type ApprovalToneMap = Record<ApprovalStatus, string>
```

## Avoid

Using `type` for every object shape just because it is shorter.

```ts
type ApprovalQueueItem = {
  id: string
  title: string
  status: 'pending' | 'approved' | 'rejected'
}

type ApprovalQueueCardProps = {
  item: ApprovalQueueItem
  onOpen: (id: string) => void
}
```

Or mixing repo naming rules.

```ts
type IApprovalQueueItem = {
  id: string
}
```

## Why

- `interface` reads like a named contract
- `type` still fits better for unions and utility composition
- repo guides in Mahiro projects often distinguish these two on purpose
