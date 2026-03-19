# [Repo Name]

Short identity line for this repo.

## Purpose

- What this repo is for
- Primary app or product surface
- High-level goal of the codebase today

## Stack Snapshot

- Package manager: `[pnpm/npm/bun/yarn]`
- Framework or runtime: `[React Router / Next.js / Remix / Vite React / etc.]`
- Language: `[TypeScript / JavaScript]`
- Styling: `[Tailwind / CSS Modules / plain CSS / etc.]`
- Data or state: `[TanStack Query / Zustand / Context / etc.]`
- i18n: `[Lingui / react-i18next / none / etc.]`

## Core Directories

### Current Reality

- List the important directories that actually exist and matter.

### Not Established Yet

- Call out important layers that do not exist yet but may appear later.

### If Introduced Later

- Describe the preferred future shape without pretending it already exists.

## Working Rules

### Current Reality

- Follow local repo patterns before introducing new abstractions.

### Preferred Direction

- Capture the direction new work should follow, even if the codebase is still uneven.

### Adoption Triggers

- Note when to introduce new layers such as services, shared UI, or shared state.

## Naming and Structure

### Current Reality

- file naming posture
- export naming posture
- route vs screen vs component boundaries

### Preferred Direction

- folder context can shorten filenames
- exports should keep enough domain signal
- single-owner data should stay with the owner by default

### When To Adopt

- describe when to extract constants, split files, or create shared abstractions

## Commands

- Install: `[verified command]`
- Dev: `[verified command]`
- Build: `[verified command if available]`
- Test: `[verified command if available]`
- Lint: `[verified command if available]`
- Typecheck: `[verified command if available]`

## Docs Map

- `docs/onboarding.md`
- `docs/project-overview.md`
- `docs/file-organization.md`

## Precedence

When rules conflict, use this order:

1. this `AGENTS.md`
2. other repo-local instruction files
3. established repeated repo patterns
4. reference grammar or fallback doctrine

## Safety

- Do not commit secrets.
- Do not force destructive git operations.
- Verify commands against repo scripts before documenting them.
- Do not describe planned architecture as if it already exists.
