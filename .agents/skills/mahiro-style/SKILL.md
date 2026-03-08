---
name: mahiro-style
description: Mahiro cross-repo code style doctrine. Encodes Mahiro's preferences for naming, file structure, interface/type usage, constants plus i18n, component boundaries, and review heuristics. Use when implementing, reviewing, refactoring, or aligning code to Mahiro style.
user-invocable: true
---

# /mahiro-style - Mahiro Code Style Doctrine

Load Mahiro's cross-repo coding style before implementing, refactoring, or reviewing. This skill is broader than frontend stack guidance: it focuses on how code should be shaped, named, split, and reviewed.

## When to Use

- Refactoring code to feel more like Mahiro wrote it
- Reviewing AI-written code for style drift
- Deciding whether something should live in routes, components, constants, services, or stores
- Checking `interface` vs `type` usage
- Preserving i18n posture when extracting config/constants
- Building a reusable review checklist for repo-specific work

## Core Principles

| Priority | Principle |
|----------|-----------|
| 1 | Existing project `AGENTS.md` is source of truth |
| 2 | Keep files single-purpose and domain-named |
| 3 | Preserve explicit boundaries between UI, config, services, and state |
| 4 | Keep i18n structural, not an afterthought |
| 5 | Reuse existing repo patterns before inventing new abstractions |

## Quick Commands

```bash
/mahiro-style
/mahiro-style code-style
/mahiro-style structure
/mahiro-style i18n
/mahiro-style boundaries
/mahiro-style review
/mahiro-style anti
```

## Output Sections

1. **Code Style Guide** - naming, imports, interface/type usage, internal section order
2. **Structure Rules** - file purpose, route/component/constants/service boundaries
3. **Constants and I18n Rules** - `msg`, `useLingui`, extraction-safe config patterns
4. **Services and State Rules** - transport, query/store boundaries, provider placement
5. **Review Checklist** - fast evaluation points for AI-generated code
6. **Anti-Patterns** - what usually makes code feel non-Mahiro

## Doctrine Model

- `Non-negotiable`: defaults unless the repo explicitly says otherwise
- `Preference`: strong default when multiple valid implementations exist
- `Contextual`: adapt to local repo conventions without losing the shape of the style

This skill is a retrieval layer, not a strict linter. It should help AI match Mahiro's code-shaping instincts across repos.

## How It Works

### 1. Source Selection
- Read project `AGENTS.md` first when it exists
- Fall back to `resources/guide.md` when project doctrine is missing or incomplete
- Read focused resource docs when the prompt asks for a narrower lens
- Read `examples/README.md` and topic-specific files in `examples/` when concrete `Do / Avoid` patterns would help

### 2. Retrieval Lenses
- `code-style` → imports, naming, interfaces, types, section order
- `structure` → route/file boundaries, constants placement, extraction decisions
- `i18n` → Lingui posture, constants with `msg`, translation-safe refactors
- `boundaries` → services, stores, providers, reusable UI separation
- `review` → practical review checklist
- `anti` → violations and drift patterns

### 3. Priority When Rules Conflict
1. Local `AGENTS.md`
2. Existing repo patterns already in use
3. Mahiro non-negotiables
4. Mahiro preferences

## Resources

| File | Purpose |
|------|---------|
| `resources/guide.md` | Consolidated fallback doctrine |
| `resources/code-style.md` | Naming, imports, interface/type rules |
| `resources/structure.md` | File and module boundary rules |
| `resources/constants-i18n.md` | Constants extraction and Lingui posture |
| `resources/services-state.md` | Service/store/provider boundaries |
| `resources/review-checklist.md` | Fast review lens |
| `resources/anti-patterns.md` | Common drift patterns |
| `examples/README.md` | Index of concrete `Do / Avoid` examples by topic |

## Maintenance Notes

- Keep this skill stack-light and style-heavy
- Prefer patterns that appeared across Mahiro repos, not one-off preferences from a single codebase
- When a repo evolves, update the local `AGENTS.md` first, then adjust this fallback doctrine if the pattern is truly cross-repo

ARGUMENTS: $ARGUMENTS
