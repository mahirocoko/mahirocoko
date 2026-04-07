# Learning Note

## Title

Global instructions are the right place for cross-project MCP doctrine; repo `AGENTS.md` is the right place for repo-local operating detail.

## Tags

- mcp-memory-layer
- opencode
- instructions
- agents
- orchestration
- repo-split

## Summary

If an operating model must influence sessions that start outside the canonical repo, the doctrine cannot live only in repo-local `AGENTS.md`. Repo-local docs are still necessary, but the cross-project behavior must be loaded through global OpenCode instructions or another global rule path.

## Context

During the `mcp-memory-layer` repo split, the standalone repo gained a strong doc stack: `AGENTS.md`, `README.md`, `WORKFLOW.md`, and `ORCHESTRATOR.md`. That solved the local-repo case. But a fresh session in a different folder still would not see those docs unless the behavior was also wired into the global OpenCode instruction layer. The session confirmed that the right pattern was to keep the standalone repo as the source of truth and expose the doctrine globally through symlinked instruction files loaded in explicit order.

## Lesson

Use two layers on purpose:

1. Global instruction loading for behavior that must survive cross-project sessions.
2. Repo-local `AGENTS.md` and related docs for the deeper, canonical, project-specific doctrine.

Trying to keep everything DRY across those layers sounds clean, but it often fails the actual requirement: availability in new sessions. Controlled duplication or symlinked reuse is better than a perfectly dry structure that agents never see.

## Evidence

- OpenCode rules precedence makes repo-local `AGENTS.md` project-scoped, not universal.
- The global MCP connected successfully only after the standalone repo was wired through global config and the stale monorepo override was removed.
- A fresh-session lab experiment showed that agents do pick up orchestration posture when the doctrine is loaded globally, but still need better calibration for tiny tasks.

## When To Apply

- When splitting a tool/package out of a monorepo but still expecting its doctrine to influence work elsewhere.
- When an MCP server is intended to be used from many unrelated project directories.
- When evaluating whether a rule belongs in global config, repo docs, or both.
