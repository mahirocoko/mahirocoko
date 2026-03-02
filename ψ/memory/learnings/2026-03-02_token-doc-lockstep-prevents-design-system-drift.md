# Token-Doc Lockstep Prevents Design System Drift

When color/token values are being tuned quickly, implementation and documentation must be updated together in the same cycle. If CSS changes land without doc sync, teams lose trust in the token contract and future updates become slower and riskier.

## Pattern

- Apply token changes in source (`globals.css`) first.
- Immediately sync policy/onboarding docs with exact finalized values.
- Re-read actual files before writing docs to avoid stale-memory mistakes.
- Verify component behavior still reflects token intent (for example `ghost`, gradient, ring patterns).

## Practical Rule

For every token tweak:
1. Update CSS token.
2. Update docs in the same session.
3. Run lint/typecheck.
4. Commit as one coherent unit.

This keeps design language, implementation, and team memory aligned.
