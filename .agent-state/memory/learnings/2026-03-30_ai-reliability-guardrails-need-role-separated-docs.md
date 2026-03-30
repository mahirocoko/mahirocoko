# AI Reliability Guardrails Need Role-Separated Docs

## Tags

- ai-reliability
- claude
- docs
- writing
- guardrails

## Context

I analyzed a Thai post about reducing hallucination in Claude-style assistants using rules like "say I don't know," tool-first grounding, immediate retraction, and citations. The work moved from opinion synthesis into repo documentation.

## Learning

When a note serves two different jobs, it should usually become two files.

In this case, the same core idea needed to support:

1. a copy-paste-ready block for a global `CLAUDE.md`, and
2. a shareable Thai post that explains the idea to people.

Keeping both in one document was workable for a first pass, but splitting them made the result more durable. The implementation-focused file can stay concise and operational, while the public-facing file can keep tone, framing, and caveats without polluting the instruction block.

This also reinforced a phrasing lesson: anti-hallucination guidance works better when it targets unsupported inference rather than reasoning itself. "Do not present unverified inference as fact" is a better durable rule than blanket wording like "no chain-guessing" if the goal is to reduce confident fabrication without disabling legitimate multi-step reasoning.

## Why It Matters

Audience separation keeps docs easier to reuse. It also reduces the chance that a polished explanation gets mistaken for an implementation spec, or that a terse instruction block gets shared publicly without enough nuance.

## Durable Note

If a reliability note has both operational and narrative value, separate the operational artifact from the narrative artifact and keep the original path as a small index when continuity matters.
