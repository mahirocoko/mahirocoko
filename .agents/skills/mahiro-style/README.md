# mahiro-style skill

`/mahiro-style` is Mahiro's cross-repo code-shape doctrine.

This skill exists for work that is broader than a frontend stack guide. It helps AI match how Mahiro tends to structure code, split responsibilities, name things, preserve i18n, and review architecture drift.

## What this skill is for

Use it when you want AI to:

- refactor code to match Mahiro style
- review code for structure and naming drift
- decide what should be a route, component, constants module, service, or store
- preserve Lingui patterns when extracting config
- compare implementation choices against Mahiro's recurring repo habits

## What this skill is not

- not a replacement for local `AGENTS.md`
- not a linter
- not a frontend framework tutorial
- not a generic architecture manifesto detached from code

## Mental model

Think of `/mahiro-style` as loading Mahiro's code-shaping taste:

- files should have one job
- names should reflect domain meaning
- constants and i18n should be extraction-safe
- services, state, and UI should not bleed into each other
- code should look intentional, not improvised

## First rule

If the current repo has `AGENTS.md`, that file wins. This skill is the fallback doctrine and review lens.

## Recommended usage

```text
/mahiro-style "ช่วย review โค้ดนี้ว่าเป็น style ของฉันไหม"
/mahiro-style structure "ช่วยจัดโครง feature นี้ให้เป็นแบบของฉัน"
/mahiro-style i18n "ช่วยแยก constants โดยไม่พัง i18n"
/mahiro-style review "ช่วย list จุดที่ยังไม่เป็น style ของฉัน"
```

## Main lenses

- `code-style`
- `structure`
- `i18n`
- `boundaries`
- `review`
- `anti`

## Output shape

The skill should usually surface:

- Code Style Guide
- Structure Rules
- Constants and I18n Rules
- Services and State Rules
- Review Checklist
- Anti-Patterns

## Examples

See `examples/README.md` for concrete `Do / Avoid` examples covering:

- `interface` vs `type`
- route boundaries
- constants plus i18n
- naming
- shared UI boundaries
- services
- stores
- section order
- export style

## Maintenance rule

Keep this skill general enough to work across Mahiro repos, but specific enough to produce actionable code review advice.
