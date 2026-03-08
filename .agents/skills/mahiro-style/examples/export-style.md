# export style

## Goal

Match the local repo's export conventions instead of mixing styles randomly.

## Do

Follow the repo's established pattern for the folder you are in.

```tsx
const ApprovalQueueCard = () => {
  return <div />
}

export { ApprovalQueueCard }
```

Or, if the repo's route scaffolds prefer default route exports:

```tsx
const Page = () => {
  return <main />
}

export default Page
```

## Avoid

Mixing named and default export style with no relation to local conventions.

```tsx
export default function ApprovalQueueCard() {
  return <div />
}
```

```tsx
const Page = () => {
  return <main />
}

export { Page }
```

## Why

- code feels consistent within the repo
- imports stay predictable
- AI output drifts less when there is already a clear local scaffold
