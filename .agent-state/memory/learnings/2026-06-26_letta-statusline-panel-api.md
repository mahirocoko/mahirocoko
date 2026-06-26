---
tags: [letta-code, mods, statusline, terminal-ui]
---
# Lesson: Letta Code 0.27.18 statusline mods are panel-based

When Letta Code statusline output disappears after 0.27.18, check for legacy APIs first. `letta.ui.setStatuslineRenderer`, `letta.ui.setStatus`, and `letta.ui.clearStatus` are removed/deprecated for this purpose. The current statusline should be a panel:

```ts
letta.ui.openPanel({
  id: "statusline",
  order: 0,
  render: ({ width, row, chalk, agent, model }) => row(left, right, width),
});
```

Important gotchas:
- `render()` returns plain strings/string arrays, not React/Ink components.
- `render()` is synchronous and has a lean context; do not assume it contains conversation id, permission mode, memfs, context percentage, or reflection settings.
- Cache dynamic fields from events (`conversation_open`, `turn_start`, `llm_start/end`, `compact_start/end`) and read stable settings from `~/.letta/settings.json` / project `.letta/settings.local.json` when needed.
- Reflection trigger display (`🗜️ compact`, `😴 25`, `💤 off`) is different from active compaction status (`🗜️ compacting`, post-compact token count).
- For terminal statuslines, reserve right-side width first, then fit/truncate left segments. Emoji and ANSI coloring can confuse width measurement; treat screenshot feedback as runtime evidence.

Mahiro prefers compact but clear statusline labels: emoji is fine, but cryptic abbreviations like `free` for `unrestricted` are confusing unless the mapping is obvious.
