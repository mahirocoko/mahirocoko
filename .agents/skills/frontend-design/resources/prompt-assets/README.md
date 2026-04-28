# Frontend Design Prompt Assets

These JSON files are the bundled runtime prompt assets for the `frontend-design` skill:

- `design-prompts.json` — shared baseline, general prompt keys, and direction prompt keys
- `design-skill-prompts.json` — reusable prompt fragments selected with `--prompt`

They are skill-owned so `frontend-design` can be copied into another workspace without depending on this repo's `docs/` tree.

Maintenance posture:

- Treat these files as curated prompt data, not generated output.
- Keep field names stable unless `scripts/main.ts` changes its runtime contract.
- Update validation fixtures when keys, counts, or important marker text changes.
- Keep reference examples and taste doctrine outside these JSON files; use `../brief-workflow.md` and `../reference-excerpts/` for that.
