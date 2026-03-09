# Project Structure

## Intent

This page owns repo layout, feature layout, and file ownership at project level.

Use it to answer questions like where a domain should live, how to split repo-level folders, when to extract feature modules, and which files should keep orchestration versus implementation responsibility.

## Feature Structure and Ownership

At project level, Mahiro-style prefers explicit homes for routes, components, hooks, services, stores, constants, types, and providers.

- Repo structure should make domain boundaries visible from the folder tree.
- Feature structure should group code by responsibility, not by vague utility buckets.
- File ownership should stay obvious enough that an agent can tell where new code belongs before touching implementation details.

## Non-negotiable

- Keep repo and feature layout aligned with the local repo's documented structure first.
- Give each folder a clear ownership boundary, such as routes, services, stores, providers, constants, or components.
- Extract growing route or screen work into domain-owned files when the route stops being a clear entry point.
- Keep project-structure doctrine focused on repo and feature ownership, not on detailed route-boundary or shared-ui doctrine.
- Avoid catch-all folders that hide domain intent.

## Preference

- Prefer feature folders or domain folders that reveal the business area quickly.
- Prefer colocating related domain modules when they change together often.
- Prefer top-level app folders that match recurring responsibilities seen across Mahiro repos, such as `routes`, `components`, `hooks`, `services`, `stores`, `constants`, `providers`, `types`, and `locales`.
- Prefer extraction that makes future ownership clearer, not just smaller files.

## Contextual

The exact tree can differ by repo.

- `jit-flow` uses an app-first structure with `app/routes/`, `app/services/`, `app/stores/`, `app/constants/`, `app/providers/`, and other responsibility-first folders. That is a strong example of visible ownership.
- `eizypay-fe` uses a monorepo, so ownership exists at both workspace level and package level. The same rule still applies: package purpose should stay explicit, and services, hooks, and shared UI should have clear homes inside each app or package.
- `haabiz-hrm-fe` currently has a leaner route-first tree. In that kind of repo, new structure should stay proportional. Do not force a larger feature tree unless the code volume actually needs it.

## Examples

- A new domain with routes, queries, and view components gets a feature home that makes the business area visible instead of scattering files into unrelated shared folders.
- Constants that belong to one domain stay with that domain or feature ownership, while repo-wide constants live in a clearly shared location.
- Providers live where app-wide scope is obvious, such as root-level provider files, instead of being hidden inside unrelated feature modules.

## Anti-Examples

- Putting unrelated domain code into a generic `utils/` folder because the right owner was not chosen.
- Expanding this page into detailed route, shared UI, hook, or service mechanics that belong in `patterns/` docs.
- Forcing every repo into the same folder tree even when the local repo already has a stable documented shape.
- Treating extraction as "move code anywhere smaller" instead of clarifying ownership.
