# Structure Rules

## Main idea

Mahiro style prefers code that is easy to place mentally.

You should be able to answer quickly:

- Why does this file exist?
- Why is this logic here instead of in another layer?
- If this changes, what other files are expected to change with it?

## Route and Screen Boundaries

- Route files are orchestration units
- Shared layout logic can live near route shell components
- Reusable sections can be extracted when a route starts carrying both content config and rendering noise

## Constants Placement

- Reused config should move to constants modules
- Navigation metadata should have one source of truth when multiple shells consume it
- Keep constants near the owning feature unless they are truly app-global

## Component Boundaries

- Shared UI should not know page-specific business logic
- Feature components can know domain details
- Presentational sections are good extraction targets when route files become hard to scan

## Good refactor direction

Move toward:

- thinner route files
- clearer names
- fewer duplicate config sources
- explicit ownership of copy and config
