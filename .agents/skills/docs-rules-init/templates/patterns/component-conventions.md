# Component Conventions

## Code Organization

Use clear section comments to organize component and hook code when complexity grows. This keeps files easier to scan and review.

### Section Order

1. Imports
2. Interface/Type definitions
3. Constants
4. Component function
5. Inside component body (in order):
   - hooks initialization
   - section comments
   - return JSX

### Section Comments

| Section | Purpose |
|---------|---------|
| `// _Ref` | `useRef` declarations |
| `// _State` | `useState` or local UI state declarations |
| `// _Query` | query hooks or data fetching |
| `// _Mutation` | mutation hooks or write actions |
| `// _Memo` | `useMemo` for computed values |
| `// _Callback` | `useCallback` for memoized functions |
| `// _Form` | form schemas and form instances |
| `// _Event` | event handler functions |
| `// _Effect` | `useEffect` hooks |

### Example

```tsx
[repo-faithful example using the repo's real data, i18n, and state libraries]
```

## Template

```tsx
[boilerplate component template aligned with the repo's import, typing, and export posture]
```

## Route Components

- Route files should stay thin and primarily connect URL structure to layout or feature partials.

## Feature Partials

When a page grows beyond a single clean file, extract partials into a feature-owned folder.

## Owner-Local Data

When copy, nav items, badges, or placeholder options belong to one component only, keep them with the owner by default.
