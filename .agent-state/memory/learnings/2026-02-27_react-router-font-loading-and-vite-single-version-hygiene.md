# React Router Font Loading and Vite Single-Version Hygiene

Date: 2026-02-27  
Source: rrr --deep (mahirocoko)

## Patterns

1. **Document-level assets belong to React Router root conventions**  
   In framework mode, font loading should be defined in `app/root.tsx` through `links()` and rendered via `<Links />` in `<head>`. This keeps font behavior aligned with routing/document lifecycle and avoids ad-hoc page-level injection.

2. **Bilingual typography works best as ordered fallback, not split runtime logic**  
   A stable stack such as `font-family: 'Inter', 'Noto Sans Thai', sans-serif;` allows Latin glyphs to render with Inter while Thai glyphs fall back to Noto Sans Thai naturally, without conditional font switching complexity.

3. **Token-first UI consistency must be enforced in primitives**  
   Color and surface consistency should be corrected in shared UI primitives (`button`, `badge`, `dialog`, `input`) using semantic tokens, then inherited by route screens. Page-level fixes alone do not scale.

4. **Type mismatch in Vite plugin chains can be stale-state symptoms**  
   “No overload matches this call” around plugin arrays can come from mixed local dependency artifacts/editor cache. Verify active symlinks and dependency graph before changing package versions.

## Reusable Checklist

- Root: add `links()` with `preconnect` and `stylesheet` for fonts.
- Head: ensure `<Links />` exists in root layout.
- CSS: set a deterministic bilingual stack in global body style.
- UI: remove direct palette classes, use semantic tokens only.
- Tooling: run graph checks (`pnpm why vite`, symlink inspection), then reinstall/refresh before version surgery.
- Verify: run `lint + format + typecheck + test + build` after each risky phase.

## Confidence

- Pattern 1 (root font loading via `links()`): **high** (official React Router convention + successful local integration)
- Pattern 2 (Inter + Noto fallback strategy): **high** (standard glyph fallback behavior + verified build/typecheck)
- Pattern 3 (token enforcement in primitives): **high** (visible consistency gains and no regressions in checks)
- Pattern 4 (Vite mismatch as stale-state symptom): **medium** (confirmed in this environment; still requires context-specific validation in future incidents)

## Watch-outs

- Keep repo boundaries explicit when debugging (memory repo vs incubated app repo).
- Do not overfit tooling fixes into permanent dependency changes without graph proof.
- If editor still shows old conflict after fixes, restart TS server/reload IDE before modifying manifest.
