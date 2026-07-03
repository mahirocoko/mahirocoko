# Learning: Statusline Reasoning and Activity Signals

Tags: letta-code, statusline, mods, reasoning, ui-panels

## Lesson

The custom global statusline at `~/.letta/mods/statusline.tsx` should treat reasoning display as runtime model context, not as a UI-setting-only feature. In Letta Code `0.27.21`, panel context exposes `model.reasoningEffort`; the statusline should show `r:<effort>` whenever that exists, even if `~/.letta/settings.json` does not have `reasoningTabCycleEnabled`.

Useful fallback paths for reasoning:

- `context.model.reasoningEffort`
- `context.model.reasoning_effort`
- `context.model.reasoning.reasoning_effort`
- `context.rawPayload.model.*`
- `context.rawPayload.model_settings.reasoning*`
- `context.rawPayload.llm_config.reasoning_effort`

## Statusline design rule

Do not install competing order-0 statusline package mods when a strong custom `~/.letta/mods/statusline.tsx` already owns the primary row. Prefer patching the owner file to borrow useful features: conversation summary, detailed git status, MemFS dirty count, tool/LLM activity, and provider-error hints.

## Implementation guardrails

- Keep `render(ctx)` synchronous and side-effect-free.
- Do async work in setup/event handlers/timers and store results in closure state.
- Use `panel.update()` after state changes.
- For global files outside git, create a timestamped backup and record the change in RRR/learning notes.
- Watch for data-shape migrations: if `memfsStatus` changes from string to object, remove old string writes like `"mem ?"`.

## Current statusline behavior after this session

- Reasoning displays as `[model r:high]` or `[model r:max]` when available.
- Conversation summary is preferred over raw conversation id.
- Git shows branch plus clean/dirty detail: `✓`, `↑`, `↓`, `+`, `~`, `-`.
- MemFS shows `🧠✓`, `🧠+N`, or `🧠?`.
- Activity hints show short-lived LLM/tool signals and provider error labels.
