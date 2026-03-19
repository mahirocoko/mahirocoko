# Import Guidelines

## Import Order

[Formatter or linter] automatically organizes imports when you run `[verified command]`.

### General Order

1. External libraries
2. Internal packages or workspace packages
3. Aliased imports
4. Relative imports
5. Type imports (grouped together when possible)

```ts
// Correct
[repo-faithful import block]
```

## Type Imports

Use `type` keyword for type-only imports:

```ts
// Correct
import type { ComponentProps } from 'react'
import type { [RepoType] } from '@/[path]'
import { useState } from 'react'
```

## Path Aliases

Document the real alias mapping used by the repo.

```ts
[repo-faithful alias examples]
```

## Relative Imports

Keep relative imports shallow:

```ts
// Preferred
[preferred shallow import example]

// Acceptable
[same-folder example]

// Avoid
[too-deep relative import example]
```

## Dynamic Imports

Document this only if the framework or repo uses meaningful dynamic import patterns.

## Named vs Default Exports

### Services

```ts
[repo-faithful service export example]
```

### Components

```tsx
[repo-faithful component export example]
```

### Types

```ts
[repo-faithful type export example]
```

## Barrel Files (`index.ts`)

Use re-exports for clean imports when the repo actually uses them:

```ts
[repo-faithful barrel example]
```

## Side Effect Imports

Avoid side effect imports unless necessary:

```ts
[repo-faithful side effect import example]
```

## Duplicate Imports

[Formatter or linter] consolidates duplicate imports.

## Unused Imports

[Formatter or linter] [warns/errors] on unused imports. Remove them before committing.
