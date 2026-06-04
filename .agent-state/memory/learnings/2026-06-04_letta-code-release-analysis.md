---
tags:
  - letta-code
  - release-analysis
  - local-first
  - skills
  - transcript-search
---

# Lesson Learned — Letta Code release analysis should group local-first systems, not only list commits

When Mahiro asks to pull and analyze `letta-code`, resolve the tracked ghq path first, pull with `git pull --ff-only`, then summarize by practical user-facing systems rather than dumping commits. The June 2026 `v0.26.3` → `v0.27.3` pull showed that Letta Code is moving several connected local-first pieces together:

- Skills management CLI (`letta install`, `letta skills list/delete`) with GitHub, ClawHub, and Hermes sources.
- Durable local transcripts and `letta messages search/list/transcript`, which improves recall and debugging.
- Reflection/dreaming telemetry and transcript capture, including websocket turns.
- Task state moving from `TodoWrite` toward `TaskCreate/Get/List/Update`.
- Conversation pins/resume selector UX and terminal-title/statusline work.
- Managed system prompt versioning, which may affect how local agents receive bundled prompt updates.

Process lesson: commit subjects are enough for orientation, but for Mahiro-facing analysis I should read representative files/diffs before claiming behavior. Also use `bash` explicitly for snippets that rely on bash loop/splitting semantics; zsh can trip simple-looking tag loops.
