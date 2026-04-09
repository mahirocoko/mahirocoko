# Learning Note: Make Batch State Honest

Tags: `retrospective`, `tui`, `installer`, `batch-operations`, `release`, `mahiro-skills`

## Lesson
When an installer grows from single-target flows into multi-agent batch work, the UI must describe partial state honestly. A generic cancellation message is acceptable for a no-side-effect plan flow, but it becomes misleading once earlier agents may already be installed. The safer pattern is either to collect all confirmations before the first write or to explicitly return a partial result summary that says what has already been applied.

## Evidence From This Session
- The new `mahiro-skills` TUI gained multi-agent plan and install support.
- Review caught that declining a later install in the batch could leave earlier agents already installed while the UI only said the install was cancelled.
- Fixing that required both a behavior change and regression coverage, not just a wording tweak.

## Reuse Guidance
- Before shipping any batch mutation flow, ask: can this partially succeed?
- If yes, design the UX and the return type around partial success from the start.
- Add regression tests for both all-success and late-cancel scenarios.

## Slug
`mahiro-skills-tui-release`
