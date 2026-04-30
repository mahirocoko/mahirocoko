# Lesson Learned: Recover Missing Learn Artifact

**Date**: 2026-04-30  
**Tags**: `learn`, `background-agents`, `documentation`, `recovery`, `chromex`

## Lesson

In a `/learn --deep` run, one failed background agent should not invalidate the whole learning session if the missing artifact can be recovered from already-generated docs plus source evidence. The safe recovery pattern is:

1. Collect all successful background outputs first.
2. Verify the expected artifact list on disk.
3. Inspect the failed task output to confirm what is missing.
4. Retry the same session when possible; if it aborts, complete the missing artifact directly with bounded scope.
5. Ground the recovery in source files and successful sibling docs.
6. Re-verify all expected docs and source tree cleanliness before reporting completion.

## Why it matters

The quick-reference lane timed out while the other four Chromex docs succeeded. Recovering only the missing `2041_QUICK-REFERENCE.md` preserved the value of the deep pass without re-running the entire workflow or duplicating already-complete research.

## Reuse

For future `/learn --deep` tasks, include explicit output-size constraints in agent prompts and keep a recovery checklist ready for missing artifacts.
