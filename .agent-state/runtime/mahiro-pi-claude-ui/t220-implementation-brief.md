# T220 — Mahiro Claude-inspired UI: theme, tool rows/diff, startup header and theme controls

## Human-approved scope update — 2026-10-21 15:18 Asia/Bangkok
Mahiro approved the summarized plan: optional Claude-inspired theme; individual tool rows/native edit diff and truthful write preview; boxed two-column startup header based on cc-my-pi/assets/screenshots/startup-header.png (read directly by Main); runtime controls for following Pi theme vs fixed Claude palette (command spelling provisional). Preserve existing footer/quota/RTK and native behavior. Screenshot supplied separately shows cc-my-pi theme controls, where on means theme-adaptive and off means fixed palette; do not mislabel as disabling the entire app theme.

Implementation order: theme + rows/diff first, then header + controls. Header uses public setHeader(), truthful public-API resource data, model/effort/cwd and narrow-layout handling. Do not invent counts or import private host structures to match fields. Resource availability limitations must be disclosed. Runtime theme controls are explicitly approved now; no global profile/theme defaults or activation without separate authorization. Header/theme controller settings ownership must be designed explicitly before writes. Spinner remains excluded.

Human fallback direction: try this public-API adapter plan first; if visual acceptance fails, consider copying more upstream implementation with license/provenance and host-coupling review. This is not unconditional permission to import monkey patches, execution wrappers or unresolved-license code, or override repository public-API-only constraints. Do not call a visually inadequate approximation complete. Mahiro owns visual acceptance; compare actual renders against reference and report differences.

## Authority and source ownership
2026-10-21 15:31 Asia/Bangkok: Mahiro explicitly authorized separate worktree. Native Herdr created /Users/mahiro/ghq/github.com/mahirocoko/mahiro-pi-t220-ui on t220/claude-ui from 5bac649a6559a0319d6ecf361e1385fb545d81b0; Space wB6, pane wB6:p1, no focus. Writer 847617c2-8979-4a8 owns ONLY this worktree. Canonical checkout remains T217-owned; its and T218 uncommitted edits are absent from worktree baseline and must be preserved on future integration. Source work may proceed isolated now. Heavy pnpm check/geometry gate still waits explicit check-slot coordination. No commits/merge/push, live-profile install/reload/default-theme changes. This newer explicit worktree permission supersedes all older writer-wait statements below only for isolated T220 worktree, not canonical source or heavy checks.

Target: /Users/mahiro/ghq/github.com/mahirocoko/mahiro-pi
Board: T220 started (research only; implementation waiting T217).
Reference: https://github.com/timvdhoorn/cc-my-pi
Local ghq: /Users/mahiro/ghq/github.com/timvdhoorn/cc-my-pi
Audited SHA: 6746292ff4359b2bdca987109ff49c8da055bb23 (cc-my-pi 1.4.2).
Researcher: da943a63-514c-4ed completed read-only; no package execution/install/checks.

## Finding / implementation decision
Do NOT import or port upstream extensions/index.ts. It patches host prototypes/theme internals, re-registers execution tools, modifies result details/message/context and initializes excluded features. Upstream dev Pi 0.84.0; our installed/target Pi 1.3.0 now has public registerToolRenderer, contradicting upstream README's dated no-global-hook claim. Build minimal rendering-only integration on current public API instead.

## Copy/provenance boundary
- themes/cc-my-pi-dark.json: suitable optional palette source. Root MIT copyright 2025–2026 FammasMaz; 2026 Tim van den Hoorn. Retain full notice and pinned source attribution; target UNLICENSED does not erase third-party obligations. Use unique name (e.g mahiro-claude-dark), appearance dark, schema, never auto-activate.
- extensions/task-and-tool-presentation.ts formatClaudeToolCallLabel (26–28) / formatClaudeResultBlock (16–20): optional small pure helpers under same root MIT; safer simple clean implementation possible. Do not import whole task module.
- Embedded diff index.ts:4733–6903 says adapted from /tmp/pi-diff; README credits pi-diff/pi-pretty/pi-tool-display without pinned licenses/revisions for portions. COPY BLOCKED pending provenance; use native public diff rendering instead.
- No wholesale dependencies (Shiki/jsdiff assets/transitive license texts not cleared); no vendored tasks/queue/header/paster.

## Proposed paths (writer must verify local owners)
- themes/mahiro-claude-dark.json
- third-party notice in repository convention (e.g THIRD_PARTY_NOTICES.md, full MIT source text)
- lib/tool-presentation.ts + test/tool-presentation.test.ts (pure geometry-safe rendering)
- one thin extension under extensions/ for registerToolRenderer startup/lifecycle, plus package resource registration and corresponding resource-graph tests/docs as needed. Current guards-first12 graph is asserted by tests: deliberate minimal audited update, not bypass/removal.
Do not edit lib/footer.ts, extensions/mahiro-status.ts, quota/RTK/guards/memory semantics. Read current AGENTS.md again and dirty state before writes.

