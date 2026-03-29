# Console employees route boundary and local i18n posture

When a console page is still small and mock-heavy, it does not automatically benefit from being hidden behind a `*Screen` wrapper. A route wrapper that only returns one extracted screen can become too thin to explain anything, which makes the boundary decorative instead of helpful. In that case, collapsing the page back into the route can be the clearer move.

For local console UI in this repo, `const { t } = useLingui()` is the stronger winner pattern than broad `i18n._(...)` usage across the file. UI-owned copy such as headings, placeholders, table headers, button labels, and computed status labels should use `t` near render. Mock data should stay data-shaped and should not be wrapped in translation calls when the fields are really names, positions, teams, or dates rather than UI labels.

The deeper lesson is procedural: once the user is testing code-shape judgment, do not widen the implementation scope just because adjacent cleanup is technically safe. Consistency is not permission.
