# Project-local OpenCode MCP is mostly a config problem once the server exists

**Date**: 2026-04-03
**Tags**: #mcp #opencode #gemini #cache #doctrine #project-config

## Lesson

When a project already has a real stdio MCP server entrypoint, enabling MCP in OpenCode is usually not a server-implementation problem. The critical step is to add the correct project-local `.opencode/opencode.json` registration and make sure the repo-level instructions explain how the agent should use that capability.

## Why it mattered today

At first glance, “make MCP usable in this project” sounded like it might require new code in the server itself. After reading the package, the real picture was simpler: `apps/mcp-memory-layer/src/index.ts` already created the server, constructed the `MemoryService`, and connected stdio transport. The missing piece was a repo-local OpenCode config that pointed to that entrypoint. Once that existed, the right follow-up was not more server work but instruction-layer alignment: `AGENTS.md` for project doctrine, plus local OpenCode `instructions` so the runtime knows what guidance to load with the MCP registration.

## Durable takeaway

For project-local MCP enablement, check in this order:

1. does a real stdio entrypoint already exist?
2. is there a project-local `.opencode/opencode.json`?
3. does that config point to the correct executable boundary?
4. does the instruction layer explain how the agent should use the capability?

If the first answer is yes, the remaining work is often configuration and doctrine, not new transport code.
