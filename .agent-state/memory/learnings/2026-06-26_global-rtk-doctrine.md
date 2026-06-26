---
tags: [rtk, workflow, memory, global-guidance]
---
# Lesson: Use ~/.agents/RTK.md as Mahiro's global RTK doctrine

Mahiro prefers a global RTK source of truth instead of copying RTK rules into every repo's `AGENTS.md`.

Canonical file:

```text
~/.agents/RTK.md
```

Core rule:

> For shell commands, preserve the repo-native command shape first, then prepend `rtk`.

Examples:

```bash
pnpm check      -> rtk pnpm check
yarn lint       -> rtk yarn lint
bun test        -> rtk bun test
git status      -> rtk git status
```

Do not change package managers, script names, flags, cwd, or command intent just because RTK is involved.

Layering:
- Hook layer: Letta's `~/.letta/hooks/rtk-letta-rewrite.py` transparently rewrites commands where possible.
- Doctrine layer: `~/.agents/RTK.md` explains when to prefer RTK, when to use raw output, and how to debug.
- Memory layer: I should remember to treat `~/.agents/RTK.md` as the global RTK source of truth.
- Repo docs layer: only add an `AGENTS.md` RTK reference when a repo needs portability across agents that do not share this memory.

Escape hatch:

```bash
RTK_DISABLED=1 <cmd>
```

Letta debug:

```bash
tail -50 ~/.letta/hooks/rtk-letta-rewrite.log
```
