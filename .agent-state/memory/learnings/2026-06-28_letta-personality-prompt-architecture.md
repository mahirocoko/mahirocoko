---
tags:
  - letta-code
  - personality
  - prompts
  - memory-architecture
  - agent-identity
---
# Lesson: Letta personality prompts are memory architecture, not just tone packs

Letta Code upstream personality presets should be analyzed as a memory architecture:

- `memo` is the Letta-native persistent identity: continuity-first, memory-first, low filler, learns the human through work.
- `tutorial` is onboarding product flow: it uses a proactive tutor persona plus a temporary `onboarding` checklist block that can be deleted after completion.
- `blank` is a minimal custom-personality scaffold.
- `linus` and `kawaii` are strong voice/character experiments with many anti-patterns and concrete examples to shape instinct.
- `claude` and `codex` are compatibility source prompts, not native continuity identities; `codex` is implementation/UI-heavy, while `claude` is task/safety/tooling-heavy.

Mechanic worth remembering: personality presets populate `persona` and `human` memory blocks, and some presets can add temporary task blocks such as `onboarding`. This is a better pattern than treating personality as a single monolithic system prompt.

Operational caution: when pulling a learned repo, preserve dirty state. If the clone is on a local branch without upstream or has local modifications, fetch upstream and read `origin/main` directly instead of merging, stashing, resetting, or cleaning.

For Mahiro Code, upstream prompts are references, not replacements. If borrowing later, prefer structural lessons: identity block + human-learning lens + temporary onboarding/checklist blocks + safe MemFS commit flow.
