# Naming

## Intent

This page owns domain naming for files, components, hooks, variables, modules, query keys, and feature folders.

Use it when the question is what something should be called so that the domain stays obvious without reading surrounding implementation details.

## Naming Boundaries

Mahiro-style naming should expose the business concept, the artifact role, and the scope.

## Non-negotiable

- Name files and symbols after their domain job, not after vague shapes like `data`, `list`, `item`, or `helper`.
- Keep naming aligned with local repo conventions for casing, export style, and route file syntax first.
- Make hook names read like behavior, component names read like UI jobs, and service names read like domain or transport intent.
- Keep query keys, constants, and folder names explicit enough that search results reveal the owning feature.
- Do not move import-order or `interface` versus `type` debates into this page. Those belong to `foundations/code-style.md`.

## Preference

- Prefer names like `approval-queue-card.tsx`, `useApprovalFilters`, `ApprovalService`, and `console-layout-header.tsx` over generic placeholders.
- Prefer folder names that show business area, such as `attendance`, `approval`, `journey`, or `console`, instead of broad buckets like `common-work`.
- Prefer query keys that mirror domain concepts and list/detail intent rather than anonymous arrays.
- Prefer small naming systems that stay internally consistent inside one feature.

## Contextual

- `jit-flow` shows strong domain-first file and service naming across routes, hooks, and services. Even with a large tree, the domain stays searchable.
- `haabiz-hrm-fe` shows why naming matters even more in a lean repo: with fewer folders, file names and component names have to carry more ownership signal.
- `eizypay-fe` shows the monorepo version, where package names, app names, and shared exports all need to reveal scope clearly.
- Local file casing, interface naming, and export conventions still come from the active repo. This page decides domain clarity, not syntax-level style.

## Examples

- Names can stand on their own in code search, not just inside one local file.

```ts
const approvalQueueSummary = []
const employeeOnboardingChecklist = []
const attendanceRiskCards = []
```

- `approval-queue-card.tsx` is clearer than `card.tsx` because the feature and UI job are both visible.

```text
approval-queue-card.tsx
employee-onboarding-checklist.tsx
attendance-risk-summary.tsx
```

- `useEmployeeAttendanceFilters` is clearer than `useFilters` because the caller knows which filters the hook owns.
- `['approval-queue', employeeId]` is clearer than `['list', employeeId]` because the cache meaning survives outside the current file.

## Anti-Examples

- Naming everything as `items`, `data`, or `config` so the domain disappears outside the current file.

```ts
const items = []
const data = []
const config = []
```

- Naming a service `api.ts` in a repo that already has multiple domains and transport layers.
- Naming a component `Section` or `Content` when it is really the approval summary grid.
- Naming a store `useAppStore` when it only owns one local feature concern.
- Letting this page expand into generic formatting rules that belong elsewhere.
