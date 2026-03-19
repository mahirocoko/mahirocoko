# TypeScript Guidelines

## Configuration

- **Strict mode**: [Enabled/Disabled]
- **No implicit any**: [Enabled/Disabled]
- **Strict null checks**: [Enabled/Disabled]

Base config lives in `[config path]`.

## Naming Conventions

### Interfaces

- **Prefix**: [`I` / none]
- **PascalCase**: Rest of the name

```ts
// Correct
interface IButtonProps extends ComponentProps<'button'> {
  variant?: 'primary' | 'secondary'
}

// Avoid
interface ButtonProps {}
```

### Types

- **PascalCase** for type aliases
- [Document whether `I` prefix is forbidden or allowed for `type` aliases]

### Enums

- **PascalCase** for enum names
- [Document whether values stay explicit, uppercase, or API-mapped]

## Exports

### Type Exports

Always export types alongside implementations when the repo does so.

### Barrels (`index.ts`)

Use barrel files to re-export when the repo actually uses them.

## Type Imports

Use `type` keyword for type-only imports when possible.

## Path Aliases

- `[real alias mapping]`

## Common Patterns

### Component Props

```tsx
[repo-faithful component props example]
```

### Store State / Service Response / Domain Payload

```ts
[repo-faithful state, service, or payload example]
```

## Avoid `any`

```ts
// Avoid
const data: any = fetchData()

// Better
const data: unknown = fetchData()
```

## Utility Types

Use TypeScript utility types.
