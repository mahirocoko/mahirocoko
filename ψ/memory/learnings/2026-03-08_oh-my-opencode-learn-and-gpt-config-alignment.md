# Oh My OpenCode Learn and GPT Config Alignment

## Pattern

When evaluating or adopting a new OpenCode / oh-my-opencode setup, treat the work as two linked tracks:

1. Deep-learn the external repo into local memory artifacts.
2. Update the local runtime config only after the repo's docs, schema, and model-role split are clear.

## What Worked

- `/learn --deep` created a durable five-part map of `oh-my-openagent` that covered architecture, snippets, quick reference, testing, and API surface.
- The repo's current model split was clear enough to drive config decisions: `openai/gpt-5.4` for orchestration and reasoning-heavy agents, `openai/gpt-5.3-codex` for GPT-native coding paths.
- Turning the agent-role explanation into `ψ/learn/code-yeongyu/oh-my-openagent/AGENT-CHEATSHEET.th.md` made the research immediately reusable for future sessions.

## Reusable Method

1. Register the studied repo under `ψ/learn/.origins` and link `origin/`.
2. Generate the standard deep-learn artifact set in parallel.
3. Build one hub index file for durable navigation.
4. If the user asks operational questions, turn the answer into a local cheat sheet or runbook, not just a chat reply.
5. For config edits, compare the real local file against the learned repo's current docs and schema before patching.
6. Verify both JSON parsing and schema conformance; report contract drift explicitly if a pre-existing key fails validation.

## Mistakes To Avoid

- Do not start from `HEAD` when the real question is version-specific; pin the tag or release first.
- Do not spend too long searching the repo for a file that may live in user config space; ask for the exact path earlier.
- Do not stop at syntax checks for config files.

## Confidence

- High: the learned repo currently presents `gpt-5.4` as the main reasoning/orchestration path and `gpt-5.3-codex` as the GPT-native coding path.
- High: the learn-hub plus audience-specific cheat-sheet pattern is reusable.
- Medium: schema drift in local config families may require manual reconciliation beyond the immediate patch, because current local files can contain keys like `lsp` that the present schema rejects.

## Concepts

- opencode
- oh-my-opencode
- learn
- config
- gpt-5.4
- gpt-5.3-codex
- retrospective
- documentation
