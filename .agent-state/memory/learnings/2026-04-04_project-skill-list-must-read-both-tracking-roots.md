# Project skill list must read both tracking roots

**Date**: 2026-04-04
**Tags**: #skills #project-management #mahiro-skills #release #agent-state #tooling

## Lesson

If a project-tracking skill claims to support both `learn` and `incubate`, its default `list` behavior must inspect both storage roots. Reading only `.agent-state/learn/.origins` creates a false picture of the tracked world because active-development repos often live only under `.agent-state/incubate/<owner>/<repo>`.

## Why it mattered today

The user noticed a real trust break: `/project list` did not show incubated repos even though the skill language implied that `incubate` was part of the model. The root cause was not a mysterious filesystem bug. It was a documentation and behavior gap. The installed flow had enough ambiguity that a fallback implementation could stop at the learn manifest and miss the second tracking root entirely. Fixing the immediate answer in-chat would not have been enough. The durable fix was to update the packaged `project` skill in `mahiro-skills` so its source-of-truth instructions explicitly define path resolution, default grouped listing, directory fallback rules, and the separation between `learn` and `incubate`. Once that was done, the release also had to move as a complete unit: version bump, README examples, install script examples, tests, tag, release, and reinstall.

## Durable takeaway

For packaged repo-tracking tools, keep this contract explicit:

1. resolve `REPO_ROOT` and `AGENT_STATE_DIR` first
2. treat `learn` and `incubate` as separate but equally first-class roots
3. let `list` include both by default unless the human scopes it
4. keep grouped output so study repos and active-work repos never get conflated
5. when behavior changes, ship the release surfaces and install surface together

If the skill promise spans multiple roots, the listing contract has to span them too.
