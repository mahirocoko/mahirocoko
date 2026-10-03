---
artifact: reference-learning
authority: non-canonical
status: candidate
source: ../retrospectives/2026-10/03/09.35_shared-memory-releases-and-sol-routing.md
tags: [testing, portability, memory-adapters, evidence]
---
# Portable retention tests need unconditional owned fixtures

**Intent:** Make a memory-retention regression execute the same meaningful assertions on a clean clone as on the author's machine.

**Trigger:** A unit or regression test claims to preserve source/native Markdown grammar or preferences, but conditionally reads personal HOME memory or returns successfully when those files are absent.

**Action:** Commit a minimal sanitized fixture retaining the load-bearing labels, nesting, paragraph introductions, and duplicate shapes. Execute its assertions unconditionally. Treat a missing required fixture as a setup failure, and keep any separately authorized live-host proof in its own receipt-owned lane.

**Boundary:** This does not forbid explicit bounded reading of user-owned memory for a real integration proof. It does not turn fixture success into live-host understanding, whole-memory equivalence, or OS isolation. Avoid copying an entire personal memory corpus merely to make a fixture realistic.

**Rationale:** An early return can count as a passing test while exercising none of the behavior promised by its name. Personal paths also make the result machine-dependent and can expose unrelated memory to a public test suite. Owned deterministic fixture content gives the regression a reproducible failure shape without collapsing separate evidence layers.

This is a local candidate reference, not a new canonical rule or packaged skill. Promotion requires review against the existing testing/privacy owners.
