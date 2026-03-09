# Task 2 - Canonical IA for Foundations and Patterns

Scope: `.agents/skills/mahiro-style/`
Date: 2026-03-08
Inputs: Task 1 crosswalk, Task 1 example coverage, restructure plan

## IA decision

Use a thin root hub plus two retrieval-first clusters:

- `foundations/` owns stable doctrine about how to read repo rules, shape files, structure projects, and review drift.
- `patterns/` owns practical implementation domains that agents are likely to query directly during coding or refactor work.
- Example knowledge stops living in a separate tree. Each canonical page owns its own `Examples` and `Anti-Examples` sections later.
- Historical file origin does not decide ownership. Retrieval intent does.

## Exact target tree

```text
.agents/skills/mahiro-style/
├── SKILL.md
├── README.md
├── foundations/
│   ├── README.md
│   ├── overview.md
│   ├── precedence.md
│   ├── project-structure.md
│   ├── code-style.md
│   └── review-checklist.md
├── patterns/
│   ├── README.md
│   ├── components.md
│   ├── hooks.md
│   ├── route-boundaries.md
│   ├── shared-ui-boundaries.md
│   ├── naming.md
│   ├── services.md
│   ├── stores-state.md
│   ├── constants-i18n.md
│   └── best-practices.md
└── compatibility/
    ├── resources-README.md
    ├── guide.md
    └── examples-README.md
```

Notes:

- `compatibility/` is a target-state planning name for redirect/deprecation docs. It prevents `resources/*` and `examples/*` from remaining disguised canonical trees.
- If later migration tasks choose to keep legacy file paths temporarily, their content should still mirror this ownership map and act only as redirects.

## Ownership model

### Foundations

| Page | Primary ownership | Explicitly does not own |
|---|---|---|
| `foundations/README.md` | Directory map for foundational docs, page chooser for retrieval | Doctrine details that belong in child pages |
| `foundations/overview.md` | Mahiro-style mental model, hybrid posture, reference-project grounding, why Foundations exists | Detailed precedence rules, topic-specific implementation rules |
| `foundations/precedence.md` | Rule priority, conflict resolution, local-doc wins posture led by `AGENTS.md` | Naming rules, service rules, hook structure, project layout specifics |
| `foundations/project-structure.md` | Repo and feature layout, file purpose, where domains live, extraction direction at project level | Thin-route specifics, shared UI specifics, service/store mechanics |
| `foundations/code-style.md` | Formatting posture, imports, TypeScript surface choices like `interface` vs `type`, internal section order, export conventions | Domain naming, route boundaries, service/store boundaries, i18n rules |
| `foundations/review-checklist.md` | Review prompts, drift detection, decision checklist for AI-written code and refactors | Primary doctrine for any single implementation domain |

### Patterns

| Page | Primary ownership | Explicitly does not own |
|---|---|---|
| `patterns/README.md` | Directory map for implementation-pattern docs, page chooser for retrieval | Detailed doctrine owned by child pages |
| `patterns/components.md` | Component conventions, component extraction posture, presentational versus domain-aware component shape | Shared UI ownership rules across features, route orchestration, naming system-wide |
| `patterns/hooks.md` | Hook shape, hook extraction, orchestration versus reusable hook logic, hook file responsibility | General component naming, provider placement, global state policy |
| `patterns/route-boundaries.md` | Thin route posture, route orchestration, what stays in route files versus extracted feature units | Global repo structure, reusable shared UI rules |
| `patterns/shared-ui-boundaries.md` | Reusable UI versus feature-specific UI, business-logic leakage into shared components | Route orchestration, generic naming, service transport rules |
| `patterns/naming.md` | Domain naming for files, components, hooks, variables, modules, query keys, and feature folders | Import formatting, `interface` vs `type`, generic code-style mechanics |
| `patterns/services.md` | Service layer intent, transport boundaries, API contracts, where data fetching mechanics belong | Store shape, route ownership, naming doctrine except service-specific examples |
| `patterns/stores-state.md` | Client state placement, store scope, server-state versus client-state separation, provider scope as state ownership concern | API transport design, route orchestration, reusable UI boundaries |
| `patterns/constants-i18n.md` | Constants extraction with Lingui-safe posture, `msg`, descriptor ownership, render-boundary translation responsibility | Generic naming, service/store design, repo-level precedence |
| `patterns/best-practices.md` | Cross-cutting implementation heuristics that connect multiple pattern pages, quick rules for choosing the right pattern page | Repeating full doctrine already owned elsewhere |

