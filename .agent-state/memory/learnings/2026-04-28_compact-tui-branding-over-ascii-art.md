# Lesson Learned: Compact TUI branding beats improvised ASCII art

Tags: `tui`, `cli-branding`, `mahiro-skills`, `reference-driven-design`, `terminal-output`

When adding branding to a CLI/TUI, do not jump straight to large ASCII art. First inspect a real reference and copy the level of restraint, not just the surface idea of “a logo.” In the `mahiro-skills` TUI session, the better pattern came from `vercel-labs/skills`: a compact startup-only wordmark, utility-first subcommand output, and no decorative header in machine-oriented paths. Large Unicode/block art caused rendering problems and made the prompt feel heavier than the workflow required.

For future CLI/TUI visual work:

- Keep logos fixed, short, and startup-only unless the tool is a full-screen dashboard.
- Never let branding pollute non-interactive or JSON output.
- Prefer plain text or verified ANSI styling over Unicode art that may serialize as escapes.
- If the user provides a reference repo, research it before trying local style variants.
- Separate view helpers from workflow logic so branding can change without destabilizing behavior.

This is a taste and reliability rule: terminal UI polish should reduce cognitive load, not become the feature.
