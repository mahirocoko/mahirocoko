---
tags: [letta-code, rtk, hooks, tooling]
---
# Lesson: RTK can transparently rewrite Letta shell commands with a Letta adapter

RTK's modern hook engine is strong enough to replace Mahiro's old `rtk-suggest-heavy.py` deny-with-suggestion hook in Letta Code, but upstream RTK does not yet have first-class Letta support.

Key facts:
- RTK 0.42.4 supports `rtk rewrite`, `rtk hook claude`, `rtk hook check`, and transparent `hookSpecificOutput.updatedInput` for Claude-style payloads.
- Letta Code 0.27.18 consumes `hookSpecificOutput.updatedInput` and merges it into shell tool args.
- Letta's `exec_command` tool uses `tool_input.cmd`; Claude-style Bash payloads use `tool_input.command`.
- Upstream `rtk hook claude` currently rewrites `command` but ignores `cmd`, so it is not enough for Letta's main shell tool.

Local working pattern:
- Use `~/.letta/hooks/rtk-letta-rewrite.py` as a thin adapter over `rtk rewrite`.
- The adapter should support both keys, preserve other tool_input fields, and output:

```json
{"hookSpecificOutput":{"hookEventName":"PreToolUse","updatedInput":{"cmd":"rtk git status"}}}
```

Migration caution:
- Do not immediately delete old hook scripts if the current Letta session may still have them cached. Replace old paths with compatibility shims that delegate to the new adapter, then hard-delete in a later fresh session if desired.
- Prove the live runtime with real commands, not only manual payload tests: `git status` should show RTK compact output, while `RTK_DISABLED=1 git status` should show raw verbose Git output.

Potential upstream contribution: add `--agent letta` / `rtk hook letta` that matches `Bash|ShellCommand|exec_command` and reads both `tool_input.command` and `tool_input.cmd`.
