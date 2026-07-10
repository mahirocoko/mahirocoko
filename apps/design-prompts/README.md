# design-prompts sandbox area

This area currently holds sandbox inputs and exploratory artifacts.

## Current posture

- `lab01/` is sandbox input only
- files here are not canonical prompt truth
- files here are not the validation harness for `frontend-design`

## Source of truth

- canonical prompt assets stay in `docs/design-prompts/`
- this repo no longer ships a project-local `.agents/` runtime
- canonical `frontend-design` now lives in the separate `mahiro-skills` repo and ships through its default bundle
- the historical compose scripts and fixtures were intentionally retired rather than kept as a second active skill source

## Notes

- keep this area for sandbox inputs, references, and exploratory artifacts
- do not treat `lab01/` as validated prompt canon
- treat old compose-oriented handoffs as historical/reference inputs, not executable local commands
