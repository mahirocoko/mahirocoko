# frontend skill

Mahiro frontend doctrine for React work.

This skill exists to make AI write and review frontend code in Mahiro's style. It is not a strict checker, not a linter replacement, and not a generic frontend best-practices pack. It is a reusable doctrine loader for how Mahiro structures React code, judges tradeoffs, and reviews implementation quality.

## What this skill is for

Use `/frontend` when you want AI to:

- write new React code in Mahiro style
- refactor without drifting into generic patterns
- review code with Mahiro's review lens
- load route, state, test, i18n, and token-first preferences before implementation
- adapt the same doctrine across `react-router`, `next`, or `vite`

Use this skill before asking for implementation when style consistency matters.

## What this skill is not

- not a deterministic verifier
- not a project bootstrap generator by itself
- not a generic ecosystem tutorial
- not a replacement for lint, typecheck, test, or build

The point is retrieval and steering. The AI loads the doctrine first, then applies it in the next prompt.

## Mental model

Think of `/frontend` as loading Mahiro's frontend operating system into context.

It carries:

- architecture taste
- naming and file organization rules
- review priorities
- preferred implementation patterns
- stack-specific adaptations

When the doctrine conflicts with project constraints, follow this order:

1. Existing project architecture boundaries
2. Mahiro non-negotiables
3. Mahiro preferences
4. Contextual stack adaptations

## How to use it

Default to natural language first.

These are all valid:

```text
/frontend "ช่วย refactor ให้เป็นในแบบของฉัน"
/frontend "ช่วย setup หน้า login ตาม style ของฉัน"
/frontend "ช่วย review frontend ชุดนี้แบบของฉัน"
```

This skill should understand those prompts as:

- load Mahiro doctrine
- infer the most relevant lens
- steer the next implementation or review toward Mahiro style

If you want more control, add stack or lens hints:

```text
/frontend rr "ช่วย refactor ให้เป็นในแบบของฉัน"
/frontend route verify "ช่วย review frontend ชุดนี้แบบของฉัน"
/frontend rr state patterns "ช่วย setup feature นี้ตาม style ของฉัน"
```

Think of it like this:

- natural prompt = default mode
- lenses = precision controls

## Quick start

If you are not sure what to run, start here:

```text
/frontend "ช่วยทำ frontend งานนี้ให้เป็นในแบบของฉัน"
```

If you want a plain doctrine dump:

```text
/frontend
```

If you know the stack:

```text
/frontend rr
/frontend next
/frontend vite
```

If you know the area:

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

## What "my style" means

When you say:

```text
/frontend "ช่วย refactor ให้เป็นในแบบของฉัน"
```

the skill should bias the AI toward these defaults:

- routes are page orchestration units, not dumping grounds
- shared UI stays reusable and does not absorb page-specific logic
- service boundaries stay explicit for transport and backend integration
- provider boundaries stay near app shell or page shell, not scattered everywhere
- server-state and UI-state are split intentionally
- semantic tokens come before direct palette classes
- naming, file structure, and section order stay disciplined
- review should catch architecture drift, token drift, stale imports, and weak boundaries

In short: clean orchestration, clear boundaries, token-first styling, and controlled complexity.

## Recommended workflows

### 1. Start a new feature

```text
/frontend "ช่วย implement feature ใหม่ตาม style ของฉัน"
```

More guided:

```text
/frontend rr patterns
Implement an orders page with list, filter, and create action. Keep route orchestration in the page, data access in services, and UI primitives reusable.
```

### 2. Refactor existing code

```text
/frontend "ช่วย refactor โค้ดนี้ให้เป็นในแบบของฉัน"
```

More guided:

```text
/frontend rr route state test anti
Refactor this module but keep route boundaries, provider structure, and existing query flow intact.
```

### 3. Review before commit

```text
/frontend "ช่วย review frontend ชุดนี้แบบของฉัน"
```

