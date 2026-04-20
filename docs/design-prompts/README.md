# Design Prompt Bundles

This folder documents the design prompt libraries stored alongside these docs:

- [`./design-prompts.json`](./design-prompts.json)
- [`./design-skill-prompts.json`](./design-skill-prompts.json)

These JSON files are the canonical prompt assets. The docs in this folder explain what they contain, how they are organized, and what to watch when editing them.

## Files in This Folder

- [`design-prompts.md`](./design-prompts.md) - overview of the general design-prompt bundle object, including its top-level keys and intended use
- [`design-skill-prompts.md`](./design-skill-prompts.md) - overview of the reusable design skill-prompt bundle array, including entry shape and maintenance notes

## Source of Truth

Keep the JSON files in this folder as the source of truth unless the repo later adds an explicit generation pipeline.

Right now, local repo evidence shows:

- the root `README.md` is brand-facing rather than a docs index
- `.opencode/opencode.json` points OpenCode at `AGENTS.md`
- there is no local doc or script that clearly marks either JSON file as generated

That means these files should currently be treated as curated design prompt assets that live with their documentation, not disposable build output.

## Editing Posture

When updating either file:

- preserve valid JSON structure
- keep field names stable unless the runtime contract changes
- avoid claiming a generation workflow unless one is added and documented in this repo
- assume downstream prompt behavior can change significantly from even small text edits

## Naming Posture

These docs use the term `design prompts` because that matches the file contents more closely than a generic `OpenCode prompts` label.

OpenCode is still a plausible usage context for these assets, but the content itself is primarily about:

- visual direction
- layout and UI structure
- styling systems
- animation and motion language
- WebGL and presentation treatment
