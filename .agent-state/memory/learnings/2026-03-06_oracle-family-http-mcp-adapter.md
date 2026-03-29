# Lesson Learned

When `oracle-family` is already running as a long-lived backend, Codex should not spawn the full MCP server again. It should use a thin stdio adapter that forwards Oracle tool calls into the existing HTTP API.

This session showed that the biggest integration risk was not a single handshake bug. The real problem was boundary confusion. The full `oracle-family` MCP server carries backend startup behavior, Chroma preconnect work, port assumptions, and stdout/stderr concerns. That makes sense when it is the primary process, but it is the wrong surface for a second client that only needs tool access. A lightweight adapter keeps the tool contract stable while avoiding duplicate startup side effects and ownership confusion.

Another useful lesson is that MCP failures should be split into layers. In this case there was a command-shape issue in the Codex config, an stdio cleanliness issue in the original server path, and a deeper architecture problem caused by spawning a second heavy process. Building a direct MCP test around the adapter made it possible to prove that the new bridge was correct even though the current Codex session still appears to cache older MCP state.

Tags: mcp, codex, oracle-family, adapter, integration, architecture
