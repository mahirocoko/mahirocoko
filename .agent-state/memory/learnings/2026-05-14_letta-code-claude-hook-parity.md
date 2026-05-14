> **Purpose:** Durable lesson for migrating Claude Code hooks into Letta Code without mixing memory and harness layers.
> **Last-Updated:** 2026-05-14

# Learning: Letta Code Claude Hook Parity

**Tags:** letta-code, hooks, claude-code, rtk, notifications, harness-config, workflow-parity

## Context

Mahiro asked whether the existing Claude Code hooks under `~/.claude` — especially RTK command rewriting and voice notification scripts — could be copied into `~/.letta` for Letta Code. The correct layer is harness configuration, not agent memory, because hooks enforce deterministic runtime behavior outside normal LLM choice.

## Durable Lesson

When migrating Claude Code hooks to Letta Code, first inspect the source `~/.claude/settings.json` and destination Letta merged config, then copy scripts into `~/.letta/hooks/` instead of referencing `~/.claude` directly. Add hooks in `~/.letta/settings.json` at user scope for personal global behavior. Create a timestamped backup before editing settings JSON, validate copied scripts with `bash -n`, verify required dependencies like `rtk` and `jq`, and test command hooks with sample stdin when possible.

For RTK specifically, the existing Claude hook emits a `hookSpecificOutput.updatedInput` payload. Letta docs also describe `updatedInput`, but runtime compatibility should be treated as configured/script-tested until verified after settings reload in a real Letta hook execution. Keep final reports precise: do not claim full hook runtime proof unless a fresh session or actual tool call demonstrates the harness applied it.

## Practical Checklist

1. Load/use `configuring-your-harness` for deterministic runtime config.
2. Run `show_config.py` before edits to check existing Letta hooks.
3. Read `~/.claude/settings.json` and identify exact events/matchers/commands.
4. Copy reusable scripts into `~/.letta/hooks/` and `chmod +x` them.
5. Backup `~/.letta/settings.json` before modifying it.
6. Add only necessary hooks; prefer narrow matchers such as `Bash|ShellCommand`.
7. Validate with `bash -n`, dependency checks, and a sample hook payload.
8. Tell Mahiro whether a fresh session is needed for hook reload.

## Applied Example

Configured Letta user hooks:

- `Stop` -> `~/.letta/hooks/say_finished.sh "Kanya" "ทำงานเสร็จแล้วค่ะ" 0.4 300`
- `Notification` -> `~/.letta/hooks/say_decision.sh "Kanya" "ต้องการการตัดสินใจค่ะ" 0.4 300`
- `PreToolUse` with matcher `Bash|ShellCommand` -> `~/.letta/hooks/rtk-rewrite.sh`

Backup path from this session: `~/.letta/settings.json.bak-20260514-222349`.
