# Frontend Skill Examples

Prompt examples for `/frontend`.

## Natural prompt first

```text
/frontend "ช่วย refactor ให้เป็นในแบบของฉัน"
/frontend "ช่วย setup หน้า login ตาม style ของฉัน"
/frontend "ช่วย review frontend ชุดนี้แบบของฉัน"
/frontend "ช่วยทำ frontend งานนี้ให้เป็นในแบบของฉัน"
```

## Fast start

```text
/frontend
/frontend rr
/frontend next
/frontend vite
```

## Core lenses

```text
/frontend style
/frontend route
/frontend test
/frontend state
/frontend patterns
/frontend anti
/frontend verify
/frontend i18n
```

## Common mixed lenses

```text
/frontend rr route test
/frontend rr patterns verify
/frontend style verify
/frontend state patterns
/frontend i18n verify
```

## Implementation prompts

```text
/frontend "ช่วย implement feature ใหม่ตาม style ของฉัน"
```

```text
/frontend rr patterns
Implement a dashboard page with filters, cards, and create action. Keep route orchestration in the route module and data access in services.
```

```text
/frontend rr patterns state
Implement an orders feature with list, detail, and create flow. Separate server-state from UI-state and keep providers centralized.
```

```text
/frontend next patterns
Build a settings page in Mahiro style. Keep shared UI reusable and avoid leaking page logic into primitives.
```

```text
/frontend vite patterns style
Implement a login page with semantic tokens, shared form primitives, and clean file structure.
```

## Refactor prompts

```text
/frontend "ช่วย refactor โค้ดนี้ให้เป็นในแบบของฉัน"
```

```text
/frontend rr route state test anti
Refactor this module but keep route boundaries, provider structure, and query flow stable.
```

```text
/frontend patterns anti
Refactor this feature to remove duplicated logic and push transport code down into services.
```

```text
/frontend style patterns
Refactor this UI so spacing and height consistency are solved in primitives first, not page overrides.
```

## Review prompts

```text
/frontend "ช่วย review frontend ชุดนี้แบบของฉัน"
```

```text
/frontend rr verify
Review this diff with focus on route safety, shared UI discipline, and token-first styling.
```

```text
/frontend verify anti
Review this feature before commit and call out architecture drift, direct palette usage, and misplaced business logic.
```

```text
/frontend next verify
Review this page with focus on client/server boundary and component organization.
```

```text
/frontend vite verify test
Review this feature for testing gaps, state boundary issues, and cleanup risk.
```

## i18n prompts

```text
/frontend "ช่วยดู i18n หน้านี้แบบของฉัน"
```

```text
/frontend i18n
Review this feature for Lingui usage and DEFAULT_LANG consistency.
```

```text
/frontend i18n verify
Check whether user-facing strings are using t or Trans correctly and whether constants stay untranslated.
```

```text
/frontend rr i18n
Implement this route with Lingui patterns and keep Thai source strings aligned with DEFAULT_LANG.
```

## Cleanup prompts

```text
/frontend "ช่วยตรวจหลังลบ route/module นี้แบบของฉัน"
```

```text
/frontend rr verify route
Check this route deletion for stale imports, redirect fallout, and missing test cleanup.
```

```text
/frontend verify
Review this cleanup PR for broken references, token drift, and missed build-sensitive changes.
```

## Setup prompts

```text
/frontend "ช่วยวางโครง init frontend project ตาม style ของฉัน"
```

```text
/frontend rr guide
ช่วยวางโครง init frontend project โดยมี app/root.tsx, app/routes, app/providers, test/setup.ts และ semantic tokens
```

```text
/frontend rr patterns
ช่วย setup โครงโปรเจกต์ที่พร้อม implement ต่อได้เลย โดยมี reusable ui primitives และ provider boundary ชัดเจน
```

```text
/frontend next guide
ช่วย setup project structure สำหรับ Next.js โดยยังรักษา Mahiro frontend doctrine เรื่อง shared ui, tokens, และ boundaries
```

## Natural language steering

```text
/frontend rr "token-first route review"
/frontend next "client server boundary review"
/frontend vite "clean feature slice setup"
/frontend "review this in Mahiro frontend style"
```

## Best two-step flow

```text
/frontend "ช่วย refactor โค้ดนี้ให้เป็นในแบบของฉัน"
```

Refined version:

```text
/frontend rr route state test
Refactor this route feature but keep shared UI reusable, tests outside route discovery, and services separate from page orchestration.
```

Start with natural language. Add stack and lenses only when you want tighter control.
