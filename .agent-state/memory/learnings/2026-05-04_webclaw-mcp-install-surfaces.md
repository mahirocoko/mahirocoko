# Learning: webclaw MCP install surfaces

Tags: `webclaw`, `mcp`, `homebrew`, `docker`, `learn`

For `0xMassi/webclaw`, do not describe the project as only an MCP. It has multiple integration surfaces: `webclaw` CLI, `webclaw-mcp` stdio MCP server, `webclaw-server` self-hosted REST API, Rust crates, and `create-webclaw` npm installer.

Manual MCP install does not require `npx create-webclaw`; viable paths include Cargo and Homebrew. Homebrew is available through the official tap, not Homebrew core:

```bash
brew tap 0xMassi/webclaw
brew install webclaw
```

After install, resolve the MCP binary with:

```bash
which webclaw-mcp
```

Use that binary path in OpenCode/Claude/Cursor MCP config. Docker is better suited to running `webclaw-server` as a REST service; running MCP itself in Docker is possible but more awkward because MCP clients usually spawn a local stdio binary.
