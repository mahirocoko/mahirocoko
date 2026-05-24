# Lesson: Letta RTK fallback should be deny-with-suggestion, not fake transparent rewrite

**Date**: 2026-05-24
**Tags**: letta-code, hooks, rtk, safety-guards, shell-commands

## Lesson

When integrating RTK with Letta Code, do not assume Claude Code hook semantics are fully supported. The existing RTK hook can emit `hookSpecificOutput.updatedInput`, but current Letta Code command-hook handling may not mutate `ShellCommand` input from that output. Verify end-to-end behavior: raw command requested by the agent should actually execute as `rtk ...`, not merely produce a valid hook JSON response in isolation.

Until Letta Code supports transparent input mutation, the practical fallback is:

1. Prefer manual `rtk` for verbose shell commands.
2. Use a scoped deny-with-suggestion hook for output-heavy raw commands only.
3. Preserve an escape hatch with `RTK_DISABLED=1 <cmd>` for exact/raw output.

## Implementation note

The local hook is `~/.letta/hooks/rtk-suggest-heavy.py`, registered before `rtk-rewrite.sh` in `~/.letta/settings.json`. It should block only likely high-token command families where `rtk rewrite` returns a useful alternative.

## Safety note

Secret-read guards must not scan heredoc bodies as shell syntax. A Python shebang like `#!/usr/bin/env python3` inside a `cat <<'PY'` body is data being written, not an `env` command being executed. Strip heredoc bodies before checking for environment-dump commands.
