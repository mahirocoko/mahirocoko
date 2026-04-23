---
title: Superpowers skills should be installed into OpenCode item by item
created: 2026-04-23
tags: [lesson, superpowers, opencode, skills, commands, symlink, installation]
slug: superpowers-skills-should-be-installed-item-by-item
---

# Superpowers skills should be installed into OpenCode item by item

## Lesson

When exposing a third-party skill repo like `obra/superpowers` to OpenCode, I should symlink each skill and command into the destination root individually instead of hanging the entire source directory under one extra namespace layer.

## Why it matters

OpenCode’s local discovery shape is root-oriented: the destination directories already contain one entry per skill or command. If I add a whole `superpowers/` folder as a single symlink, the final structure may look tidy to me but behave incorrectly for the host because discovery now depends on an extra nesting layer that was never part of the target contract. Installing item by item preserves the host’s expected shape, keeps the source repo live-updating through symlinks, and makes collision checking explicit instead of hidden.

## Applied in this session

- Learned `obra/superpowers` deeply enough to identify the skills and command shims that actually ship.
- Checked the existing contents of `~/.config/opencode/skills` and `~/.config/opencode/commands` before touching anything.
- Corrected the initial folder-level symlink idea after the user called out the shape mismatch.
- Created per-item symlinks for 14 skills and 3 command files, then verified representative targets resolved correctly.

## Repeat next time

- Inspect the destination directory shape before proposing a symlink strategy.
- Prefer per-item symlinks when the host treats entries as first-class root-level artifacts.
- Verify a few representative links after installation, not just the creation command output.
