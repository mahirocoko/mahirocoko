# Learning: Project-local skill experiments need one canonical owner

**Date**: 2026-07-10
**Tags**: skill-architecture, mahiro-skills, frontend-design, taste-skill, default-bundle, cleanup, install-verification

## Lesson

A project-local skill tree can be valuable during experimentation, but once the same role has a maintained cross-agent owner, keeping both copies creates discovery ambiguity, stale scripts, and hidden prompt priors.

Preferred lifecycle:

1. Study the local and external skill implementations before deletion.
2. Extract durable contracts and role boundaries.
3. Promote the reusable behavior into canonical `mahiro-skills` with wrappers, catalog surfaces, tests, and release alignment.
4. Verify default/all installation through actual isolated installs across adapters.
5. Remove the project-local runtime and update active docs that point to it.
6. Preserve historical plans, retrospectives, and Git history rather than rewriting the past.

For frontend design, keep this role split:

```text
frontend-design
→ explicit briefs, reference anatomy, redesign mode, high-level asset roles,
  responsive/state expectations, and fidelity planning

asset-designer / web-asset-prompts / codex-asset-production
→ production asset planning, prompts, generation, cleanup, QA, and promotion

uncodixify
→ explicit or evidence-triggered post-render audit/enforcement
```

Core installation and experimental triggering are separate controls. If Mahiro considers a skill primary, include it in the single default bundle so `install --agent all` delivers it. Protect native-model baselines through precise trigger descriptions and explicit workflow gates, not by omitting the skill from installation.

When deleting a tracked runtime surface, run an exact reference search. Update current README/usage entrypoints that would otherwise become broken, but leave dated plans, specs, traces, and retrospectives unchanged as historical evidence.
