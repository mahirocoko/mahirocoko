---
query: "jotai ทำงานยังไง"
target: "mahirocoko"
mode: deep
timestamp: 2026-02-27 10:06 +07
---

# Trace: jotai ทำงานยังไง

**Target**: mahirocoko
**Mode**: deep (search-mode exhaustive)
**Time**: 2026-02-27 10:06 +07

## Oracle Results
- Oracle memory has no direct Jotai knowledge in this repo (`ftsMatches: 0`; vector hits were unrelated noise).
- Additional oracle-memory scoped search in `ψ/memory` also found no direct Jotai/atom-state content.

## Files Found
- No direct Jotai usage in this workspace (`jotai`, `useAtom`, `atom(` imports/usages all returned no local matches).
- State-management pattern present in incubated projects is primarily Zustand + React Query + Context.
- Evidence file with explicit Jotai mention (documentation matrix, not implementation):
  - `.claude/skills/frontend/resources/state-data.md`

## Git History
- `3084eaf7f9b433a871a978c57d15aae901aba338` — adds/updates state guidance including local-state options that mention Jotai.
- Provider-related docs/history matches exist (`581d5f5...`, `632782c...`, `6759cf1...`) but are architecture docs/handoff context, not Jotai runtime code.
- No history matches for concrete Jotai code patterns (`from 'jotai'`, `useAtom(`, `createStore(` in this repo history).

## GitHub Issues/PRs
- Repo `mahirocoko/mahirocoko`: no issue/PR hits for query `jotai`.

## Cross-Repo Matches
- Official docs:
  - https://jotai.org/docs/core/atom
  - https://jotai.org/docs/core/use-atom
  - https://jotai.org/docs/core/store
  - https://jotai.org/docs/core/provider
  - https://jotai.org/docs/guides/core-internals
  - https://jotai.org/docs/guides/async
  - https://jotai.org/docs/utilities/family
- Real GitHub usage examples:
  - `toeverything/AFFiNE` — Provider/store composition (`packages/frontend/core/src/components/context/index.tsx`)
  - `twentyhq/twenty` — atomFamily-heavy patterns (`packages/twenty-front/...`)
  - `Agenta-AI/agenta` — atomFamily + query atoms (`web/packages/...`)
  - `argentlabs/argent-x` — async atoms (`packages/extension/src/ui/views/account.ts`)
  - `bytedance/UI-TARS-desktop` — write-only action atoms (`multimodal/tarko/agent-ui/src/common/state/atoms/ui.ts`)
  - `upscayl/upscayl` — atomWithStorage usage (`renderer/atoms/user-settings-atom.ts`)

## Oracle Memory
- Direct matches in `ψ/memory/*`: none for Jotai concepts.
- Existing memory content appears unrelated (retrospectives and learnings on other topics).

## Summary
- In this repository, there is no actual Jotai implementation to reverse-engineer.
- Jotai mental model from official docs:
  - `atom()` creates immutable atom config; value lives in a store.
  - `useAtom` reads/writes via store mapping (conceptually WeakMap atom->value).
  - Derived atoms track dependencies through `get` in read functions.
  - `Provider` scopes store per subtree; provider-less mode uses default store.
  - `createStore` exposes `get/set/sub` for out-of-component state operations.
- For migration/usage learning, external codebases provide concrete production patterns (Provider, derived/write-only/async atoms, family usage).
