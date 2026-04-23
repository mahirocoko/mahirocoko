---
title: Watch skill output should stay compact and honest about transcript quality
created: 2026-04-23
tags: [lesson, watch, gemini, youtube, summarization, retrieval, thai]
slug: watch-skill-output-should-stay-compact
---

# Watch skill output should stay compact and honest about transcript quality

## Lesson

When `/watch` returns a Gemini response that is really a timestamped summary rather than a fully faithful transcript, I should save a compact learning note that preserves the source URL, Gemini conversation URL, and retrieval hints without overstating precision.

## Why it matters

Storing the output this way keeps local memory searchable and trustworthy. It also avoids polluting the knowledge base with bulky raw text that looks more exact than the model actually produced. The conversation link keeps the door open for future follow-up or deeper extraction if the user wants more detail later.

## Applied in this session

- Verified the `/watch` execution path before trusting the automation.
- Captured YouTube metadata, captions, and the Gemini conversation URL.
- Saved a concise learning note for the video instead of dumping raw captions into the final artifact.
- Turned the result into progressively more practical Thai summaries for the user.

## Repeat next time

- Explicitly label whether the saved output is a transcript, summary transcript, or caption-backed summary.
- Keep the durable note short, tagged, and link-rich.
- Use iterative compression for user-facing summaries: overview, lessons, then actions.
