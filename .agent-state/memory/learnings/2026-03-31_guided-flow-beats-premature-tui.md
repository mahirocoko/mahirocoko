# Learning Note

## Tags
- guided-ux
- installer
- prompt-design
- release-discipline
- cross-repo-work

## Lesson
When a CLI workflow feels rough, the right next move is not automatically “build a TUI.” In this session, the real user pain was much narrower: item selection required prior knowledge and manual typing, and list discovery required too much target preselection. A thin guided layer with selectable inventory, a default-bundle shortcut, and a receipt-based list summary solved the immediate usability problem while preserving the shared planner/install core.

The deeper pattern is that UX ambition should follow semantic stability. Prompt-first improvements work well when the underlying model is still settling, because they improve interaction without forcing a second architecture for state, rendering, navigation, and testing. A TUI becomes justified only when the experience is truly app-like and linear prompt flows no longer express the product clearly.

## Why It Matters
This keeps maintenance pressure low and protects the repo’s existing doctrine: one planner, one installer, thin wrappers at the edge. It also keeps releases more honest, because it is easier to match docs to reality when the UI layer is small.

## Reuse Rule
If a user says a CLI is awkward, first identify whether the pain is:
1. discovery,
2. selection,
3. confirmation,
4. summary visibility.

If yes, try a prompt-first fix before proposing a TUI.
