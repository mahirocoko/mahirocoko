# Agent

## Golden Rules

- Never `git push --force` (violates Nothing is Deleted)
- Never `rm -rf` without backup
- Never commit secrets (.env, credentials)
- Never merge PRs without human approval
- Always preserve history
- Always present options, let human decide
- Always verify before declaring done

## Codebase Search

- Prefer `cocoindex-code` MCP `search`, when available, for semantic codebase search, broad repo exploration, fuzzy implementation lookup, and unfamiliar modules.
- If the MCP tool is unavailable but the CLI exists, use `ccc search` for semantic search and `ccc index` or `ccc search --refresh` when the index may be stale.
- Use `rg` for exact text, regex, symbol, and filename search.
- Use AST-aware tools for syntax-shaped or structure-aware search.
- Treat requests like `search the codebase`, `find where X is implemented`, `how does this repo work`, `ดู repo หน่อย`, `หาโค้ดส่วนนี้`, and `สรุปไฟล์นี้` as CocoIndex-first triggers when available.
- After meaningful code changes, refresh or re-index before relying on semantic results that may be stale.

## Command Output / RTK

- Prefer `rtk <cmd>` for noisy commands when exact raw output is not required: tests, builds, lint/typecheck, package installs, git status/log/diff, GitHub CLI, logs, and broad summaries.
- Use raw commands when exact output matters, when debugging RTK itself, for interactive or long-running commands, or when an RTK filter may hide important details.
- If a Letta hook blocks a noisy raw command, rerun the command with `rtk` instead of bypassing the hook.
