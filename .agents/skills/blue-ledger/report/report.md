# Blue Ledger Synthesis Report

- Mode: refresh
- Destination: .agents/skills/blue-ledger
- Overall confidence: high
- Preflight status: ready

## Preflight

### Known Inputs

- Brand name: Blue Ledger
- Requested mode: refresh
- Explicit brand docs: 2
- Live product or brand-truth websites: 1

### Missing Coverage

- Visual references

### Ambiguities

- None

### Preflight Warnings

- No screenshots or Figma references were provided. Visual-system confidence will stay lower.

## Source Summary

- Total sources: 4

## Sources

### website-1

- Type: website
- Role: live-product
- Location: http://127.0.0.1:4173/
- Summary: Website metadata extracted (title: blue-ledger).
- Confidence baseline: medium
- Discovered: none
- Notes: none

### brand-docs-1

- Type: brand-docs
- Role: brand-truth
- Location: ./docs/brand/blue-ledger
- Summary: Scanned 1 brand document files.
- Confidence baseline: high
- Discovered: 2026-03-17-brand-brief.md
- Notes: Directory source scanned recursively with common build and dependency directories ignored.

### brand-docs-2

- Type: brand-docs
- Role: brand-truth
- Location: ./docs/superpowers/specs/2026-03-17-personal-finance-tracker-design.md
- Summary: Scanned 1 brand document files.
- Confidence baseline: high
- Discovered: 2026-03-17-personal-finance-tracker-design.md
- Notes: none

### code-reference-1

- Type: code-reference
- Role: live-product
- Location: ./apps/blue-ledger
- Summary: Scanned 25 reference files.
- Confidence baseline: medium
- Discovered: tsconfig.node.json, index.html, tsconfig.app.json, README.md, public/icons.svg, public/favicon.svg, .gitignore, package-lock.json
- Notes: Directory source scanned recursively with common build and dependency directories ignored.

## Brand Identity

- Surface identity: Keep the brand instantly legible through surface labels such as "blue-ledger".
  Sources: website-1
  Confidence: medium
  Why: Synthesized from visible website and screenshot labels rather than abstract internal docs alone.
- Positioning line: Reinforce the brand with a clear positioning statement in the spirit of "Personal Finance Tracker Design".
  Sources: brand-docs-1, brand-docs-2, website-1
  Confidence: high
  Why: Derived from the strongest surface-facing sentence found across website, docs, and visual references.
- Supporting cues: Use secondary cues such as blue, ledger to quickly place the brand's domain and personality.
  Sources: website-1
  Confidence: medium
  Why: Built from repeated non-meta surface terms that help orient the audience fast.

## Voice

- Voice anchor: Anchor copy around recurring brand language such as product, blue, visual, personal, tracker, user.
  Sources: brand-docs-1, brand-docs-2
  Confidence: high
  Why: Synthesized from repeated terms in explicit brand-doc language, then grounded with visible screenshot copy when available.
- Voice guardrails: Honor explicit brand directives from docs, including guidance like: # Personal Finance Tracker Design Date: 2026-03-17 Status: Approved design draft ## Summary Build a simple personal income and expense web app with a white-and-blue visual system. The product should feel clean, calm, and reliable, with a Stripe-like sense of structure without cop.
  Sources: brand-docs-1, brand-docs-2
  Confidence: high
  Why: Pulled from directive-style language found in brand docs.

## Visual System

- Tokenized styling: Route styling choices through reusable tokens or utilities such as color-text-muted, color-primary, color-border, color-surface, color-primary-deep, color-expense, color-surface-muted, color-text instead of one-off visual values.
  Sources: code-reference-1
  Confidence: medium
  Why: Synthesized from implementation style tokens paired with visual references.

## Interaction Behavior

- Operational guardrails: Surface cautionary or boundary-setting guidance clearly when needed, following patterns like "# Personal Finance Tracker Design Date: 2026-03-17 Status: Approved design draft ## Summary Build a simple personal income and expense web app with a white-and-blue visual system. The product should feel clean, calm, and reliable, with a Stripe-like sense of structure without cop".
  Sources: brand-docs-1, brand-docs-2
  Confidence: medium
  Why: Pulled from cautionary live copy and explicit directive language in docs.

## Design System

- Component vocabulary: Keep a reusable component vocabulary with explicit exported primitives such as LedgerEntry, CreateLedgerEntryInput, LedgerSummary, LedgerStateSnapshot, SummaryCards, TopBar, RecentActivity, QuickAddForm.
  Sources: code-reference-1
  Confidence: medium
  Why: Derived from exported symbols found in code references.
