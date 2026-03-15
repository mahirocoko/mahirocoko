# Brand Skill Generator Implementation Plan

Date: 2026-03-15
Source spec: `docs/superpowers/specs/2026-03-15-brand-skill-generator-design.md`

## Objective

Implement v1 of the brand skill generator as a single-brand, project-local pipeline that:

- accepts flexible brand sources
- synthesizes a normalized brand model
- renders a skill bundle under `.agents/skills/<brand-skill>`
- emits dual-format reports
- updates an existing brand skill in place

## Delivery Strategy

Build the system in four tracks, but execute them in a dependency-aware order:

1. source ingestion and evidence extraction
2. normalized brand model and conflict engine
3. bundle and report rendering
4. update-in-place diffing and validation

The first implementation target is a CLI with deterministic behavior. The project skill wrapper can be added once the CLI contract is stable.

## V1 Cut Line

V1 must support:

- one brand per run
- local output under `.agents/skills/<brand-skill>`
- flexible source inputs with confidence penalties for sparse inputs
- profiles fixed to `design-system`, `marketing`, `product-ui`, and `dashboard`
- Markdown and JSON report output
- update-in-place behavior with `changes.md`

V1 does not need:

- browser UI
- multi-brand orchestration
- global install or publish flows
- arbitrary profile generation

## Phase Plan

### Phase 1: Repository Scaffolding and Contracts

Deliverables:

- CLI entrypoint and package structure
- initial folder layout for source adapters, model, renderer, diffing, and validation
- normalized brand model schema
- report schema
- generated bundle file contract

Tasks:

- choose runtime and command shape for the CLI
- define the normalized brand model types
- define JSON report structure
- define renderer input and output interfaces
- define destination naming rules for `<brand-skill>`

Acceptance checks:

- the project has one clear CLI entrypoint
- the normalized model schema is stable enough for downstream implementation
- renderer and validator can depend on the schema without reading raw sources

### Phase 2: Source Ingestion

Deliverables:

- source inventory builder
- source metadata normalization
- source validation output

Initial adapters for v1:

- website URL
- local docs or brand files
- screenshots directory
- local code or component references
- optional Figma URL placeholder adapter contract, even if implementation is limited at first

Tasks:

- normalize all input sources into source records
- attach source ids, type, path or URL, freshness, and coverage estimate
- emit structured warnings for inaccessible or weak sources

Acceptance checks:

- mixed input sets can be parsed into one source inventory
- invalid sources fail clearly without corrupting the rest of the run
- source validation output can be rendered into the final report

### Phase 3: Evidence Extraction

Deliverables:

- evidence extractor pipeline
- evidence record schema
- category-specific extraction routines

Categories:

- brand identity
- voice
- visual system
- interaction behavior
- design system
- constraints and anti-patterns

Tasks:

- convert raw source content into evidence records with citations
- tag extracted evidence with provisional confidence
- separate explicit claims from inferred signals

Acceptance checks:

- evidence records always point back to one or more source refs
- explicit and inferred evidence are distinguishable
- extraction output is rich enough to populate all core model sections

### Phase 4: Weighted Synthesis and Conflict Engine

Deliverables:

- scoring engine
- weighted-hybrid merge logic
- conflict resolver
- normalized brand model builder

Tasks:

- implement scoring factors for source type, freshness, explicitness, consistency, coverage, and confidence
- merge consistent evidence into core sections
- split context-specific rules into profiles
- record unresolved conflicts instead of flattening them

Acceptance checks:

- the same evidence set yields deterministic model output
- conflicts are stored with rationale and chosen resolution mode
- each top-level model section has section-level confidence

### Phase 5: Bundle Rendering

Deliverables:

- project-local skill bundle renderer
- `SKILL.md` template logic
- core and profile file renderers

Tasks:

- render the bundle to `.agents/skills/<brand-skill>`
- write `core/brand-dna.md`, `core/voice.md`, `core/visual-system.md`, `core/behavior.md`, and `core/source-policy.md`
- write profile files for `design-system`, `marketing`, `product-ui`, and `dashboard`
- ensure generated `SKILL.md` references bundled files consistently

Acceptance checks:

- generated output matches the spec structure exactly
- rerendering from the same model is idempotent
- bundle files are human-readable and operational, not just raw dumps

### Phase 6: Report Rendering

