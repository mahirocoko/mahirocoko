# Learning — Open Design architecture

**Date:** 2026-08-01  
**Tags:** open-design, design-tools, agent-runtime, skills, design-systems, plugins, daemon, mcp

Open Design 0.16.1 is a local-first design studio built around one authoritative Express/SQLite daemon. Its Next.js web app, `od` CLI, MCP servers, Electron desktop, and packaged shells are clients/control planes over daemon-owned projects, runs, agent spawning, artifacts, registries, credentials, and policy. Live output uses HTTP/SSE, while durable truth lives in run records, event logs, project files, artifact manifests, and frozen plugin snapshots.

The strongest reusable patterns are:

- one declarative `RuntimeAgentDef` per CLI over shared lifecycle/parsing machinery;
- pure cross-runtime contracts in `packages/contracts` and typed sidecar protocols;
- distinct ownership for functional skills, rendering templates, design systems, universal craft, and plugins;
- real per-run copies under `.od-skills/` instead of mutable global/symlink delivery;
- `RUNTIME_DATA_DIR` as the resolved single data-root truth propagated to subprocesses;
- focused package tests, replay mocks, isolated E2E namespaces/data roots, and confidence-tiered CI/release evidence.

For Mahiro's work, borrow these contracts selectively rather than treating Open Design as proof that a new universal frontend skill should exist. The project is a broad studio/runtime product with significant packaging, updater, plugin, security, and cross-platform testing cost. Detailed study: [[../learn/nexu-io/open-design/repo.md]].
