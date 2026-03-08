# constants plus i18n

## Goal

Extract config without breaking Lingui posture.

## Do

Keep i18n-bearing constants in a constants module and preserve `msg`.

```ts
import { msg } from '@lingui/core/macro'

const approvalNavItems = [
  {
    key: 'overview',
    label: msg`ภาพรวม`,
    href: '/console',
  },
  {
    key: 'queue',
    label: msg`คิวอนุมัติ`,
    href: '/console/approvals',
  },
]

export { approvalNavItems }
```

Then translate where the repo normally renders labels.

```tsx
import { useLingui } from '@lingui/react/macro'

const ApprovalNav = () => {
  const { t } = useLingui()

  return approvalNavItems.map((item) => <span key={item.key}>{t(item.label)}</span>)
}
```

## Avoid

Moving strings into plain config objects with no translation path.

```ts
const approvalNavItems = [
  {
    key: 'overview',
    label: 'ภาพรวม',
  },
  {
    key: 'queue',
    label: 'คิวอนุมัติ',
  },
]
```

Or inventing a heavy abstraction before checking whether the repo already uses constants modules.

## Why

- extracted config stays reusable
- translation extraction remains intact
- structure gets cleaner without i18n regressions
