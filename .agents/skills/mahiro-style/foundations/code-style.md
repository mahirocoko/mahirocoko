# Code Style

## Intent

This page owns formatting posture, imports, TypeScript surface choices, internal section order, and export conventions.

Use it before editing code when the question is about how the file should be shaped, not what the domain should be named.

## Imports and Type Shape

Read the formatter and local repo rules first, then keep imports and type surfaces consistent with the winning local convention.

- Prefer `import type` for type-only imports when the repo uses it.
- Keep TypeScript surfaces explicit enough that props, payloads, and store shapes are easy to scan.
- Treat `interface` versus `type` as a local convention plus repeated repo pattern question, not a universal rule.

## Non-negotiable

- Follow the repo formatter, linter, and import-order output instead of hand-formatting against it.
- Keep code-style doctrine focused on formatting posture, imports, TypeScript surface choices, section order, and export conventions.
- Do not move naming doctrine into this page.
- Keep internal file sections predictable when the repo uses section ordering conventions.
- Match the winning local export style before applying fallback preference.

## Preference

- Prefer formatter-led consistency over manual styling.
- Prefer `import type` where the repo uses it and the import is type-only.
- Prefer explicit section order in larger components and hooks when it improves scanability.
- Prefer export posture that matches local scaffolding and repeated repo files.
- Prefer simple TypeScript surfaces that expose domain meaning without unnecessary alias churn.

## Contextual

This page is intentionally narrow because local repos vary a lot here.

- `jit-flow` explicitly calls out Biome, `import type`, named exports for components, and a stable section order for components and hooks.
- `haabiz-hrm-fe` also centers Biome, `import type`, kebab-case file posture, and section ordering when complexity grows, while allowing both default and named exports if local scaffolding does.
- `eizypay-fe` shows a stronger local rule set with required section comments, service-class patterns, and colocated type exports beside implementations.

The cross-repo pattern is not "one exact syntax everywhere." The real pattern is to respect the local code-style surface first, then use Mahiro fallback doctrine to keep new files internally clean and predictable.

## Examples

- A repo that uses `interface` for stable object contracts keeps that split clear, while unions and utility compositions stay as `type`.

```ts
interface IApprovalQueueItem {
  id: string
  title: string
  status: 'pending' | 'approved' | 'rejected'
}

type ApprovalStatus = IApprovalQueueItem['status']
type ApprovalToneMap = Record<ApprovalStatus, string>
```

- A Biome repo keeps import ordering and formatting aligned with Biome output instead of preserving hand-grouped imports, and keeps `import type` when the import is type-only.
- A larger component follows a stable internal order so reviewers can scan refs, state, queries, memo, events, and effects without hunting.

```tsx
const ApprovalQueueSection = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [searchValue, setSearchValue] = useState('')
  const approvalQueueQuery = useQuery({ ... })
  const filteredItems = useMemo(() => [], [])
  const handleSearchChange = (value: string) => setSearchValue(value)
  useEffect(() => {}, [])

  return <section ref={containerRef} />
}
```

- A repo with named-export component scaffolds keeps named exports for components, while route entry files still use default exports if that is how the local router works.

## Anti-Examples

- Rewriting imports into a personal style that fights the repo formatter.
- Using `type` for every object shape just because it is shorter, then mixing `I`-prefixed names into `type` aliases with no local precedent.

```ts
type IApprovalQueueItem = {
  id: string
  title: string
}
```

- Using this page to decide file naming, domain naming, or route/shared UI ownership.
- Mixing queries, handlers, refs, and effects in the order they happened to be written when the repo already relies on section order to keep larger files readable.
- Mixing named and default exports randomly inside one repo when local scaffolding already signals a winner.
- Turning `interface` versus `type` into a universal rule without checking the local repo first.
