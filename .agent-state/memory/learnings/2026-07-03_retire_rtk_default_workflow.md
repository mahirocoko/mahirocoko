# Learning: RTK retired from default Letta workflow

Tags: rtk, letta-code, workflow, hooks, command-output

## Lesson

As of 2026-07-03, RTK is retired from Mahiro's default Letta workflow. Use repo-native raw commands by default (`pnpm check`, `bun test`, `git diff`, `cargo check`, etc.) and keep commands focused with scoped paths/flags rather than automatically wrapping with `rtk`.

RTK remains installed as a manual fallback/debug tool only. Do not uninstall it unless Mahiro explicitly asks, but do not restore the Letta RTK rewrite hook or prepend `rtk` by habit.

## Current runtime state

The Letta `PreToolUse` RTK rewrite hook was removed from `~/.letta/settings.json` and Mahiro ran `/reload`. Keep these hooks active:

- `python3 ~/.letta/hooks/block-secret-reads.py`
- `python3 ~/.letta/hooks/block-letta-commit-attribution.py`

The old RTK hook files/logs may remain on disk for rollback/debugging:

- `~/.letta/hooks/rtk-letta-rewrite.py`
- `~/.letta/hooks/rtk-letta-rewrite.log`
- `~/.letta/hooks/rtk-suggest-heavy.py`
- `~/.letta/hooks/rtk-rewrite.sh`

## Guidance cleanup

Do not add RTK guidance to repo `AGENTS.md` files by default. The `mahirocoko` repo removed its `Command Output / RTK` section entirely. Old RTK retrospectives/learnings should remain as history/debug evidence, not active workflow doctrine.

## Rollback

Backups from retirement:

- `~/.letta/settings.json.bak-disable-rtk-20260703-214256`
- `~/.agents/RTK.md.bak-retired-20260703-214256`

If Mahiro asks to restore RTK default behavior, restore the RTK PreToolUse hook from backup and run `/reload`.
