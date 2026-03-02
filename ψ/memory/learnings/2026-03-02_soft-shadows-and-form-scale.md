# Soft Shadow Tokens and Form Control Scale Alignment

**Date**: 2026-03-02
**Source**: rrr: mahirocoko

## Pattern

### Multi-layer Soft Shadows

For elevated surfaces (cards, dialogs, popovers), use multi-layer shadows instead of Tailwind defaults:

```css
/* Light mode - subtle, modern SaaS look */
--shadow-soft: 0 4px 20px -2px rgba(0,0,0,0.05), 0 2px 8px -2px rgba(0,0,0,0.04);
--shadow-soft-md: 0 8px 30px -4px rgba(0,0,0,0.08), 0 4px 12px -2px rgba(0,0,0,0.04);
--shadow-soft-lg: 0 16px 40px -8px rgba(0,0,0,0.10), 0 8px 16px -4px rgba(0,0,0,0.05);

/* Dark mode - 3-5x opacity for visibility */
--shadow-soft: 0 4px 20px -2px rgba(0,0,0,0.30), 0 2px 8px -2px rgba(0,0,0,0.20);
```

Two layers create natural depth: large diffuse shadow for ambient lift, small sharp shadow for edge definition.

### Form Control Scale Alignment

| Component | Default | Disabled Style |
|-----------|---------|----------------|
| Input | `h-10` (40px) | `opacity-50` |
| Button | `h-10` (40px) | `opacity-50` |
| Checkbox | `size-5` (20px) | `bg-muted opacity-60` |

Checkbox sized to visually align with h-10 inputs. Disabled states should have distinct visual identity (`bg-muted`) not just opacity reduction.

## When to Apply

- Design system token setup
- Form control consistency audits
- Dark mode shadow visibility issues

## Anti-Pattern

- Using Tailwind default `shadow-sm/md/lg` which don't account for dark mode
- Checkbox sized in isolation without considering input/button height
- Disabled states with only opacity (looks broken vs intentionally disabled)
