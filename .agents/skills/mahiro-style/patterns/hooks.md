# Hooks

## Intent

This page owns hook shape, hook extraction, and the boundary between route or component orchestration and reusable hook logic.

Use it when the question is whether a hook should exist, what it should return, and whether a hook is carrying transport, state, or UI responsibilities in the right place.

## Detect

- Custom hook returns more than five unrelated values (queries, setters, handlers, formatted strings)
- Hook named `usePage` or `use[ScreenName]` that owns fetch, state, navigation, and formatting for one route only
- Simple two-line `useState` wrapped in a custom hook with no reuse or ownership benefit
- Hook imports service classes AND manages dialog/modal state AND performs navigation

## Hook Boundaries

Mahiro-style hooks package behavior, not confusion.

- A hook is a good home for reusable stateful behavior, query wiring, and event orchestration that multiple screens or components need.
- A hook is not an automatic home for every block of code that happens to use `useState` or `useEffect`.
- The hook boundary should make the caller simpler without hiding the real owner of transport, routing, or rendering.

## Non-negotiable

- Create a hook only when it gives a clearer reusable boundary than leaving the logic inline.
- Keep hook outputs deliberate: expose the state and actions the caller actually needs.
- Keep hook internals readable when they grow, using the repo's accepted section-order pattern if the repo already uses one.
- Do not move route-only orchestration into a hook just to make the route look shorter.
- Do not let hooks become a back door that mixes service transport design, provider placement, and shared UI ownership into one file.

## Preference

- Prefer hooks that describe a feature behavior, such as `useApprovalFilters` or `useConsoleSidebar`, instead of vague utility names.
- Prefer calling services from hooks when the hook owns server-state wiring, cache invalidation, or mutation orchestration.
- Prefer returning named values and handlers over opaque arrays unless the local repo has a strong established pattern.
- Prefer keeping rich JSX decisions in components and keeping hooks focused on behavior, state, and orchestration.

## Contextual

- In a responsibility-first app, hooks can sit beside services and React Query wiring cleanly because transport still belongs to services and the hook owns consumption.
- In a monorepo, hooks can coordinate query-state helpers and shared packages without replacing service contracts.
- In a lighter app, many screens can stay simple without custom hooks until behavior actually repeats.
- Follow local formatter, snippet, and import rules from the active repo. This page decides hook responsibility, not tool-specific syntax.

## Examples

- A feature hook owns query wiring around a service, then returns shaped state plus domain actions the screen needs.

```tsx
const useApprovalQueue = (filters: IApprovalFilters) => {
  const queueQuery = useQuery({
    queryKey: ['approval-queue', filters],
    queryFn: () => ApprovalService.listQueue(filters),
  })

  const approveMutation = useMutation({
    mutationFn: ApprovalService.approve,
    onSuccess: () => queueQuery.refetch(),
  })

  return {
    items: queueQuery.data?.items ?? [],
    isLoading: queueQuery.isLoading,
    approve: approveMutation.mutate,
    isApproving: approveMutation.isPending,
  }
}
```

- A local interaction hook owns disclosure state and keyboard behavior for a reusable screen section.

```tsx
const useCommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return { isOpen, setIsOpen, query, setQuery }
}
```

- A route keeps loader-like navigation decisions inline when they are unique to that route instead of creating a one-off hook with no reusable boundary.

```tsx
const SettingsPage = () => {
  const { tab } = useParams()
  const navigate = useNavigate()

  if (!VALID_TABS.includes(tab)) {
    navigate('/settings/general', { replace: true })
    return null
  }

  return <SettingsLayout activeTab={tab} />
}
```

## Anti-Examples

- A `usePage` hook that quietly fetches data, opens dialogs, navigates, formats display strings, and shapes JSX copy for one route only.

```tsx
const useApprovalPage = () => {
  const router = useRouter()
  const { data } = useQuery({ queryKey: ['approvals'], queryFn: fetchApprovals })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const formattedTitle = `Approvals (${data?.length ?? 0})`

  const handleRowClick = (id: string) => {
    setSelectedId(id)
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    router.push('/dashboard')
  }

  return { data, isModalOpen, selectedId, formattedTitle, handleRowClick, handleClose }
}
```

- A hook that returns raw service payloads plus unrelated setters because it became a dumping ground for screen state.

```tsx
const useEmployeeDashboard = () => {
  const employees = useQuery({ ... })
  const attendance = useQuery({ ... })
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [isExporting, setIsExporting] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  return {
    employees: employees.data,
    attendance: attendance.data,
    searchTerm, setSearchTerm,
    sortBy, setSortBy,
    isExporting, setIsExporting,
    toastMessage, setToastMessage,
  }
}
```

- Moving a simple two-line `useState` block into a custom hook even though no reuse or clearer ownership appears.

```tsx
const useDisclosure = () => {
  const [isOpen, setIsOpen] = useState(false)
  return { isOpen, setIsOpen }
}
```

- Treating this page as the owner of provider scope or global state policy. Those belong to `stores-state.md`.
