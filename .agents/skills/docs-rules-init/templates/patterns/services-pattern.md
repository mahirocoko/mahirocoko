# Services Pattern

## Current Status

[Say clearly whether the repo already has a shared service layer.]

## BaseService

If the repo uses or plans a base transport class, document it here.

### BaseService Methods

```ts
[repo-faithful BaseService method surface]
```

## Service Template

```ts
[repo-faithful service template]
```

## Request Config

```ts
[repo-faithful request config type if the repo has one]
```

### Using Fallback

```ts
[repo-faithful fallback example if the repo has one]
```

If the repo does not use request config or fallbacks, keep these sections only as short explicit notes.

## Service File Structure

```text
services/
├── [base file or entry file]
├── [domain folder]/
│   ├── index.ts
│   └── utils.ts
└── ...
```

If the service layer is minimal, keep the real one-file structure instead of forcing domain folders.

## Best Practices

### 1. Stable Export Pattern

```ts
[repo-faithful service export pattern example]
```

### 2. Type Safety

Always specify request and response types when the repo has shared service data.

```ts
[repo-faithful typed service example]
```

### 3. Payload Interfaces

Define payload interfaces in the repo's shared or owner-local type layer.

```ts
[repo-faithful payload typing example]
```

### 4. Method Naming

- **GET data**: `get`, `list`, `fetch`
- **POST create**: `add`, `create`
- **POST update**: `update`, `edit`
- **POST delete**: `remove`, `delete`
- **POST action**: verb matching the action

Adapt these verbs to the target repo's actual naming posture instead of forcing the full list.

### 5. Comments

Add JSDoc comments for public methods only if the repo uses them consistently.

## Using Services in Components

```tsx
[repo-faithful component or hook usage example]
```

## Best Practices Summary

1. **Keep transport in services or service-like owners, not spread across unrelated components**
2. **Type every request and response**
3. **Only introduce shared services after repetition justifies the layer**
