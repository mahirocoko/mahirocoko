---
name: brand-skill-generator
description: Generate or refresh a brand-specific project skill from mixed sources such as websites, docs, screenshots, code references, and Figma links. Uses a local CLI to build source inventory, synthesize a normalized brand model, and render a project-local skill bundle plus reports.
---

# Brand Skill Generator

Create or refresh a single-brand skill bundle for this project.

This skill is the orchestration layer. It does not own synthesis logic itself. It delegates deterministic work to the local CLI under `.agents/skills/brand-skill-generator/cli/`.

## Use When

- You want to create a brand-specific skill from website, docs, screenshots, code, or Figma sources
- You want to refresh an existing brand skill in place
- You want to inspect source coverage, confidence posture, or planned outputs before rendering
- You want project-local brand synthesis instead of a generic style doctrine
- You want the system to identify missing source coverage and ask clarifying questions before execution

## Command Shape

Use the local CLI through the package script:

```bash
bun --cwd .agents/skills/brand-skill-generator run brand-skill <mode> --brand "<brand>" [sources...] [options]
```

Modes:

- `inspect`
- `generate`
- `refresh`
- `reconcile`

## Common Examples

Minimal inspect from a live website plus screenshots:

```bash
bun --cwd .agents/skills/brand-skill-generator run brand-skill inspect \
  --brand "Acme" \
  --website https://acme.com \
  --screenshots ./captures
```

Inspect a brand run before rendering:

```bash
bun --cwd .agents/skills/brand-skill-generator run brand-skill inspect \
  --brand "Acme" \
  --website https://acme.com \
  --docs ./brand \
  --screenshots ./captures \
  --code ./app
```

Generate a project-local brand skill bundle:

```bash
bun --cwd .agents/skills/brand-skill-generator run brand-skill generate \
  --brand "Acme" \
  --website https://acme.com \
  --docs ./brand \
  --screenshots ./captures \
  --code ./app \
  --dest .agents/skills/acme-brand
```

Inspect with JSON output for tooling:

```bash
bun --cwd .agents/skills/brand-skill-generator run brand-skill inspect \
  --brand "Acme" \
  --website https://acme.com \
  --docs ./brand \
  --json
```

Refresh an existing generated brand skill in place:

```bash
bun --cwd .agents/skills/brand-skill-generator run brand-skill refresh \
  --brand "Acme" \
  --website https://acme.com \
  --docs ./brand \
  --screenshots ./captures \
  --code ./app
```

## Current Input Model

This version is source-driven.

Supported inputs right now:

- `--brief`
- `--website`
- `--docs`
- `--screenshots`
- `--code`
- `--figma`
- per-source role flags such as `--website-role mood-reference`

Behavior in v2:

- the skill runs intake preflight first
- if source posture is incomplete, it should summarize what is known, what is missing, and what is ambiguous
- it should ask one clarifying question at a time
- websites must be classified before execution when their role is ambiguous
- a short brief can be turned into a temporary brand doc with `--write-brief-doc`
- mood-reference websites should not be treated as equivalent to brand truth

## Workflow

1. Gather available brand sources or a short brief
2. Run intake preflight and review known inputs, gaps, ambiguities, and the next question
3. Resolve missing brand identity, website roles, or brief-doc decisions
4. Run `inspect` first when source quality is unclear
5. Run `generate` or `refresh`
6. Review the generated reports before applying the skill broadly

## Current Phase

The current implementation is in Phase 3.

What works now:

- CLI entrypoint
- intake preflight with one-question-at-a-time next-question planning
- source inventory with real local scanning and website fetch support
- validation gates
- first-pass evidence extraction from source summaries and text samples
- weighted brand model synthesis with category-derived rules
- real bundle and report rendering during `generate` and `refresh`

What lands in later phases:

- deeper role-aware synthesis instead of filtering mood-reference websites out of engine execution
- stronger rule quality and brand inference
- richer update-in-place diffing

## Files

- CLI entrypoint: `.agents/skills/brand-skill-generator/cli/main.ts`
- Model contracts: `.agents/skills/brand-skill-generator/model/normalized-brand-model.ts`
- Source inventory: `.agents/skills/brand-skill-generator/sources/build-source-inventory.ts`
- Validation: `.agents/skills/brand-skill-generator/validation/validate-brand-skill-run.ts`

## Wrapper Script

You can also use the local wrapper script:

```bash
bun .agents/skills/brand-skill-generator/scripts/main.ts --help
```

Local skill package commands:

```bash
bun --cwd .agents/skills/brand-skill-generator install
bun --cwd .agents/skills/brand-skill-generator run typecheck
```
