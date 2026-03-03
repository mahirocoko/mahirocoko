# Lesson Learned: Natural-Intent Fallback for Frontend Skill

## Context

During frontend guidance flow, literal focus matching (`style label.tsx`) was too brittle and often returned low-signal or empty outputs. The user intent was operational ("use this guidance and act"), not lexical ("find exact same string").

## Pattern

For CLI guide skills, treat natural-language prompts as first-class inputs:

1. Normalize and tokenize user query (`label.tsx` -> `label`).
2. Expand with scoped aliases (`label` -> related form-control tokens).
3. Score rendered guidance lines.
4. If confidence is weak or action intent is present (`refactor`, `fix`, `align`), emit an **AI Fallback** block:
   - interpreted mode
   - detected file targets
   - top relevant guidance lines
   - one ready-to-use implementation handoff prompt

## Why It Works

- Prevents dead-end responses like "No matching lines found" on valid natural prompts.
- Converts guidance retrieval into execution-oriented output.
- Keeps deterministic script behavior while still supporting AI decision layers.

## Reusable Rule

When a guide command fails lexical match but user intent is clearly actionable, always provide a structured fallback prompt so implementation can continue immediately.

## Confidence

- High for prompt categories involving file names and refactor/fix verbs.
- Medium for ambiguous one-word inputs without domain anchors.

## Tags

frontend-skill, cli-ux, prompt-matching, fallback-design, snippet-first
