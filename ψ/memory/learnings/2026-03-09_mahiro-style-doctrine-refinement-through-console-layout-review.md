# Lesson Learned: Mahiro-Style Doctrine Refinement Through Console Layout Review

## Context

This lesson came from a live review and refactor loop in `haabiz-hrm-fe`, centered on `app/components/layouts/console/` and the follow-up update to the `mahiro-style` skill in this repo. The work covered nested-folder naming, section-order doctrine, owner-local constants, props versus local ownership, and Lingui posture.

## Patterns Identified

### 1. Explicit local doctrine must beat uneven active-code snapshots

**Confidence**: High

If `AGENTS.md` says a repo uses a specific internal section order, that rule should guide new or updated files even when the current codebase applies it inconsistently. A migration-in-progress snapshot is not stronger evidence than explicit doctrine.

### 2. Owner-local data is often clearer than extracted constants

**Confidence**: High

When copy, options, badges, nav items, or placeholder data are used by exactly one component, extracting them into `constants/` or lifting them into a compose parent often lengthens the read path without buying reuse. The better default is to keep the data with the true owner until a real multi-consumer pattern emerges.

### 3. Nested-folder naming needs a path/export split rule

**Confidence**: High

Inside a domain-revealing folder like `app/components/layouts/console/`, filenames can often drop redundant prefixes (`header.tsx`, `sidebar.tsx`) because the path already carries the domain. Exported component names can still stay explicit (`ConsoleLayoutHeader`, `ConsoleLayoutSidebar`) where searchability or cross-file clarity benefits.

### 4. Parent composition does not need prop plumbing for local children

**Confidence**: Medium-High

If a child component is domain-local and not intended for reuse, the parent compose file does not need to centralize its local data just to pass props. The cleaner shape is often a thin parent shell with children that own their own local arrays, placeholder data, and translation calls.

### 5. `const { t } = useLingui()` is the best owner-local default

**Confidence**: High

For components that render their own final UI copy directly, `const { t } = useLingui()` is a clearer default than extracting descriptors prematurely. `msg` + render-boundary translation still makes sense for genuinely shared config, but it should not become cleanup cargo cult.

## Connections to Past Learnings

- `2026-03-08_mahiro-style-needs-real-refactor-feedback-loops.md` already suggested that the skill only becomes useful when shaped by real refactor pressure. This session confirmed that strongly.
- `2026-02-27_lingui-source-language-pattern.md` reinforced that i18n posture should preserve clear ownership and source-language discipline. This session extended that lesson into the question of when not to extract copy.
- The console retrospectives from `2026-03-04` and `2026-03-08` both foreshadowed the same issue: structure should emerge from actual ownership boundaries, not just from a desire to shorten files.

## Mistakes To Avoid

- Do not treat a half-migrated file tree as the real repo rule when `AGENTS.md` already decided the shape.
- Do not extract constants or shared props just because the diff looks tidier from a distance.
- Do not let folder context and export naming drift independently; decide what the path explains and what the symbol name still needs to explain.
- Do not default to `msg`-driven extraction for owner-local layout copy that is easier to scan inline with `t`.

## Reusable Guidance

- Before extracting constants, ask: “Does this have more than one true consumer?”
- Before lifting child data into a parent, ask: “Is the parent really the owner, or is it only assembling siblings?”
- Before trusting repo snapshots, ask: “Does `AGENTS.md` already say the intended rule more clearly?”
- In nested feature folders, prefer shorter filenames and explicit exported component names.
- In owner-local render files, prefer `const { t } = useLingui()` unless the data is truly shared.

## Practical Rule Set

1. Local `AGENTS.md` wins over uneven implementation snapshots.
2. Single-owner data stays with the owner by default.
3. Compose parents stay thin when children can own their own local data.
4. Folder context can shorten filenames, but exports should keep enough domain signal.
5. `t` is the default for owner-local copy; `msg` is for genuinely shared extracted config.

## Why This Matters

The deepest lesson is that style doctrine should not be a frozen aesthetic manifesto. It should become more accurate every time real code pushes back. This session showed that the most trustworthy `mahiro-style` guidance is not the most abstract version of Mahiro taste. It is the version that survives live disagreement, repo-local doctrine, and concrete refactor pressure without losing clarity.
