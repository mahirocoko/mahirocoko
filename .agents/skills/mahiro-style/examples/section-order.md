# section order

## Goal

Make components and hooks easier to scan when they grow.

## Do

Use a stable internal order.

```tsx
const ApprovalQueueSection = () => {
  // _Ref
  const containerRef = useRef<HTMLDivElement | null>(null)

  // _State
  const [searchValue, setSearchValue] = useState('')

  // _Query
  const approvalQueueQuery = useQuery({ ... })

  // _Memo
  const filteredItems = useMemo(() => [], [])

  // _Event
  const handleSearchChange = (value: string) => setSearchValue(value)

  // _Effect
  useEffect(() => {}, [])

  return <section ref={containerRef} />
}
```

## Avoid

Mixing queries, handlers, refs, and effects in the order they happened to be written.

```tsx
const ApprovalQueueSection = () => {
  const handleSearchChange = (value: string) => setSearchValue(value)
  const approvalQueueQuery = useQuery({ ... })
  useEffect(() => {}, [])
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [searchValue, setSearchValue] = useState('')

  return <section ref={containerRef} />
}
```

## Why

- reviewers can find concerns faster
- large components stay readable longer
- it becomes easier to spot missing boundaries and dead code
