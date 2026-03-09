# Stores and State

## Intent

This page owns client state placement, store scope, server-state versus client-state separation, and provider scope as a state ownership concern.

Use it when the question is whether state belongs in component state, a store, a query cache, or a provider, and how wide that state scope should be.

## State Placement and Provider Scope

State should live at the smallest scope that still matches its lifetime and sharing needs.

## Non-negotiable

- Keep server state in the repo's server-state layer, such as React Query, instead of duplicating it into client stores by default.
- Use stores for client state that truly needs cross-screen, cross-layout, or long-lived sharing.
- Keep provider scope aligned with the lifetime of the state or context it owns.
- Do not let a store become a dumping ground for unrelated UI flags, domain data, transport helpers, and side effects.
- Keep provider and state-scope rules here, not in `services.md`.

## Preference

- Prefer local component state for short-lived UI toggles, form openness, hover state, and other single-owner concerns.
- Prefer feature-scoped stores before app-wide stores when the state is only shared inside one feature area.
- Prefer root-level providers only for app-wide concerns such as query clients, theming, auth session bootstrapping, or global shell state.
- Prefer explicit persistence decisions instead of automatically persisting every store field.

## Contextual

- `jit-flow` is the clearest example of the server-state versus client-state split: React Query for remote data, Zustand for client state, providers near the app shell for app-wide concerns.
- `haabiz-hrm-fe` states the same split even with a smaller surface area. That is useful because it shows the doctrine still applies before the app grows large.
- `eizypay-fe` reinforces the same boundary inside a monorepo, where shared query helpers exist but app-level state still needs clear ownership.
- Local persistence middleware, provider APIs, and package wrappers belong to the repo. This page decides scope and lifetime, not library syntax.

## Examples

- Auth session tokens and hydration flags can live in a store because they are long-lived client concerns shared across the app shell.

```ts
interface IAuthState {
  accessToken: string
  isHydrated: boolean
  setAccessToken: (accessToken: string) => void
}

export const useAuthStore = create<IAuthState>((set) => ({
  accessToken: '',
  isHydrated: false,
  setAccessToken: (accessToken) => set({ accessToken }),
}))
```

- Query data for an approval list stays in React Query, while a local filter panel open state stays in the screen component or a small feature store.
- A provider lives in `root` or an app shell only when multiple routes need the context, otherwise the provider stays close to the owning feature.
- A feature-scoped store can own a route subtree concern, but it should not automatically become the app-wide home for unrelated UI and transport state.

## Anti-Examples

- Copying every query result into Zustand just because another screen might need it later.
- Creating one `useAppStore` that owns auth state, modal state, table filters, mutations, and navigation helpers for unrelated domains.

```ts
export const useAppStore = create((set) => ({
  accessToken: '',
  approvalFilters: {},
  isCreateModalOpen: false,
  hoveredCardId: '',
  submitApproval: async () => {},
  resetEverything: () => set({}),
}))
```

- Mounting a global provider for a feature concern that is only used by one route subtree.
- Treating stores as the right answer for any state that feels inconvenient in a component.
