# Hooks

## Intent

This page owns hook shape, hook extraction, and the boundary between route or component orchestration and reusable hook logic.

Use it when the question is whether a hook should exist, what it should return, and whether a hook is carrying transport, state, or UI responsibilities in the right place.

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

- `jit-flow` is the clearest reference for hooks that sit beside services and React Query wiring. The pattern works because transport still belongs to services and the hook owns consumption.
- `eizypay-fe` reinforces the same split with query-state helpers and shared packages. Hooks coordinate, but they do not replace service contracts.
- `haabiz-hrm-fe` shows a lighter app shape where many screens can stay simple without custom hooks until behavior actually repeats.
- Follow local formatter, snippet, and import rules from the active repo. This page decides hook responsibility, not tool-specific syntax.

## Examples

- A feature hook owns `useQuery` or `useMutation` wiring around `ApprovalService.listQueue`, then returns query state plus domain actions the screen needs.
- A local interaction hook owns disclosure state, keyboard handlers, and derived booleans for a reusable screen section.
- A route keeps loader-like navigation decisions inline when they are unique to that route instead of creating a one-off hook with no reusable boundary.

## Anti-Examples

- A `usePage` hook that quietly fetches data, opens dialogs, navigates, formats display strings, and shapes JSX copy for one route only.
- A hook that returns raw service payloads plus ten unrelated setters because it became a dumping ground for screen state.
- Moving a simple two-line `useState` block into a custom hook even though no reuse or clearer ownership appears.
- Treating this page as the owner of provider scope or global state policy. Those belong to `stores-state.md`.
