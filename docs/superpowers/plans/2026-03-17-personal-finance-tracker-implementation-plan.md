# Personal Finance Tracker Implementation Plan

Date: 2026-03-17
Source spec: `docs/superpowers/specs/2026-03-17-personal-finance-tracker-design.md`

## Objective

Implement `v1` of a personal income and expense tracker as a frontend-only web app that:

- uses a white-and-blue visual system
- supports fast entry creation
- shows `Balance`, `Income`, and `Expense` summaries
- displays recent activity on the same screen
- persists data locally in the browser with `localStorage`
- lives in `apps/blue-ledger` as a standalone `Vite + React + TypeScript` app

## Delivery Strategy

Build the first usable version in five tracks, executed in dependency order:

1. establish the app shell and visual system
2. implement the local data model and storage boundary
3. build the quick-add form and validation flow
4. build summary and recent-activity presentation
5. verify responsive behavior and storage resilience

The target is one polished single-screen experience, not a broad feature set.

## V1 Cut Line

`v1` must include:

- one-screen layout
- top bar with title and context
- balance overview with three summary cards
- quick-add form for new entries
- recent activity list ordered newest first
- category suggestions that learn newly submitted categories automatically
- first-screen recent activity capped to `8` entries
- browser persistence with `localStorage`
- Thai-first copy with selected English labels
- responsive behavior for mobile and desktop

`v1` does not need:

- backend
- authentication
- edit or delete actions
- charts
- multi-account support
- category management screens
- filtering and search

## Phase Plan

### Phase 1: App Foundation and Layout Shell

Deliverables:

- app root screen structure
- top bar
- base spacing and surface system
- responsive page container rules

Tasks:

- scaffold `apps/blue-ledger` with `Vite + React + TypeScript`
- create the single-screen shell for the finance app
- define shared layout tokens or local style constants for spacing, radius, border, and shadows
- establish white-and-blue color usage for primary, secondary, and muted states

Acceptance checks:

- the screen renders as one coherent app, not loose components
- desktop and mobile both preserve hierarchy
- the top bar and page sections are visually stable before data wiring

### Phase 2: Data Model and Persistence Boundary

Deliverables:

- `entry` type or interface
- storage read and write helpers
- summary calculation helpers
- category suggestion helpers

Tasks:

- define the `entry` shape from the spec
- implement `localStorage` read on initial load
- implement safe parsing and corrupted-state fallback
- implement derived calculations for balance, total income, total expense, and recent ordering
- implement category suggestion derivation from starter values plus saved entries

Acceptance checks:

- a valid saved entry list restores correctly on refresh
- invalid persisted data does not crash the app
- all summary values derive from one canonical entry source

### Phase 3: Quick Add Form

Deliverables:

- type selector
- amount field
- category field
- note field
- date field
- submit flow with inline validation

Tasks:

- build the form in the same screen without modal navigation
- validate required fields and positive amount
- normalize submitted values into the `entry` model
- write successful submissions to the canonical state and persistence layer
- reset form fields to sensible defaults after save

Acceptance checks:

- invalid input shows clear inline feedback
- valid submission updates the UI immediately
- the form remains fast to use on mobile-width screens

### Phase 4: Summary Cards and Recent Activity

Deliverables:

- primary `Balance` card
- secondary `Income` and `Expense` cards
- recent activity list
- empty state for first use
- recent activity cap for the first `8` entries

Tasks:

- render summary totals with strong numeric emphasis
- visually distinguish income and expense without loud color usage
- sort recent entries newest first
- present category, date, amount, and note cleanly in each list item
- add an empty state that points the user back to `Quick add`

Acceptance checks:

- saving an entry refreshes summaries and list immediately
- recent activity is readable on narrow screens
- empty and populated states both feel intentional

### Phase 5: Polish, Resilience, and Verification

Deliverables:

- refined spacing and copy pass
- responsive edge-case fixes
- verification notes

Tasks:

- adjust visual density so the app feels premium rather than generic
- verify keyboard and pointer usability for the form
- verify local storage behavior across refreshes
- test narrow and wide viewport layouts
- test fallback behavior for empty and corrupted persisted state

Acceptance checks:

- the final screen matches the clean, trustworthy tone from the spec
- layout does not collapse awkwardly on mobile
- no backend assumptions leak into the UI

## Suggested Implementation Order

Use this sequence to keep rework low:

1. scaffold `apps/blue-ledger`
2. create the layout shell and style foundation
3. define entry model, storage helpers, and derived calculations
4. build and wire the quick-add form
5. build summary cards and recent activity
6. implement empty state, learned categories, and corrupted-storage fallback
7. polish responsive behavior and copy
8. run verification

## File and Module Boundaries

Recommended split, adapted to the existing stack once confirmed:

- app screen file
  owns composition of the finance screen
- finance domain module
  owns `entry` model, calculations, and storage helpers
- presentational components
  own cards, form pieces, and recent items
- style layer
  owns local tokens or component-level styling decisions

Rules:

- keep one canonical entry source of truth
- keep storage logic out of leaf presentation components
- keep calculations pure and testable

## State and Data Flow

Canonical state:
- `entries`

Derived state:
- `balance`
- `totalIncome`
- `totalExpense`
- `recentEntries`

Flow:

1. app loads persisted entries
2. canonical state initializes
3. derived values are computed from canonical state
4. user submits a new entry
5. canonical state updates
6. persisted storage updates
7. summaries and recent activity rerender from the same source

## UX and Visual Priorities

- keep the balance card visually dominant
- make the quick-add form feel lightweight, not admin-like
- avoid dense table UI for recent activity
- use blue as emphasis, not as a full-page wash
- keep borders and shadows subtle

## Test Plan

Functional checks:

- add income entry
- add expense entry
- validate empty required fields
- validate non-positive amount
- restore entries after refresh
- recover safely from unreadable persisted data

Presentation checks:

- desktop hierarchy is clear
- mobile layout remains comfortable
- summary totals are easy to scan
- recent activity remains legible with long notes or categories

## Risks and Mitigations

Risk:
- the repo may not yet contain a runnable frontend app

Mitigation:
- inspect the current stack first and decide whether to adapt an existing app or scaffold a minimal frontend surface

Risk:
- local storage wiring may get mixed into UI components

Mitigation:
- isolate storage and calculation helpers early

Risk:
- the design may drift into generic finance-dashboard styling

Mitigation:
- keep the visual system narrow and enforce the calm white-and-blue posture during polish

## Definition of Done

The implementation is done when:

- one screen supports end-to-end entry creation and review
- data persists across refreshes in the same browser
- summaries are correct and immediate
- the experience is responsive on mobile and desktop
- the visual result matches the spec's calm, structured white-and-blue direction
