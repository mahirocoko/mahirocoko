---
artifact: reference-learning
authority: non-canonical
status: candidate
source: .agent-state/memory/retrospectives/2026-09/11/15.26_herdr-sidebar-public-release.md
---

# External CLI postcondition reconciliation

## Intent

Keep local lifecycle and installer workflows truthful when an external mutating command can change state before returning an error, timeout, or interrupted result.

## Trigger

A workflow invokes an external command that links, installs, enables, disables, unlinks, removes, registers, reloads, or otherwise mutates state not owned atomically by the caller.

## Action

Capture the exact pre-operation state and canonical owner identity. After every mutating command, inspect the authoritative external state rather than inferring outcome from exit code alone. Accept a reported failure when the exact desired postcondition is already proven. Otherwise restore bytes, mode, snapshots, and lifecycle state only after re-verifying that the same owner still controls the target. Cover failure-before-mutation and failure-after-mutation shapes directly.

## Boundary

Do not apply recovery mutations when the target is missing, duplicated, ambiguous, or now owned by another path/process. Do not treat postcondition inspection as proof of semantic correctness beyond the exact state checked. Pure/read-only commands do not need transaction machinery.

## Rationale

Exit status describes command completion, not necessarily external state. Owner-bound reconciliation prevents both false rollback after successful mutation and destructive rollback against a successor owner.

Tags: `cli`, `transactions`, `postconditions`, `rollback`, `ownership`, `installers`
