# 2026-03-08 - Task 3 precedence doctrine decisions

- Locked precedence order for the rewritten skill: `AGENTS.md` -> other repo-local instruction files such as `CLAUDE.md` -> established repo patterns -> Mahiro fallback doctrine.
- Locked hybrid framing: the skill carries Mahiro code shape, but repo-local doctrine wins whenever it speaks.
- Locked tie-break posture: explicit beats implicit, specific beats general, repeated patterns beat isolated examples.
- Locked doc-writing constraint for later tasks: do not present Mahiro doctrine as a parallel source of authority with local repo docs. It is the fallback layer.
# 2026-03-08 - Task 2 canonical IA decisions

- Decision: Use a thin root hub with two canonical clusters, `foundations/` and `patterns/`, instead of preserving `resources/` and `examples/` as first-class trees.
- Decision: Resolve naming ownership in favor of `patterns/naming.md`. `foundations/code-style.md` keeps imports, TypeScript surface choices, section order, export conventions, and formatting posture only.
- Decision: Split project-level structure from implementation boundary patterns. `foundations/project-structure.md` owns repo and feature layout, while `patterns/route-boundaries.md` and `patterns/shared-ui-boundaries.md` own concrete extraction boundaries.
- Decision: Split `services-state` into `patterns/services.md` and `patterns/stores-state.md`, with provider placement owned by the state page.
- Decision: Reserve compatibility docs for redirect behavior only. They are not part of the canonical doctrine surface.

# 2026-03-08 - Task 7 Foundations rewrite decisions

- Decision: Keep `foundations/README.md` as a thin directory map, not a schema-bearing doctrine page.
- Decision: Use the Task 3 ready-to-lift hybrid sentence verbatim in the Foundations overview and precedence pages to avoid precedence drift.
- Decision: Keep `foundations/project-structure.md` scoped to repo and feature layout ownership only, with no detailed route-boundary or shared UI doctrine.
- Decision: Keep `foundations/code-style.md` scoped to formatting posture, imports, TypeScript surface choices, section order, and export conventions only. Naming remains outside this page.

# 2026-03-08 - Task 9 pattern rewrite decisions

- Decision: Keep `patterns/README.md` as a thin directory router, not a schema-bearing doctrine page.
- Decision: Make each Pattern page schema-bearing and canonical for its implementation domain: components, hooks, route boundaries, shared UI boundaries, naming, services, stores/state, and best practices.
- Decision: Keep route thickness in `patterns/route-boundaries.md`, shared UI leakage in `patterns/shared-ui-boundaries.md`, and provider scope in `patterns/stores-state.md` to avoid mixed ownership drift.
- Decision: Ground every Pattern page in repeated signals from `jit-flow`, `haabiz-hrm-fe`, and `eizypay-fe`, while keeping repo-local tooling and syntax as contextual rather than doctrinal rules.
