# Shared communication integration — 2026-10-02

## Latest checkpoint — published releases

Source-learning closeout (21:35 approval): Main committed only the approved communication clause as `7fad97e8a4dfbc751a0bb17c5230facb1bf51f83`, preserving all unrelated memory changes. Both actual newly assembled Cursor context and Agy PreInvocation payload contain the new clause and pin that exact source revision. This is context-propagation evidence, not a new provider/live-chat semantic proof. The owned full-native proposal was rejected after extracting the approved clause; native imports were not promoted and zero proposals remain. This supersedes the blocked source-commit checkpoint below. Tool-required attribution remained in the stored MemFS commit message; no amend or further commit retry was attempted. Final evidence: `release/shared-learning-completed.json` in primary Agy evidence.

Mahiro authorized remaining work and both releases at 20:32. Cursor `v0.2.0` is published at `https://github.com/mahirocoko/cursor-memory-layer/releases/tag/v0.2.0`, commit `72c1d4cfa9fc85a37bbad6c7e706038f414ea9dd`. Agy `v1.24.0` is published at `https://github.com/mahirocoko/agy-memory-layer/releases/tag/v1.24.0`, commit `bb0886bb7ad04f51d5df1faf1be6e8f1a109ab5e`. Both primary checkouts are clean; remote main and annotated tag targets were independently read back at those commits. This supersedes the earlier no-commit/no-release stopping point below.

Public release checks: Cursor 113 tests and check; Agy 316 tests, 11 generated integration scenarios, check, and native plugin validation (14 skills, 9 agents, 3 hooks). Release review found two previously conditional tests reading live personal memory; these were replaced with inline disposable fixtures, removing silent early returns and personal paths. Current release README/contract/version assertions and historical coverage labels were corrected. Fresh review closed those exact blockers; final suite passed after the corrections.

Both actual inspectors accepted a distinct generic Git memory source without Letta runtime/API/service calls. Native standalone behavior remains default; optional sharing requires the committed fixed owner and existing source safety checks.

Real Agy native approval produced pending proposal `prop-shared-mur0irkb-168012` for Mahiro's simpler-explanation/concrete-next-actions correction without modifying native communication. Only its new clause was prepared in canonical source; unrelated native imports were not copied. Source commit did not complete: the first staging attempt hit an old empty index lock, which Main preserved reversibly after verifying no live owner; the resumed commit worker then executed in the wrong checkout and made no commit. The exact source clause remains staged alone, other memory changes remain unrelated. No further agent-side commit retries were performed. Therefore this live learning cycle is **blocked at canonical source commit**, not complete or active shared knowledge. A concurrent unrelated MemFS commit advanced HEAD to `ff5104749a7bee56250a2d21c33684600a99b11a`; the queued proposal is stale by revision and requires re-grounding before source acceptance. The communication owner in that committed revision remains unchanged.

Per-primary ignored `release/` evidence retains final raw logs, generic-source proof, proposal/export, lock recovery, and published-release receipts. Worktrees are retained; release verification does not depend on them. Historical parity/suite/native-invariance claims below remain scoped to their original checkpoints rather than the later release changes.

## Historical pre-release outcome and boundary

Local integration and reversible activation are complete for Cursor and Agy. Mahiro's workflow acceptance is pending; source proposal acceptance remains a human/source-owner gate.

Shared owner: `system/human/prefs/communication.md`, read from committed Git objects in the existing Letta MemFS repository. Both hosts pinned `9d8892fe7c309c6ce75ba6519f42021dcdb7ea5f` during fresh-host proofs. Dirty unrelated source files did not become active or block the committed reader.

No new canonical store, daemon, vector layer, persona/roster migration, automatic two-way sync, source rewrite, repository commit/push, or release was performed. Agy package `1.24.0` is a local development candidate; `v1.23.0` remains the published release.

## Verified layers

| Layer | Cursor | Agy |
| --- | --- | --- |
| Source checks | `pnpm check`, clean | `pnpm check`, clean |
| Final suite | 113 tests, 31 suites | 316 tests, 23 suites; 11 integration scenarios |
| Independent probes | 12 comprehensive + 8 cross-syntax variants, actual-source merge | 13 counterexamples, actual Letta/Agy labels and all native additions tested |
| Runtime ownership | Monotonic enabled floor; direct/CLI/repair/Dream protection | Direct write/buffer/delete/commit/restore/approval/curation/migration/reflection guards |
| Pending learning | Actual CLI `--force` append diverted; native fixture file/HEAD/status unchanged | Actual native approval API diverted; export/reject; native fixture unchanged |
| Fresh host | Interactive Cursor CLI, Opus5.5 **300K Medium** banner; source SHA, communication facts, native2026-09-30 correction | Interactive native Agy, Gemini3.8FlashHigh; all8active owners, native reporting invariant, current-project isolation |
| Deferred recall | Existing native mechanism retained; no new host-recall claim | Bounded native search retrieved `reference/human/workflow-nuances.md` at its exact committed revision |
| Reversibility | Actual disable/re-enable; native projection restored | Actual disable/re-enable; shared provenance removed, native owners retained |
| Native invariance | Real native bytes/HEAD/status unchanged across installation and host proof | Real native bytes/HEAD/status unchanged across enablement and host/recall proof |

Suite counts and source/test/CLI probes do not replace fresh-host proof. Fresh-host proof does not verify arbitrary semantic equivalence, OS-level security, Electron IDE behavior, or Mahiro's acceptance.

