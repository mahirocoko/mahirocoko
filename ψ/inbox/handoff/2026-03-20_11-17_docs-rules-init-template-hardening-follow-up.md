# Handoff: docs-rules-init template hardening follow-up

**Date**: 2026-03-20 11:17
**Context**: 88%

## What We Did
- Hardened the highest-impact `docs-rules-init` templates so generated docs stay closer to repo reality and drift less into generic AI boilerplate.
- Tightened `.agents/skills/docs-rules-init/templates/AGENTS.md` across multiple passes using real generated output review from `~/ghq/lab/vite-react-template`.
- Improved `.agents/skills/docs-rules-init/templates/file-organization.md`, `.agents/skills/docs-rules-init/templates/project-overview.md`, and `.agents/skills/docs-rules-init/templates/development-commands.md` so starter repos no longer inflate future architecture or fake tool posture.
- Improved `.agents/skills/docs-rules-init/templates/code-style/formatting.md` and `.agents/skills/docs-rules-init/templates/patterns/services-pattern.md` to require verified reality, honest current-state wording, and smaller believable examples.
- Validated the output through repeated reruns against `~/ghq/lab/vite-react-template`, then committed the template work as `2eac565 docs: 📝 strengthen bootstrap docs templates`.
- Captured retrospective and learning via `/rrr`, then committed memory files as `3264b9e rrr: docs-rules-init-template-hardening`.

## Pending
- [ ] Harden `.agents/skills/docs-rules-init/templates/best-practices.md` so it stays repo-specific and review-actionable instead of turning into broad generic advice.
- [ ] Harden `.agents/skills/docs-rules-init/templates/code-style/typescript.md` so it only describes observed TS posture from config and code instead of inventing conventions.
- [ ] Harden `.agents/skills/docs-rules-init/templates/patterns/component-conventions.md` so it reflects current repo component ownership instead of ideal React structure.
- [ ] Harden `.agents/skills/docs-rules-init/templates/code-style/imports.md` so it clearly separates enforced import rules from observed patterns.
- [ ] Harden `.agents/skills/docs-rules-init/templates/patterns/hooks-pattern.md` so small repos do not get premature hook architecture.

## Next Session
- [ ] Re-run `docs-rules-init` against one or two small real repos after each remaining template pass instead of editing multiple templates blind.
- [ ] Start with `best-practices.md`, then `typescript.md`, then `component-conventions.md` as the next highest-value templates.
- [ ] Keep ignoring `.opencode` noise for now unless it starts harming generated docs quality in a meaningful repo.

## Key Files
- `.agents/skills/docs-rules-init/templates/AGENTS.md`
- `.agents/skills/docs-rules-init/templates/file-organization.md`
- `.agents/skills/docs-rules-init/templates/project-overview.md`
- `.agents/skills/docs-rules-init/templates/development-commands.md`
- `.agents/skills/docs-rules-init/templates/code-style/formatting.md`
- `.agents/skills/docs-rules-init/templates/patterns/services-pattern.md`
- `ψ/memory/retrospectives/2026-03/20/11.14_docs-rules-init-template-hardening.md`
- `ψ/memory/learnings/2026-03-20_docs-rules-init-templates-need-real-output-review.md`
