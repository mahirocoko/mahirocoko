# Handoff: docs-rules-init Skill Hardening

**Date**: 2026-03-19 22:13 (GMT+7)
**Context**: 80%

## What We Did
- Designed and built the first usable `docs-rules-init` skill under `.agents/skills/docs-rules-init/`.
- Shaped the skill around `eizypay-fe` and `haabiz-hrm-fe` as the reference docs grammar, with React-first boilerplates and repo-local reality rules.
- Tested the skill repeatedly against sandbox repos, especially `/Users/mahiro/Git/lab-rich`, and reviewed the generated `AGENTS.md` plus docs output.
- Hardened the skill after finding orchestration drift, then improved the generated output for `development-commands.md` and `commit-guide.md` significantly.
- Ran `/rrr`, captured the retrospective and learning, and committed those memory files already.

## Pending
- [ ] Harden `.agents/skills/docs-rules-init/templates/code-style/formatting.md` so generated formatting docs feel closer to the `haabiz-hrm-fe` / `eizypay-fe` boilerplate grammar instead of a polished local summary.
- [ ] Harden `.agents/skills/docs-rules-init/templates/patterns/services-pattern.md` so minimal repos still get a richer service-doc shape without overclaiming architecture.
- [ ] Decide whether `.agents/skills/docs-rules-init/` is ready to keep, split, or prune before committing it.
- [ ] Delete the sandbox repos `/Users/mahiro/Git/lab/` and `/Users/mahiro/Git/lab-rich/` if they are no longer needed for comparison.

## Next Session
- [ ] Start with `rtk git status --short --branch` and confirm that only `.agents/skills/docs-rules-init/` remains as active uncommitted work.
- [ ] Rework only `formatting.md` and `services-pattern.md`, then rerun the skill on a sandbox or real repo once.
- [ ] Review the regenerated docs specifically for grammar fidelity, not just factual correctness.
- [ ] Make an atomic commit for the skill once those two files feel stable enough.

## Key Files
- `.agents/skills/docs-rules-init/`
- `ψ/memory/retrospectives/2026-03/19/22.06_docs-rules-init-react-boilerplate-review.md`
- `ψ/memory/learnings/2026-03-19_docs-boilerplate-skills-need-behavior-lock-before-last-mile-style.md`
- `/Users/mahiro/Git/lab-rich/`
- `/Users/mahiro/Git/lab/`
