# RRR should generate derived pulse before retro

**Date**: 2026-04-04
**Tags**: #rrr #recap #pulse #metrics #mahiro-skills #workflow

## Lesson

If the workflow wants pulse context to exist reliably, `rrr` should generate or refresh that context before writing the retrospective and then refresh it again after the retrospective lands on disk. That makes pulse a byproduct of grounded session closure rather than a vague optional file that may or may not exist.

## Why it mattered today

The skill set had grown a concept called pulse, but the ownership model was fuzzy. `rrr` talked about reading `project.json` and `heartbeat.json`, and `recap` referenced `heartbeat.json`, yet nothing clearly owned the act of generating those files. The result was predictable: pulse was conceptually useful but operationally unreliable. The fix was not to invent a heavy telemetry system. The fix was to define pulse as a small local-derived snapshot based on facts already available in the repo: retrospective counts, today-session counts, streak length, weekly session change, current branch, recent commits, and visible git churn. Once `rrr` generates that data, `recap` can use it as supporting context for momentum and scale while still deferring to richer same-day retrospectives, handoffs, and active-thread evidence.

## Durable takeaway

For local memory workflows:

1. let `rrr` generate pulse from retrospective history and git state
2. keep pulse explicitly derived and humble
3. let `recap` consume pulse as supporting evidence only
4. refresh pulse after writing the retrospective so the snapshot includes the session that just closed

Pulse becomes trustworthy when its ownership and limits are explicit.
