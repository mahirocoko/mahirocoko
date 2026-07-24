---
title: Herdr lifecycle reload safety
date: 2026-07-24
tags:
  - letta-mod
  - herdr
  - react
  - cleanup
  - lifecycle
  - agent-halo
  - verification
---

# Herdr lifecycle reload safety

## Durable lesson

A Letta Mod can trigger React `Maximum update depth exceeded` without calling React itself. During engine-owned reload, Letta aborts the outgoing mod generation and then clears its registry. If a mod's cleanup calls every command/tool/event/panel disposer after that abort, each unregister may publish another external-store snapshot while React passive effects are flushing. Enough registrations can cross React's nested passive-update threshold.

Use a two-path cleanup contract:

1. Always stop mod-owned timers, child processes, sockets, panels, and other resources.
2. If `letta.signal.aborted` is false, run registration disposers normally and symmetrically.
3. If `letta.signal.aborted` is true, skip redundant per-registration disposers because the engine is already clearing the entire generation.
4. Test both paths explicitly: normal cleanup must unregister everything; engine-aborted cleanup must not republish the dying registry.
5. Do not assume reducing tool count or removing one accessor proves the cause. Use a disable sentinel or tiny registration probe to isolate reload behavior.

## Adjacent integration rules

- One interactive Letta root owns one Herdr pane; inherited child environment variables do not grant authority.
- Send only count/type metadata. Prompt-derived descriptions remain sensitive even when truncated.
- Treat process disappearance as `ended`, not successful `done` or error.
- Persisted pane IDs are routing hints only. Revalidate current PID, process start, and conversation scope before focus.
- Bound the whole transport: one in-flight plus one latest report, connect deadline, read/write/size limits, response ID/error validation, and cleanup.

## Concrete evidence

- Disabling only `mahiro-herdr-lifecycle` removed the warning; enabling it restored the warning.
- Removing external `subagents.list()` access did not remove the warning.
- Cursor Fable traced the verified source chain: disposer → unregister `onChange()` → mod-engine publish → `useSyncExternalStore` passive update accounting.
- Signal-aware cleanup removed the warning; Mahiro confirmed the final reload.
- Final diagnostics were 0 errors / 0 warnings.
- Live Herdr showed one `repo-scout` child and later `subagents_ended=1`.
- Mods v0.8.0 was released from commit `f906894`; Agent Halo exact focus was committed as `3fc8ff8`.

## Reuse trigger

Apply this lesson whenever a Letta Mod adds several registrations, reload warnings appear only when that mod is enabled, or cleanup runs during `/reload`. Also apply the identity/privacy/transport rules to any local agent-host integration that turns persisted terminal metadata into a foreground action.

