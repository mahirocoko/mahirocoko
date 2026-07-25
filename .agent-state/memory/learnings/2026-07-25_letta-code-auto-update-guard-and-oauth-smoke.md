# Letta Code auto-update guard and standalone OAuth validation

**Date**: 2026-07-25  
**Tags**: `letta-code`, `release`, `auto-update`, `oauth`, `subagents`, `environment`

## Durable lesson
When holding Letta Code on a rollback version, distinguish the updater's documented process-level control from the shell shortcut that happens to launch it. `DISABLE_AUTOUPDATER=1` is the supported gate, but an alias in `~/.zshrc` protects only invocations that pass through that interactive alias. For broader terminal and child-process coverage, use a temporary export in `~/.zshenv`; GUI/Desktop launchers may still need their own environment configuration.

Do not call an update fixed solely because its release note sounds relevant. Inspect the release diff and perform one narrow real smoke test through the failing surface. v0.29.0's packaged standalone OAuth path attempted to import missing `./openai-codex.js`, preventing Codex-routed subagents from starting. v0.29.1 added a standalone entrypoint that calls `registerBunOAuthFlows()` before loading the app, and a fresh Terra subagent completed successfully after the manual update.

## Practical checklist
1. Set the update guard before rerunning rollback, then restart the relevant launcher.
2. Verify it with `LETTA_DEBUG_AUTOUPDATE=1` from the same launch path.
3. Keep source checkout version, global installed package version, and running client version as separate facts.
4. For a release-level fix, test the original failure mode once; do not rely on version text alone.
5. Remove the temporary guard only after deliberate validation, not because a newer version merely exists.
