# Pencil MCP Audit

Checked at: 2026-02-25 (GMT+7)

## Status by App

| App                       | Status    | Notes                                                                                                           |
| ------------------------- | --------- | --------------------------------------------------------------------------------------------------------------- |
| Claude Code (CLI and IDE) | Found     | Configured in `~/.claude.json` with `mcpServers.pencil`; permission `mcp__pencil` in `~/.claude/settings.json`. |
| Codex CLI (OpenAI)        | Found     | Configured in `~/.codex/config.toml` under `[mcp_servers.pencil]`.                                              |
| OpenCode CLI              | Found     | Configured in `~/.config/opencode/opencode.json` as `pencil`.                                                   |
| Claude Desktop            | Not found | `claude_desktop_config.json` currently has `puppeteer` only.                                                    |
| Cursor (AI-powered IDE)   | Not found | No Pencil MCP entry found in `Cursor/User/settings.json`; no `Cursor/User/mcp.json` present.                    |
| Windsurf IDE (Codeium)    | Not found | No Pencil MCP config found under `~/.codeium/windsurf`.                                                         |
| Antigravity IDE           | Not found | No Pencil MCP entry in `Antigravity/User/settings.json`; no `Antigravity/User/mcp.json` present.                |

## Pencil Binary Path

All found configurations point to:

`/Applications/Pencil.app/Contents/Resources/app.asar.unpacked/out/mcp-server-darwin-arm64`

## Paths Checked

- `/Users/mahiro/.claude.json`
- `/Users/mahiro/.claude/settings.json`
- `/Users/mahiro/Library/Application Support/Claude/claude_desktop_config.json`
- `/Users/mahiro/Library/Application Support/Cursor/User/settings.json`
- `/Users/mahiro/.codeium/windsurf`
- `/Users/mahiro/.codex/config.toml`
- `/Users/mahiro/Library/Application Support/Antigravity/User/settings.json`
- `/Users/mahiro/.config/opencode/opencode.json`
