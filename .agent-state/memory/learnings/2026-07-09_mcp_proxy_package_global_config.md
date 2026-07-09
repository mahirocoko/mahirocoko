# Learning: MCP proxy should graduate to package before HTTP/SSE

**Date**: 2026-07-09
**Tags**: letta-code, mcp, mods, safety, package-mods, tooling

## Lesson

When a local Letta mod evolves from a single-file stdio experiment into a durable MCP bridge, graduate it to a packaged mod before adding HTTP/SSE or other dependency-backed features.

The durable architecture from this session:

- Keep `mcp_proxy` read-only for cached metadata: `status`, `setup`, `tools/list`, `search`, `describe`.
- Put live process/tool actions behind `mcp_proxy_live`: `reconnect`, `call`, `disconnect`.
- Use persistent stdio connections only where process lifecycle is clear; expose `disconnect` and close everything on reload/dispose.
- Do not hand-roll HTTP/SSE MCP. Use `@modelcontextprotocol/sdk` transports for Streamable HTTP and SSE, including custom headers and bearer auth.
- For config, prefer global `~/.letta/mcp.json` as the agent-level default, then allow project `.mcp.json` / `.letta/mcp.json` overrides.
- Avoid storing command args, bearer tokens, or secrets in cache; hash resolved bearer token only for invalidation.

## Gotchas

- `letta install <local package dir>` may not copy/install runtime dependencies for local package sources. After installing `mahiro-mcp-proxy`, check that `~/.letta/mods/packages/npm/mahiro-mcp-proxy/node_modules/@modelcontextprotocol/sdk` exists; if not, run the documented npm install command in that package root.
- A config walker looking for project `.letta/mcp.json` can accidentally find global `~/.letta/mcp.json` when the repo lives under `$HOME`. Explicitly skip the global path when considering project overrides.
- Mock permission checks are not enough for live tool safety. Dogfood the actual tool path after reload.

## Reuse

Before changing MCP proxy again, read:

- `~/.letta/mcp-proxy/README.md`
- `~/.letta/mcp.json`
- `~/.letta/mods/packages/npm/mahiro-mcp-proxy/mods/mahiro-mcp-proxy.js`
- memory note `letta-code/context.md` around the 2026-07-09 MCP proxy entries
