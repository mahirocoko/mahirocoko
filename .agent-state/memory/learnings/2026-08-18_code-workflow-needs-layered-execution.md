# Code workflow talks need layered execution, not a tool inventory

**Date**: 2026-08-18  
**Tags**: `workflow`, `slides`, `letta`, `subagents`, `direct-cli`, `skills`, `context-contracts`

## Lesson

When explaining Mahiro's code workflow, distinguish three execution layers:

1. **Main agent does the work** when scope is clear and no separate exploration is needed.
2. **Letta subagent** separates role or context while staying inside the same main-agent workflow.
3. **Direct executor lane** uses Agy, Cursor, Codex, or Pi only when executor-specific capability, model access, environment, visibility, or independent implementation is useful.

Herdr and Agent Halo support direct or multi-lane visibility; they are not prerequisites for every task. `ccc`, exact search, browser evidence, and Mahiro Skills can be used across all three layers.

For project entry, new and existing work differ mainly at the start:

- New project: create context and rules with Mahiro-style doctrine, repo docs, and safe indexing boundaries.
- Existing project: load repo-local context, current behavior, Git state, and ownership before editing.

After entry, both use the same understand → execute → verify → learn → retain loop.

## Durable behavior

- Ask Mahiro for one real sequence before turning remembered patterns into a framework
- Map each tool or skill to a concrete trigger and responsibility
- Verify current installed skill contracts before projecting command names
- Start from the lightest execution path and add orchestration only when evidence justifies it
- Keep human visual/product acceptance separate from agent verification

