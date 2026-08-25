# Provider-correct subagent routing needs explicit IDs and runtime proof

**Date**: 2026-07-18  
**Tags**: letta-code, subagents, GPT-5.6, model-routing, ChatGPT-OAuth, verifier, context-cost

## Lesson

Selecting a subagent model requires preserving five things together:

1. task role;
2. model family;
3. reasoning effort;
4. provider/auth route;
5. context and turn cost.

A plausible model ID can still select the wrong provider. The original 2026-07-18 catalog required `*-plus-pro-*` IDs for ChatGPT OAuth, but that contract is historical. In Letta Code 0.30.31 the current explicit presets are `gpt-5.6-luna-medium`, `gpt-5.6-terra-medium`, and `gpt-5.6-sol-high`; live readback resolves them to `openai-codex/*` with `provider_type: chatgpt_oauth` and the named effort. Bare family slugs resolve through the same provider but default to `reasoning_effort: none`.

## Current routing contract

- Mahiro Code main: GPT-5.6 Sol High.
- Repo scout and narrow mapping: Luna Medium.
- Routine specialist, Thai copy, sprite pipeline, and generic verification: Terra Medium.
- High-judgment UI, architecture, migration, native lifecycle, or security: Sol High.
- Git commit: GPT-5.3 Codex Spark.
- Recall/fork: inherit.

For local backend subagents, pass `model` explicitly. Without it, local resolution returns the active parent conversation model before consulting custom-agent frontmatter recommendations.

## Verification procedure

1. Check that the catalog ID exists and inspect its resolved provider handle plus effort.
2. Launch one bounded read-only smoke with the exact preset ID.
3. Read the spawned local agent record to confirm model family and reasoning effort.
4. Treat provider/auth failure as a routing result, not evidence that the task or implementation failed.
5. Measure agent value as evidence produced relative to context/turn cost; do not spawn merely because Luna or Terra is cheaper.

## Custom-agent lifecycle

Global custom definitions live under `~/.letta/agents/`. Their supported frontmatter is limited to `name`, `description`, `tools`, `model`, `skills`, `fork`, `background`, and `launchProfile`. The current `/reload` path reloads settings and local mods but does not invalidate the custom-subagent discovery cache, so adding a new type requires a fresh Letta process before the Agent tool can see it.

The new global `verifier` is the reusable independent QA lane. It is read-only, tries the cheapest counterexample first, and returns one of `VERIFIED`, `VERIFIED WITH CAVEATS`, `REFUTED`, or `BLOCKED`. Keep every verdict scoped: source review is not runtime QA, browser QA is not native QA, and a focused PASS is not a whole-product PASS.

## Evidence

- Plain Luna/Terra Medium launches failed with `No API key for provider: openai`.
- Plus/Pro Luna/Terra Medium launches succeeded.
- Mahiro Code's fresh agent listing showed Sol with high reasoning and 372k local catalog context.
- The Verifier smoke ran one `git status --short --branch` command, returned `VERIFIED`, and preserved a clean worktree.
