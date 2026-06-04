# Lesson Learned: MemFS local commits are not always remote sync

**Date**: 2026-05-26
**Tags**: letta-code, memfs, memory, git, local-mode, workflow

## Context

Mahiro noticed that my memory repository was dirty. We inspected the diff and found real Murmur/mahiro-whisper durable memory updates, then committed them locally inside the Local mode MemFS repo. The follow-up `git push` failed because the memory repo had no configured remote.

## Lesson

Do not equate “memory repo is clean after commit” with “memory was pushed to a remote.” In this Local mode setup, MemFS is projected as a local filesystem/git repository under `$MEMORY_DIR`, and local commits provide useful versioning. But `git push` only works if a remote is configured. A configured Letta API git-backed memory repo would push to an endpoint like `$LETTA_BASE_URL/v1/git/<agent-id>/state.git`; this particular local repo had no remote.

## Operating rule

Before saying memory is synced remotely or before running `git push`, check:

```bash
git -C "$MEMORY_DIR" status --short
git -C "$MEMORY_DIR" remote -v
git -C "$MEMORY_DIR" log --oneline -3
```

Use precise wording:

- “Committed local memory repo” = local git history updated and working tree clean.
- “Pushed/synced memory remote” = remote exists and push succeeded.
- “MemFS projection exists” = files are available under `$MEMORY_DIR`; this does not itself imply a remote.

## Why it matters

Mahiro cares about durable memory and transparent agent behavior. Overclaiming remote sync would make memory feel less trustworthy. The correct posture is repo-reality-first: inspect the actual memory repo config, report what happened, and clearly separate local persistence from remote backup.
