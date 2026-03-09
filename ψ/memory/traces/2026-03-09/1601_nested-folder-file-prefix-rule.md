---
query: "เหมือนเคยบอกเรื่อง prefix file name หาก folder /xxx ตัว xxx- ไม่ต้องมี"
target: "mahirocoko"
mode: deep
timestamp: 2026-03-09 16:01
---

# Trace: nested-folder file prefix rule

**Target**: mahirocoko
**Mode**: deep
**Time**: 2026-03-09 16:01

## Oracle Results

Oracle search did not return direct high-signal matches for this exact naming rule. The useful evidence came from local memory, doctrine files, git history, and external repository precedent.

## Files Found

### Explicit local doctrine

- `.agents/skills/mahiro-style/patterns/naming.md` - canonical rule now says folder context can shorten file names and explicitly flags repeated folder + file domain words as an anti-pattern
- `ψ/memory/learnings/2026-03-09_mahiro-style-doctrine-refinement-through-console-layout-review.md` - direct wording of the rule in learning form
- `ψ/memory/retrospectives/2026-03/09/14.55_mahiro-style-doctrine-refinement-through-console-layout-review.md` - retrospective record that the rule was formalized during live console review

### Earlier contrast / pre-rule artifacts

- `ψ/memory/retrospectives/2026-03/08/16.50_console-refactor-and-mahiro-style.md` - earlier console review context, but no explicit anti-prefix rule found
- `ψ/inbox/handoff/2026-03-08_16-49_console-refactor-and-mahiro-style-follow-up.md` - still references `console-layout-header.tsx`, indicating the shorter-file-name rule had not yet been codified there

### Repo pattern evidence

- `ψ/incubate/haabiz/haabiz-hrm-fe/app/components/layouts/console/header.tsx` - actual file path that matches the refined rule
- `ψ/incubate/haabiz/haabiz-hrm-fe/app/components/layouts/console/header.tsx` exports `ConsoleLayoutHeader`, showing the path/export split in practice
- `ψ/incubate/haabiz/haabiz-hrm-fe/app/routes/console.tsx` imports from `@/components/layouts/console/header`

## Git History

Most relevant local commits:

- `499dfb7` - `docs: 📝 refine mahiro-style guidance`
- `4ba4563` - `rrr: deep analysis - mahiro-style-doctrine-refinement`
- `fdcdb80` - `chore: 🔧 consolidate mahiro-style skill links`
- `3878cac` - major `mahiro-style` restructure into foundations/patterns

Key timing conclusion: the exact file-prefix-drop rule appears to have been explicitly formalized in the `499dfb7` refinement cycle on 2026-03-09, not earlier.

## GitHub Issues/PRs

None found that are directly relevant in this repo for this naming rule.

## Cross-Repo Matches

External precedent mostly supports the local rule for route modules and feature-local files, but not as a universal rule for shared library entrypoints.

### Supports the rule

- **Next.js App Router**: folders define URL segments, while filenames stay generic like `page`, `layout`, `loading`, `error`, and colocated folders use names like `app/blog/_components/Post.tsx` and `app/blog/_lib/data.ts`
- **SvelteKit**: route folders carry the meaning and files are intentionally generic, such as `+page.svelte` and `+layout.svelte`
- **Nuxt**: pages rely on folder-driven route meaning with files like `pages/index.vue`, `pages/posts/[id].vue`, and nested `index.vue` / `foo.vue`

### Weakens the rule if over-applied

- **Radix UI primitives**: reusable library modules often keep explicit filenames like `dialog.tsx` and `alert-dialog.tsx` even inside matching folders, because the file itself acts as a public artifact boundary

Scope recommendation from external evidence:

- Good fit: route modules, route-local helpers, nested feature folders, and local/private component groups
- Weaker fit: shared/public library modules where the filename itself is part of the public API surface

## Oracle Memory

Most relevant local memory findings:

- `ψ/memory/learnings/2026-03-09_mahiro-style-doctrine-refinement-through-console-layout-review.md:25` says filenames can drop redundant prefixes (`header.tsx`, `sidebar.tsx`) because the path already carries the domain
- `ψ/memory/learnings/2026-03-09_mahiro-style-doctrine-refinement-through-console-layout-review.md:57` says nested feature folders should prefer shorter filenames and explicit exported component names
- `ψ/memory/retrospectives/2026-03/09/14.55_mahiro-style-doctrine-refinement-through-console-layout-review.md:82` says nested-folder naming needs a two-level rule: shorter file names because the path already carries context, but explicit exported component names where searchability still matters

## Summary

Verdict:

1. **Yes, this rule is real doctrine now.** It is explicitly written in `mahiro-style` and backed by a learning plus a retrospective.
2. **It does not appear to have been explicitly written before 2026-03-09.** Earlier artifacts still used names like `console-layout-header.tsx` and do not state the anti-prefix rule directly.
3. **The correct shape is scoped, not absolute.** In nested domain-revealing folders, the path can carry the domain so the file name can often be shorter; exported component names can stay explicit for searchability.
4. **Do not universalize it to public/shared libraries.** External precedent suggests that reusable package entrypoints often keep explicit filenames intentionally.

Practical local rule:

- In folders like `app/components/layouts/console/`, prefer `header.tsx`, `sidebar.tsx`, `main-nav.tsx`, `user-menu.tsx`
- Keep exports explicit where useful, such as `ConsoleLayoutHeader`
- Avoid redundant pairs like `console/console-layout-header.tsx` when the folder already provides the domain context
