# Release boundaries and shell guidance need real verification

**Date**: 2026-03-30
**Tags**: `mahiro-skills`, `release`, `rrr`, `shell`, `verification`, `lessons`

## Lesson

There are two kinds of “done” that look similar but are not the same: pushed code and released code. In the `mahiro-skills` session, the installer entrypoint, README rewrite, and `rrr` hotfix all existed on `main`, but the latest public release was still `v0.1.0`. The correct finishing move was to compare `HEAD` against the latest tag, update versioned references coherently, run the gates again, and then cut `v0.1.1`.

The same principle applied to shell guidance. The `/rrr` flow had already “worked” overall, but a real parse error showed the command shape was still brittle. That made the issue release-worthy for the packaged skill itself. Once a shell pattern fails in real usage, the fix should live in the reusable guidance, not only in the one-off command rerun.

## Why it matters

- Users experience releases, not just commits.
- Version references in docs and tests must move together or release prep becomes noisy and error-prone.
- Real shell failures are stronger evidence than theoretical concerns; they should feed back into packaged guidance.

## Reuse pattern

1. After push, compare `HEAD` to the latest release tag.
2. If they differ and the work is meant to be shipped, prepare a patch release explicitly.
3. Treat version strings as a single cluster across docs, metadata, installer examples, and tests.
4. When a shell pattern fails in practice, update the shared skill guidance so the failure does not repeat.
