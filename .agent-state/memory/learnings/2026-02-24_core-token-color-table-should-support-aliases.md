# Learning: Core token color tables must support aliases, not just hex

When documenting design-system colors for implementation, a hex-only presentation is insufficient. A practical color table should explicitly support at least three value forms: resolved literal values (e.g. `#15803D`), token alias references (e.g. `var(--color-surface)`), and derived/computed values (e.g. backdrop alpha over base). If this flexibility is missing, the documentation becomes misleading in real product workflows where reuse and inheritance are core mechanics.

The most effective format in this session was:

1. Swatch-first column for fast visual scanning.
2. Description column for intent and usage boundaries.
3. CSS variable column as implementation contract.
4. Value/Source column for resolved or aliased provenance.

This structure reduced ambiguity and made future extension straightforward (Card, Popup, Dialog placeholders). It also made review feedback actionable because disagreements surfaced as concrete column-level corrections instead of abstract style opinions.

Key takeaway: treat design token documentation as an interface specification, not a style note.
