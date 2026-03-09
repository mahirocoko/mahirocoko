# Lesson Learned: Public-Friendly Doctrine Needs Archetypes, Not Source-Case Names

## Context

This lesson came from a long session that crossed `haabiz-hrm-fe` implementation work, skill-repository learning, trace-based doctrine extraction, and a publicization pass on `mahiro-style`. The trigger was a practical concern: the doctrine itself was becoming sharper, but its canonical pages still leaned too heavily on named source projects such as `haabiz-hrm-fe`, `jit-flow`, and `eizypay-fe`, along with very specific example filenames and paths.

## Pattern Identified

The most portable version of a style skill is not the one that removes personality entirely. It is the one that separates three layers clearly:

1. **Portable doctrine** - ownership rules, route thickness rules, naming heuristics, i18n boundaries, and structure principles that can survive across repos.
2. **Generic examples** - examples written in role-based language such as `dashboard`, `route entry file`, `feature section folder`, or `feature-local config helper`.
3. **Private evidence** - the original source repos, file paths, and refactor case studies that proved the rule, but do not need to sit in the public-facing doctrine.

When private evidence stays in the canonical pages, the skill starts to feel like a guided tour of one person's project history. When the same rules are rewritten in repo-archetype language, the doctrine becomes more widely usable without losing precision.

## Why It Matters

This matters because style doctrine fails in two opposite ways. If it stays too personal, outsiders feel like they need to know the author's world before they can trust the rules. If it becomes too abstract, the rules lose their bite and collapse into generic advice. The right middle path is archetype-driven writing: keep the rules concrete, keep the examples realistic, but replace named-project references with stable repo shapes like `lean route-first app`, `responsibility-first single app`, or `monorepo with shared packages`.

## Reusable Guidance

- Keep named project references out of canonical doctrine pages unless the project name itself is essential to the rule.
- Rewrite example paths and filenames so they teach a role, not a remembered source case.
- Preserve the original evidence somewhere else if needed, but do not make readers pass through private lore to use the rule.
- Treat source-case leakage as more than repo names. Specific filenames, feature names, and path shapes can leak just as much context.
- Public doctrine should still feel like method, not marketing.

## Practical Rule

When a style skill is intended to travel beyond one person's repos, canonical doctrine should use:

- portable rules
- archetype-based examples
- local precedence that still yields to the target repo

And it should avoid:

- named source repos in core doctrine pages
- case-study filenames in examples unless they are already generic
- examples that require knowledge of the author's project history to feel meaningful
