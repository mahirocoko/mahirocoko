# stores

## Goal

Keep stores focused on long-lived client state instead of turning them into app-wide dumping grounds.

## Do

Store only the state the app truly needs to share.

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

## Avoid

Using one store to hold unrelated feature UI state, filters, modal state, and transport helpers.

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

## Why

- ownership stays clear
- persistence decisions stay intentional
- features remain easier to refactor independently
