# Framework-agnostic frontend patterns over profile sprawl

When style is maturing across multiple projects, prioritize extracting cross-framework writing boundaries into one core guide rather than expanding stack-specific profiles. The stable signal is usually architectural behavior (page orchestration, layout guard boundaries, provider bootstrap, service transport, centralized auth/session sync, and consistent error-feedback flow), not framework syntax.

Use profiles as delta layers only. If a rule is true in more than one stack, move it to core immediately. This prevents profile drift, duplicate guidance, and maintenance overhead.

For deep codebase learning, treat subagent output as reconnaissance. Final docs should be synthesized from verified source reads before becoming memory artifacts.
