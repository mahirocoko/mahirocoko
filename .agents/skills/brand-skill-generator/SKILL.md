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

## Workflow

1. Gather available brand sources
2. Run `inspect` first when source quality is unclear
3. Review validation issues, missing-source suggestions, and planned files
4. Run `generate` or `refresh`
5. Review the generated reports before applying the skill broadly

## Current Phase

The current implementation is in Phase 1.

What works now:

- CLI entrypoint
- source inventory scaffolding
- validation gates
- normalized brand model scaffold
- planned output structure

What lands in later phases:

- real source fetching and parsing
- real evidence extraction
- weighted synthesis
- real bundle rendering
- update-in-place diffing

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
