---
title: Base UI uses data-checked, Radix uses data-state for checkbox styling
tags: [base-ui, radix-ui, shadcn, tailwind, checkbox, styling]
created: 2026-02-28
source: rrr: mahirocoko
---

# Base UI uses data-checked, Radix uses data-state for checkbox styling

When building checkbox components with shadcn/ui styling, the Tailwind variant syntax differs between Base UI and Radix UI:

| Library  | Attribute on checked state | Tailwind syntax        |
| -------- | -------------------------- | ---------------------- |
| Radix UI | `data-state="checked"`       | `data-[state=checked]:`  |
| Base UI  | `data-checked` (boolean)   | `data-checked:`          |

shadcn's `shadcn/tailwind.css` includes custom variants that support both:

```css
@custom-variant data-checked {
  &:where([data-state="checked"]),    /* Radix */
  &:where([data-checked]:not([data-checked="false"])) {  /* Base UI */
    @slot;
  }
}
```

**Key insight**: Always check `shadcn/tailwind.css` for available custom variants before assuming syntax. The file documents all supported state variants.

**Reference**: shadcn/ui repo at `/Users/mahiro/ghq/github.com/shadcn-ui/ui`
- Base UI patterns: `apps/v4/registry/bases/base/ui/`
- Radix patterns: `apps/v4/registry/new-york-v4/ui/`