- Token posture: Express visual decisions through reusable named primitives, backed by style tokens like color-text-muted, color-primary, color-border, color-surface, color-primary-deep, color-expense, color-surface-muted, color-text.
  Sources: code-reference-1
  Confidence: medium
  Why: Synthesized from implementation tokens and visual references instead of isolated one-off values.
- Implementation boundary: Keep brand primitives centralized behind explicit exports so downstream surfaces compose the system instead of redefining it ad hoc.
  Sources: code-reference-1
  Confidence: medium
  Why: Inferred from the presence of reusable exports and shared reference files in the code source.

## Conflicts

- None

## Profiles

### design-system
- Component vocabulary: Keep a reusable component vocabulary with explicit exported primitives such as LedgerEntry, CreateLedgerEntryInput, LedgerSummary, LedgerStateSnapshot, SummaryCards, TopBar, RecentActivity, QuickAddForm.
  Sources: code-reference-1
  Confidence: medium
  Why: Derived from exported symbols found in code references.
- Token posture: Express visual decisions through reusable named primitives, backed by style tokens like color-text-muted, color-primary, color-border, color-surface, color-primary-deep, color-expense, color-surface-muted, color-text.
  Sources: code-reference-1
  Confidence: medium
  Why: Synthesized from implementation tokens and visual references instead of isolated one-off values.
- Implementation boundary: Keep brand primitives centralized behind explicit exports so downstream surfaces compose the system instead of redefining it ad hoc.
  Sources: code-reference-1
  Confidence: medium
  Why: Inferred from the presence of reusable exports and shared reference files in the code source.

### marketing
- Message hierarchy: Lead marketing surfaces with an instantly readable identity layer, then reinforce it with a positioning line. Preferred posture: Reinforce the brand with a clear positioning statement in the spirit of "Personal Finance Tracker Design".
  Sources: website-1, brand-docs-1, brand-docs-2
  Confidence: high
  Why: Composed from the synthesized brand-identity rules so marketing pages open with recognition first and explanation second.
- Marketing copy posture: Keep campaign copy anchored in the core voice, then close with short direct CTAs. Voice anchor: Anchor copy around recurring brand language such as product, blue, visual, personal, tracker, user.
  Sources: brand-docs-1, brand-docs-2
  Confidence: high
  Why: Composed from voice rules so marketing copy stays on-brand without drifting into generic campaign language.

### product-ui
- Product copy discipline: Keep in-product copy direct and operational, and surface boundaries clearly when they matter. Surface cautionary or boundary-setting guidance clearly when needed, following patterns like "# Personal Finance Tracker Design Date: 2026-03-17 Status: Approved design draft ## Summary Build a simple personal income and expense web app with a white-and-blue visual system. The product should feel clean, calm, and reliable, with a Stripe-like sense of structure without cop".
  Sources: brand-docs-1, brand-docs-2
  Confidence: medium
  Why: Composed from voice and behavior rules so product copy stays useful, not promotional.
- System reuse: Build product screens from the shared system first, then customize only where the product truly needs it. Express visual decisions through reusable named primitives, backed by style tokens like color-text-muted, color-primary, color-border, color-surface, color-primary-deep, color-expense, color-surface-muted, color-text. Keep brand primitives centralized behind explicit exports so downstream surfaces compose the system instead of redefining it ad hoc.
  Sources: code-reference-1
  Confidence: medium
  Why: Composed from design-system rules so product UI scales through reuse instead of one-off screen styling.

### dashboard
- Operational clarity: Dashboard actions and labels should be terse, obvious, and safe to scan under time pressure. Surface cautionary or boundary-setting guidance clearly when needed, following patterns like "# Personal Finance Tracker Design Date: 2026-03-17 Status: Approved design draft ## Summary Build a simple personal income and expense web app with a white-and-blue visual system. The product should feel clean, calm, and reliable, with a Stripe-like sense of structure without cop".
  Sources: brand-docs-1, brand-docs-2
  Confidence: high
  Why: Composed from behavior rules so dense operational surfaces privilege clarity and boundaries over flourish.
- System consistency: Keep dashboard surfaces tightly coupled to the shared design system so dense views remain consistent across states and modules. Express visual decisions through reusable named primitives, backed by style tokens like color-text-muted, color-primary, color-border, color-surface, color-primary-deep, color-expense, color-surface-muted, color-text. Keep brand primitives centralized behind explicit exports so downstream surfaces compose the system instead of redefining it ad hoc.
  Sources: code-reference-1
  Confidence: medium
  Why: Composed from design-system rules to prevent dense information surfaces from drifting into bespoke UI patterns.

## Missing Source Suggestions

- Add screenshots or Figma references.
