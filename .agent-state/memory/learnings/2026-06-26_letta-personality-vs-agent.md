---
tags: [letta-code, personality, agents, novel-agent]
---
# Lesson: Personality is not the same as a separate agent

When Mahiro asks about Letta Code `/personality`, explain the distinction clearly:

- **Personality** changes the persona/template behavior of the current agent.
- It does not create a new agent by itself.
- The same agent keeps its agent id, memory, recall/history, tools, and current long-term continuity.
- **Separate agents** have separate ids, memory, recall/history, and durable self.

Guidance for Mahiro's setup:
- Keep **Mahiro Code** on the memory-first Letta Code personality; it matches the role of main persistent coding companion.
- Do not casually swap Mahiro Code into `Blank`, `Linus`, tutor, or vanilla flavors because that can disrupt learned self and workflow.
- For a dedicated Thai novel/writing agent, prefer `Blank` and craft a custom persona around canon memory, character voice, plot threads, emotional pacing, and Thai reader experience.
- Pair a novel agent with `thai-novel-reader-experience` and focused memory files for canon/characters/style rather than coding-project conventions.

For experiments, separate safe UI affordances from runtime/context-affecting features. `conversation titles` is relatively safe; features like conversation bootstrap, node routing, or scheduler behavior should be treated as experimental until verified.
