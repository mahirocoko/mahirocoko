---
tags: [vite, web-summary, context-management, recovery]
---
# Lesson: Recover web-summary misses by fetching clean source and delivering the answer

When a web summary task was previously derailed by noisy HTML or context pressure, the next step is to finish the user's requested summary, not dwell on the miss.

For Vite/VitePress pages:
- Use the GitHub markdown source when available, e.g. `docs/blog/<slug>.md`.
- Extract headings and key paragraphs from the feature sections.
- Summarize in Thai with practical implications.
- Mention experimental status and caveats clearly.

Good release-summary structure:
1. One-line purpose/context.
2. Biggest feature and why it matters.
3. Experimental flags/config snippets if useful.
4. Smaller features and migration direction.
5. “What this means for our projects.”

Avoid repeating a raw-page fetch mistake. Clean source first, concise answer immediately.
