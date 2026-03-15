# Brand Skill Generator Design

Date: 2026-03-15
Status: Approved design draft

## Summary

Build a single-brand generator that synthesizes multiple brand sources into a project-local skill bundle plus an audit report. The system should accept flexible inputs, weight sources by reliability, normalize them into a brand model, and render a reusable skill bundle under `.agents/skills/<brand-skill>`. It should update the same skill in place over time and emit machine-readable plus human-readable reports explaining what changed and why.

## Problem

Existing skills such as `uncodixfy` are useful as doctrine, but they are generic. They encode strong UI and anti-pattern guidance without being grounded in one business, one brand voice, one visual system, or one product context. That makes them good guardrails but weak at generating output that feels unmistakably like a specific company.

The missing capability is a repeatable way to ingest brand evidence from many sources, resolve conflicts, and produce a brand-specific skill bundle that captures:

- visual system rules
- copy and tone rules
- product behavior rules
- brand constraints
- design-system posture

## Goals

- Generate one skill bundle per brand run.
- Accept flexible source sets rather than requiring a fixed input contract.
- Weight sources with a weighted-hybrid strategy instead of trusting one source type blindly.
- Produce a normalized brand model that is independent of any one source format.
- Render project-local skill bundles under `.agents/skills/<brand-skill>`.
- Support update-in-place behavior for existing brand skills.
- Emit dual-format reports: Markdown for humans and JSON for tooling.
- Include confidence, rationale, source references, conflict notes, and suggested overrides in reporting.

## Non-Goals

- Multi-brand platform orchestration in v1.
- Automatic publishing to global skills directories in v1.
- Browser UI for brand synthesis management in v1.
- Unlimited custom profile taxonomies in v1.
- Replacing designer judgment or human brand approval.

## Design Principles

- Preserve history: update in place, but always emit a change summary and keep git history as the audit trail.
- Separate synthesis from rendering: infer a normalized brand model first, then render files from that model.
- Distinguish stable brand truths from context-specific rules.
- Expose uncertainty instead of hiding it behind polished prose.
- Optimize for repeatability and review, not one-shot prompt magic.

## Inputs

The generator accepts flexible source combinations. Examples:

- live website URLs
- brand guidelines, decks, or manifesto documents
- Figma URLs or design exports
- screenshots
- component library or design-system references
- source code or product UI references
- copy decks or existing product text

Source sparsity is allowed in v1, but low coverage must reduce confidence and trigger explicit warnings in the report.

## Weighted-Hybrid Source Policy

Default trust order:

1. explicit brand documentation
2. live product or website behavior
3. designer artifacts such as Figma or screenshots
4. derived signals from codebase conventions, repeated UI patterns, and copy patterns

This order is a default policy, not an absolute rule. If the evidence suggests a context split, the system may route different decisions to different profiles. If evidence remains insufficient, the rule must be marked unresolved rather than silently averaged.

## Proposed System Architecture

The system is a normalized brand model pipeline with deterministic rendering:

1. Source ingestion
2. Evidence extraction
3. Weighted synthesis
4. Normalized brand model creation
5. Skill bundle rendering
6. Report rendering
7. Update-in-place change generation

This is a brand synthesis engine, not a prompt generator.

## Units and Boundaries

### 1. Source Ingestion

Responsibility:
Read raw sources and normalize them into a common source inventory.

Inputs:
- user-provided URLs, files, folders, screenshots, design references

Outputs:
- normalized source records with metadata

Required metadata:
- source id
- source type
- location
- freshness
- explicitness baseline
- coverage estimate

Boundary:
This unit does not infer brand rules. It only validates, classifies, and records source material.

### 2. Evidence Extraction

Responsibility:
Extract signals from each source into structured evidence records.

Evidence categories:
- brand identity
- voice
- visual system
- interaction behavior
- design-system contracts
- constraints and anti-patterns

Boundary:
This unit does not decide final truth. It creates candidate evidence with references and provisional confidence.

### 3. Weighted Synthesis

Responsibility:
Resolve multiple evidence records into one coherent brand model.

Behavior:
- score evidence records
- merge consistent signals
- split context-specific signals into profiles when needed
- record unresolved conflicts when confidence is insufficient

Decision modes:
- adopt one source as primary
- split by profile
- mark unresolved

Boundary:
This unit produces brand truth for the run. It does not write skill files directly.

### 4. Normalized Brand Model

Responsibility:
Act as the intermediate source of truth for rendering and future updates.

Top-level sections:
- `brand_identity`
- `voice`
- `visual_system`
- `interaction_behavior`
- `design_system`
- `profiles`
- `evidence`
- `conflicts`
- `confidence`

Boundary:
This model is renderer-agnostic. New renderers or report formats should consume this model without re-reading raw sources.

### 5. Skill Renderer

Responsibility:
Generate the project-local skill bundle from the normalized brand model.

Default destination:
- `.agents/skills/<brand-skill>`

Boundary:
The renderer should be deterministic for the same normalized model input.

### 6. Report Renderer

Responsibility:
Generate human-readable and machine-readable audit outputs from the normalized model and current run.

Outputs:
- `report/report.md`
- `report/report.json`
- `report/changes.md`

Boundary:
The report renderer explains decisions. It should not invent new rules.

## Normalized Brand Model

The normalized brand model should contain the following sections.

### `brand_identity`

Contains:
- brand name
- product or company summary
- target audience
- positioning cues
- differentiators

### `voice`

Contains:
- tone attributes
- preferred vocabulary
- discouraged vocabulary
- CTA posture
- writing rhythm or cadence
- banned copy patterns

### `visual_system`

