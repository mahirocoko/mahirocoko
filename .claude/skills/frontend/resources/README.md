# Frontend Resources

This folder contains runtime-neutral frontend conventions used by the `/frontend` skill when project `AGENTS.md` is unavailable.

All docs are written to be:

- runtime-neutral
- package-manager-neutral
- framework-adaptable with concrete examples

## Document Map

- `guide.md` - Consolidated fallback guide with skill-compatible section headings
- `overview.md` - Scope, goals, and how to apply these docs
- `code-style.md` - Formatting and TypeScript style rules
- `i18n.md` - Lingui i18n conventions and examples
- `testing.md` - Test placement and test quality rules
- `state-data.md` - State management conventions
- `implementation-patterns.md` - Reusable implementation snippets (route/store/service/mutation + component-system patterns)
- `anti-patterns.md` - Things to avoid
- `verification.md` - Verification cadence and runtime examples
- `runtime.md` - Runner/tooling fallback details
- `review-checklist.md` - Fast pre-merge checklist for Mahiro-style frontend PR review
- `profiles/detect-rules.md` - Stack profile selection and auto-detection rules
- `profiles/next.md` - Stack additions for Next.js App Router projects
- `profiles/vite-react-ts.md` - Stack additions for Vite + React + TypeScript projects
- `profiles/react-router-framework.md` - Stack additions for React Router framework mode projects

## Authoring Rule

Keep `guide.md` headings aligned with skill output sections:

- `## Code Style Guide`
- `## Navigation and Screen Rules`
- `## Testing Rules`
- `## State and Data Rules`
- `## Implementation Patterns`
- `## Anti-Patterns`
