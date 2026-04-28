# Gradient terminal logos need plain fallbacks

Tags: `terminal-ui`, `ansi`, `mahiro-skills`, `tui`, `release`

When adding visual styling to terminal logos, keep the canonical logo as plain text and apply ANSI color as a final presentation step. The `mahiro-skills` `v0.1.20` logo worked best as `LOGO_LINES: string[]`, joined into plain text, then optionally passed through a dependency-free truecolor gradient only for interactive terminals. Tests should strip ANSI before checking semantic logo content, and code should honor `NO_COLOR` / `TERM=dumb` so non-interactive or low-capability environments keep readable output. This keeps fun branding reversible and safe.
