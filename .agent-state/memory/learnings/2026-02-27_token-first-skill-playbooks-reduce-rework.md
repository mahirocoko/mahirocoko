# Token-first skill playbooks reduce rework

Date: 2026-02-27
Source: rrr: mahirocoko

## Pattern
When implementation repeatedly hits UI inconsistency and configuration friction, the real fix is to encode prevention in skill docs, not just patch code. A token-first rule hierarchy, explicit React Router root-asset guidance, and Vite conflict triage order convert one-off fixes into reusable execution behavior.

## What worked
- Enforcing semantic tokens in primitives prevented repeated page-level color drift.
- Using root `links()` for fonts in React Router made asset loading predictable and framework-aligned.
- Defining triage order (`pnpm why vite` -> reinstall/refresh -> only then version changes) reduced unnecessary dependency churn.
- Providing prompt presets improved command quality and reduced ambiguity.

## Reusable checklist
1. Token sweep before final verification.
2. Primitive consistency check (sizes/states) before route polish.
3. Root-level document asset configuration for React Router apps.
4. Dependency graph proof before package surgery.
5. Add intent-based prompt presets in skill README/examples.

## Confidence
- High: token-first + primitive-first consistency workflow.
- High: React Router `links()` for fonts/favicon.
- Medium: Vite mismatch diagnostics remain environment-sensitive but triage order is reliable.
