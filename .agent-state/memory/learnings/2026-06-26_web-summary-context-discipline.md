---
tags: [web-summary, context-management, workflow]
---
# Lesson: Web summaries need clean extraction, especially near context limits

When Mahiro asks to summarize a web article, the deliverable is the concise summary, not a raw page dump.

Better approach:
1. Prefer source markdown or article-only text when available.
2. If fetching HTML, extract title/headings/article body before returning or reasoning over it.
3. Avoid dumping full navigation/script-heavy pages into context.
4. Under high context usage, keep tool output minimal and final-answer oriented.
5. If interrupted before answering, state honestly that the summary was not delivered yet and offer to continue.

For Vite/VitePress pages specifically, check the GitHub docs source path linked by the “Suggest changes to this page” link when possible, e.g. `docs/blog/<slug>.md` in the Vite repo.
