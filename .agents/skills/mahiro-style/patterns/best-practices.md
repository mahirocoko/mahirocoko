# Best Practices

## Intent

This page owns cross-cutting implementation heuristics that connect multiple pattern pages.

Use it when the problem crosses boundaries, such as deciding between route extraction, hook extraction, shared UI wrapping, service placement, or state scope.

## Choosing the Right Owner

The main question is not "how do I shrink this file". The main question is "which owner makes this code easiest to understand and change later".

## Non-negotiable

- Keep this page as synthesis, not as a second full copy of every pattern page.
- Resolve implementation choices by ownership first: route, component, hook, service, store, provider, or shared UI.
- Follow repo-local tooling, exports, and formatter rules first, then apply Mahiro-shaped ownership decisions.
- Use the more specific canonical pattern page when the decision clearly belongs there.
- Keep examples here short and cross-cutting instead of turning this page into a framework tutorial.

## Preference

- Prefer the smallest scope that keeps ownership clear.
- Prefer extraction that improves searchability, naming, and reviewability together.
- Prefer keeping data transport, client state, and presentational UI in separate homes even when one file could technically hold all three.
- Prefer feature wrappers around shared primitives when domain meaning starts to leak.

## Contextual

- In a larger app, ownership mistakes compound quickly. Respect the service, hook, store, and route layers before adding new abstractions.
- In a leaner app, proportionality matters. Do not create enterprise layers before the feature volume asks for them.
- In a monorepo, package boundaries add another ownership layer. Check whether something is truly shared across apps before promoting it into a shared package.
- If a local repo has stronger snippet, package, or export rules, follow them. This page is about choosing the owner, not overriding local mechanics.

## Examples

- If a route is thick because it mixes config and section rendering, move the section into a component and the config into a domain constant, then keep route composition readable.
- If a component needs remote data and cache invalidation, keep transport in a service and let a hook or route own the query wiring.
- If a shared primitive starts speaking approval or payroll vocabulary, stop and wrap it with a feature component instead.

## Anti-Examples

- Fixing every readability problem by creating another hook, even when the route or component is still the better owner.
- Promoting one feature-specific widget into shared UI after a single usage because reuse feels possible.
- Copying repo-local mechanics from one reference project into another without checking local doctrine first.
- Repeating full service, state, route, and naming doctrine here instead of routing to their canonical pages.
