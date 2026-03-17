# dashboard

Confidence: high

- Operational clarity: Dashboard actions and labels should be terse, obvious, and safe to scan under time pressure. Surface cautionary or boundary-setting guidance clearly when needed, following patterns like "# Personal Finance Tracker Design Date: 2026-03-17 Status: Approved design draft ## Summary Build a simple personal income and expense web app with a white-and-blue visual system. The product should feel clean, calm, and reliable, with a Stripe-like sense of structure without cop".
  Sources: brand-docs-1, brand-docs-2
  Confidence: high
  Why: Composed from behavior rules so dense operational surfaces privilege clarity and boundaries over flourish.
- System consistency: Keep dashboard surfaces tightly coupled to the shared design system so dense views remain consistent across states and modules. Express visual decisions through reusable named primitives, backed by style tokens like color-text-muted, color-primary, color-border, color-surface, color-primary-deep, color-expense, color-surface-muted, color-text. Keep brand primitives centralized behind explicit exports so downstream surfaces compose the system instead of redefining it ad hoc.
  Sources: code-reference-1
  Confidence: medium
  Why: Composed from design-system rules to prevent dense information surfaces from drifting into bespoke UI patterns.
