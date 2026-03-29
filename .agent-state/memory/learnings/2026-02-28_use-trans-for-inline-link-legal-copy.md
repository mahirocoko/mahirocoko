---
title: Use Trans for inline legal copy with links
tags: [lingui, i18n, trans, links, login, shadcn]
created: 2026-02-28
source: rrr: mahirocoko
---

# Use Trans for inline legal copy with links

When a sentence contains inline links (for example, Terms and Privacy in login footers), prefer a single `<Trans>` message over multiple `t` fragments.

Why this pattern is better:

- Keeps translation context as one semantic sentence
- Preserves natural word order in target languages
- Avoids awkward split-message catalog entries (`"and"`, isolated phrases)
- Reduces translator ambiguity for link placement

Recommended pattern:

```tsx
<FieldDescription>
  <Trans>
    By signing in, you agree to <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
  </Trans>
</FieldDescription>
```

Rule of thumb:

- `t` macro for short, isolated strings
- `<Trans>` for rich text or inline elements
