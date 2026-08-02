# MD-This-Page: browser-to-Markdown extension patterns

Source study: [[../../learn/Ademking/MD-This-Page/repo|MD-This-Page Learning Index]] at commit `dd85645`.

- Keep browser-extension responsibilities split by execution context: page extraction and focus-sensitive clipboard/download work in the content script, event orchestration in the background worker, and output policy in a shared pure formatter.
- A shared storage key is a convenient handoff to a newly opened extension tab, but it becomes a race-prone mailbox when multiple conversions can overlap; tokenized or tab-scoped payloads are safer.
- Fallback extraction should clone candidate DOM before stripping nodes. Removing scripts, styles, SVG, and hidden nodes directly from the host document changes the user's live page.
- Current documentation can drift from implementation: this repo's README names Mozilla Readability while source uses Defuddle. Verify dependency imports and current entry points before repeating architectural claims.
