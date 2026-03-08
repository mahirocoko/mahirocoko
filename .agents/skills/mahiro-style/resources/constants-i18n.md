# Constants and I18n

## Main rule

Do not improve structure by breaking translation posture.

## Extraction-safe pattern

- If a repo already uses constants modules, follow that pattern
- If copy lives in extracted config, keep it compatible with Lingui flow
- Prefer existing repo conventions for `msg`, `useLingui`, and source locale handling

## What to watch for

- Plain string blobs moved out of components with no translation path
- Duplicated labels between nav config and route headers
- Route copy that becomes harder to translate after extraction

## Preferred shape

- constants hold structured values
- i18n-bearing values stay translation-safe
- rendering components are responsible for final `t(...)` or equivalent local usage when the repo pattern expects it

## Review prompts

- If I move this into constants, do I still preserve Lingui usage?
- Is there already a constants module in this repo that should own this?
- Am I inventing a new i18n abstraction when a simpler repo pattern already exists?
