# Mahiro Style Guide

Use this when project `AGENTS.md` is unavailable. Headings match the skill output so retrieval stays predictable.

## Overview

This guide captures recurring Mahiro style across repos:

- `Non-negotiable` = default unless repo doctrine says otherwise
- `Preference` = preferred when multiple good choices exist
- `Contextual` = adapt to local repo patterns without losing the style shape

Priority order when rules conflict:
1. Local `AGENTS.md`
2. Existing repo architecture and conventions
3. Mahiro non-negotiables
4. Mahiro preferences

## Code Style Guide

- Non-negotiable: use `import type` for type-only imports
- Non-negotiable: `interface` names use `I` prefix
- Non-negotiable: `type` aliases do not use `I` prefix
- Non-negotiable: filenames should be descriptive and kebab-case where practical
- Non-negotiable: constants use names that reflect domain meaning, not vague UI labels
- Preference: route files orchestrate; they should not become giant config dumps
- Preference: component and hook internals follow a stable order when complexity grows
- Contextual: follow local snippet/export style if the repo defines one clearly

## Structure Rules

- Non-negotiable: each file should have one main reason to change
- Non-negotiable: page or route modules hold orchestration, not every domain contract and config object
- Non-negotiable: reusable UI stays reusable; page-specific logic should not leak into shared primitives
- Non-negotiable: if constants/config are reused, move them to explicit constants modules rather than leaving them inline in large screens
- Preference: centralize navigation metadata instead of duplicating labels across shell, route, and menu layers

## Constants and I18n Rules

- Non-negotiable: never break translation posture when extracting config
- Non-negotiable: if the repo uses Lingui, extracted UI copy should remain compatible with `msg` and `useLingui`
- Preference: keep i18n-bearing constants in a dedicated constants module rather than plain string blobs spread through routes
- Preference: use existing constants pattern in the repo before introducing new descriptor abstractions
- Contextual: when the source locale is Thai, keep source strings in Thai unless the repo says otherwise

## Services and State Rules

- Non-negotiable: transport and API intent belong in services, not screen JSX
- Non-negotiable: server state and client state stay clearly separated
- Non-negotiable: global providers live near the app shell, not scattered across leaf components
- Preference: state modules should expose stable interfaces and avoid UI-specific leakage
- Preference: screens should compose service, state, and UI layers instead of becoming all three at once

## Review Checklist

- Does each file still have a clear single purpose?
- Are names domain-specific and easy to scan?
- Are interface/type rules consistent?
- If config moved out, is i18n still safe?
- Did reusable UI stay generic?
- Did route or page files get thinner and clearer after the change?

## Anti-Patterns

- Giant route files with data contracts, config, helper maps, and JSX all mixed together
- Extracting constants in a way that strips out Lingui or translation-safe patterns
- Creating a new abstraction when an existing repo pattern already fits
- Generic names like `items`, `data`, `config` when the domain can be named precisely
- Shared UI components absorbing page-specific business logic
