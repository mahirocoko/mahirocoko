# Learning: Base UI Structure Before Styling

When implementing or refactoring shared UI primitives that come from Base UI/shadcn examples, preserve composition structure first, then apply local token/style customization.

Practical pattern:
- Step 1: Copy canonical structure exactly (provider boundaries, group contexts, render/native element contracts, `data-*` state wiring).
- Step 2: Replace imports with project-local aliases and primitives (`@/components/ui/*`, `@/utils/cn`).
- Step 3: Apply semantic design tokens (`bg-background`, `text-foreground`, `shadow-soft*`) without changing behavioral composition.
- Step 4: Validate both machine and runtime checks:
  - `pnpm lint && pnpm format && pnpm typecheck && pnpm test`
  - manual interaction checks for trigger/context/collapsible behavior.

Failure mode to avoid:
- "Adapt first" can pass static checks but break runtime semantics (for example: non-button render with native button semantics, menu group parts outside group context, selector mismatch for open state animation).

Rule of thumb:
- For component systems with strict context contracts, structural fidelity is part of correctness, not optional polish.
