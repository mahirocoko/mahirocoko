# Learning: Keep Letta custom subagents small and workflow-shaped

**Date**: 2026-05-18
**Tags**: letta-code, subagents, workflow, mahiro, local-tools

## Lesson

For Mahiro's Letta Code workflow, custom subagents should represent repeated collaboration jobs, not every possible domain role. The first useful set is:

- `repo-scout` — read-only repository reality mapping before implementation
- `ui-review` — Mahiro-style UI/product polish and anti-generic frontend review
- `thai-copy-review` — natural Thai copy and repo-local i18n review
- `git-commit` — safe explicit commit creation with repo style and no AI attribution

This keeps the subagent surface small enough to remember and practical enough to use.

## Implementation Detail

Project-local custom subagents are markdown files under `.letta/agents/*.md` with frontmatter such as `name`, `description`, `tools`, `model`, `memoryBlocks`, `mode`, `background`, and optional `skills`. The installed Letta Code bundle shows discovery from both project `.letta/agents` and global `~/.letta/agents`.

A running Letta session may not immediately recognize newly-created custom subagents in the `Agent` tool, even when the files validate. Treat that as a refresh/restart/cache issue to verify, not as proof the files are invalid.

## Guardrail

Do not overbuild a large agent taxonomy. Add or promote a custom subagent only when it matches repeated work, clear responsibilities, and a distinct review/implementation posture.

## Follow-up

After real use, refine prompts based on output quality. If these roles prove useful across repos, consider moving or copying them to global `~/.letta/agents` or making a reproducible setup skill.
