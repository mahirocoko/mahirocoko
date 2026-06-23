# Lesson Learned — Safe project learn/ghq cleanup needs an executable plan

Tags: `project`, `cleanup`, `ghq`, `agent-state`, `symlink-safety`

## Lesson

When cleaning `.agent-state/learn` and ghq clones, do not delete directly from live discovery results only. First build and preserve an explicit cleanup plan: selected learn entries, ghq targets to delete, incubate targets to preserve, non-ghq targets to skip, and unmatched patterns. Then execute that plan with symlink-aware deletion and verify counts afterward.

## What triggered this

Mahiro wanted to reduce a large learn list. I correctly inventoried first and asked for dry-run confirmation, then targeted a user-provided list. However, the first execution failed midway because `shutil.rmtree` cannot remove a symlink directory. Since some learn entries were already removed, rerunning discovery alone would no longer find all ghq clones that still needed deletion. I recovered by using the earlier targeted path list directly, but a saved execution plan would have been safer.

## Durable rule

For future learn/ghq cleanup:

1. Inventory learn, incubate, ghq, and non-ghq targets.
2. Ask for scope and confirmation before deletion.
3. Write a plan file or keep a structured in-memory plan before executing.
4. Delete learn entries with a helper: unlink symlinks/files, rmtree real directories only.
5. Delete ghq clones only when they are learn-only and under the ghq root.
6. Re-run project list verification: learn count, incubate count, broken links, selected path existence.

## Applied this session

The cleanup removed the selected learn entries and ghq clones, preserved incubate targets and non-ghq work/local paths, and ended with 17 learn entries, 7 incubate entries, and 0 broken links.
