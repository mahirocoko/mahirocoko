# Lesson Learned

Natural-language prompts should be the default interface for a personal frontend doctrine skill.

The `frontend` skill became more accurate once it stopped behaving like a pseudo-checker and started behaving like a doctrine loader. The key shift was treating prompts such as "ช่วย refactor ให้เป็นในแบบของฉัน" as the primary interaction, with stack flags and retrieval lenses acting as optional precision controls. That better matches what the skill is actually for: loading Mahiro's judgment about boundaries, token usage, state separation, and implementation patterns into the AI before it writes or reviews code.

Another important lesson is that Mahiro style is not tied to one exact UI surface. `haabiz-hrm-fe` and `jit-flow` use different frontend surfaces, but they share the same deeper rules: route orchestration, service and provider boundaries, token discipline, clear state separation, and deliberate control over complexity. A doctrine skill should encode those invariants first and only then describe project or stack adaptations.

Tags: frontend-skill, doctrine, natural-language, react, retrieval, documentation
