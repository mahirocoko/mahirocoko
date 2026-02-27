# React Router Framework Profile

## Code Style Guide
- Use typed route component props (`Route.ComponentProps`) from generated route types when available.
- Keep route exports explicit and consistent (`const Page = ...; export default Page`).

## Navigation and Screen Rules
- Keep file-based route modules under `app/routes/` with `flatRoutes()` registration in `app/routes.ts`.
- Keep compatibility redirects as dedicated route files, not scattered redirect logic.
- Keep auth shell/layout split in `app/root.tsx` so nested routes remain focused.
- Keep shared providers grouped under `app/providers/` with a barrel export (`app/providers/index.ts`).

## Testing Rules
- Test route-level states (loading/error/redirect) with deterministic query and mutation mocks.
- Keep route tests outside discovery paths to avoid runtime/build coupling.

## State and Data Rules
- Keep loader/action or route-query orchestration inside route modules; service modules handle integration.
- Centralize auth/session sync in hook/store boundary and reuse it from root + routes.
- Keep React Query client creation in `app/utils/react-query/get-query-client.ts` and consume it in provider modules.

## Implementation Patterns
- Pattern: root composes providers once (`PageProvider` from `app/providers`), then route modules orchestrate page data.
- Pattern: route module owns query/mutation invalidation and user feedback messaging.

## Anti-Patterns
- Do not duplicate route bootstrap/auth redirect logic across many routes.
- Do not bypass typed route contracts when generated types are available.
