---
name: frontend
description: Frontend coding conventions and implementation patterns for Mahiro-style React projects. Covers code style, navigation, testing, state management, i18n, and verification workflows. Use when implementing or reviewing frontend code, setting up new routes, refactoring, or aligning with project conventions.
user-invocable: true
---

# /frontend - Frontend Guide

Show project frontend conventions from `AGENTS.md`, with automatic fallback to `resources/guide.md`.

## When to Use

- Implementing new pages, routes, or features
- Setting up frontend project structure
- Reviewing code before PR
- Fixing style inconsistencies
- Aligning with project conventions
- Refactoring with boundary safety

## Core Principles

| Priority | Principle |
|----------|-----------|
| 1 | Token-first consistency (semantic over direct palette) |
| 2 | Existing project architecture boundaries |
| 3 | Local style preferences |

## Quick Commands

```bash
/frontend              # Full guide
/frontend style        # Code style focus
/frontend route        # Navigation/screen rules
/frontend test         # Testing patterns
/frontend state        # State/data rules
/frontend patterns     # Implementation patterns
/frontend anti         # Anti-patterns
/frontend verify       # Verification cadence
/frontend i18n         # Lingui i18n patterns
/frontend rr           # React Router framework mode
/frontend next         # Next.js App Router mode
/frontend vite         # Vite React TS mode
```

## Output Sections

1. **Code Style Guide** - Formatting, TypeScript, token-first classes
2. **Navigation and Screen Rules** - Route organization, layout guards
3. **Testing Rules** - Test placement, quality gates
4. **State and Data Rules** - Server-state, client-state, providers
5. **Implementation Patterns** - Page orchestrator, services, stores
6. **Anti-Patterns** - Things to avoid

## Component Scale Contract

| Component | Default | Disabled Style |
|-----------|---------|----------------|
| Input | `h-10` (40px) | `opacity-50` |
| Button | `h-10` (40px) | `opacity-50` |
| Checkbox | `size-5` (20px) | `bg-muted opacity-60` |
| Checkbox icon | `size-4.5` (18px) | fallback: `size-4` |

## Shadow Tokens

- `shadow-soft` — cards, default elevation
- `shadow-soft-md` — medium elevation, hover states
- `shadow-soft-lg` — high elevation, dialogs/modals

Avoid Tailwind default `shadow-sm/md/lg` in favor of semantic shadow tokens.

## Code Style (Non-negotiable)

- 2-space indentation, single quotes, line width around 120
- Use `import type` for type-only imports
- Files kebab-case, constants SCREAMING_SNAKE_CASE
- Interface names use `I` prefix, type aliases do not
- Prefer semantic tokens (`bg-background`, `text-foreground`) over direct palette

## Navigation Rules (Non-negotiable)

- Route modules in `app/routes/` as page orchestration units
- Reusable UI in `app/components/`, no page logic in shared UI
- File-based route discovery, centralized in one routing entry
- Auth shell decision in root (authenticated layout vs guest outlet)

## Testing Rules (Non-negotiable)

- Tests outside route discovery paths (`test/` or `__tests__/`)
- Deterministic tests only (no hidden time/network coupling)
- Quality gate before PR: `lint`, `typecheck`, `test`

## State Rules (Non-negotiable)

- Split server-state and client-state responsibilities
- API calls in service modules, not inline in UI
- Global providers in app root shell
- React Query clients via utility boundary, not ad-hoc

## Stack Profiles

| Profile | Use When |
|---------|----------|
| `rr` | React Router framework mode |
| `next` | Next.js App Router |
| `vite` | Vite + React + TypeScript |

Auto-detection based on project config/dependencies.

## Verification Cadence

Always run before PR:
```bash
pnpm lint && pnpm format && pnpm typecheck && pnpm test
```

Run build when:
- Route definitions changed
- Bundler/runtime config changed
- Release preparation

After deleting routes/modules:
```bash
rg "deleted-module-name" app test
```

Token enforcement sweep:
```bash
rg "(text|bg|border)-(slate|gray|emerald|white|black)-[0-9]{2,3}" app
```

## Refactor Workflow

1. Lock profile: `/frontend rr`
2. Read boundaries: `/frontend route state test`
3. Check patterns: `/frontend patterns anti`
4. Verify: `/frontend verify`

## How It Works

### 1. Source Selection
- Read `AGENTS.md` from current project if available
- Otherwise read `resources/guide.md`

### 2. Section Assembly
Print sections in fixed order for predictable output.

### 3. Stack Profile
- Resolve from args (`next`, `vite`, `rr`) or auto-detect
- Append stack-specific additions per section

### 4. Focus Filtering
- If arguments provided, append `Focus` lines by keyword match

### 5. Runtime Fallback
- Primary: Bun
- Fallback: Node + `tsx`

```bash
bun scripts/main.ts "$ARGUMENTS"
# Fallback:
npx tsx scripts/main.ts "$ARGUMENTS"
```

## Resources

| File | Purpose |
|------|---------|
| `resources/guide.md` | Consolidated fallback guide |
| `resources/code-style.md` | Formatting and TypeScript rules |
| `resources/i18n.md` | Lingui i18n conventions |
| `resources/testing.md` | Test placement and quality |
| `resources/state-data.md` | State management patterns |
| `resources/implementation-patterns.md` | Code snippets and patterns |
| `resources/anti-patterns.md` | Things to avoid |
| `resources/verification.md` | Verification cadence |
| `resources/review-checklist.md` | Pre-merge checklist |
| `resources/profiles/*.md` | Stack-specific additions |

## Troubleshooting

- `AGENTS.md` missing: ensure project root has `AGENTS.md`, or maintain `resources/guide.md`
- Empty focus results: try broader keywords (`style`, `test`, `state`, `patterns`)
- Token consistency issue: run token enforcement sweep in `resources/verification.md`
- Runtime issue with Bun: use fallback `npx tsx scripts/main.ts "$ARGUMENTS"`
- React Router font/favicon: check `resources/profiles/react-router-framework.md`
- Vite plugin type mismatch: follow `resources/verification.md` Vite triage

ARGUMENTS: $ARGUMENTS
