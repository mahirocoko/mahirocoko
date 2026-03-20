# Plan: docs-rules-init template hardening follow-up

## Background

This session hardened the highest-impact `docs-rules-init` templates using repeated real-output review against `~/ghq/lab/vite-react-template`. The strongest improvements landed in `AGENTS.md`, `file-organization.md`, `project-overview.md`, `development-commands.md`, `formatting.md`, and `services-pattern.md`. The current lesson is that template quality improves fastest when generated docs are reviewed against a small real repo instead of editing templates in isolation.

## Pending from Last Session

- Harden `.agents/skills/docs-rules-init/templates/best-practices.md` so it stays repo-specific and review-actionable instead of turning into broad generic advice.
- Harden `.agents/skills/docs-rules-init/templates/code-style/typescript.md` so it only describes observed TS posture from config and code instead of inventing conventions.
- Harden `.agents/skills/docs-rules-init/templates/patterns/component-conventions.md` so it reflects current repo component ownership instead of ideal React structure.
- Harden `.agents/skills/docs-rules-init/templates/code-style/imports.md` so it clearly separates enforced import rules from observed patterns.
- Harden `.agents/skills/docs-rules-init/templates/patterns/hooks-pattern.md` so small repos do not get premature hook architecture.

## Next Session Goals

- Re-run `docs-rules-init` against one or two small real repos after each remaining template pass instead of editing multiple templates blind.
- Start with `best-practices.md`, then `typescript.md`, then `component-conventions.md` as the next highest-value templates.
- Keep ignoring `.opencode` noise for now unless it starts harming generated docs quality in a meaningful repo.

## Reference

- Handoff: `ψ/inbox/handoff/2026-03-20_11-17_docs-rules-init-template-hardening-follow-up.md`
