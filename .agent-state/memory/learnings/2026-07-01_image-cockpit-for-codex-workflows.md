# Learning: image-cockpit-for-codex-workflows

**Date**: 2026-07-01
**Repo**: https://github.com/dreiachse-cyber/image-cockpit-for-codex-workflows
**Docs**: `.agent-state/learn/dreiachse-cyber/image-cockpit-for-codex-workflows/2026-07-01/1600_*.md`

## Key insights

- Image Cockpit is a local-first React/Vite + Node API cockpit for Codex-era image workflows. It avoids direct OpenAI API calls and instead creates local handoff jobs for Codex/user-managed runs.
- The durable integration contract is the local `codex-handoff/` filesystem: `inbox/` job JSON, `assets/` source images, `outbox/` results/manifests/blockers, `status/` runner state, and `logs/` stdout/stderr.
- It has strong QA workflow documentation: unit tests, doctor/smoke scripts, CDP browser smoke, real Codex/imagegen smoke, animation-delivery checks, and release-audit scripts.
- The deterministic local generator is valuable as a fallback/testing lane for UI/export flows when real Codex/imagegen is unavailable.

## Relevance to Mahiro projects

This repo is useful as a reference for local imagegen/Codex handoff architecture, artifact outbox contracts, and browser-smoke/asset-delivery QA loops. Do not copy its npm/tooling choices blindly into pnpm/Bun/Yarn repos; treat the handoff model and QA philosophy as the portable parts.