Contains:
- color direction
- type direction
- spacing density
- corner and radius posture
- surface and shadow posture
- motion posture
- composition and layout patterns
- explicit anti-patterns

### `interaction_behavior`

Contains:
- navigation posture
- form behavior rules
- loading, empty, success, and error state posture
- feedback style
- state transition expectations

### `design_system`

Contains:
- token posture
- component principles
- state and variant rules
- implementation constraints
- reuse boundaries

### `profiles`

Profiles inherit from core sections and add context-specific adjustments. V1 includes:

- `design-system`
- `marketing`
- `product-ui`
- `dashboard`

### `evidence`

Maps rules back to source records so every synthesized claim can be traced.

### `conflicts`

Stores source conflicts, decisions, and unresolved items.

### `confidence`

Stores confidence at:
- overall model level
- section level
- rule level

## Scoring Model

Each evidence record should be scored on:

- `source_type`
- `freshness`
- `explicitness`
- `consistency`
- `coverage`
- `confidence`

Example posture:

- a current brand guideline that explicitly defines tone scores high
- a repeated live-site pattern scores high but below explicit documentation
- a single screenshot scores medium
- an inferred codebase pattern scores lower unless repeated strongly

Confidence is not just one number. The system should preserve why a rule is trusted.

## Conflict Resolution

When sources disagree, the system must not blur everything into a vague middle. It must do one of the following:

- adopt a primary source and record why
- split the decision by profile
- mark the issue unresolved and lower confidence

Every significant conflict should be visible in the report with:

- competing sources
- chosen interpretation
- rationale
- suggested override if the reviewer disagrees

## Generated Skill Bundle Structure

```text
.agents/skills/<brand-skill>/
├── SKILL.md
├── core/
│   ├── brand-dna.md
│   ├── voice.md
│   ├── visual-system.md
│   ├── behavior.md
│   └── source-policy.md
├── profiles/
│   ├── design-system.md
│   ├── marketing.md
│   ├── product-ui.md
│   └── dashboard.md
├── report/
│   ├── report.md
│   ├── report.json
│   └── changes.md
└── assets/
    └── optional captured metadata or references
```

### Bundle File Responsibilities

`SKILL.md`
- skill entrypoint
- how to use the skill
- when to apply each profile
- which bundled files contain authoritative rules

`core/brand-dna.md`
- stable brand identity rules

`core/voice.md`
- copy and messaging doctrine

`core/visual-system.md`
- brand-wide visual rules

`core/behavior.md`
- interaction and state rules

`core/source-policy.md`
- source weighting policy and conflict posture used for the current skill

`profiles/design-system.md`
- tokens, components, variants, states, contracts

`profiles/marketing.md`
- campaign and landing-page guidance

`profiles/product-ui.md`
- product surface guidance for general application screens

`profiles/dashboard.md`
- dense information surface guidance and dashboard-specific anti-pattern handling

`report/report.md`
- reviewer-facing synthesis report

`report/report.json`
- machine-readable structured report

`report/changes.md`
- delta from the previous version when updating in place

## Skill and CLI Orchestration

V1 should use a `skill orchestrates CLI` design.

### Skill Responsibilities

The generator skill handles:

- conversational intake
- source completeness checks
- mode selection
- summarizing confidence and conflicts to the user
- invoking the CLI

### CLI Responsibilities

The CLI handles:

- source ingestion
- evidence extraction
- scoring
- conflict resolution
- normalized brand model generation
- skill bundle rendering
- report generation
- update-in-place comparison

Suggested modes:

- `generate`
- `refresh`
- `reconcile`
- `inspect`

Example command shape:

```bash
brand-skill generate \
  --brand "Acme" \
  --website https://acme.com \
  --figma <url> \
  --docs ./brand/ \
  --screenshots ./captures/ \
  --dest .agents/skills/acme-brand
```

## Update-In-Place Behavior

If the target skill already exists, v1 should update it in place instead of generating a versioned sibling directory.

Required behavior:

- load the previous report and prior generated files when available
- compare previous model decisions to new evidence
- overwrite current bundle files with the new synthesis
- write `report/changes.md` summarizing additions, removals, confidence shifts, and resolved or new conflicts

Git history remains the durable version trail.

## Validation and Review Loop

Validation must run at three levels.

### 1. Source Validation

Check:
- source accessibility
- source type recognition
- stale or low-coverage warnings
- missing expected metadata

### 2. Brand Model Validation

Check:
- core sections are present
- each profile has enough guidance to be usable
- unresolved conflicts are surfaced
- confidence is attached at section and rule level

### 3. Output Validation

Check:
- bundle structure is complete
- `SKILL.md` references correct internal files
- Markdown and JSON reports describe the same decisions
- `changes.md` matches the actual update delta

### Human Review Summary

Every run should summarize for the reviewer:

- overall confidence
- top conflicts
- top inferred rules
- most valuable missing sources to improve fidelity

## Success Criteria for V1

V1 is successful when:

- it accepts flexible source sets without collapsing into undefined behavior
- it produces a usable normalized brand model
- it renders `core + profiles + reports` consistently
- it updates an existing brand skill in place
- it clearly explains evidence, confidence, and conflict handling
- reviewers describe the generated skill as recognizably brand-specific rather than generic AI synthesis

## Open Implementation Constraints

These are design constraints to carry into planning, not unresolved product questions:

- source adapters should be extensible without changing the renderer contract
- the renderer should consume only the normalized model
- reports must not contain invented certainty
- profile count is fixed in v1 to `design-system`, `marketing`, `product-ui`, and `dashboard`

## Recommended Next Step

Create the implementation plan around four tracks:

1. source ingestion and evidence extraction
2. normalized brand model and conflict engine
3. bundle and report rendering
4. update-in-place diffing and validation
