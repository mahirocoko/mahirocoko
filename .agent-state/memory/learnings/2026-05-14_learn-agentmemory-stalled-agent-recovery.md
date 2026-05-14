# Lesson: Recover stalled learn agents by replacing only the stuck lane

**Date**: 2026-05-14  
**Tags**: learn, orchestration, background-agents, agentmemory, local-first, mcp

When running `/learn --deep`, if most reports have already landed but one background agent remains silent long enough to block hub creation, cancel only that specific task and regenerate that report with a narrower synchronous prompt. Do not cancel unrelated completed or still-useful work, and do not rewrite successful reports unless verification finds a real gap.

For this session, the API-surface report stalled while architecture, snippets, quick reference, and testing were already present. The clean recovery was:

1. Cancel `bg_94b3d62f` only.
2. Rerun API-surface generation with a tighter required-file list and explicit distinction between full-server MCP and standalone fallback.
3. Verify the new report exists and `origin/` remains clean.
4. Create `repo.md` only after all five reports are present.

Concrete agentmemory insight to preserve: `@agentmemory/mcp` behaves very differently depending on whether it can proxy to the full server. Proxy mode exposes the full MCP-over-HTTP surface; local fallback uses `InMemoryKV` and only implements 7 tools. Any installation guidance should start the full server first, verify `/agentmemory/health`, and then wire MCP with `AGENTMEMORY_URL=http://localhost:3111`.
