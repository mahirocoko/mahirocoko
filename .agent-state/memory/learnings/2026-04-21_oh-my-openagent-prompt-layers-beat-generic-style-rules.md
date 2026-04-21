# Lesson Learned: OmO prompt layers can outweigh generic local style rules

## Summary
When OmO behaves in a way that seems to contradict a local preference file like `~/.claude/CLAUDE.md`, do not assume the local file is being ignored. In this session, the repeated “two ways / which option do you want?” pattern was not best explained by GPT-5.4 itself and not by the active user config alone. The stronger explanation came from the built-in prompt stack, especially Prometheus, which explicitly instructs the planner to present multiple options and even forces a final two-choice handoff.

## What actually mattered
- Prometheus GPT prompt explicitly says to provide `2-4 options + recommended default`.
- Interview mode says to use the `Question` tool when presenting multiple options.
- Plan generation hard-codes a final `Start Work` vs `High Accuracy Review` choice.
- Delegated planning adds another prepend layer that pushes clarification and explicit decision framing.
- Existing user config did not contain the real cause; it mostly set models and one lightweight `prometheus.prompt_append`.

## Why this matters
This is a good example of why prompt behavior debugging should be done like configuration debugging. There may be several active layers:
1. local operator rules,
2. built-in orchestrator prompt,
3. planner-specific prompt variant,
4. delegated planner prepend,
5. user or project prompt appends.

If a deeper or more explicit layer says “offer options,” that instruction can dominate a generic recommendation-first preference higher up. The fix is not to argue abstractly about the model. The fix is to identify the active layer and patch the right one.

## Practical takeaway
When response style is off, inspect in this order:
1. built-in agent prompt for the active lane,
2. delegated prepend logic,
3. user config prompt overrides,
4. project config and legacy config files,
5. only then ask whether the model itself is amplifying the pattern.

## Tags
- omocode
- prompt-layering
- recommendation-first
- config-debugging
