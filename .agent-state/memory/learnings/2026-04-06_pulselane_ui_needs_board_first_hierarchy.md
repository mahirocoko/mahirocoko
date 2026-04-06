# Learning Note

**Date**: 2026-04-06
**Tags**: pulselane, ui, ux, kanban, realtime, sandbox

## Lesson
For a kanban-style realtime app, board-first hierarchy is a product requirement, not an aesthetic preference. A technically correct implementation can still feel weak if the layout gives too much space and visual weight to secondary metadata, settings, or explanatory chrome. In `PulseLane`, the turning point was admitting that the first complete version worked but still looked like a generic sandbox. The fix was not a new architecture. It was a hierarchy correction: reclaim horizontal space for the board, reduce decorative noise, strengthen card identity, and make realtime feedback more local and legible.

## Why It Matters
This matters because product feel is often lost in the gap between “it runs” and “it communicates the core idea instantly.” For a live kanban tool, the core idea is the board and the motion of work across it. If the board is visually secondary, the whole product reads wrong. I should treat this as an explicit check in future frontend sessions: before calling the UI done, ask whether the primary object of the product is also the primary visual stage.

## Reuse Signal
Apply this to any future work involving boards, dashboards, timelines, inboxes, or other object-centric tools: the user should immediately land on the object they came to manipulate, not on the supporting controls around it.
