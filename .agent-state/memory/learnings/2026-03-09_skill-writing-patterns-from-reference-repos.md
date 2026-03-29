# Skill Writing Patterns from Reference Repos

**Date**: 2026-03-09
**Source**: Analysis of vercel-labs/agent-skills, vercel-labs/next-skills, anthropics/skills
**Concepts**: skill-design, agent-skills, detect-triggers, code-examples, decision-trees, ownership-declarations

## Pattern

Effective agent skills share these structural patterns:

1. **SKILL.md as thin hub** — routes to sub-files, never duplicates content
2. **~500 line target per file** — progressive disclosure over monolithic docs
3. **Bad/Good code pairs** — every rule needs concrete code, not just prose
4. **Detection triggers** — machine-parseable signals for when a rule applies (e.g., "File has inline fetch AND renders JSX")
5. **Decision trees** — ASCII trees for branching ownership questions beat prose lists

mahiro-style adds innovations not in reference repos:
- **Ownership declarations** ("this page owns X") per page
- **Anti-ownership** ("do not use this page for Y, see other-page.md")
- **Precedence system** (4-level winner order for conflict resolution)
- **Consistent section template** (Intent/Non-negotiable/Preference/Contextual/Examples/Anti-Examples)

## Validation

All patterns confirmed against 3 real codebases (haabiz-hrm-fe, jit-flow, eizypay-fe). Detect triggers correspond to actual code smells found in the repos. Code examples are grounded in real patterns, not hypotheticals.
