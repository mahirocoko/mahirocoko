# Hooks Pattern

## Code Organization

Use clear section comments to organize hook code. This keeps hooks easier to read and maintain.

### Section Order

1. Imports
2. Hook function
3. Inside hook body (in order):
   - hooks initialization
   - section comments
   - return statement

### Section Comments

| Section | Purpose |
|---------|---------|
| `// _Ref` | `useRef` declarations |
| `// _State` | `useState` declarations |
| `// _Query` | TanStack Query or other query hooks |
| `// _Mutation` | TanStack Query or other mutation hooks |
| `// _Memo` | `useMemo` for computed values |
| `// _Callback` | `useCallback` for memoized functions |
| `// _Form` | form schemas and form instances |
| `// _Event` | event handler functions |
| `// _Effect` | `useEffect` hooks |

### Example

```ts
[repo-faithful hook example]
```

## Query Hooks

Use the repo's actual query and mutation library here.

## `useMutation` Template

```ts
export const useMyMutation = () => {
  return useMutation({
    mutationFn: (payload: TPayload) => MyService.method(payload),
  })
}
```

## `useQuery` Template

```ts
export const useFetchMyData = () => {
  return useQuery({
    queryKey: ['my-data'],
    queryFn: () => MyService.getData(),
  })
}
```

## Best Practices

1. **Keep hooks focused**: One clear responsibility per hook
2. **Return simple APIs**: Prefer small return surfaces
3. **Type everything**: Hook params and return shapes should stay explicit
