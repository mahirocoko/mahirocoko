# Personal Finance Tracker Design

Date: 2026-03-17
Status: Approved design draft

## Summary

Build a simple personal income and expense web app with a white-and-blue visual system. The product should feel clean, calm, and reliable, with a Stripe-like sense of structure without copying Stripe's interface. `v1` focuses on fast daily entry, immediate balance visibility, and recent transaction review. Data is stored locally in the browser with no backend.

## Product Direction

- Single-user personal finance tracker
- White-and-blue tone with a restrained, trustworthy look
- Thai-first copy with selective English labels such as `Balance`, `Income`, `Expense`, and `Recent activity`
- Responsive for both desktop and mobile, with neither treated as a degraded experience
- Implemented as a standalone `Vite + React + TypeScript` app inside `apps/blue-ledger`

## Goals

- Let one person add income and expense entries quickly
- Show current balance and high-signal financial summaries immediately
- Make the first screen useful without navigation complexity
- Keep the interaction model simple enough to implement without backend services
- Preserve data locally across refreshes through browser storage

## Non-Goals

- Authentication
- Multi-user collaboration
- Cloud sync
- Budget goals
- Recurring transactions
- Account or wallet management
- Edit and delete flows in `v1`
- Advanced analytics or chart-heavy dashboards

## Visual Reference Posture

Reference mood:
- `https://stripe.com/`

Interpretation for this product:
- strong hierarchy
- calm whitespace
- restrained accents
- polished card surfaces
- premium but not flashy

What to keep:
- clarity
- trust
- composure
- structured spacing

What not to copy:
- complex marketing composition
- enterprise density
- dark sections
- decorative gradients that overwhelm utility

## Primary User

One person tracking their own daily money movement. The product should feel lightweight enough to use quickly but solid enough to trust for ongoing personal logging.

## Core User Flow

1. Open the app
2. See current balance, total income, and total expense
3. Add a new entry through a short form
4. See the summaries and recent activity update immediately
5. Return later and continue from the locally stored history

## Information Architecture

`v1` uses a single-screen layout with a `card stack hybrid` approach:

1. Top bar
2. Balance overview
3. Quick add
4. Recent activity

This keeps the desktop experience dashboard-like while still collapsing naturally into one vertical flow on mobile.

## Screen Structure

### 1. Top Bar

Contents:
- app name
- brief personal subtitle
- current date or contextual time label
- optional compact action such as `+ Add entry`

Purpose:
- orient the user immediately
- establish product tone without spending space on navigation

### 2. Balance Overview

Contents:
- primary `Balance` card
- secondary `Income` card
- secondary `Expense` card

Purpose:
- communicate the most important financial state at a glance
- create a strong visual hierarchy before the user reaches the form

Behavior:
- values are derived from stored entries
- updates happen immediately after submission

### 3. Quick Add

Contents:
- type selector: `income` or `expense`
- amount input
- category input with reusable suggestions
- note input
- date input
- submit action

Purpose:
- optimize for fast capture
- keep entry creation short and obvious

Behavior:
- validation is inline and minimal
- submit writes to local storage
- successful submit clears or resets fields to a sensible default
- if the user submits a new category that does not yet exist, that category becomes available in future suggestions automatically

### 4. Recent Activity

Contents:
- recent entries ordered newest first
- visual distinction between income and expense
- date, category, amount, and optional note

Purpose:
- confirm what was just saved
- give enough history to stay oriented without another page

Behavior:
- show the latest `8` entries on the first screen

## Data Model

`v1` uses one primary entity: `entry`

Fields:
- `id`
- `type` as `income | expense`
- `amount`
- `category`
- `note`
- `date`
- `createdAt`

Derived state:
- `balance`
- `totalIncome`
- `totalExpense`
- `recentEntries`
- `categorySummary`
- `categorySuggestions`

## Persistence

Storage mode:
- browser-only persistence with `localStorage`

Rules:
- write after successful submission
- read on initial load
- handle corrupted or unreadable stored data by falling back to an empty safe state
- avoid backend assumptions in UI copy and architecture
- keep all browser persistence behind an explicit storage helper boundary rather than inside leaf UI components

## Interaction Rules

- Submitting a valid entry updates storage and UI immediately
- Entries appear in `Recent activity` in reverse chronological order
- `Balance`, `Income`, and `Expense` cards are always computed from the same entry source
- Empty state should encourage the user to add the first entry
- The form should not feel modal or hidden behind another step
- Category suggestions should combine default starter categories with categories already used in saved entries

## Validation and Error States

Required validation:
- type must be selected
- amount must be greater than zero
- category must not be empty
- date must be present

Error posture:
- inline validation near the affected field
- clear and brief language
- no blocking toast system required for `v1`

Fallback states:
- empty state when there are no entries
- safe reset when persisted data cannot be parsed

## Responsive Behavior

Desktop:
- airy spacing
- summary cards can sit in a row
- quick-add and recent-activity sections can remain vertically stacked or use mild column treatment if space allows

Mobile:
- everything stacks in a single column
- balance card remains visually dominant
- form controls remain large enough for quick thumb entry
- recent activity stays readable without dense table patterns
- mobile should still preserve a clear section rhythm rather than becoming one undifferentiated stack

## Visual System

Color direction:
- white and near-white surfaces
- medium and deep blues for emphasis
- soft neutral grays for dividers and metadata
- red is allowed only for expense cues if needed, but should stay subtle

Typography direction:
- clean, modern sans-serif
- strong numeric emphasis for financial totals
- compact label styling for secondary information

Surface direction:
- medium corner radius
- light borders
- very soft shadows
- minimal glass or gradient treatment

Density:
- spacious enough to feel premium
- compact enough to support daily utility

## Copy Direction

- Thai-first for usability
- English used selectively for product polish and common finance labels
- tone should feel calm, competent, and non-judgmental
- avoid overly playful or motivational copy

Examples:
- `ยอดคงเหลือ Balance`
- `เพิ่มรายการใหม่`
- `รายการล่าสุด`
- `รายรับ`
- `รายจ่าย`

## Component Breakdown

Suggested component boundaries:
- `FinanceAppShell`
- `TopBar`
- `BalanceOverview`
- `SummaryCard`
- `QuickAddForm`
- `EntryTypeToggle`
- `RecentActivityList`
- `RecentActivityItem`
- `EmptyState`

State boundaries:
- one local source of truth for entries
- derived selectors or helpers for summaries
- storage read and write isolated from presentation components

## Testing Strategy

Priority checks:
- local storage read and write behavior
- summary calculations
- form validation
- newest-first recent activity ordering
- empty state rendering
- corrupted storage fallback

Responsive verification:
- mobile-width layout remains readable and usable
- desktop layout preserves hierarchy without dead space

## Implementation Notes

- Keep the initial architecture frontend-only
- Prefer simple data flow over abstraction-heavy state management
- Avoid introducing routing unless a second screen becomes necessary
- Build the screen so edit and delete can be added later without replacing the data model

## Out of Scope for This Design

This spec only locks the `v1` product and interface direction. It does not yet define:
- implementation plan tasks
- exact framework choice if a new app must be scaffolded
- analytics instrumentation
- backend migration path
