# Lingui Source Language Pattern

**Date**: 2026-02-27
**Source**: rrr: mahirocoko

## Pattern

When using Lingui for i18n, the `t` macro wraps strings in the **default language** — not English by default.

```tsx
// config.ts
export const DEFAULT_LANG = 'th'  // This determines source language

// ✅ CORRECT - source matches DEFAULT_LANG
const { t } = useLingui()
return <h1>{t`เข้าสู่ระบบ`}</h1>

// ❌ WRONG - English source when default is Thai
return <h1>{t`Sign in`}</h1>
```

## Constants Don't Translate

Brand names, app names, proper nouns — use constants directly:

```tsx
import { APP_NAME } from '@/constants/config'
return <p>{APP_NAME}</p>  // No t` macro needed
```

## .po File Structure

When `DEFAULT_LANG = 'th'`:
- `th.po` — source language (msgid = Thai, msgstr = Thai)
- `en.po` — translation (msgid = Thai, msgstr = English)

## Key Insight

The `t` macro wraps what you **write in code**, not what you translate **from**. If your codebase uses Thai by default, write Thai in `t` — the `.po` files handle translations to other languages.
