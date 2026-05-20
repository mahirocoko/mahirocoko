---
title: Watch notes need second-pass extraction
tags: [watch, learning, workflow, knowledge-base, decision-memory, mahir-code]
created: 2026-05-19
source: rrr - youtube-watch-knowledge-extraction
---

# Watch notes need second-pass extraction

## Lesson

A `/watch` note is only half useful if it stops at transcript and summary. The durable step is a second-pass extraction that answers: **what should Mahiro Code do differently because of this source?**

For future video learning notes, prefer this shape:

1. **Capture** — source URL, title, channel, duration, Gemini conversation URL, transcript, raw captions, retrieval hints.
2. **Synthesize** — short summary and key takeaways in Mahiro's working language.
3. **Extract** — workflow implications, durable insights, risks, and adoption triggers.
4. **Route** — decide whether the insight belongs in memory, a skill, a backlog item, or only the learning note.
5. **Verify** — if a note implies adopting a tool/dependency, research security/auth/maintenance before installation.

## Concrete pattern from this session

Two ลงทุน Diary videos produced reusable ideas:

- Claude Code + NotebookLM workflow → keep the local pipeline small first: `/watch` → learning note → insight extraction → route to memory/skill/backlog.
- AI stock-picking agent → decision memory matters: thesis, kill conditions, review cadence, and mistake log are more transferable than the investing domain itself.

## Operating change

When Mahiro asks to watch/study a video, I should aim to preserve the source and then add a practical `Apply to Mahiro Code` layer. Do not rush into new integrations like NotebookLM CLI until repeated workflow bottlenecks justify research and adoption.

## Date/path hygiene

Derive learning-note filenames from the current runtime date. Avoid hardcoding dates during manual script writes, especially around midnight or after a new CLI connection.