Deliverables:

- `report.md`
- `report.json`
- report summary generator

Tasks:

- render human-readable report with confidence, evidence, rationale, conflicts, and suggested overrides
- render machine-readable JSON with stable field names
- add summary sections for overall confidence, top conflicts, and missing sources

Acceptance checks:

- Markdown and JSON reports describe the same decisions
- each important synthesized rule includes confidence, refs, and rationale
- conflict notes appear only where needed, not as filler

### Phase 7: Update-In-Place and Diffing

Deliverables:

- existing bundle loader
- changes comparator
- `report/changes.md` renderer

Tasks:

- read current generated bundle and prior report if present
- compare previous and new model outputs
- classify additions, removals, confidence changes, and conflict changes
- overwrite the skill in place while preserving history through git

Acceptance checks:

- rerunning against new evidence updates the same target directory
- change summaries reflect actual file and model differences
- unchanged sections do not churn unnecessarily

### Phase 8: Validation and Run Summary

Deliverables:

- source validation
- model validation
- output validation
- final run summary for human review

Tasks:

- verify required sections exist
- verify profile completeness
- verify report and bundle consistency
- emit final summary with overall confidence, top inferred rules, top conflicts, and most useful next sources

Acceptance checks:

- invalid runs fail early with actionable messages
- low-confidence runs still produce usable artifacts with explicit warnings
- final summary makes review efficient

## Suggested Implementation Order

Use this sequence to reduce rework:

1. scaffold CLI, schemas, and folder structure
2. implement source ingestion
3. implement evidence extraction
4. implement synthesis and normalized model
5. implement bundle renderer
6. implement report renderer
7. implement update-in-place diffing
8. implement validation and final summary
9. wrap with project skill orchestration

This order keeps the renderer and reports downstream of a stable data contract.

## File and Module Boundaries

Recommended internal module split:

- `cli/`
  command parsing and execution entrypoints
- `sources/`
  source adapters and inventory builder
- `evidence/`
  extraction logic and evidence schemas
- `model/`
  normalized brand model types and builders
- `synthesis/`
  scoring and conflict resolution
- `renderers/`
  skill bundle and report rendering
- `diff/`
  update-in-place comparison logic
- `validation/`
  source, model, and output validation

Each unit should expose a small interface and avoid reaching across layers. The renderer must never inspect raw inputs directly.

## Testing Plan

Minimum test coverage for v1:

- source normalization tests
- evidence extraction tests for explicit versus inferred signals
- scoring and conflict resolution tests
- normalized model snapshot tests
- renderer output structure tests
- update-in-place diff tests
- validation failure tests

Use a small set of fixture brands with intentionally conflicting sources so the conflict engine is exercised early.

## Risks and Mitigations

### Risk: The model schema becomes too vague

Mitigation:
- define field-level contracts before building renderers
- reject ambiguous catch-all sections

### Risk: Source adapters leak source-specific assumptions into the renderer

Mitigation:
- enforce the normalized model as the only renderer input

### Risk: Conflict handling becomes hand-wavy

Mitigation:
- require explicit resolution mode and rationale in the model

### Risk: Reports become verbose but unhelpful

Mitigation:
- prioritize confidence, refs, rationale, and only emit conflict notes when real conflicts exist

### Risk: Update-in-place churn rewrites everything every run

Mitigation:
- keep deterministic ordering and compare model content, not just generated text blobs

## Milestones

### Milestone 1

CLI scaffolding, source ingestion, and evidence extraction working end to end with stub rendering.

### Milestone 2

Weighted synthesis, normalized model generation, and first complete bundle rendering.

### Milestone 3

Report generation, update-in-place diffing, validation, and project skill wrapper.

## Definition of Done for V1

V1 is done when:

- a real brand source set can be ingested through the CLI
- the system produces a normalized brand model with confidence and conflict tracking
- the bundle renders to `.agents/skills/<brand-skill>`
- reports are emitted in Markdown and JSON
- rerunning with changed inputs updates the same skill and writes a meaningful `changes.md`
- the resulting skill is judged by review as brand-specific rather than generic

## Immediate Next Action

Start with Phase 1 and Phase 2 together:

1. scaffold the CLI and internal modules
2. define normalized model and report schemas
3. implement source inventory building for website, local docs, screenshots, and local code references
