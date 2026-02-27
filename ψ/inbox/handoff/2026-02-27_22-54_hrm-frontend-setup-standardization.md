# Handoff: HRM Frontend Setup Standardization

**Date**: 2026-02-27 22:54
**Context**: 95%

## What We Did

- Integrated Lingui i18n into HRM with Thai as source language
- Established pattern: `t` macro uses `DEFAULT_LANG`, constants don't translate
- Updated frontend skill with comprehensive i18n.md documentation
- Committed HRM (867639b) and skill updates (8c2a7fe)
- Synced Lingui pattern to Oracle

## HRM Current State

**Repo**: `/Users/mahiro/ghq/github.com/haabiz/haabiz-hrm-fe`
**Branch**: `main`
**Last commit**: `867639b feat: ✨ Add Lingui i18n with Thai as source language`

**Structure**:
```
app/
├── components/ui/     # shadcn primitives (button, card, input, etc.)
├── constants/config.ts    # DEFAULT_LANG, SUPPORTED_LANGUAGES, APP_NAME
├── libs/lingui/      # config.ts, index.ts (loadCatalog)
├── locales/          # th.po, en.po (*.js gitignored)
├── providers/page-provider.tsx  # QueryClientProvider + I18nProvider
├── routes/_index.tsx # Login page with i18n
├── stores/setting/   # lang state with zustand persist
├── styles/globals.css
└── utils/react-query/
```

**Tech Stack**:
- React Router Framework (SPA)
- TanStack Query + Zustand
- Base UI primitives
- Tailwind v4 + shadcn-style
- Lingui i18n (th source, en translation)

## Pending

- [ ] Add language switcher UI to HRM
- [ ] Review HRM against frontend skill standards
- [ ] Add remaining UI primitives if missing
- [ ] Setup test infrastructure (vitest config exists, need setup)
- [ ] Add route guard pattern for auth
- [ ] Verify size contract consistency across primitives

## Next Session

**Focus**: Continue HRM frontend setup to match personal standards

1. Run `/frontend rr` in HRM to audit against standards
2. Check for missing primitives (dialog, dropdown, etc.)
3. Verify token-first styling (no direct palette colors)
4. Add test setup file if missing
5. Review root.tsx for proper links() pattern (fonts/favicon)
6. Add language switcher component

## Key Files

**HRM**:
- `app/routes/_index.tsx` — Login page (reference for patterns)
- `app/providers/page-provider.tsx` — Provider composition
- `app/constants/config.ts` — App constants
- `app/libs/lingui/` — i18n utilities
- `app/stores/setting/` — Language state

**Skill**:
- `.claude/skills/frontend/resources/i18n.md` — Lingui patterns
- `.claude/skills/frontend/resources/implementation-patterns.md` — Code patterns

## Notes

- Feature implementation deferred — focus on setup/standards first
- jit-flow is reference implementation for Haabiz patterns
- Thai is source language (`DEFAULT_LANG = 'th'`)
