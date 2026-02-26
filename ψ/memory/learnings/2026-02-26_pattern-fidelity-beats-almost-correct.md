# Learning: Pattern Fidelity Beats "Almost Correct"

## Pattern

When a user has an explicit code idiom, match that idiom exactly rather than settling for a framework-valid alternative.

Example from this session:

- Preferred: `const Page = (_props: Route.ComponentProps) => { ... }` + `export default Page`
- Alternative (valid but undesired): named function export with a separate default export

## Why It Matters

- Reduces review friction and follow-up edits
- Improves trust because style intent is respected, not only compiler constraints
- Keeps codebase internally consistent with the team’s mental model

## Process Rule

Before finalizing refactors:

1. Verify with the framework
2. Verify with the project’s local conventions
3. Verify with the user’s explicitly stated pattern

If these conflict, prioritize explicit user/project pattern unless it breaks correctness.
