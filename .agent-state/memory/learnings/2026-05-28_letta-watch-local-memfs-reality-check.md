---
title: "Letta watch + local MemFS reality check"
tags: [letta-code, watch, memfs, local-backend, ccc, project-list, skills, retrospective]
created: "2026-05-28"
slug: "letta-watch-local-memfs-reality-check"
---

# Letta watch + local MemFS reality check

## Lesson

When studying Letta Code direction from Office Hours or other external material, use a three-step evidence loop:

1. **Capture durable source material** — save captions/transcript or notes under `.agent-state/memory/learnings/` and register a slug.
2. **Compare against current repo reality** — pull `letta-ai/letta-code`, inspect README/source paths, and verify whether the claims exist in code/docs.
3. **Check our own runtime reality** — if the topic is local mode/MemFS/skills, verify what the current agent is actually running with.

This session confirmed that the watched direction matches current repo reality: `letta --backend local`, local provider connections, MemFS-backed memory, slash-skill invocation, `/goal`, TUI cron, and local backend channels are all visible in `letta-code` main. It also confirmed that this Mahiro Code agent is currently using local backend MemFS at:

```text
/Users/mahiro/.letta/lc-local-backend/memfs/agent-local-b1f7b85c-d49d-43ea-a7e3-6fa085ecd426/memory
```

## Gotchas

- Gemini may return only a short breakdown for YouTube transcription; use YouTube CC/SRT fallback when available.
- `ccc init` inside an external repo can create `.cocoindex_code/` and may update `.gitignore`; check `git status` and clean temporary artifacts unless the user wants to keep an index.
- `/project list` has a strict output contract. If summarizing a huge list, explicitly say it is a summary rather than the exact contract output.

## Retrieval hints

`#letta-code` `#local-backend` `#memfs` `#watch` `#office-hours` `#ccc-side-effects` `#slash-skills` `#goal-command` `#tui-cron` `#mahiro-code-runtime`
