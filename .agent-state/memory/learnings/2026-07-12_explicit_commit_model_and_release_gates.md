# Learning: Explicit commit-model routing and approval-aware skill releases

**Date**: 2026-07-12
**Tags**: git-commit, codex-spark, subagent-routing, memory-compaction, frontend-design, provenance, release

## Lesson

A specialized subagent's configured or recommended model does not guarantee that the runtime will select it when the parent omits the `model` argument. For Mahiro's commit workflow, the correct invocation is explicit:

```json
{
  "subagent_type": "git-commit",
  "model": "openai-codex/gpt-5.3-codex-spark"
}
```

Use Spark first because commit analysis is narrow, procedural, and benefits from low latency. Fall back only when Spark is unavailable or the invocation fails before creating a commit. Report the fallback instead of switching silently. If the failed lane may have staged or committed anything, inspect `git status`, staged diff, and recent log before retrying.

Memory compaction must preserve exact operational rules when a parameter controls behavior. Replacing “pass this model ID explicitly” with “use the specialized agent/model” preserved the idea but lost the executable instruction.

The same explicit-state principle applies to skill releases:

1. Separate research evidence from packaged doctrine.
2. Record promotion candidates with IDs, evidence, counterexamples, scope, status, and owner approval.
3. Keep human selection session-only until retention is approved.
4. Preserve optional/default-bundle boundaries in executable tests.
5. Verify source, tests, provenance, install output, remote branch, tag, and release object before calling the release complete.

Concrete policy from this session:

- `frontend-design` remains in the default bundle.
- `deep-research` retains `/gemini research` but remains outside the default bundle.
- Source-specific Macapp evidence stays under authoring records/local ignored archives; only bounded repo-neutral methods were promoted.
