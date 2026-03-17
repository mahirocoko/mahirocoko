# product-ui

Confidence: high

- Product copy discipline: Keep in-product copy direct and operational, and surface boundaries clearly when they matter. Surface cautionary or boundary-setting guidance clearly when needed, following patterns like "# Personal Finance Tracker Design Date: 2026-03-17 Status: Approved design draft ## Summary Build a simple personal income and expense web app with a white-and-blue visual system. The product should feel clean, calm, and reliable, with a Stripe-like sense of structure without cop".
  Sources: brand-docs-1, brand-docs-2
  Confidence: medium
  Why: Composed from voice and behavior rules so product copy stays useful, not promotional.
- System reuse: Build product screens from the shared system first, then customize only where the product truly needs it. Express visual decisions through reusable named primitives, backed by style tokens like color-text-muted, color-primary, color-border, color-surface, color-primary-deep, color-expense, color-surface-muted, color-text. Keep brand primitives centralized behind explicit exports so downstream surfaces compose the system instead of redefining it ad hoc.
  Sources: code-reference-1
  Confidence: medium
  Why: Composed from design-system rules so product UI scales through reuse instead of one-off screen styling.
