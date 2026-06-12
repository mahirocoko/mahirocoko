# Lesson Learned — RTK as output control and skill root bridging

**Date**: 2026-06-12  
**Tags**: letta-code, rtk, skills, workflow, global-tools

## Lesson

RTK should be treated as an output-control lane, not a semantic replacement for all shell usage. In Mahiro's Letta setup, a hook may block noisy raw commands; the correct response is to rerun with `rtk` rather than bypassing the hook. Raw commands still matter when exact output, interactive behavior, long-running sessions, or RTK debugging is needed.

Skill discovery also has a real root split:

- Mahiro's cross-agent global skills live under `~/.agents/skills`.
- Letta Code currently discovers global skills under `~/.letta/skills`.
- Bridge the two with symlinks when Mahiro wants a `~/.agents/skills` skill available to Letta.
- If a skill is accidentally installed under workspace `.claude/skills`, move it to `~/.agents/skills/<name>` for global reuse, then symlink `~/.letta/skills/<name>` to it.

## Concrete checks

```bash
# Skill root check
find ~/.agents/skills -maxdepth 2 -name SKILL.md
find ~/.letta/skills -maxdepth 2 -name SKILL.md

# Create Letta bridge
ln -s ~/.agents/skills/<name> ~/.letta/skills/<name>

# CLI provenance check
command -v playwright
ls -la "$(command -v playwright)"
realpath "$(command -v playwright)"
```

## Why it matters

This prevents two recurring forms of drift: agents producing huge command output despite Mahiro's RTK hook, and skills being installed in one agent ecosystem but invisible in Letta Code. Keep the guidance small in repo context; promote to a dedicated skill only if repeated operational pressure appears.
