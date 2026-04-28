# Handoff: Orchestration Telemetry And Async Polling

**Date**: 2026-04-05 23:51
**Context**: 80%

## What We Did
- Diagnosed MCP `Request timed out` on long-running orchestration calls and confirmed workflows were actually completing from persisted traces.
- Added async polling support for `orchestrate_workflow` via `waitForCompletion: false` and `get_orchestration_result` so long-running jobs can return a `requestId` immediately.
- Used the new async flow to run an Opus review against `apps/blue-ledger` and verified the polling path works in practice.
- Expanded orchestration telemetry with per-job `status` inside `jobModels` and added richer usage summary dimensions: `bySource`, `byWorkflowStatus`, `byJobStatus`, `byDay`, `workflowOutcome`, `jobOutcome`, and `byRequestedModelOutcome`.
- Added trace support for `runner_failed` workflows and date-range inspection with `--from-date` / `--to-date`, including whole-day semantics for date-only input.
- Wrote retrospective and learning notes under `.agent-state/memory/` documenting the telemetry decision-making and implementation lessons.

## Pending
- [ ] Decide whether the separate `orchestration-result-store` + `data/traces/orchestration-results/` path should remain, or whether polling state should be unified more tightly with trace-based telemetry.
- [ ] Review and clean up older modified files in `apps/mcp-memory-layer` that predate this telemetry pass, especially `WORKFLOW.md`, `src/config/paths.ts`, `workflow-spec.ts`, `list-orchestration-traces.ts`, and `tests/run-orchestration-workflow.test.ts`.
- [ ] Validate that new traces generated after this session actually populate `byJobStatus` and `byRequestedModelOutcome` as expected, since current repo traces are mostly legacy entries.
- [ ] Decide whether to commit only the telemetry slice or split async polling/result-store work from usage-summary work into separate commits.

## Next Session
- [ ] Run `git diff -- apps/mcp-memory-layer` and separate telemetry changes made in this session from unrelated existing worktree changes.
- [ ] Exercise a fresh orchestration run that produces brand-new traces, then re-run `bun run list-orchestration-traces -- --format usage` to confirm status-based metrics populate on new data.
- [ ] Resolve the architecture question around trace store vs result store and either keep both intentionally with clearer docs or refactor toward a single source of truth.
- [ ] If keeping current design, add more reliability-focused reporting such as model/source combinations and top failing statuses.

## Key Files
- `apps/mcp-memory-layer/src/features/orchestration/mcp/register-tools.ts`
- `apps/mcp-memory-layer/src/features/orchestration/observability/orchestration-trace.ts`
- `apps/mcp-memory-layer/src/features/orchestration/observability/summarize-orchestration-trace-usage.ts`
- `apps/mcp-memory-layer/src/features/orchestration/observability/list-orchestration-traces.ts`
- `apps/mcp-memory-layer/src/features/orchestration/types.ts`
- `apps/mcp-memory-layer/src/features/orchestration/schemas.ts`
- `apps/mcp-memory-layer/src/features/orchestration/list-orchestration-traces-cli.ts`
- `apps/mcp-memory-layer/src/features/orchestration/format-orchestration-traces.ts`
- `apps/mcp-memory-layer/README.md`
- `.agent-state/memory/retrospectives/2026-04/05/23.49_orchestration-telemetry-and-async-polling.md`
