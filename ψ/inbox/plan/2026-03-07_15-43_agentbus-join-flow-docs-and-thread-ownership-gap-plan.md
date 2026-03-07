# Plan: AgentBus Thread Ownership and Autonomous Wakeups

## Background
Session incubated and advanced `agentbus` significantly: join manifests, manifest discovery in `agentd`, docs rewrite for humans, AI-agent playbook, skill updates, and a runtime scaffold for v2 adapters. The biggest product gap discovered from real thread behavior is that AgentBus currently resumes workers from task ownership, not thread ownership.

## Pending from Last Session
- Add thread-level ownership so a worker can keep owning a conversation after task completion.
- Add thread wake semantics for follow-up messages with `taskId: null`.
- Extend schema/model with `thread.mode`, `thread.ownerPeerId`, `thread.wakeupPolicy`, and `thread.stopCondition`.
- Update `agentd` to wake by thread owner instead of only actionable task-bound inbox items.
- Decide whether owner-targeted `note` messages should become actionable on autonomous threads.
- Expose thread owner and waiting state in `/monitor`.

## Next Session Goals
- Start in `src/agentd.ts`, `src/types.ts`, `src/db.ts`, and `src/store.ts`.
- Implement the smallest viable autonomous-thread contract and persistence.
- Make a conductor worker resume on follow-up thread traffic without human prompts.
- Reproduce the prior failure mode and verify the fix with a real test thread.
- Only after that, decide whether to continue with CLI polish (`agentbus start/status/doctor`) or broader adapter coverage.

## Reference
- Handoff: `ψ/inbox/handoff/2026-03-07_15-43_agentbus-join-flow-docs-and-thread-ownership-gap.md`
