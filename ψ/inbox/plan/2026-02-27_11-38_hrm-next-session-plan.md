# Plan: HRM data-wiring and provider-depth follow-up

## Background
Last session delivered HRM mockup screens, Base UI alignment, and provider/query-client boundary standardization. Provider composition now uses `app/providers/page-provider.tsx`, and query client creation is centralized in `app/utils/react-query/get-query-client.ts`. Frontend skill resources were updated to reflect these patterns.

## Pending from Last Session
- [ ] Commit remaining frontend skill doc updates in this repo (`.claude/skills/frontend/resources/*`).
- [ ] Review and decide what to keep from `ψ/memory/traces/` (new trace logs currently uncommitted).
- [ ] Add deeper tests for provider/query behavior in HRM (beyond heading smoke tests).
- [ ] Start wiring one real HRM feature with service + query/mutation + invalidation flow.

## Next Session Goals
- [ ] Create one focused commit for frontend skill resource updates and trace decisions.
- [ ] Add `useQuery` + `useMutation` integration for one HRM module (suggest `employee` or `leave`).
- [ ] Add provider-level regression tests (query client reuse + cache behavior on auth transition).
- [ ] Re-run full gate (`lint`, `format`, `typecheck`, `test`, `build`) after data wiring.

## Reference
- Handoff: `ψ/inbox/handoff/2026-02-27_11-37_hrm-mockup-base-ui-provider-pattern.md`
