# Learning: Agent autonomy becomes believable only when worker launches are observable

**Date**: 2026-03-07  
**Context**: `agentbus` single-machine autonomy work with `codex` and `opencode`

## Pattern

For multi-agent orchestration, durable messages and task state are necessary but not sufficient. Users will still experience the system as "not really automatic" unless they can verify that a runtime was actually launched, why it was launched, and what happened when it ran.

## Evidence

- `agentbus` could already move tasks between `mahiro.codex.worker` and `mahiro.opencode.worker`
- the main debugging pain was not "can the bus deliver a message?" but "did `codex` or `opencode` actually spawn?"
- adding durable worker-run telemetry made it possible to inspect trigger, runtime, prepared command, exit code, and run outcome
- inspecting a real thread also revealed a second failure mode: source code may be updated while the live process still runs an older build, so missing behavior can come from stale processes rather than flawed logic

## Implication

Background-worker systems need first-class launch telemetry and explicit live-process awareness. Without those, developers and users will misdiagnose autonomy failures as protocol problems when the real issue is runtime visibility or stale daemons.

## Practical Rule

When building agent collaboration infrastructure:

1. Record every worker launch durably.
2. Show recent launches in both CLI and UI.
3. Distinguish "code changed" from "live process restarted."
4. Treat observability as part of the autonomy feature, not as optional debugging garnish.

## Application

For `agentbus`, this means:

- keep thread ownership and wake policy as first-class semantics
- persist worker runs with trigger, runtime, command, and outcome
- surface those runs in monitor and status flows
- require live stack restart verification before judging whether a new autonomy behavior works
