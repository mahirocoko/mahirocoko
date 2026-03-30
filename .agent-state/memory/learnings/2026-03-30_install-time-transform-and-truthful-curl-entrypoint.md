# Install-time transform and truthful curl entrypoint

**Date**: 2026-03-30
**Tags**: `mahiro-skills`, `installer`, `readme`, `release`, `nested-repo`, `lessons`

## Lesson

When a packaged repo is the canonical source of truth, user-visible differences that should appear only after installation must be applied during the install pipeline, not by mutating the source files themselves. In `mahiro-skills`, the correct design was to copy each target into a staging path, rewrite only the staged markdown frontmatter there, and then move the staged copy into place. That preserved the repo content while still giving installed skills and command wrappers the `Mahiro Skill |` prefix the user wanted.

The same rule applies to documentation: a README install example should only be added after the install path is real and testable. Once `install.sh` existed and passed both Bun tests and a shell smoke test, the curl example became truthful instead of aspirational.

## Why it matters

- It protects the repo as a stable package source.
- It prevents source-vs-installed behavior from drifting silently.
- It makes README examples trustworthy because they are backed by executable behavior.
- It keeps nested repo releases cleaner by separating release-scope work from follow-up installer/docs work.

## Reuse pattern

1. Keep source assets canonical.
2. Apply install-only mutations in a staging copy.
3. Add tests that assert both sides: source unchanged, installed target changed.
4. Only document a curl/install flow after it exists and passes a real smoke run.
