---
title: Never Run claude /init
source: YouTube - Matt Pocock (https://www.youtube.com/watch?v=9tmsq-Gvx6g)
gemini_conversation: https://gemini.google.com/app/2b66c991becc3d01
video_id: 9tmsq-Gvx6g
channel: Matt Pocock
duration: 10:37
created: 2026-04-01
tags: [youtube, watch, gemini, coding-agents, context-files, claude-md, agents-md]
transcript_source: youtube-cc-fallback
---

# Never Run claude /init

## Summary

Matt Pocock argues that auto-generated `CLAUDE.md` and `AGENTS.md` files often make coding agents worse, not better. His core point is that repository-wide context files consume permanent prompt budget, duplicate information that agents can already discover from the codebase, and quickly rot when they describe specific files, commands, or architecture details that change over time.

The practical recommendation is to keep global context extremely small and reserve it only for information that is both non-obvious and broadly relevant to nearly every task. Project-specific steering should move into discoverable skills or task-local guidance instead of living in a global always-loaded file.

## Key Takeaways

- Auto-generated repo context tends to add token cost on every request while providing little durable value.
- Commands, architecture notes, and file-specific implementation details are usually better discovered directly from source-of-truth files.
- Global context should contain only rare, high-value facts that are hard for the agent to infer, like environment quirks.
- Pattern steering belongs closer to skills or scoped instructions, not a giant repository-level prompt blob.
- Reliable agent workflows depend more on good exploration and file structure than on stuffing long instructions into global docs.

## Operational Pattern

Use repository context files only for stable, cross-cutting facts that would be expensive or error-prone for the agent to infer each time. If the guidance is feature-specific, stack-specific, or likely to drift with refactors, it should live in a skill, task prompt, or the code structure itself.

## Source Capture

- YouTube: https://www.youtube.com/watch?v=9tmsq-Gvx6g
- Gemini conversation: https://gemini.google.com/app/2b66c991becc3d01
- Note: the `/watch` flow successfully opened Gemini and sent the prompt, but this local bridge did not expose response readback automatically during this run. This note was therefore captured from the video metadata plus YouTube captions fallback.

## Retrieval Hints

- Search terms: `claude init`, `agents md`, `global context budget`, `repository context files`, `Matt Pocock`
- Quick access: `/trace never-run-claude-init`
