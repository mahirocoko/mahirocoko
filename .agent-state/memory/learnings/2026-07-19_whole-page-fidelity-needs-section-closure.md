# Whole-page fidelity needs section-level closure

**Date:** 2026-07-19  
**Tags:** frontend-design, reference-fidelity, closure-ledger, QA, DOM-ownership, stale-evidence, sprite-provenance

## Durable lesson

A complete reference anatomy map is only useful if it survives implementation as a closure ledger. For every website frame and section, retain:

- target anatomy and hierarchy;
- material/surface relationship;
- interactive and timed states;
- desktop/mobile responsive contract;
- current DOM/CSS owner;
- implementation status;
- matched reference/current evidence;
- remaining drift or intentional adaptation.

Do not call the page a whole-page PASS while any mapped row is legacy-owned, unreviewed, drifted, or supported only by a downscaled full-page screenshot. Build and behavior tests remain necessary, but they do not prove local visual closure. Use section-level captures at matched viewports/states plus material DOM geometry. A reviewer who claims complete coverage must return a verdict per row.

Before final handoff, remove stale implementation screenshots or clearly label them historical. An old artifact with obsolete Pricing, CTA, typography, or section anatomy can silently refute an otherwise accurate current report.

## Structural implication

When the new page implementation is stable, remove superseded DOM and CSS ownership rather than leaving the redesign as an override layer. A composition-only page shell, owner-local components, and a minimal active stylesheet make fidelity claims auditable and reduce regression ambiguity.

## Related provenance lesson

The same closure principle applies to generated assets. Source-authorship evidence must remain hash-bound through every transformation: raw provider artifact → extraction → native review → normalization → promotion → atlas. Testing only job creation and final promotion leaves room for silent provenance loss in the middle. Legacy compatibility must require an auditable review record and refuse new/job-bound/promoted downgrade paths.

## Trigger

Apply this whenever Mahiro asks to make a full page “like this,” supplies a live/local source, challenges overall fidelity, or when a workflow claims generated-source provenance across multiple transformation stages.
