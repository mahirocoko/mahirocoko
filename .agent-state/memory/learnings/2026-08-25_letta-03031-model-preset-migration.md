# Lesson: Verify model ID, provider, and effort together

**Date**: 2026-08-25  
**Tags**: letta-code, model-routing, subagents, chatgpt-oauth, reasoning-effort, migration

Letta Code model routing has three independent contracts that must be verified together:

1. the catalog ID accepted by the `Agent` surface;
2. the provider/auth handle selected at runtime;
3. the effective reasoning effort stored on the spawned agent.

In Letta Code 0.30.31, GPT-5.6 custom-subagent IDs changed from `*-plus-pro-*` presets to `<family>-<effort>` IDs such as `gpt-5.6-luna-max`, `gpt-5.6-terra-medium`, `gpt-5.6-sol-high`, and `gpt-5.6-luna-low`. Bare family slugs can still resolve through `openai-codex/*` with ChatGPT OAuth, but they default to `reasoning_effort: none`; therefore a successful response alone is not sufficient routing proof.

For future model-catalog updates:

- inspect the current installed/runtime catalog rather than recalling old aliases;
- launch a minimal exact-ID smoke;
- read back the spawned agent's provider and reasoning settings;
- update global agent frontmatter, explicit Main routing memory, and canonical skill contracts together;
- keep dated retrospectives intact, but label old current-state claims historical;
- restart the Letta Code process after changing custom-agent definitions because discovery is process-cached.

