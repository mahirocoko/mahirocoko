# Learning Note

**Date**: 2026-04-01  
**Tags**: gemini, mahiro-skills, oracle-family-skills, release, packaging, restore, extension

## Lesson

When a packaged skill drifts behind its upstream source, the right recovery pattern is: prove the local payload is incomplete, validate the upstream source by rebuilding it first, restore the subtree into the target repo, then reconcile repo-specific branding and packaging instead of copying blindly.

## Why It Mattered

In this session, the visible symptom was a missing Chrome extension build for the Gemini skill. The actual problem was larger: `mahiro-skills/skills/gemini` had fallen far behind `oracle-family-skills/src/skills/gemini` and was missing most of its payload. If I had stopped after rebuilding the upstream extension, the user would have a working artifact path but the packaged skill in `mahiro-skills` would still be structurally broken. The durable fix came from restoring the subtree, keeping `mahiro-skills`-specific packaging and branding, adding missing dependencies and root-level build hooks, and then cutting a release.

## Reusable Pattern

1. Compare target subtree vs source-of-truth subtree directly.
2. Validate the source by building or running it before transplanting anything.
3. Restore the missing payload into the target repo.
4. Preserve target-repo install surfaces, branding, and path conventions.
5. Add root-level verification commands if the restored payload has its own build flow.
6. Verify from the target repo root, not from whichever nested directory was convenient.
7. Release only after the target repo passes its own checks.

## Concrete Reminder

Delegated restore summaries are not enough. Always inspect the target tree after a delegated file operation, especially when the work spans a nested repo and the success condition is structural completeness rather than a single line edit.
