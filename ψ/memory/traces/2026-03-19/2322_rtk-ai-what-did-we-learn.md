---
query: "rtk-ai เราเคย learn ไปแล้วมันคืออะไรนะฉันลืม"
target: "rtk-ai/rtk + mahirocoko memory"
mode: deep
timestamp: 2026-03-19 23:22
---

# Trace: rtk-ai เราเคย learn ไปแล้วมันคืออะไรนะฉันลืม

**Target**: `rtk-ai/rtk` + local Oracle memory
**Mode**: `deep`
**Time**: `2026-03-19 23:22`

## Oracle Results

- `ψ/memory/learnings/2026-03-07_when-porting-a-command-rewrite-pattern-from-one-ai.md`
- `ψ/memory/learnings/2026-03-09_when-using-rtk-in-shell-workflows-the-stable-rule.md`
- `ψ/memory/learnings/2026-03-10_if-a-team-wants-a-stricter-local-rtk-rule-than-ups.md`

## Files Found

- `ψ/learn/rtk-ai/rtk/rtk.md`
- `ψ/learn/rtk-ai/rtk/2026-03-07/2129_ARCHITECTURE.md`
- `ψ/learn/rtk-ai/rtk/2026-03-07/2129_CODE-SNIPPETS.md`
- `ψ/learn/rtk-ai/rtk/2026-03-07/2129_QUICK-REFERENCE.md`
- `ψ/learn/rtk-ai/rtk/2026-03-07/2129_TESTING.md`
- `ψ/learn/rtk-ai/rtk/2026-03-07/2129_API-SURFACE.md`
- `ψ/memory/retrospectives/2026-03/07/22.05_cursor-rtk-hook-and-cli-fit.md`
- `ψ/memory/retrospectives/2026-03/09/16.38_rtk-command-shape-in-claude-guidance.md`
- `ψ/learn/.origins`

## Git History

- `79ca1c5` `rrr: cursor-rtk-hook-and-cli-fit`
- `b6e9507` `rrr: rtk-command-shape-in-claude-guidance`
- `484e3d0` `rrr: rtk-doc-scope-was-enough`

## GitHub Issues/PRs

- Issue `#651` `feat(learn): sanitize sensitive data in --write-rules output`
- Issue `#654` `feat(learn): extract generalizable patterns instead of raw command pairs`
- Issue `#670` `Hook rewrites commands correctly via updatedInput, but rewritten rtk invocations are not recorded in history DB`
- PR `#255` `feat: multi-provider session scanning for discover and learn`
- PR `#642` `feat(init): add experimental Codex adapter via subprocess-local PATH shims`
- PR `#728` `feat(copilot): add rtk init --agent copilot support`

## Cross-Repo / Session Matches

- Session search found prior OpenCode sessions referencing `rtk-ai/rtk/origin`
- Local clone exists at `/Users/mahiro/ghq/github.com/rtk-ai/rtk`
- `ψ/learn/.origins` lists `rtk-ai/rtk`

## Oracle Memory

- Prior deep learn happened on `2026-03-07`
- Local learning index says RTK is best understood as hook-first infrastructure, not only a wrapper CLI
- Retrospective says the learn pass was used to decide whether RTK was worth adopting for AI-assisted terminal workflows

## Summary

RTK is `Rust Token Killer`: a Rust CLI proxy that wraps common developer commands, compresses noisy output, tracks token savings, and can install hooks so shell commands are transparently rewritten to `rtk ...`. The most distinctive part of the repo is not just command filtering, but the `discover` and `learn` features that mine session history to adapt workflow behavior. We already studied it deeply on `2026-03-07` and kept the full study set under `ψ/learn/rtk-ai/rtk/`.

The attempted parallel `explore` and `librarian` subagents were unavailable in this environment because those agent types are disabled, so this trace fell back to direct Oracle, session, repo, git, and GitHub evidence.
