# Learning: namespace fixes need canonical inventory too

**Date**: 2026-04-01
**Tags**: mahiro-skills, gemini, inventory, naming, release, oracle-review

## Context

After shipping native Gemini `.toml` commands in `mahiro-skills`, real user feedback showed runtime name conflicts with existing Gemini commands. The immediate fix was to namespace installed Gemini command files as `mahiro-*.toml`.

## What Happened

The namespace idea was correct, but the first pass was incomplete in two ways. First, repo inventory still derived commands from the markdown lane, so the docs claimed `commands-gemini/` was canonical while runtime discovery did not fully agree. Second, a simple prefix rule created doubled names like `mahiro-mahiro-style.toml` for already-prefixed logical command names. Oracle review caught both issues before the final release. I then added normalized Gemini inventory handling in `src/repo.ts` and a formatter rule that preserves already-prefixed names.

## Lesson

When fixing runtime naming conflicts, changing file targets is only half the job. The repo’s own inventory and naming normalization rules must also change, or the system becomes internally inconsistent. A namespace is a contract, not just a string transformation.

## Why It Matters

This prevents a class of “green today, drifting tomorrow” bugs. If the canonical-source story in docs, inventory, planner, and assets does not line up, the next Gemini-specific add or rename can silently fail in ways that current tests do not fully exercise.

## Reuse

- Whenever you add an adapter-specific artifact lane, update inventory discovery in the same pass.
- If a naming scheme adds prefixes, define behavior for already-prefixed logical names explicitly.
- Treat Oracle review as especially useful after “small” naming or packaging fixes; those changes often hide canonical-source mismatches.
