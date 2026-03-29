# Token-Bound Focus Ring Pattern Prevents False Ring Updates

When `--ring` token changes appear to have no visual effect, the issue is often class binding, not token values.

## Pattern

Use token-bound focus classes consistently in interactive components:
- `focus-visible:border-ring`
- `focus-visible:ring-ring/50`
- `focus-visible:ring-[3px]`

If component uses only width utilities like `focus:ring-2` / `focus-visible:ring-2`, ring color may not reflect token updates clearly or at all.

## Practical Rule

Before tuning token values, run a ring binding audit:
1. Search for `focus:ring-2` and `focus-visible:ring-2`.
2. Replace with token-bound ring pattern where brand-consistent focus is required.
3. Recheck key components: input, dialog close buttons, icon-only buttons.

This reduces false debugging loops and keeps focus behavior aligned with design tokens.
