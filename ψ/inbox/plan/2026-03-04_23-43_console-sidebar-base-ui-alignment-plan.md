# Plan: Console Sidebar Base UI Re-Alignment

## Background
Session implemented `/console` layout with split modules under `components/layouts/console/`, added Base UI primitives, and fixed multiple runtime issues (Button `nativeButton`, Menu group context, collapsible chevron state selector). Style and pattern audits were executed via direct tools and parallel agents.

## Pending from Last Session
- Align remaining components to base snippet patterns more strictly (especially `sidebar.tsx` internals) while preserving project tokens.
- Finish arrow-function normalization for new UI components and confirm consistency after formatter pass.
- Continue reconciling `styleguide.tsx` with latest component set without adding Sidebar section.
- Re-run runtime interaction checks for TeamSwitcher, NavUser, and collapsible groups after structural updates.

## Next Session Goals
- Perform strict diff and patch for `app/components/ui/sidebar.tsx` against canonical base snippets.
- Keep semantic token usage and Tailwind v4 utility naming (`wrap-break-word`) intact.
- Validate with `pnpm lint && pnpm format && pnpm typecheck && pnpm test` (no build unless explicitly requested).

## Reference
- Handoff: `ψ/inbox/handoff/2026-03-04_23-41_console-sidebar-base-ui-alignment.md`
