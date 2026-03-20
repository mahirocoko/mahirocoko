# Handoff: mahiro docs rules init wrap up

**Date**: 2026-03-20 12:00
**Context**: 95%

## What We Did
- Renamed the docs bootstrap skill from `docs-rules-init` to `mahiro-docs-rules-init` and updated its invocation/docs.
- Hardened the skill doctrine around reality-first versus blueprint-allowed pages in `.agents/skills/mahiro-docs-rules-init/resources/generation-rules.md`.
- Refined key templates including `AGENTS.md`, `formatting.md`, `imports.md`, `typescript.md`, `component-conventions.md`, `hooks-pattern.md`, `services-pattern.md`, and `best-practices.md`.
- Committed the skill work as `d20e0fe` with `docs: 📝 harden mahiro docs skill`.
- Verified the renamed skill on `~/ghq/lab/vite-react-template`; it made only two narrow corrective docs edits, which confirmed healthy post-bootstrap restraint.
- Wrote retrospective and learning, synced the lesson to Oracle, and committed that record as `b16ee18`.

## Pending
- [ ] Decide whether to keep `init` only or introduce a dedicated `sync` mode for already-initialized repos.
- [ ] Verify the skill on one or two additional starter repos to test whether the same restraint holds across different repo shapes.
- [ ] Review whether any remaining template pages still carry subtle meta-template voice after multiple reruns.

## Next Session
- [ ] Run `/mahiro-docs-rules-init` on another small repo and compare the create/skip behavior with `vite-react-template`.
- [ ] If repeated drift appears, design a clean separation between bootstrap behavior and sync behavior.
- [ ] Tighten only the next weakest template surfaced by real output review, not by speculative editing.

## Key Files
- `.agents/skills/mahiro-docs-rules-init/SKILL.md`
- `.agents/skills/mahiro-docs-rules-init/README.md`
- `.agents/skills/mahiro-docs-rules-init/resources/generation-rules.md`
- `.agents/skills/mahiro-docs-rules-init/templates/code-style/formatting.md`
- `.agents/skills/mahiro-docs-rules-init/templates/code-style/imports.md`
- `.agents/skills/mahiro-docs-rules-init/templates/code-style/typescript.md`
- `.agents/skills/mahiro-docs-rules-init/templates/patterns/component-conventions.md`
- `.agents/skills/mahiro-docs-rules-init/templates/patterns/hooks-pattern.md`
- `.agents/skills/mahiro-docs-rules-init/templates/patterns/services-pattern.md`
- `ψ/memory/retrospectives/2026-03/20/11.58_mahiro-docs-rules-init-rename-and-verification.md`
- `ψ/memory/learnings/2026-03-20_mahiro-docs-skill-needs-restraint-after-bootstrap.md`
