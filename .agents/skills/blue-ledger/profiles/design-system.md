# design-system

Confidence: high

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
