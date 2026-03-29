# Plan: docs-rules-init Skill Hardening

## Background
This session built a first usable `docs-rules-init` skill, tested it against `lab-rich`, and pushed it much closer to a Mahiro-style React docs boilerplate system. The latest review showed that most of the docs family is now usable enough to pause, but two high-signal pages still need hardening: `formatting.md` and `services-pattern.md`.

## Pending from Last Session
- Harden `.agents/skills/docs-rules-init/templates/code-style/formatting.md` so generated formatting docs feel closer to the `haabiz-hrm-fe` / `eizypay-fe` boilerplate grammar instead of a polished local summary.
- Harden `.agents/skills/docs-rules-init/templates/patterns/services-pattern.md` so minimal repos still get a richer service-doc shape without overclaiming architecture.
- Decide whether `.agents/skills/docs-rules-init/` is ready to keep, split, or prune before committing it.
- Delete the sandbox repos `/Users/mahiro/Git/lab/` and `/Users/mahiro/Git/lab-rich/` if they are no longer needed for comparison.

## Next Session Goals
- Start with `rtk git status --short --branch` and confirm that only `.agents/skills/docs-rules-init/` remains as active uncommitted work.
- Rework only `formatting.md` and `services-pattern.md`, then rerun the skill on a sandbox or real repo once.
- Review the regenerated docs specifically for grammar fidelity, not just factual correctness.
- Make an atomic commit for the skill once those two files feel stable enough.

## Reference
- Handoff: `.agent-state/inbox/handoff/2026-03-19_22-13_docs-rules-init-skill-hardening.md`
