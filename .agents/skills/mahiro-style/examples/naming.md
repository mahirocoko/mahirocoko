# naming

## Goal

Make names explain the domain without extra context.

## Do

Use names that can stand on their own.

```ts
const approvalQueueSummary = []
const employeeOnboardingChecklist = []
const attendanceRiskCards = []
```

Use descriptive filenames.

```text
approval-queue-card.tsx
employee-onboarding-checklist.tsx
attendance-risk-summary.tsx
```

## Avoid

Generic names that only make sense if you already know the file.

```ts
const items = []
const data = []
const config = []
```

```text
card.tsx
list.tsx
helper.ts
```

## Why

- code becomes easier to search
- ownership is clearer
- future refactors create less ambiguity
