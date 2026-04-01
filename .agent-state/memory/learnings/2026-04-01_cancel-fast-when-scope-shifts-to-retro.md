---
title: Cancel fast when scope shifts to retro
created: 2026-04-01
tags: [retrospective, workflow, cancellation, background-tasks, watch]
source: local session
---

# Cancel fast when scope shifts to retro

When a session has already started background analysis and the human suddenly changes direction, the correct pattern is to cancel the disposable tasks immediately and re-anchor to the new goal. Trying to salvage the old analysis usually adds drag, especially when the user has already signaled that the original path is no longer worth pursuing.

This session reinforced a second linked lesson: in `/watch` flows, command dispatch and response capture are different reliability checkpoints. The automation successfully opened Gemini and sent the prompt, but the actual response body was not available through the local bridge. Because the workflow also captured the Gemini conversation URL and recovered YouTube captions, the session still produced a durable learning note instead of ending in a false positive.

The durable operational pattern is:

1. Dispatch external-model work.
2. Validate that a usable body was actually captured.
3. If the user changes scope, cancel any now-irrelevant background work immediately.
4. Preserve the lesson locally so the next session starts from pattern memory instead of vague recollection.

Quick retrieval hints: `cancel fast`, `scope shift`, `retro`, `watch fallback`, `background task cancellation`.