## Current installed owners

- Cursor primary: `/Users/mahiro/ghq/github.com/mahirocoko/cursor-memory-layer`. CLI remains `/Users/mahiro/.local/bin/cursor-memory`; installed hooks/skill/statusline use primary source, not a temporary worktree.
- Cursor settings: `/Users/mahiro/.cursor/cursor-memory.json`. Shared-read is enabled with the explicit Letta source root.
- Agy primary: `/Users/mahiro/Git/me/sandbox/learn-letta-code`. Existing plugin symlink `/Users/mahiro/.gemini/antigravity-cli/plugins/agy-memory-layer` still targets primary `plugins/agy-memory-layer`.
- Agy settings: `/Users/mahiro/.gemini/memory.state/shared-memory.json`. Shared-read is enabled with the same explicit source root.
- Source root: `/Users/mahiro/.letta/lc-local-backend/memfs/agent-local-b1f7b85c-d49d-43ea-a7e3-6fa085ecd426/memory`.

## Learning and source review

Native recall, native persona/routing, project memory, and unrelated native learning remain host-owned. Shared communication mutations produce private pending proposals; they do not become active merely by being queued. Canonical source acceptance and any source commit require separate explicit approval.

Cursor inspection/export: `cursor-memory shared list`, `cursor-memory shared show <id>`, `cursor-memory shared export <id>`, `cursor-memory shared reject <id>`.

Agy inspection/export: `node --experimental-strip-types /Users/mahiro/Git/me/sandbox/learn-letta-code/plugins/agy-memory-layer/scripts/shared-memory.ts list|show|export|reject [id]`.

Pending queues are adapter state, not fourth canonical memory stores. Cursor uses private Git administrative storage; Agy uses private state outside Git MemFS. Stale or ungrounded source revisions remain visible. Same-UID cooperative validation is not a cryptographic signature or an OS sandbox.

An isolated existing-commit Agy clone also verified unrelated native write/delete while shared mode was enabled. No real native learning commit was executed; do not promote that write/delete result into a live commit-path claim.

## Disable and rollback

Disable only shared reading, preserving the current native memory:

```sh
cursor-memory shared disable
node --experimental-strip-types /Users/mahiro/Git/me/sandbox/learn-letta-code/plugins/agy-memory-layer/scripts/shared-memory.ts disable
```

Re-enable with the explicit source root via each adapter's `enable` command. Both actual disable/re-enable sequences passed; final state is enabled.

Pre-activation settings existence/backup manifests and native memory snapshots are retained in the evidence directories below. Cursor's existing settings backup is `/Users/mahiro/.cursor/cursor-memory.json.shared-read-before-20261002`; the official installer also retained its owned hook backup. Restore only receipt-bound owned fields/files if reverting the installation; do not rewrite unrelated CLI preferences or memory.

## Evidence ownership and supersession

- Cursor canonical evidence: `/Users/mahiro/ghq/github.com/mahirocoko/cursor-memory-layer/.agent-state/tmp/shared-memory-2026-10-02/`.
- Agy canonical evidence: `/Users/mahiro/Git/me/sandbox/learn-letta-code/.agent-state/tmp/shared-memory-2026-10-02/`.

Final closeout preserved 43 Cursor evidence files (261,516 bytes) and 38 Agy evidence files (324,203 bytes) in those ignored primary-owned paths. Each `manifest.json` records relative paths, byte counts, and independently checked SHA-256 values. Provider memory stores, Git fixture/object databases, symlinks, and unrelated cache/runtime state were excluded. Original worktree evidence remains intact; deletion was not authorized.

Primary/worktree byte parity was checked for every implementation change: 17 Cursor files and 21 Agy files, with no mismatches. Runtime and evidence no longer depend on keeping a worktree open. Worktrees are retained by Mahiro's choice, not because implementation or artifact transfer remains unfinished.

Retained reports are not all acceptance records. Cursor's initial blocked review, original correction reports, and the final report that downgraded native paragraph loss to information are superseded for affected claims. The final retention follow-up plus Main's exact replay close that omission. Agy's initial writer report contradicted the latest code after follow-up changes; Main reproduced the errors, correction raw logs and final independent review replace its readiness claims. Keep contradictions visible rather than treating every `complete`/`accepted` field as truth.

Live host receipt-bound answer captures, proof summaries, native pre-activation snapshots, settings rollback manifests, pending lifecycle smoke, raw check/test logs, and primary integration patches are in those ignored project-owned evidence directories. No unrelated MemFS changes were staged. All session-owned executor/reviewer/host lanes were closed after collection. Local implementation and artifact closeout are complete; commit/push/release, source proposal acceptance, worktree deletion, and human workflow acceptance remain separate explicit decisions rather than unfinished agent work.

## Limits and human review

- Sharing is limited to communication, not the complete human preferences corpus.
- Structural reconciliation covers tested Markdown/list/paragraph shapes; arbitrary semantic contradiction detection is not established.
- Cursor host honestly cannot identify every merged clause's native-only origin because provenance is view-level, not per-clause. Main verified the native-only2026-09-30 content independently.
- Existing native references can record historical procedures; retrieving a fact does not adopt that procedure as current guidance.
- Fresh chats load the new context; existing long-lived conversations may still hold their old injected view.
- Mahiro still decides whether the behavior feels right across all three hosts and whether any queued source learning should be accepted.
