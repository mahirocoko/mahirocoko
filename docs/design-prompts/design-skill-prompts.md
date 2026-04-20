# design-skill-prompts.json

`design-skill-prompts.json` is the repo's reusable design skill-prompt bundle.

It is a JSON array of prompt entries. The current rebuilt file contains 56 unique items.

## Entry Shape

Each item follows this slim schema:

```json
{
  "id": "css-border-gradient",
  "label": "Border Gradients",
  "description": "Apply subtle gradient-border treatments for premium surfaces.",
  "prompt_lines": [
    "- Border Gradients: Apply subtle gradient-border treatments for premium surfaces."
  ],
  "tags": ["style"]
}
```

## Field Meaning

- `id` - stable machine-facing identifier for the prompt entry
- `label` - short human-facing name
- `description` - one-line summary of the prompt's purpose
- `prompt_lines` - the actual prompt content, stored as line fragments
- `tags` - loose categorization such as `style`, `layout`, `animation`, `webgl`, or `design system`

## What It Contains

This bundle acts like a library of reusable prompt fragments for design and implementation direction.

The entries cover areas such as:

- layout systems
- visual style systems
- border and shadow treatments
- animation patterns
- WebGL and Three.js directions
- framed technical UI motifs
- asset and image sourcing guidance

Some entries are intentionally short one-liners. Others are long-form prompt blocks with:

- scope definitions
- visual target descriptions
- implementation guidance
- tuning knobs
- explicit avoid lists
- external reference URLs

## Current Repo-Specific Notes

The current file was rebuilt into a slim schema so it stays focused on reusable design prompt data rather than extra source metadata.

The present maintenance rules are:

- keep every entry valid JSON
- keep `id`, `label`, `description`, `prompt_lines`, and `tags` on each item
- keep `id` values unique across the array
- if a prompt entry would otherwise have an empty `prompt_lines`, provide a fallback one-line prompt using the `label` and `description`

Example fallback shape:

```text
- Border Gradients: Apply subtle gradient-border treatments for premium surfaces.
```

## Why This File Matters

Unlike a single large system prompt, this file is modular. Small edits can change how a downstream design prompt library composes style direction, implementation hints, or pattern-specific instructions.

That makes it useful, but also easy to destabilize.

## Maintenance Notes

When editing this file:

- validate JSON after every structural change
- check for duplicate `id` values
- preserve the slim schema unless the runtime contract changes
- treat external URLs inside prompt text as content that may need occasional review
- avoid rewriting the tone of many entries at once unless that broader behavior change is intentional

## Caveat

I found no local generator or doc that formally declares this file to be generated output. For now, it should be treated as a curated design prompt asset with documented structure.
