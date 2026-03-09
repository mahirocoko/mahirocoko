# Services

## Intent

This page owns service layer intent, transport boundaries, API contracts, and where data-fetching mechanics belong.

Use it when the question is where API transport should live, where mapping should happen, and how route, hook, and service responsibilities should stay separate.

## Service Responsibilities

Services own transport intent. They are the home for endpoint calls, request shaping, response mapping decisions, and shared transport mechanics that the repo already standardizes.

## Non-negotiable

- Keep API transport out of route files and presentational components.
- Put request building, endpoint intent, and response-shaping logic behind a service boundary.
- Reuse the repo's existing service base pattern when one exists, instead of inventing a new fetch style next to it.
- Keep service APIs explicit enough that callers know the domain action they are invoking.
- Do not use this page to decide provider scope or global client state ownership. Those belong to `stores-state.md`.

## Preference

- Prefer domain-named service modules and methods that read like product actions, such as `ApprovalService.listQueue` or `GoalService.getSummary`.
- Prefer keeping data mapping close to the service when the mapping is tied to the transport contract.
- Prefer hooks, queries, or route loaders to consume services rather than rebuild endpoint details inline.
- Prefer concise method-level documentation when the local repo already expects it for service clarity.

## Contextual

- A responsibility-first app can use an explicit base service pattern and keep auth or transport behavior centralized.
- A monorepo can keep the same class-based or module-based service boundary across packages even though the exact package path changes.
- A lighter app can keep the service boundary ready without forcing `app/services/` too early, introducing it only when transport volume grows.
- Local HTTP clients, JSDoc rules, and exact method style belong to the repo. This page decides who owns transport and mapping.

## Examples

- A service method wraps the approval queue endpoint and returns shaped data, while a hook or route uses React Query around that method.

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

- A query or route loader consumes the domain service instead of rebuilding transport details inline.

```tsx
const approvalQueueQuery = useQuery({
  queryKey: ['approval-queue'],
  queryFn: ApprovalService.listQueue,
})
```

- A shared base service handles auth headers or common error handling once, while domain services expose business-intent methods.
- A route or hook imports a service method by domain name instead of embedding `fetch` calls and endpoint strings inline.

## Anti-Examples

- A route file that opens `fetch('/api/approval.listQueue')` inline because the service layer felt like extra work.

```tsx
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
```

- A presentational component that imports a service class and performs its own network request.
- A service module that also owns Zustand state, router redirects, and dialog visibility.
- Treating service naming as the whole problem while ignoring whether transport logic actually leaked into callers.
