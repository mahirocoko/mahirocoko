---
title: Raindrop Mod migration safety
date: 2026-07-24
tags:
  - letta-mod
  - raindrop
  - oauth
  - migration
  - safety
  - verification
---

# Raindrop Mod migration safety

## Durable lesson

A bookmark integration is runtime capability, but a whole-library reorganization is a data migration. Treat the two layers differently:

1. Keep the ordinary agent surface small: one command plus one unified tool.
2. Store credentials in Keychain and expose only bounded, sanitized provider diagnostics.
3. Prove library completeness from the provider's count and a non-truncated snapshot.
4. Define a versioned hierarchy contract with exact parent relationships and an allowlisted leaf mapping before creating move operations.
5. Require exact source-ID coverage and duplicate-target consistency.
6. Persist each mutation batch as unknown before dispatch, never blindly retry an ambiguous write, and reconcile from a fresh full-library read.
7. Verify final bookmark count and every planned destination after migration.
8. Keep destructive collection deletion out of the permanent Mod. If the human explicitly requests legacy cleanup, use a one-off operation that proves zero bookmarks, zero children, no ID overlap, and writes preflight/result receipts.

## Concrete evidence from this session

- Complete source: 574 bookmarks / 26 old collections / no tags.
- New hierarchy: 26 nodes, 19 bookmark destinations.
- Apply: 26 creates + 574 moves, 0 stale/unknown/failed.
- Cleanup: 26 verified-empty old collections deleted.
- Final: 574 bookmarks, 26 new collections, 0 legacy collections, 0 destination mismatches.
- Raindrop suggestion returned `403 pro only`; model-driven tree selection is the non-Pro fallback.
- Letta reload pressure disappeared only after consolidating three related tools into one unified action and allowing old registrations to dispose across reloads.

## Reuse trigger

Apply this pattern to future external-service migrations involving many records, especially when provider APIs have ambiguous mutation outcomes, incomplete tier documentation, or destructive cleanup operations.

