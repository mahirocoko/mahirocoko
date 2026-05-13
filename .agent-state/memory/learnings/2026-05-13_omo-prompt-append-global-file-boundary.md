---
tags: [lesson, omo, oh-my-openagent, prompt-append, superpowers, prometheus, configuration]
slug: omo-prompt-append-global-file-boundary
source: rrr
---

# OmO prompt_append global file boundary

When adapting Superpowers-style brainstorming discipline into Oh My OpenAgent, prefer a small OmO-native adapter over copying the whole `superpowers:brainstorming` skill. The good reusable parts are design-first planning, scope decomposition, context inspection, success criteria, approach trade-offs, concise design presentation, and plan self-review. The parts to avoid are Superpowers-specific hard gates, required spec paths, commits, and skill-transition names.

For now, attach this kind of adapter to `agents.prometheus.prompt_append` first, not `sisyphus` and not broad categories. Prometheus is the planning surface, so this keeps the behavior scoped to planning without slowing down trivial execution.

Important implementation detail: `oh-my-openagent` documents `file://` support for `prompt` and `prompt_append`, but the runtime resolver enforces a project/config boundary. For general agents, the override flow can pass a directory into `resolvePromptAppend()`. Prometheus currently calls `resolvePromptAppend(prompt_append)` without a config directory in `buildPrometheusAgentConfig`, so a global prompt file under `~/.config/opencode/prompts/...` may be rejected when the active project root is elsewhere. Until Prometheus passes config-dir context, a global inline `prompt_append` is safer than a global `file://` reference.

If the inline prompt becomes too long, the clean fix is upstream: thread the plugin config directory into `buildPrometheusAgentConfig` and then move the adapter to a global prompt file.
