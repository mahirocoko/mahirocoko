# design-prompts.json

`design-prompts.json` is the repo's general design prompt bundle.

It is a JSON object with three top-level keys:

- `directionSystemPrompts`
- `generalSystemPrompts`
- `generalSystemPrompt`

## What It Contains

### `directionSystemPrompts`

This section contains short directional modifiers such as:

- `animate`
- `change-texts`
- `prompt-remix`
- `remix-colors`
- `design-details`
- `explore-typography`
- `change-style`

These act like focused creative nudges. They are compact instructions that steer output style or behavior without redefining the whole page prompt.

### `generalSystemPrompts`

This section contains long-form page or output-type prompts such as:

- `hero`
- `login`
- `footer`
- `mobile`
- `pricing`
- `branding`
- `features`
- `slide-deck`
- `testimonials`
- `instagram-slide`
- `faq`
- `motion-design`
- `webgl`
- `threejs`
- `button`
- `background`
- `landing-page`

These prompts define the main task framing for a UI or visual generation run. They usually include:

- output constraints
- scope boundaries
- information architecture guidance
- styling and implementation expectations

### `generalSystemPrompt`

This is the shared baseline instruction block. It contains the recurring cross-cutting constraints that also appear at the start of many entries in `generalSystemPrompts`.

## Practical Interpretation

Treat this file as the broad design prompt library for visual and interface generation.

In practice, the structure suggests a layered prompt model:

1. a shared baseline in `generalSystemPrompt`
2. a page or output-type prompt from `generalSystemPrompts`
3. optional directional refinements from `directionSystemPrompts`

This interpretation matches the file contents, but the repo does not currently include a local doc that formally specifies the runtime composition order.

OpenCode may be one environment that consumes or works with these prompts, but the prompt content itself is broader than product-specific runtime behavior. The file reads primarily as a library of design-direction instructions.

## Maintenance Notes

When editing this file:

- keep the top-level keys stable
- preserve plain JSON object structure
- avoid accidental drift between `generalSystemPrompt` and repeated leading guidance inside `generalSystemPrompts`
- be careful with wording changes because these prompts are long, high-leverage instruction blocks
- prefer additive changes over silent semantic rewrites when possible

## Caveat

I found no local script or doc that proves this file is generated. Until that changes, document and edit it as a curated design prompt asset.