## Requested topic coverage

| Requested topic | Canonical home |
|---|---|
| formatting | `foundations/code-style.md` |
| imports | `foundations/code-style.md` |
| TypeScript | `foundations/code-style.md` |
| project structure | `foundations/project-structure.md` |
| component conventions | `patterns/components.md` |
| hooks | `patterns/hooks.md` |
| services | `patterns/services.md` |
| state management | `patterns/stores-state.md` |
| naming | `patterns/naming.md` |
| best practices | `patterns/best-practices.md` |
| route boundaries | `patterns/route-boundaries.md` |
| shared UI boundaries | `patterns/shared-ui-boundaries.md` |
| constants plus i18n | `patterns/constants-i18n.md` |
| review posture | `foundations/review-checklist.md` |
| rule precedence | `foundations/precedence.md` |

Coverage QA:

- Every requested topic has exactly one canonical owner: PASS
- No requested topic requires `examples/` or `resources/guide.md` as primary source: PASS

## Task 1 crosswalk resolution

| Task 1 source | Resolved canonical owner in Task 2 | Resolution note |
|---|---|---|
| `resources/code-style.md` | `foundations/code-style.md` | Kept as foundational style doctrine, but naming ownership removed from this page. |
| `resources/structure.md` | `foundations/project-structure.md` + `patterns/route-boundaries.md` + `patterns/shared-ui-boundaries.md` | Split retained. Project-level structure stays foundational, concrete boundary patterns move to Patterns. |
| `resources/services-state.md` | `patterns/services.md` + `patterns/stores-state.md` | Split retained. Provider scope follows state ownership, not service ownership. |
| `examples/naming.md` | `patterns/naming.md` | Main Task 1 ambiguity resolved here. Naming is query-shaped implementation guidance, not formatting doctrine. |
| `examples/interface-vs-type.md` | `foundations/code-style.md` | Stays with TypeScript style choices. |
| `examples/section-order.md` | `foundations/code-style.md` | Stays with file-shape doctrine. |
| `examples/export-style.md` | `foundations/code-style.md` | Stays with code-style and local-convention posture. |
| `examples/services.md` | `patterns/services.md` | Stays with service boundary examples. |
| `examples/stores.md` | `patterns/stores-state.md` | Stays with state/store ownership examples. |
| `examples/route-boundaries.md` | `patterns/route-boundaries.md` | Stays with thin-route doctrine. |
| `examples/shared-ui-boundaries.md` | `patterns/shared-ui-boundaries.md` | Stays with reusable UI boundary doctrine. |
| `resources/constants-i18n.md` + `examples/constants-i18n.md` | `patterns/constants-i18n.md` | Kept as one canonical i18n ownership page. |
| `resources/review-checklist.md` + `resources/anti-patterns.md` | `foundations/review-checklist.md` plus embedded anti-examples in owner pages | Review stays foundational. Anti-patterns stop being a standalone tree. |

## Why this split is retrieval-friendly

- Queries like "which file should own this logic?" map to `foundations/project-structure.md`.
- Queries like "how should Mahiro name this hook or file?" map to `patterns/naming.md`.
- Queries like "should this fetch live in the route or service?" map to `patterns/services.md` or `patterns/route-boundaries.md`, not a mixed structure page.
- Queries like "how do I extract constants without breaking Lingui?" map to one page, `patterns/constants-i18n.md`.
- Root docs stay thin. They route, they do not compete with canonical topic pages.

## Ambiguities and deferred choices

These are not blockers for IA ownership, but they should stay visible:

1. `compatibility/` is the cleanest target-state home for redirect docs, but later migration work must decide whether legacy file paths remain temporarily for backwards compatibility.
2. `patterns/best-practices.md` must stay a synthesis page. If later rewrites start duplicating child-page doctrine, it should be narrowed or retired.
3. Provider placement is assigned to `patterns/stores-state.md` because it follows state scope more than transport scope. Later content rewrites should keep that rule explicit to avoid drift back into mixed ownership.

## Final ownership verdicts

- Naming belongs to `patterns/naming.md`.
- `foundations/code-style.md` owns syntax-level and file-shape style, not domain naming.
- `foundations/project-structure.md` owns repo and feature layout, while route and shared UI extraction rules live in separate pattern pages.
- Services and state split into separate canonical pages, with no mixed `services-state` primary page in the final IA.
