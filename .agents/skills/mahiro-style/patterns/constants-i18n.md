# Constants and I18n

## Intent

This page owns constants extraction with Lingui-safe posture, `msg`-based descriptors, and render-boundary translation responsibility.

Use it when the question is whether copy should stay in React, move into config, or be reshaped into translation-safe descriptors without making `msg`, `t`, and `<Trans>` responsibilities fuzzy.

## Render Boundary and Translation Responsibility

The component that renders UI text owns the final translation call.

- Extracted config can carry translation-safe descriptors such as `msg` values.
- Components and render boundaries call `i18n._(...)`, `t(...)`, or render `<Trans>` at the point where text becomes UI.
- Do not move user-facing copy into constants just to make a component shorter.
- Keep component-local copy in React when it is tightly coupled to JSX structure, interaction flow, conditional rendering, or nearby event intent.
- Use `msg` for extracted descriptors and shared config. Use `t` or `i18n._` inside components and hooks that already own a live translation context. Use `<Trans>` when the rendered output needs JSX composition, inline markup, or rich text.
- When a component already owns the UI text directly, prefer `const { t } = useLingui()` as the default posture before reaching for a broader extracted-config shape.

## Non-negotiable

- Follow repo-local doctrine first, then other repo-local instruction files, then established repo patterns, and only then use Mahiro fallback doctrine.
- Keep component-local copy in React when the wording is tightly bound to JSX layout, button flow, empty states, form help text, or conditional UI branches.
- Extract only data-like or reusable structures, such as nav items, route metadata, table column descriptors, status maps, and screen configuration that already wants a constants owner.
- Do not extract layout-local or component-local copy into `constants/` when the data is only consumed by one owner and stays easier to scan in place.
- When extracted config contains user-facing copy, store translation-safe descriptors such as `msg`, not plain source-locale strings with no Lingui path.
- Make the render boundary explicit. Constants define descriptors, renderers translate them.
- Do not extract copy only to reduce line count or make a file look tidier.
- Do not leave `msg` versus `t` versus `<Trans>` ambiguous in review comments or refactors. The rule is descriptor at definition, translation at render.

## Preference

- Prefer domain-owned constants files when a screen, layout, or module already shares the same labels across multiple renderers.
- Prefer component-local `t` usage when one component is the only renderer and the extracted constants would create a longer read path.
- Prefer `msg` in extracted config because it keeps Lingui extraction-safe while avoiding early translation outside render context.
- Prefer small translation helpers only when the repo already uses them and they keep responsibility clearer, not more abstract.
- Prefer translating as late as possible, near the component that decides badges, buttons, headings, and conditional copy.
- Prefer leaving one-off JSX copy in place when extraction would split one sentence across constants and component branches.

## Contextual

Repo-local posture decides the final shape.

- In `haabiz-hrm-fe`, the HRM console refactor showed the useful split clearly: extracted console config can store shared labels as `MessageDescriptor` values created with `msg`, while owner components such as `header.tsx`, `console-overview-screen.tsx`, and `sidebar.tsx` perform the final translation at the render boundary.
- That same review also showed the limit of extraction. Later layout cleanup moved header and sidebar copy back into the owning components because the extracted constants were not buying real reuse and made the read path worse.
- In the same repo, `const { t } = useLingui()` became the preferred owner-local posture for layout components when the copy stayed inside the component instead of traveling through shared descriptor config.
- Some repos may prefer `t(...)` from `useLingui`, others may use `i18n._(...)`, and some rich text cases need `<Trans>`. The stable rule is not one exact API everywhere. The stable rule is that extracted config holds descriptors, and rendering code performs the final translation call.
- If a repo already repeats a different but translation-safe pattern, keep the local winner. Mahiro fallback doctrine exists to resolve the gap, not to flatten working local conventions.

## Examples

Keep reusable route and nav metadata in constants with `msg`, then translate inside the component that renders it.

```ts
import type { MessageDescriptor } from '@lingui/core'
import { msg } from '@lingui/core/macro'

interface IConsoleRouteMeta {
  label: MessageDescriptor
  description: MessageDescriptor
}

const CONSOLE_ROUTE_META_MAP: Record<string, IConsoleRouteMeta> = {
  '/console': {
    label: msg`โต๊ะควบคุมงานบุคคล`,
    description: msg`สรุปคิวอนุมัติ งานเอกสาร และความเสี่ยงของทีม HRM เพื่อเริ่มวันจากมุมมองเดียว`,
  },
}
```

```tsx
import { useLingui } from '@lingui/react/macro'

const ConsoleLayoutHeader = () => {
  const { i18n } = useLingui()
  const currentRoute = CONSOLE_ROUTE_META_MAP['/console']

  return (
    <>
      <h1>{i18n._(currentRoute.label)}</h1>
      <p>{i18n._(currentRoute.description)}</p>
    </>
  )
}
```

Keep JSX-bound copy in React when extraction would separate wording from the branch or markup that gives it meaning.

```tsx
import { Trans, useLingui } from '@lingui/react/macro'

const EmptyState = ({ isFiltered }: { isFiltered: boolean }) => {
  const { t } = useLingui()

  if (isFiltered) {
    return <p>{t`No employees match this filter.`}</p>
  }

  return (
    <p>
      <Trans>
        Start by inviting your first teammate. You can add profile details later.
      </Trans>
    </p>
  )
}
```

Good review call from the HRM console refactor:

- `msg` belongs in extracted console config such as route meta, sidebar sections, badges, metrics, and checklist items.
- `i18n._(...)` belongs in owner render files such as `header.tsx`, `console-overview-screen.tsx`, and `sidebar.tsx` because those files render the final UI.
- Copy that only exists to support one JSX branch should stay in the component unless there is a stronger domain-sharing reason to extract it.
- If the console layout child owns the only rendering site, moving that child's copy back into the child with `t` is often clearer than keeping a detached constants file.

## Anti-Examples

Do not extract plain strings into config with no Lingui-safe descriptor type.

```ts
const consoleHeaderActions = [
  { href: '/console/approvals', label: 'Open approvals' },
  { href: '/console/employees', label: 'Employee directory' },
]
```

Do not translate too early in constants or outside the render owner.

```ts
import { i18n } from '@/i18n'

const consoleHeaderActions = [
  { href: '/console/approvals', label: i18n._('Open approvals') },
]
```

Do not extract copy just to shrink the component when the text is branch-specific and JSX-bound.

```ts
const EMPTY_STATE_COPY = {
  filtered: 'No employees match this filter.',
  default: 'Start by inviting your first teammate.',
}
```

```tsx
<p>{isFiltered ? t(EMPTY_STATE_COPY.filtered) : t(EMPTY_STATE_COPY.default)}</p>
```

That split saves almost nothing, weakens local readability, and hides that the component still owns the final UI wording.
