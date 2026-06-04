# Lesson: Updating OpenCode oh-my-openagent safely

**Date**: 2026-05-26  
**Tags**: opencode, oh-my-openagent, plugin-cache, tooling, environment-hygiene

## Durable takeaway

When Mahiro asks to update `oh-my-openagent` for OpenCode, treat it as an environment maintenance task with multiple state surfaces:

- active OpenCode config: `~/.config/opencode/opencode.json`
- plugin-specific config: `~/.config/opencode/oh-my-openagent.json`
- OpenCode package cache: `~/.cache/opencode/packages/oh-my-openagent@<version>`
- cache manifests/locks: `~/.cache/opencode/package.json`, `~/.cache/opencode/bun.lock`

Prefer the official OpenCode plugin installer:

```bash
opencode plugin oh-my-openagent@<latest> --global --force
```

Do not rely on cache manifests alone to infer the active plugin; `opencode.json` is the active plugin pin.

## Verification checklist

1. Confirm latest version with npm: `npm view oh-my-openagent version dist-tags --json`.
2. Run `opencode plugin oh-my-openagent@<version> --global --force`.
3. Confirm `~/.config/opencode/opencode.json` contains the new pin.
4. Confirm `~/.cache/opencode/packages/oh-my-openagent@<version>` exists and package.json reports the same version.
5. Run `oh-my-openagent doctor --status` from the cached package binary.
6. If `oh-my-openagent.json` has a versioned `$schema`, update it to the pinned version after creating a backup.
7. Delete old cache folders only after the new version verifies and Mahiro explicitly asks to clean.

## Gotchas

- Broad `rg` over `~/.cache/opencode` can explode into huge output because package internals are large. Prefer top-level `find`, package manifests, and targeted checks.
- `npm warn Unknown user config "python"` is known environment noise in Mahiro's setup.
- `doctor --status` may report unrelated tool health such as `AST-Grep ✗`; do not treat that as a plugin update failure unless the task targets that tool.