More guided:

```text
/frontend rr verify
Review this change with Mahiro's frontend lens. Focus on route safety, token usage, provider boundaries, and stale imports.
```

### 4. Fix UI inconsistency

```text
/frontend "ช่วยแก้ UI ให้เป็นในแบบของฉัน"
```

More guided:

```text
/frontend style token
Normalize the form controls in this screen. Fix spacing and sizing at the primitive level first.
```

### 5. Work on i18n

```text
/frontend "ช่วยดูเรื่อง i18n ให้เป็นในแบบของฉัน"
```

More guided:

```text
/frontend i18n
Update this feature to follow Lingui patterns and keep source strings aligned with DEFAULT_LANG.
```

## Common patterns

### Natural prompt first

```text
/frontend "ช่วย setup project frontend ตาม style ของฉัน"
/frontend "ช่วย refactor โค้ดนี้ให้เป็นในแบบของฉัน"
/frontend "ช่วย review frontend งานนี้แบบของฉัน"
```

Use this when you want the skill to infer the right emphasis on its own.

### Add stack when it matters

```text
/frontend rr "ช่วย refactor ให้เป็นในแบบของฉัน"
/frontend next "ช่วย review หน้า settings แบบของฉัน"
/frontend vite "ช่วย setup feature นี้ตาม style ของฉัน"
```

### Add lenses when you want tighter control

```text
/frontend route verify "ช่วย review frontend ชุดนี้แบบของฉัน"
/frontend state patterns "ช่วย refactor feature นี้ให้เป็นในแบบของฉัน"
/frontend i18n verify "ช่วยตรวจ i18n แบบของฉัน"
```

### Load doctrine with free-form steering

```text
/frontend rr "token-first route review"
/frontend next "review server/client boundary"
/frontend vite "setup clean feature slice structure"
/frontend "review this in Mahiro frontend style"
```

## Command reference

### Natural prompt

```text
/frontend "ช่วย xxx"
```

This is the default usage style. Use it when you want the AI to infer the right doctrine automatically.

### Full doctrine

```text
/frontend
```

Loads the full Mahiro frontend doctrine.

### Stack profile

```text
/frontend rr
/frontend next
/frontend vite
```

Locks stack-specific adaptations before implementation.

### Retrieval lenses

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

Each lens tells the AI which part of the doctrine to prioritize. Lenses are optional, not required.

### Mixed lenses

```text
/frontend rr route state test
/frontend rr patterns verify
/frontend next style i18n
```

Use mixed lenses when a task spans multiple concerns.

## Best usage style

The best usage style is usually:

1. Start with a natural prompt
2. Add stack only if it matters
3. Add lenses only if you want tighter control

Example:

```text
/frontend "ช่วย refactor โค้ดนี้ให้เป็นในแบบของฉัน"
```

Refined version:

```text
/frontend rr route test
Refactor this route module. Keep route discovery clean, tests outside route files, and shared UI reusable.
```

Start simple. Add precision only when needed.

## Practical examples

### Init a project

```text
/frontend "ช่วยวางโครง init frontend project ตาม style ของฉัน"
```

More guided:

```text
/frontend rr guide
ช่วยวางโครง init frontend project โดยมี app/root.tsx, app/routes, app/providers, test/setup.ts และใช้ token-first classes
```

### Setup a login page

```text
/frontend "ช่วย setup หน้า login ตาม style ของฉัน"
```

More guided:

```text
/frontend rr patterns
ช่วย implement หน้า login โดยใช้ semantic tokens, reusable form primitives, และแยก API call ไปที่ service
```

### Review a messy feature

```text
/frontend "ช่วย review feature นี้แบบของฉัน"
```

More guided:

```text
/frontend rr verify anti
ช่วย review feature นี้ก่อน commit โดยเน้น route boundary, direct color classes, และ logic ที่หลุดไปอยู่ใน shared components
```

