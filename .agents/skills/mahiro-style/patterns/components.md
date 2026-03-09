# Components

## Intent

This page owns component conventions, extraction posture, and the split between presentational components and domain-aware components.

Use it when the question is whether code should stay in a route or screen, move into a component, or split into a presentational shell plus a domain wrapper.

## Component Boundaries

Mahiro-style components should make ownership visible.

- A presentational component mostly explains structure, styling, and slots.
- A domain-aware component can know feature concepts, domain copy, and screen-specific composition.
- The component boundary should reduce noise without hiding where the business decision really lives.

## Non-negotiable

- Keep component files responsible for one clear UI job.
- Extract a component when it clarifies ownership, not just when a file gets long.
- Keep presentational components free from transport logic, store mutation wiring, and route orchestration.
- Let domain-aware components carry feature vocabulary when the UI is meaningfully tied to that domain.
- Do not use this page to decide shared UI reuse thresholds across features, that belongs to `shared-ui-boundaries.md`.

## Preference

- Prefer components whose names reveal the screen section or domain job, such as `ApprovalOverviewSection` or `ConsoleLayoutHeader`.
- Prefer passing already-shaped props instead of making a component derive feature meaning from raw backend payloads.
- Prefer extracting large visual sections, card groups, filter bars, and tables into components before a route becomes difficult to scan.
- Prefer small wrapper components when a shared primitive needs domain-specific labels, icons, or mapping.

## Contextual

- `haabiz-hrm-fe` is a good reference for token-first UI primitives plus screen-specific layout wrappers. The shared primitives stay generic, while console and module screens can stay domain-aware.
- `jit-flow` shows a larger app where domain components, layout components, and reusable UI all coexist. The useful lesson is not the exact folder shape, it is that each component tier keeps a readable job.
- `eizypay-fe` shows the same split inside a monorepo, where package-level shared UI exists, but app-level components still own product wording and feature composition.
- Local snippet, formatter, and export conventions are repo-owned concerns. Follow those locally, then shape the component boundary with this doctrine.

## Examples

- A route hands `overviewCards` to `ApprovalOverviewSection` instead of mixing card config, status mapping, and JSX layout in the route file.
- A reusable `StatusBadge` accepts `label` and `tone`, while a feature component decides how approval statuses map into those props.
- A `ConsoleLayoutHeader` owns screen-specific header composition, while low-level button, badge, and dialog primitives stay generic.

## Anti-Examples

- A component called `Section` or `CardList` that only makes sense if the reader already knows the route.
- A presentational component that imports a service, fetches its own data, and silently decides screen navigation.
- Extracting a component that still depends on half the route file's local variables, making ownership harder to read rather than easier.
- Pushing shared UI leakage questions into this page instead of resolving them in `shared-ui-boundaries.md`.
