# Handoff: AgentBus Join Flow, Docs, and Thread Ownership Gap

**Date**: 2026-03-07 15:43 (GMT+7)
**Context**: 90%

## What We Did
- Incubated `agentbus` into `ψ/incubate/mahirocoko/agentbus` and built the current Bun/Hono/SQLite MVP in `~/ghq/github.com/mahirocoko/agentbus`.
- Added and verified the project-local AgentBus skill and OpenCode integration, then reworked the skill to be `user-invocable` with command-style lenses similar to the `frontend` skill.
- Built a more end-user-friendly `/monitor` UI so agent conversations are readable like a chat app instead of an ops dashboard.
- Added v2 direction docs:
  - `docs/v2-architecture.md`
  - `docs/adapter-contract.md`
- Scaffolded runtime-layer code under `src/runtime/`:
  - manifest types
  - adapter interface
  - generic-command adapter
- Implemented `bun run agentbus:join` to create a join manifest and register peers on the bus.
- Wired `agentd` to auto-discover manifests from `.agentbus/manifests/*.json` instead of requiring every worker to be hand-added to `agentd.json`.
- Rewrote `README.md` and `EXAMPLE.md` to separate:
  - human-facing start-here docs
  - concrete cookbook scenarios
- Added `AGENT_PLAYBOOK.md` for AI-agent-facing operating rules and linked it from `README.md` and `AGENTS.md`.
- Inspected thread `thr_0aa342e826154d1faa80c6b423bd665f` and confirmed the core product gap:
  - AgentBus currently waits on tasks, not on autonomous thread ownership.
  - Follow-up notes with `taskId: null` do not wake workers.

## Pending
- [ ] Add thread-level ownership so a worker can continue owning a conversation after a task completes.
- [ ] Add thread-level wake semantics so new messages on an owned autonomous thread wake the owner even when `taskId` is `null`.
- [ ] Extend schema/model with fields like `thread.mode`, `thread.ownerPeerId`, `thread.wakeupPolicy`, and `thread.stopCondition`.
- [ ] Update `agentd` to resume by thread owner, not only by actionable task-bound inbox items.
- [ ] Decide whether `note` should remain passive or become actionable when delivered to the owner of an autonomous thread.
- [ ] Add monitor visibility for thread owner, waiting state, and why no worker replied yet.
- [ ] Decide how far to take CLI surface next (`agentbus start/status/doctor`) versus prioritizing autonomy semantics first.
- [ ] Commit real work inside `~/ghq/github.com/mahirocoko/agentbus` when ready; that repo still has many uncommitted changes.

## Next Session
- [ ] Start from the diagnosis in `src/agentd.ts`: current worker loop drops messages with no `task` and treats `note` as passive.
- [ ] Implement minimal autonomous-thread contract:
  - `thread.mode = request_reply | autonomous_loop`
  - `thread.ownerPeerId`
  - `thread.wakeupPolicy = on_message | on_timer | manual`
  - `thread.stopCondition`
- [ ] Update persistence layer (`src/db.ts`, `src/types.ts`, `src/store.ts`) to store the new thread fields.
- [ ] Update `agentd` so owned autonomous threads wake the owner on new messages even when no new task is created.
- [ ] Re-test with the same thread scenario: root request -> worker response -> follow-up note -> worker resumes without human prompt.
- [ ] After the above works, revisit CLI surface (`agentbus start/status/doctor`) and native adapters for other runtimes.

## Key Files
- `ψ/incubate/mahirocoko/agentbus`
- `~/ghq/github.com/mahirocoko/agentbus/README.md`
- `~/ghq/github.com/mahirocoko/agentbus/EXAMPLE.md`
- `~/ghq/github.com/mahirocoko/agentbus/AGENT_PLAYBOOK.md`
- `~/ghq/github.com/mahirocoko/agentbus/AGENTS.md`
- `~/ghq/github.com/mahirocoko/agentbus/.agents/skills/agentbus/SKILL.md`
- `~/ghq/github.com/mahirocoko/agentbus/src/join.ts`
- `~/ghq/github.com/mahirocoko/agentbus/src/runtime/types.ts`
- `~/ghq/github.com/mahirocoko/agentbus/src/runtime/manifest.ts`
- `~/ghq/github.com/mahirocoko/agentbus/src/runtime/adapter.ts`
- `~/ghq/github.com/mahirocoko/agentbus/src/runtime/adapters/generic-command.ts`
- `~/ghq/github.com/mahirocoko/agentbus/src/agentd.ts`
- `~/ghq/github.com/mahirocoko/agentbus/src/agentd/config.ts`
- `~/ghq/github.com/mahirocoko/agentbus/src/monitor.ts`
- `~/ghq/github.com/mahirocoko/agentbus/src/db.ts`
- `~/ghq/github.com/mahirocoko/agentbus/src/types.ts`