### Clean up after deleting a route

```text
/frontend "ช่วยตรวจหลังลบ route/module นี้แบบของฉัน"
```

More guided:

```text
/frontend rr verify route
ช่วยตรวจหลังลบ route/module นี้ โดยดู stale imports, reference sweep, test fallout, และ redirect behavior
```

### Enforce i18n discipline

```text
/frontend "ช่วยดู i18n หน้านี้แบบของฉัน"
```

More guided:

```text
/frontend i18n verify
ช่วย review หน้านี้ว่ามี string ไหนที่ควรใช้ t หรือ Trans และมีจุดไหนหลุดจาก DEFAULT_LANG บ้าง
```

### Improve primitives first

```text
/frontend "ช่วยแก้ UI ให้เป็นในแบบของฉัน"
```

More guided:

```text
/frontend style patterns
ช่วยแก้ความไม่สม่ำเสมอของ UI โดยเริ่มจาก primitive components ก่อน แล้วค่อยดู page-level override
```

### Keep feature slice clean

```text
/frontend "ช่วยจัดโครง feature นี้ให้เป็นในแบบของฉัน"
```

More guided:

```text
/frontend patterns state
ช่วยจัดโครง feature orders ใหม่ให้แยก pages, services, hooks, components, types ชัดขึ้น
```

### Review a Next.js page

```text
/frontend "ช่วย review หน้า Next.js นี้แบบของฉัน"
```

More guided:

```text
/frontend next verify
Review this page with focus on client/server boundary, token usage, and shared UI discipline.
```

### Review a Vite React app

```text
/frontend "ช่วย review feature นี้แบบของฉัน"
```

More guided:

```text
/frontend vite verify
Review this feature for architecture drift, state boundary issues, and testing gaps.
```

## Output shape

Depending on the prompt, the skill can surface:

- Code Style Guide
- Navigation and Screen Rules
- Testing Rules
- State and Data Rules
- Implementation Patterns
- Anti-Patterns
- Verification Cadence
- I18n Rules
- Stack additions
- Focus hints for the current task

It also prints per-section source so the AI can tell project-local doctrine from fallback doctrine.

## Source model

This skill reads from:

1. `AGENTS.md`
2. `resources/guide.md`
3. `resources/i18n.md`
4. `resources/profiles/*.md`

Interpretation:

- `AGENTS.md` = project-local doctrine if available
- `resources/guide.md` = portable Mahiro baseline
- `resources/i18n.md` = dedicated i18n doctrine
- `profiles/*.md` = stack adaptations, not a replacement for the doctrine

## Runtime

Primary:

```bash
bun scripts/main.ts "$ARGUMENTS"
```

Fallback:

```bash
npx tsx scripts/main.ts "$ARGUMENTS"
```

## Writing good prompts after loading the skill

Good follow-up prompts usually say:

- what to build, refactor, or review
- which boundary must stay intact
- which Mahiro preference matters most

Examples:

```text
Implement this page in Mahiro style. Keep route orchestration in the route module and move all transport logic to services.
```

```text
Review this diff with Mahiro frontend lens. Focus on token-first styling, route safety, and provider/query boundaries.
```

```text
Refactor this feature but do not collapse shared UI into page-specific code.
```

## Known limits

- retrieval is still text-based, so very broad prompts can be noisy
- focus results are guidance, not proof of compliance
- wrong stack selection can pull in irrelevant adaptations
- this skill works best when followed by a plain-language implementation or review request

## Maintenance notes

- Keep `AGENTS.md` current when a project has local doctrine worth overriding
- Keep `resources/guide.md` portable and runtime-neutral
- Keep `resources/i18n.md` aligned with actual Lingui usage
- Keep section headings stable so retrieval stays predictable

## More examples

See [examples/README.md](/Users/mahiro/Git/me/mahirocoko/.agents/skills/frontend/examples/README.md) for additional prompt samples.
