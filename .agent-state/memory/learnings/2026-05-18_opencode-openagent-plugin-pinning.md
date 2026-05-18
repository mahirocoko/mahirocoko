# Lesson: Pin OpenCode Oh My OpenAgent plugin versions

**Date**: 2026-05-18  
**Tags**: opencode, oh-my-openagent, plugin-cache, version-pinning, config

## Durable takeaway

When Mahiro asks about the `oh-my-openagent` plugin “that is tied to OpenCode,” ignore study/source clones unless the OpenCode config uses a `file://` plugin. The runtime source of truth is:

- `/Users/mahiro/.config/opencode/opencode.json`
- `/Users/mahiro/.config/opencode/oh-my-openagent.json`
- `/Users/mahiro/.cache/opencode/packages/**`
- npm/package availability for `oh-my-openagent` / `oh-my-opencode`

Bare plugin specs like:

```json
"oh-my-openagent"
```

allow OpenCode to resolve/cache `latest`, which can leave stale mixed cache roots. Prefer exact specs:

```json
"oh-my-openagent@4.1.2"
```

Then clear only the ambiguous old cache paths, not every OpenCode cache.

## Version rule

Do not treat a dev-branch `package.json` version as released. In this session, `origin/dev` had `4.2.0`, but npm/latest and tags were `4.1.2`, so the correct runtime pin was `oh-my-openagent@4.1.2`.

## Config rule

When pinning the plugin version, also update the schema URL in `~/.config/opencode/oh-my-openagent.json` to the same released tag when available, and create backups before editing global user config.
