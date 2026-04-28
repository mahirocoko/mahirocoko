# Handoff: Worker-First Orchestration And Memory Layer Hardening

**Date**: 2026-04-04 23:20
**Context**: 85%

## What We Did
- Reoriented the repo doctrine toward worker-first orchestration and tightened `AGENTS.md` so Gemini/Cursor usage, explicit model selection, verification depth, and plan-mode posture are more concrete.
- Added `apps/mcp-memory-layer/WORKFLOW.md` and aligned package docs with headless worker usage, explicit model rules, and practical parallel execution guidance.
- Hardened Gemini structured parsing so fenced JSON response bodies parse correctly while the outer envelope remains strict.
- Enforced explicit `--model` requirements in Gemini/Cursor CLI and worker-facing surfaces, removed misleading implicit defaults, and updated tests accordingly.
- Improved memory-layer behavior: retrieval modes now affect ranking, degraded keyword-only fallback works when embeddings fail, degraded traces are persisted and asserted, and context building is now mode-aware.
- Wrote `/rrr` outputs for the session retrospective and lesson learned, then refreshed pulse metrics.

## Pending
- [ ] Decide how to commit the current worktree. The session produced a broad but coherent set of uncommitted changes across doctrine, docs, package code, tests, and local memory notes.
- [ ] Optional docs polish: the Cursor worker JSON example in `apps/mcp-memory-layer/README.md` is valid as schema, but could still be labeled more explicitly as an example shape rather than a recommendation.
- [ ] Apply the worker-first orchestration posture consistently in the next session without regressing into local-analysis-first behavior.

## Next Session
- [ ] Start with `/recap` and confirm the dirty worktree matches this handoff before changing anything.
- [ ] Review the current diff and split it into sensible commit boundaries if you want smaller commits instead of one large session commit.
- [ ] If continuing `apps/mcp-memory-layer`, choose between repo-wide orchestration adoption work or another product-facing improvement in retrieval/cost behavior.

## Key Files
- `AGENTS.md`
- `apps/mcp-memory-layer/README.md`
- `apps/mcp-memory-layer/WORKFLOW.md`
- `apps/mcp-memory-layer/src/features/gemini/core/normalize-gemini-result.ts`
- `apps/mcp-memory-layer/src/features/gemini/gemini-cli.ts`
- `apps/mcp-memory-layer/src/features/gemini/gemini-worker-service.ts`
- `apps/mcp-memory-layer/src/features/cursor/cursor-cli.ts`
- `apps/mcp-memory-layer/src/features/cursor/core/run-cursor-command.ts`
- `apps/mcp-memory-layer/src/features/cursor/cursor-worker-service.ts`
- `apps/mcp-memory-layer/src/features/memory/retrieval/hybrid-search.ts`
- `apps/mcp-memory-layer/src/features/memory/retrieval/rank.ts`
- `apps/mcp-memory-layer/src/features/memory/retrieval/context-builder.ts`
- `apps/mcp-memory-layer/tests/gemini-worker.test.ts`
- `apps/mcp-memory-layer/tests/cursor-worker.test.ts`
- `.agent-state/memory/retrospectives/2026-04/04/23.18_orchestration-worker-first-and-memory-layer-hardening.md`
- `.agent-state/memory/learnings/2026-04-04_mode-is-not-model-worker-first-orchestration.md`
