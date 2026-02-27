# Plan: HRM Frontend Setup Standardization

## Background

Integrated Lingui i18n into HRM with Thai as source language. Established the pattern that `t` macro uses `DEFAULT_LANG`, and constants don't need translation. Updated frontend skill with comprehensive i18n documentation.

## Pending from Last Session

- [ ] Add language switcher UI to HRM
- [ ] Review HRM against frontend skill standards
- [ ] Add remaining UI primitives if missing
- [ ] Setup test infrastructure (vitest config exists, need setup)
- [ ] Add route guard pattern for auth
- [ ] Verify size contract consistency across primitives

## Next Session Goals

**Focus**: Continue HRM frontend setup to match personal standards (not features)

1. **Audit against standards**
   - Run `/frontend rr` in HRM to check compliance
   - Review token-first styling (no direct palette colors)
   - Check size contract consistency across primitives

2. **Missing primitives check**
   - Review current `app/components/ui/` against needs
   - Add dialog, dropdown, select if missing
   - Ensure Base UI consistency

3. **Test infrastructure**
   - Create test/setup.ts if missing
   - Verify vitest.config.ts is correct
   - Add sample test pattern

4. **Root.tsx review**
   - Check links() pattern for fonts/favicon
   - Verify proper document structure

5. **Language switcher**
   - Create language switcher component
   - Wire to useSettingStore

## Reference

- Handoff: `ψ/inbox/handoff/2026-02-27_22-54_hrm-frontend-setup-standardization.md`
- HRM Repo: `/Users/mahiro/ghq/github.com/haabiz/haabiz-hrm-fe`
- Skill: `/frontend rr` for React Router patterns

## Scope Boundary

**In scope**: Setup, standards compliance, infrastructure
**Out of scope**: Feature implementation (attendance, leave, employee modules)