## Public API evidence / design
Read full installed docs/themes.md, extensions.md, tui.md and linked configuration/settings/packages/security/CLI/terminal docs. Current declarations dist/core/extensions/types.d.ts:339–378,516–526,1256 and dist/index.d.ts:25–38 expose:
- pi.registerToolRenderer((toolName,next)=>renderers), renderCall/renderResult/renderShell:self.
- Context partial/error/execution flags, renderer state, args, expansion, outputPad, image visibility and invalidation.
- Public renderDiff/generateDiffString/generateUnifiedPatch/EditToolDetails.
Use explicit supported built-in text tool allowlist, compact call header + result arm, current theme semantic tokens, public TUI width/wrap utilities. Honor partial with output (not success yet), native expansion, outputPad; next() fallback for unsupported/custom/image-bearing/specialized/task tools. Never read current files to render historical results. Native edit details.diff/patch support truthful historical edit preview. Normal write lacks old-file content: show truthful write status/preview, do not promise write-overwrite diff or capture it via execution changes. Runtime public imports deferred until TUI startup; non-TUI must not import UI or publish.

## Exclusions / protected behavior
No tool re-registration, execution wrappers, result/details/context/history/message mutation, file reads during rendering, keyboard/queue/Esc hooks, animation timers, prototype/global-theme patching, footer/statusline replacement, tasks, grouping, spinner, Shiki/word-diff/split-view, theme default activation. Preserve model/auth, native permissions, original-candidate-final guards, native usage/quota, Herdr metadata and RTK display.

## Gates after release
1. Tests for no execution/context/result mutations or excluded imports; forwarding next fallback intact.
2. Pending/partial-with-output/success/error, missing/streaming args, empty/truncated output, native expansion/fallback/image results.
3. Edit details.diff/patch old/new forms, errors/multiple edits/CRLF/BOM/long lines; historical rendering independent of filesystem.
4. Geometry widths narrow/wide, outputPad 0/1, ANSI, Thai/CJK/emoji/combining chars, resize and theme invalidation using public TUI geometry.
5. Non-TUI isolation and source startup/resource graph plus footer/quota/RTK/guard regressions.
6. Native scoped formatter; targeted tests; pnpm check; independent read-only verifier; explicit geometry smoke (repo rule when geometry changes). Avoid overlapping heavy checks.
7. Actual rendered regular/fullscreen inspection and Mahiro visual acceptance; synthetic checks do not establish acceptance. No live probe/reload/profile activation without explicit permission.

## Additional approved comparative research: pi-compact-tools
Mahiro explicitly requested this alongside cc-my-pi. Reference https://github.com/nedleeds/pi-compact-tools ; local /Users/mahiro/ghq/github.com/nedleeds/pi-compact-tools ; audited SHA 8be1a8de1a7003c436a11256a5f65943148e09b0 (0.16.6). Root MIT copyright 2026 Dong Hyeong Lee; retain full MIT notice for any copied code. No runtime dependencies declared; development targets Pi 1.3.0. Research was read-only; tests read, not executed.

UPDATED RANKING: pi-compact-tools selective presentation helpers are a stronger implementation reference than cc-my-pi for tool rows/native edit diff. Keep clean Mahiro public-API adapter; cc-my-pi remains optional palette/visual source. Neither entrypoint is approved wholesale.

Positive source findings:
- extensions/compact-tools.ts:557–598,669–680 public registerToolRenderer/next/renderShell:self; no tool replacement/result manufacturing in inspected path.
- compact-tools-invocation.ts:439–446 reads stored native diff/patch; :521–533 successful write content preview comes from call args, NOT old/new overwrite diff.
- compact-tools-claude.ts:17–118 labels/title helpers and :193–242 outcomes/errors are possible attributed extracts after removing cross-module imports.
- compact-tools-layout.ts:302–398 diff parsing/context trimming potentially reusable; prefer public native renderDiff over larger :653–683 renderer dependency slice.
- Existing token-neutrality/host-token-neutrality and width tests are useful design references, not our passing evidence.

Reject/remove:
- compact-tools-rendering.ts:27–39 imports host internal dist/extensions/codemode/renderer.js; :52–89 manipulates renderer timers/private shell children/caches.
- compact-tools-transcript.ts:28–60 mutates private transcript toolDefinition/render components/updateDisplay EVEN on public API path.
- grouping/viewport/thinking/progress/silent controllers patch components/prototypes, working/thinking/keyboard behavior; no import of those entrypoints.
- Static runtime SDK/TUI imports and unconditional internal renderer loader conflict with target deferred public import rules. Release marker/config writes excluded.
- Claude grouping automatic in upstream; do not inherit it. Silent mode hides errors/notices; excluded.

Concrete image gap: getTextResult filters images; image reads with inline images unavailable may say Read 0 lines. Preserve native next() renderer for image-bearing/specialized/custom results; test unsupported-inline fallback. Claude partial output is Running… upstream; ensure we do not mark partial-with-output successful. Retain native keybinding hints rather than hardcode Ctrl+O.

Codemode nested summaries (compact-tools-nested.ts:17–118) bounded and based on public child events/persisted nestedCalls; useful LATER option. Not first-slice scope absent further human instruction; preserve native codemode renderer and do not import its private module.

License caution: compact-tools-layout.ts:400 says thresholds mirror Codex renderer; not proof of copying or independent authorship. Verify ancestry if extracting that part; native renderDiff avoids it. Palette GitHub ancestry beyond root MIT declaration not established. No dependency/license wholesale transfer.

Additional gates: source contract forbids private transcript/timer/prototype hooks; image fallback; outputPad/width/theme invalidation; incomplete nested context left native; no execution/result/context/history mutation. No T220 source writer or checks before T217 release.

## Waiting boundary
No target source changes by T220. Owner pi-t190 will publish .agent-state/runtime/companion-continuity-2026-10-21/t217-release-for-theme.json and notify when source writer/checks/QA/repairs terminal. Receive before implementing; do not infer release from idle main or task status.
