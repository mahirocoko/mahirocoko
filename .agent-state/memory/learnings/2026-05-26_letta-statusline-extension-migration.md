# Lesson: Letta statusline extensions own the whole row

**Date**: 2026-05-26  
**Tags**: letta-code, statusline, extensions, reasoning-tab, local-backend, terminal-ui

## Durable takeaway

Letta Code 0.26.2 moved statusline customization from legacy command scripts toward the global extension file:

```text
~/.letta/extensions/statusline.tsx
```

A custom statusline renderer owns the whole idle row. If Mahiro expects the familiar right-side display — agent name, model label, backend/local marker — the extension must explicitly render that right side. The built-in right side will not automatically remain underneath a custom renderer.

## Practical migration notes

- Preserve old files such as `~/.letta/statusline-conversation.js` and `~/.letta/statusline.sh` as rollback backups unless Mahiro asks to delete them.
- Use `letta.capabilities.ui.customStatuslineRenderer` and `letta.capabilities.ui.statusValues` guards.
- Do async work outside render and cache it with `letta.ui.setStatus`.
- Read `context.model.reasoningEffort` / `context.rawPayload.reasoning_effort` for live statusline display; do not trust manual JSON edits as live runtime truth.
- `permission_mode` is the Shift+Tab mode Mahiro means when asking for “mode” in the statusline.

## Reasoning-tab note

`/reasoning-tab` toggles whether plain `Tab` cycles reasoning tiers. It is not a UI tab. It only works when the input is idle, autocomplete is not active, and the model handle has multiple recognized tier entries. If the global installed CLI lags behind source fixes, the command may report enabled while Tab cycling still fails for some provider/model state.

## UI lesson

Use color semantically in terminal statuslines:

- clean/safe = green
- dirty/warning/reasoning attention = yellow
- identity/accent = purple
- secondary/passive = gray
- pressure/error = pink/red

This keeps Mahiro’s statusline readable without turning it into decorative noise.
