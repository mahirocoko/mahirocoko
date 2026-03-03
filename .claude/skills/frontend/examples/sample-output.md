# Sample Output Shape

```markdown
# Frontend Guide

Source: AGENTS.md

## Stack Profile
- Selected: react-router-framework (auto-detected)

## Code Style Guide
- Non-negotiable: ...
- Preference: ...
- Contextual: ...

### Stack Additions (react-router-framework)
- ...

## Navigation and Screen Rules
- Non-negotiable: ...
- Preference: ...
- Contextual: ...

### Stack Additions (react-router-framework)
- ...

## Testing Rules
- Non-negotiable: ...
- Preference: ...
- Contextual: ...

### Stack Additions (react-router-framework)
- ...

## State and Data Rules
- Non-negotiable: ...
- Preference: ...
- Contextual: ...

### Stack Additions (react-router-framework)
- ...

## Implementation Patterns
- ### Route Pattern (...)
- ### Service Pattern (...)
- ### Store Pattern (...)
- ### Provider Composition Pattern (...)

### Stack Additions (react-router-framework)
- ...

## Anti-Patterns
- Non-negotiable: ...
- Preference: ...

### Stack Additions (react-router-framework)
- ...
```

## Example Response - `/frontend rr "ช่วย init โปรเจคตามนี้หน่อย"`

```markdown
# Frontend Guide

Source: AGENTS.md

## Stack Profile
- Selected: react-router-framework (forced)

## Code Style Guide
- Non-negotiable: use semantic design tokens (`bg-background`, `text-foreground`, `border-border`)
- Preference: route pages use explicit `const Page = ...; export default Page` when aligned with project snippets/templates

## Navigation and Screen Rules
- Keep route modules in `app/routes/`
- Keep document assets in `app/root.tsx` via `links()` + `<Links />`

## Verification Cadence
- Run `lint + format + typecheck + test`
- If route/build config changed, run `build`

## Focus
- matched: init, setup project, route, token, verify
```

## Example Response - `/frontend rr guide "ช่วย setup project frontend ตามนี้หน่อย"`

```markdown
# Frontend Guide

Source: AGENTS.md

## Stack Profile
- Selected: react-router-framework (forced)

## Implementation Patterns
- Root bootstrap via `app/root.tsx`
- Provider composition in `app/providers/`
- Route orchestration in `app/routes/`

## Suggested Setup Checklist
1. Initialize base routes and root layout
2. Add provider barrel and query client utility
3. Add token-first UI primitives
4. Add test setup outside route discovery paths
5. Run quality gate and fix issues before feature work
```

## Example Response - `/frontend rr i18n`

```markdown
# Frontend Guide

Source: AGENTS.md

## Stack Profile
- Selected: react-router-framework (forced)

## i18n (Lingui)
- Source language = DEFAULT_LANG — if `DEFAULT_LANG = 'th'`, use Thai in `t` macro
- Constants like APP_NAME don't need translation
- Use `useLingui()` + `t` for plain strings
- Use `Trans` for markup-containing strings

### Folder Structure
```text
app/
  constants/config.ts     # DEFAULT_LANG, APP_NAME
  libs/lingui/            # config.ts, index.ts (loadCatalog)
  locales/                # *.po (track), *.js (gitignore)
  stores/setting/         # lang state with persist
```

### Example
```tsx
// DEFAULT_LANG = 'th' → use Thai
const { t } = useLingui()
return <h1>{t`เข้าสู่ระบบ`}</h1>

// Constants don't translate
import { APP_NAME } from '@/constants/config'
return <p>{APP_NAME}</p>
```

## Focus
- matched: i18n, lingui, locale, translation, source language
```
