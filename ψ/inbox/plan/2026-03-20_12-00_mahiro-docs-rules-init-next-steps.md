# Plan: mahiro docs rules init next steps

## Background
This handoff closes a session that renamed `docs-rules-init` to `mahiro-docs-rules-init`, clarified its reality-first versus blueprint-allowed doctrine, hardened the most important templates, and verified the renamed skill against `~/ghq/lab/vite-react-template`. The verification result was positive because the skill recognized an already-initialized repo and made only narrow corrective edits instead of broad regeneration.

## Pending from Last Session
- [ ] Decide whether to keep `init` only or introduce a dedicated `sync` mode for already-initialized repos.
- [ ] Verify the skill on one or two additional starter repos to test whether the same restraint holds across different repo shapes.
- [ ] Review whether any remaining template pages still carry subtle meta-template voice after multiple reruns.

## Next Session Goals
- [ ] Run `/mahiro-docs-rules-init` on another small repo and compare the create/skip behavior with `vite-react-template`.
- [ ] If repeated drift appears, design a clean separation between bootstrap behavior and sync behavior.
- [ ] Tighten only the next weakest template surfaced by real output review, not by speculative editing.

## Reference
- Handoff: `ψ/inbox/handoff/2026-03-20_12-00_mahiro-docs-rules-init-wrap-up.md`
