---
name: frontend
description: Show frontend code style guide and implementation patterns from AGENTS.md. Use when user says "frontend", "style guide", "code style", "pattern", or "frontend rules".
---

# /frontend - Frontend Guide

Show project frontend conventions from `AGENTS.md`, with automatic fallback to `resources/guide.md`.

## Core Principles

- Keep guidance predictable and section-based
- Prefer project source of truth (`AGENTS.md`) over fallback docs
- Keep output runtime-neutral and package-manager-neutral
- Keep examples practical and copyable

## Usage

```bash
/frontend
/frontend route
/frontend test
/frontend style
/frontend patterns
/frontend state
/frontend verify
/frontend anti
/frontend next
/frontend vite
/frontend rr
```

Common arguments: `style`, `navigation`, `route`, `test`, `state`, `data`, `patterns`, `anti`, `verify`, `next`, `vite`, `rr`.

## How It Works

### 1. Source Selection

- Read `AGENTS.md` from current project if available
- Otherwise read `resources/guide.md`

### 2. Section Assembly

- Print sections in fixed order:
  - Code Style Guide
  - Navigation and Screen Rules
  - Testing Rules
  - State and Data Rules
  - Implementation Patterns
  - Anti-Patterns

### 3. Stack Profile

- Resolve profile from args (`next`, `vite`, `rr`) or auto-detect from project config/dependencies
- Append stack-specific additions per section

### 4. Focus Filtering

- If arguments are provided, append `Focus` lines by keyword match

### 5. Runtime Fallback

- Primary: Bun
- Fallback: Node + `tsx`

## Step 1: Generate guide

```bash
bun scripts/main.ts "$ARGUMENTS"
```

Fallback:

```bash
npx tsx scripts/main.ts "$ARGUMENTS"
```

## Output

- Code style rules
- Navigation/testing/state conventions
- Implementation patterns
- Optional focused lines by keyword

## Notes

- Output structure is consistent across primary and fallback sources
- Runtime support is neutral: Bun primary, Node + tsx fallback
- Package manager commands come from project docs, not hardcoded by this skill
- Supporting references live in `resources/` and prompt examples live in `examples/`

## Troubleshooting

- `AGENTS.md` missing: ensure project root has `AGENTS.md`, or maintain `resources/guide.md`
- Empty focus results: try broader keywords (`style`, `test`, `state`, `patterns`)
- Runtime issue with Bun: use fallback `npx tsx scripts/main.ts "$ARGUMENTS"`

ARGUMENTS: $ARGUMENTS
