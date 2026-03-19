# Development Commands

## Quick Start

```bash
# Install dependencies
[verified install command]

# Start development server
[verified dev command]
```

If this is a monorepo or multi-surface repo, add the most useful app-specific commands here too.

## Building

```bash
# Production build
[verified build command]

# Preview built output
[verified preview/start command if available]
```

**Note**: [Explain when build should run, such as routing/build changes, release checks, or production-facing PRs.]

## Linting & Formatting

```bash
# Lint
[verified lint command]

# Format
[verified format command if available]

# Direct formatter or linter commands
[verified direct tool commands if useful]
```

**Always run after making changes**:

```bash
[verified post-change verification cadence]
```

If the repo has no format script, keep this section but say so directly instead of pretending one exists.

## Type Checking

```bash
[verified typecheck command if available]
```

Remove this section only if the repo truly has no separate typecheck step.

## Internationalization

If the repo has i18n, document the real update command here.

```bash
[verified i18n extraction or compile command]
```

Add a short explanation only if the repo actually has an i18n workflow.

## Testing

[Document the real test posture. If no test framework exists, say so directly.]

## Dependency Management

```bash
# Install dependencies
[verified install command]

# Add dependency
[verified add dependency command if the package manager posture is clear]

# Add dev dependency
[verified add dev dependency command if the package manager posture is clear]
```

Include version-pin guidance only if the repo actually enforces or consistently uses it.

## Verification Cadence

Every completed task should run:

```bash
[verified verification sequence]
```
