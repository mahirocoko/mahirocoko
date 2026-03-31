# Repo-root agent-state conventions prevent nested state drift

**Date**: 2026-03-31
**Tags**: `mahiro-skills`, `agent-state`, `rrr`, `forward`, `recap`, `release`, `conventions`, `lessons`

## Lesson

If a reusable skill reads or writes local `.agent-state` data, cwd-relative defaults are too weak. They silently work from repo root, then silently drift when the agent is invoked inside a child folder such as `apps/` or `skills/`. The stable pattern is to resolve repo root first with `git rev-parse --show-toplevel 2>/dev/null || pwd`, then default `AGENT_STATE_DIR` to `$REPO_ROOT/.agent-state` unless the human explicitly overrides it.

This matters most for write paths like `rrr` and `forward`, because they can create a brand-new nested `.agent-state` tree in the wrong place. But the same convention also improves read paths like `recap`, which might otherwise search the wrong folder and quietly miss real local memory. Once one skill fails this way, the follow-up should not stop at a local patch. It should become a repo-level authoring convention and a template default so future skills do not reintroduce the same assumption.

## Why it matters

- Child-folder execution is normal in real agent workflows, so cwd-relative state paths are a latent bug, not an edge case.
- Read-only skills can still mislead the agent if they look up memory in the wrong tree.
- Shared conventions are cheaper than repeated forensic fixes across multiple skills.
- Release work becomes safer when packaged skills carry the same path-root assumption.

## Reuse pattern

1. Resolve `REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"`.
2. Set `AGENT_STATE_DIR="${AGENT_STATE_DIR:-$REPO_ROOT/.agent-state}"`.
3. Use `AGENT_STATE_DIR` for every local state read and write path.
4. Add the convention to repo-level packaging notes and the skill template so new skills inherit it automatically.
