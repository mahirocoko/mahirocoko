# Frontend Review Checklist (Mahiro Signature)

Use this as a quick pre-merge checklist for frontend PRs.

## 1) Route and Screen Boundaries
- Route files stay in `app/routes/` and focus on page orchestration.
- Reusable UI remains in `app/components/` (no page-only logic in shared UI).
- Auth shell logic stays centralized in root/provider boundary.

## 2) Data and State Boundaries
- API/Supabase calls stay in `services/`, not inline in presentational UI.
- Server-state and client-state responsibilities are clearly separated.
- Auth/session sync is centralized (hook/store), not duplicated across pages.
- Persist only required store fields.

## 3) i18n and UX Consistency
- New UI copy uses Lingui (`t`/`Trans`) consistently.
- Locale/theme behavior follows provider/store flow (no ad-hoc overrides).
- Error and success feedback follows shared popup/message patterns.

## 4) Code Style and Patterns
- Typed route/component signatures follow project conventions.
- Interface naming with `I` prefix (when interfaces are used).
- Section order for hooks/components is preserved when applicable.
- New feature code matches existing route/service/store patterns.

## 5) Verification Gate
- Ran `lint`.
- Ran `typecheck`.
- Ran `test`.
- Ran `build` when route/build-sensitive changes are included.
