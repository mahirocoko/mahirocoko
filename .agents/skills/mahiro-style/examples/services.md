# services

## Goal

Keep transport and backend intent in services, not in screen components.

## Do

Keep API access behind a service boundary.

```ts
interface IApprovalQueueResponse {
  items: IApprovalQueueItem[]
}

export class ApprovalService {
  static listQueue() {
    return postJSON<IApprovalQueueResponse>('/approval.listQueue', {})
  }
}
```

Then let the route or hook consume the service.

```tsx
const approvalQueueQuery = useQuery({
  queryKey: ['approval-queue'],
  queryFn: ApprovalService.listQueue,
})
```

## Avoid

Building transport logic directly inside route or component files.

```tsx
const Page = () => {
  const approvalQueueQuery = useQuery({
    queryKey: ['approval-queue'],
    queryFn: async () => {
      const response = await fetch('/api/approval.listQueue', {
        method: 'POST',
        body: JSON.stringify({}),
      })

      return response.json()
    },
  })

  return <main />
}
```

## Why

- service intent becomes reusable
- route files stay orchestration-focused
- auth and transport patterns stay centralized
