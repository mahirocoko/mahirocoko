# Learning: Frontend Skill Structure Works Best as Contracted Layers

## Pattern

For reusable project skills, treat folder structure as an explicit contract:

- `SKILL.md` defines intent, workflow, and execution constraints.
- `scripts/` contains deterministic runtime behavior.
- `resources/` is the canonical fallback knowledge source.
- `examples/` shows practical invocation and output shape.

This layering reduced ambiguity and made updates easier to apply without breaking behavior.

## Why It Worked

- Clear ownership boundaries: behavior vs guidance vs demonstrations.
- Easier maintenance: moving from `docs/` to `resources/` became mechanical once the contract was explicit.
- Better onboarding: contributors can start from examples and then drill into resources.

## Watch-outs

- Avoid broad structural edits outside the requested scope (for example template-wide changes when request targets one skill).
- Keep fallback logic singular and obvious (primary source + one fallback path).
- Keep arguments documentation synchronized with script behavior to prevent drift.

## Reusable Rule

When creating or refining skills, ship these four together: contract, runtime, references, examples.
