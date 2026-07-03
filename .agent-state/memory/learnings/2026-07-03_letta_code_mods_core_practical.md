# Learning: Letta Code Core Practical Mods

Tags: letta-code, mods, workflow, control-room, plan-mode, threadkeeper, memfs-search

## Lesson

Letta Code `v0.27.21` removed the built-in goal tools/mode. For Mahiro's main persistent coding workflow, do not try to use `CreateGoal`, `UpdateGoal`, `GetGoal`, or `goal-loop`. The better replacement is a layered mod setup:

- `plan-mode` — use only when a non-trivial or risky task needs read-only exploration, a written plan, and explicit approval before edits.
- `control-room` — use for long-running work as the visible cockpit for human-owned goal, current mode, next step, verification state, and drift risk. Agent claims are `claimed`; only Mahiro can make something `verified`.
- `threadkeeper` — use for temporary live anchors: boundaries, open loops, drift guards, due state, or current mode. Keep it small, with TTL/close criteria. Do not store durable preferences there.
- `memfs-search` — use before answering remembered-context questions or before writing new memory when a relevant memory file may already exist.
- `user-timestamps` — automatic per-turn local time context; useful for relative time, due/expiry, and session continuity.

## Operational rule

Do not turn these mods into ceremony. Small tasks can proceed normally. Use Control Room for long work, Plan Mode for risky pre-approval work, Threadkeeper for live constraints, and MemFS search for recall. If Control Room reminds but no implementation state changed, inspect status and continue normally rather than forcing an update.

## Gotcha

`/mods list` is not the installed-mod listing command in the current runtime; `/mods` is the mod-learning command. Use shell `letta mods list` to inspect installed mods.
