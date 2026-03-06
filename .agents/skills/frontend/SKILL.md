---
name: frontend
description: Mahiro frontend doctrine for React projects. Encodes Mahiro's personal frontend style across code structure, navigation, testing, state, i18n, and review lenses. Use when implementing, reviewing, refactoring, or aligning AI output to Mahiro-style React patterns.
user-invocable: true
---

# /frontend - Mahiro Frontend Doctrine

Load Mahiro's frontend operating model from project docs, with fallback guidance when project-local doctrine is incomplete.

## When to Use

- Implementing new pages, routes, or features
- Setting up frontend project structure
- Reviewing code before PR
- Fixing style inconsistencies
- Aligning with project conventions
- Refactoring with boundary safety
- Steering AI output toward Mahiro's React style instead of generic ecosystem defaults

## Core Principles

| Priority | Principle |
|----------|-----------|
| 1 | Token-first consistency (semantic over direct palette) |
| 2 | Existing project architecture boundaries |
| 3 | Project-local snippets/templates over fallback examples |
| 4 | Local style preferences |

## Quick Commands

```bash
/frontend              # Full doctrine
/frontend style        # Code style lens
/frontend route        # Navigation and route lens
/frontend test         # Testing lens
/frontend state        # State and data lens
/frontend patterns     # Implementation pattern lens
/frontend anti         # Anti-pattern lens
/frontend verify       # Review/checklist lens
/frontend i18n         # Translation/copy lens
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
7. **Verification Cadence** - Review lens and safety sweeps
8. **I18n Rules** - Translation posture when relevant

## Doctrine Model

- `Non-negotiable`: Mahiro defaults unless the project has a hard constraint
- `Preference`: Mahiro-leaning implementation choice when multiple good options exist
- `Contextual`: stack- or project-specific adaptation of the same doctrine

This skill is not a strict checker. It is a retrieval layer for Mahiro's frontend judgment so the AI can continue the work in the same style.

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

## Refactor Workflow

1. Lock profile: `/frontend rr`
2. Read boundaries: `/frontend route state test`
3. Check patterns: `/frontend patterns anti`
4. Verify: `/frontend verify`

## How It Works

### 1. Source Selection
- Read `AGENTS.md` from current project if available
- Fall back to `resources/guide.md` when project-local doctrine is missing or incomplete
- Load `resources/i18n.md` as a dedicated i18n lens

### 2. Section Assembly
Render doctrine sections in a stable order for predictable retrieval.

### 3. Stack Profile
- Resolve from args (`next`, `vite`, `rr`) or auto-detect
- Append stack-specific adaptations per section

### 4. Retrieval Lenses
- Arguments such as `style`, `route`, `test`, `state`, `patterns`, `verify`, and `i18n` act as retrieval lenses
- Free-form prompts are still allowed and are used to bias what the AI should pay attention to

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
| `resources/guide.md` | Portable Mahiro doctrine baseline |
| `resources/code-style.md` | Formatting and TypeScript rules |
| `resources/i18n.md` | Lingui i18n conventions |
| `resources/testing.md` | Test placement and quality |
| `resources/state-data.md` | State management patterns |
| `resources/implementation-patterns.md` | Code snippets and patterns |
| `resources/anti-patterns.md` | Things to avoid |
| `resources/verification.md` | Verification cadence |
| `resources/review-checklist.md` | Pre-merge review lens |
| `resources/profiles/*.md` | Stack-specific adaptations |

## Troubleshooting

- `AGENTS.md` missing: ensure project root has `AGENTS.md`, or maintain `resources/guide.md`
- Empty focus results: try a doctrine lens first (`style`, `route`, `test`, `state`, `patterns`, `verify`, `i18n`)
- Token consistency issue: run token enforcement sweep in `resources/verification.md`
- Runtime issue with Bun: use fallback `npx tsx scripts/main.ts "$ARGUMENTS"`
- React Router font/favicon: check `resources/profiles/react-router-framework.md`
- Vite plugin type mismatch: follow `resources/verification.md` Vite triage

ARGUMENTS: $ARGUMENTS
