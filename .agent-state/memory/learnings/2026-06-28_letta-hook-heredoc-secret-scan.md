---
tags:
  - letta-code
  - hooks
  - security-guardrails
  - heredoc
  - workflow-safety
---
# Lesson: Secret-read hooks must not scan heredoc prose as shell paths

When maintaining Letta PreToolUse shell guards such as `~/.letta/hooks/block-secret-reads.py`, distinguish shell syntax from data payloads. A real false positive happened when an image-generation prompt used normal design prose containing “brand identity”; the hook tokenized the heredoc body and treated the bare word `identity` as a sensitive file basename.

Durable rule:

- Strip heredoc bodies before scanning shell commands for secret-path reads.
- Keep path-like sensitive values (`.env`, `~/.ssh/...`, provider credential paths, `credentials.json`, key files) blocked broadly when they appear as shell path arguments.
- Treat bare sensitive basenames as high confidence only in read/dump command contexts such as `cat identity`, `sed ... identity`, `rg ... identity`, `less identity`, etc.
- For shell tools, return after shell-aware env/secret checks; do not let a generic direct-argument fallback re-scan the entire shell command string.
- Test both sides after changes: safe prompt prose should pass, and an actual file-read command should still block.

This prevents safety tooling from forcing unnatural prompt wording while preserving protection against accidental credential reads.
