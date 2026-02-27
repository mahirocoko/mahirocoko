# frontend skill

This skill outputs frontend coding conventions and implementation patterns from project docs, with a consistent section layout for onboarding.

## Overview

The skill reads:

1. `AGENTS.md` (primary source)
2. `resources/guide.md` (fallback source when `AGENTS.md` is unavailable)

`resources/guide.md` is the fallback source.

## When to use

- Onboarding new contributors/agents
- Aligning implementation to project conventions
- Quickly checking route/test/state patterns before coding

## How It Works

1. **Source selection**
   - Uses `AGENTS.md` as primary source
   - Falls back to `resources/guide.md` when `AGENTS.md` is unavailable

2. **Section rendering**
   - Renders stable sections in fixed order for predictable output

3. **Stack profile resolution**
   - Forced via args: `next`, `vite`, `rr`
   - Otherwise auto-detected from project files/dependencies
   - Appends stack-specific additions per section

   Detection reference: `resources/profiles/detect-rules.md`

4. **Focus mode**
   - Applies keyword-based line extraction when arguments are provided

5. **Runtime fallback**
   - Runs with Bun by default, supports Node + `tsx` fallback

## Usage

```bash
/frontend
/frontend route
/frontend test
/frontend state
/frontend style
/frontend patterns
/frontend verify
/frontend anti
/frontend i18n
/frontend next
/frontend vite
/frontend rr
```

See runnable prompt examples in `examples/README.md`.

## Practical Examples

Token-first (recommended default):

```text
/frontend style token
/frontend verify token
```

i18n (Lingui patterns):

```text
/frontend i18n
/frontend i18n lingui
/frontend rr i18n
```

React Router assets (fonts/favicon via root links):

```text
/frontend rr route
```

Cleanup after deleting routes/modules:

```text
/frontend verify route
```

Vite plugin/type conflict triage:

```text
/frontend verify vite
```

Intent-driven usage (what you asked for):

```text
/frontend rr "ช่วย init โปรเจคตามนี้หน่อย"
/frontend rr guide "ช่วย setup project frontend ตามนี้หน่อย"
```

Recommended execution style (2-step):

```text
/frontend rr guide
ช่วย setup project frontend ตามนี้หน่อย: [requirements]
```

Reason: first command locks conventions, second message executes implementation against those conventions.

## Prompt Presets

Copy-paste ready commands:

```text
# INIT (React Router + token-first)
/frontend rr guide "ช่วยวางโครง init frontend project" --context "token-first, shadcn new-york, root links() สำหรับ font/favicon, provider/query boundary"

# SETUP โครงพร้อมเริ่มทำงาน
/frontend rr patterns "ช่วย setup โครงโปรเจกต์ให้เริ่ม implement ได้ทันที" --context "app/root.tsx, app/routes, app/providers, app/components/ui, test/setup.ts"

# IMPLEMENT หน้า/ฟีเจอร์ใหม่
/frontend rr patterns "ช่วย implement หน้า login" --context "ใช้ semantic tokens เท่านั้น, ใช้ base ui primitives, รองรับ mobile"

# REVIEW ก่อน commit
/frontend rr verify "ช่วย review ชุดแก้นี้ก่อน commit" --context "ห้าม direct palette colors, เช็ก size contract ของ Button/Input, เช็ก stale imports"

# CLEANUP หลังลบ route/module
/frontend rr verify "ช่วยตรวจหลังลบ route/module" --context "ทำ reference sweep, test sweep, typecheck แล้วสรุปจุดเสี่ยง"

# FIX style inconsistency
/frontend style token "ช่วยแก้ความไม่สม่ำเสมอของ UI" --context "normalize spacing/height ที่ primitives ก่อน, หลีกเลี่ยง page-level override"

# FIX Vite type conflict
/frontend verify vite "ช่วย triage error vite plugin type mismatch" --context "เริ่มจาก pnpm why vite, ตรวจ dependency graph ก่อนแก้เวอร์ชัน"

# FAST checklist mode
/frontend rr verify "ขอ checklist สั้นๆ ก่อนส่ง PR" --context "token-first, route safety, tests, build gate"
```

## Arguments

- `style` - focus on code style conventions
- `navigation` or `route` - focus on navigation/screen organization
- `test` - focus on testing patterns and rules
- `state` or `data` - focus on state and data boundaries
- `patterns` - focus on implementation patterns/examples
- `i18n` - focus on Lingui i18n patterns and conventions
- `anti` - focus on anti-patterns
- `verify` - focus on verification cadence
- `next` - force Next.js stack profile additions
- `vite` - force Vite React TS stack profile additions
- `rr` - force React Router framework stack profile additions
- Any free-form text is also supported (substring search in source docs)

## Output Structure

- Code Style Guide
- Navigation and Screen Rules
- Testing Rules
- State and Data Rules
- Implementation Patterns
- Anti-Patterns

With an argument, the skill adds a `Focus` section with matching lines.

When a profile is forced or auto-detected, stack additions are appended per section.

## Runtime Compatibility

Primary runner:

```bash
bun scripts/main.ts "$ARGUMENTS"
```

Fallback runner:

```bash
npx tsx scripts/main.ts "$ARGUMENTS"
```

Package manager is not fixed by this skill. Use the package manager selected by each project.

## Maintenance Notes

- Keep `AGENTS.md` current; it is the source of truth
- Keep `resources/guide.md` generic and runtime-neutral
- Keep i18n conventions aligned to Lingui (`resources/i18n.md`)
- Keep supporting resource docs in sync (`resources/code-style.md`, `resources/testing.md`, etc.)
- Keep section headings identical across both docs

## Troubleshooting

- `AGENTS.md not found` in output: run the skill in a project folder that includes `AGENTS.md`
- Focus output too noisy: use narrower arguments like `style`, `test`, `state`, `patterns`
- Bun unavailable: run fallback `npx tsx scripts/main.ts "$ARGUMENTS"`
