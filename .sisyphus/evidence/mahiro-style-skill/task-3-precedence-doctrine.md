# Task 3 - Precedence Doctrine for `mahiro-style`

## Purpose

Lock the exact rule order that later `foundations/precedence` content must express.

This skill stays hybrid:

- It helps code feel like Mahiro wrote it.
- It never silently overrides repo-local doctrine.
- Repo-local rules win first, Mahiro doctrine fills the gaps.

## Exact precedence order

1. `AGENTS.md`
2. Other repo-local instruction files, such as `CLAUDE.md`
3. Established repo patterns already in use
4. Mahiro fallback doctrine

## What each level means

### 1. `AGENTS.md`

This is the highest-priority local doctrine file.

- If `AGENTS.md` gives an explicit rule, follow it.
- If `AGENTS.md` conflicts with any other local instruction file, `AGENTS.md` wins.
- If `AGENTS.md` only covers part of a topic, keep its rules fixed and fill remaining gaps from lower levels.

### 2. Other repo-local instruction files

This covers local files that shape agent behavior or repo conventions but are not `AGENTS.md`, for example `CLAUDE.md`.

- Use them when `AGENTS.md` is absent or silent on the specific question.
- They can narrow or clarify local behavior.
- They cannot overrule an explicit `AGENTS.md` rule.

### 3. Established repo patterns already in use

This means the real codebase has a repeated, intentional shape even if no local doc states it directly.

- Prefer stable, repeated patterns over importing Mahiro defaults too quickly.
- A one-off file is not enough. Look for recurring structure across the repo.
- Treat repeated implementation shape as lower than explicit local doctrine, but higher than cross-repo Mahiro fallback rules.

### 4. Mahiro fallback doctrine

This is the skill's core value when the repo does not already decide the matter.

- Use Mahiro doctrine to fill gaps.
- Use it to review drift when local doctrine is silent.
- Never use it to erase explicit local rules or strong existing repo patterns.

## Conflict-resolution rules

When sources disagree, resolve conflicts in this order:

1. Check whether `AGENTS.md` states the rule directly.
2. If not, check other repo-local instruction files.
3. If local docs are still silent, inspect established repo patterns.
4. Only then apply Mahiro fallback doctrine.

Operational rule:

- Explicit local doctrine beats inferred patterns.
- Stable repo patterns beat fallback taste.
- Mahiro doctrine shapes new work only where the repo has not already made the choice.

## Tie-break guidance

Use these tie-breaks when the answer is still not obvious.

### Explicit beats implicit

- A written local rule beats a pattern inferred from code.
- A repeated repo pattern beats a vague Mahiro preference.

### Specific beats general

- A topic-specific local rule beats a broad local philosophy statement.
- A page about `i18n` beats a generic note about code style when the conflict is about translation boundaries.

### Repeated beats isolated

- Three or more consistent examples across active code are stronger evidence than one exceptional file.
- Migration leftovers do not count as the repo's intended pattern.

### New code follows the winner

- Do not average conflicting rules into a hybrid compromise.
- Pick the winning layer, then keep new code internally consistent with that layer.

## Concrete conflict examples

### Example 1: `AGENTS.md` vs `CLAUDE.md`

Situation:

- `AGENTS.md` says route files should stay thin and move business logic into domain modules.
- `CLAUDE.md` says colocating heavier logic inside route files is acceptable for speed.

Winner: `AGENTS.md`

Why:

- `AGENTS.md` is the highest-priority repo-local doctrine.
- The lower local file can only help when `AGENTS.md` is silent, not contradict it.

### Example 2: `CLAUDE.md` vs Mahiro fallback doctrine

Situation:

- No `AGENTS.md` rule exists for exports.
- `CLAUDE.md` says the repo prefers named exports.
- Mahiro fallback doctrine would usually prefer a different code-shape choice in some contexts.

Winner: `CLAUDE.md`

Why:

- Repo-local instruction beats fallback doctrine.
- The skill should adapt Mahiro shape inside that local export preference instead of replacing it.

### Example 3: Repo patterns vs Mahiro fallback doctrine

Situation:

- Local docs do not mention query hook placement.
- The repo repeatedly keeps query hooks near domain services in feature folders.
- Mahiro fallback doctrine might otherwise split them differently.

Winner: established repo patterns

Why:

- Repeated repo structure shows an intentional local shape.
- Mahiro doctrine should only fill the gaps, not flatten existing repo habits.

### Example 4: Partial local doctrine plus fallback fill-in

Situation:

- `AGENTS.md` says all user-facing copy must remain translation-safe.
- It does not specify whether extracted config should store plain strings, descriptors, or render functions.
- The repo code does not show a settled pattern.

Winner:

- `AGENTS.md` keeps control of the translation-safe requirement.
- Mahiro fallback doctrine fills the unresolved implementation detail.

Why:

- The local rule sets the boundary.
- Mahiro doctrine fills the gap without weakening that boundary.

## Anti-drift guidance for later rewrite

The final precedence page and hub wording should make these points unmistakable:

- `AGENTS.md` is first, not just "recommended first".
- Other repo-local instruction files sit between `AGENTS.md` and repo patterns.
- Repo patterns matter even when docs are incomplete.
- Mahiro doctrine is fallback and shaping guidance, not an override layer.
- The skill is hybrid: Mahiro code shape, repo-local doctrine wins.

## Ready-to-lift wording

Use this sentence family in later canonical docs:

> `mahiro-style` is a hybrid doctrine. It helps code feel like Mahiro, but it yields to repo-local rules first. Follow `AGENTS.md`, then other repo-local instruction files such as `CLAUDE.md`, then established repo patterns, and only then apply Mahiro fallback doctrine.
