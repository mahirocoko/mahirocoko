# Direct CLI Image URL Handoff

Tags: direct-cli, gemini, frontend-design, unsplash, tmux, verification

## Lesson

When using a direct Gemini CLI lane for frontend image work, do not rely on tmux prompt text to preserve complex image URLs with query strings. URLs such as `https://images.unsplash.com/photo-id?auto=format&fit=crop&w=1400&q=80` can be mangled when sent through nested quoting or wrapped pane input, which can cause the executor to verify or write a different URL than intended.

## Practice

- Verify image candidates with `curl -I -L` before using them.
- Inspect the final HTML after editing to ensure `?`, `&amp;`, width, crop, and quality parameters are actually present.
- If the executor stalls on URL verification, stop the lane and patch the exact asset URLs manually rather than repeatedly prompting.
- In the final summary, separate executor-generated work from operator-applied repairs.

## Trigger

This came from the lab03 `gemini-index.html` session. Gemini generated the landing page, but the final Unsplash image replacement was manually patched after the Gemini pane stalled and a follow-up prompt mangled query-string URLs.
