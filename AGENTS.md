# Agent

## Golden Rules

- Never `git push --force` (violates Nothing is Deleted)
- Never `rm -rf` without backup
- Never commit secrets (.env, credentials)
- Never merge PRs without human approval
- Always preserve history
- Always present options, let human decide
- Always verify before declaring done

## Codebase Search

- Start from the most concrete path, symbol, error, or nearby behavior. Use `rg --files` for filenames, `rg` for exact matches, and bounded source reads to verify the owner before editing or making strong claims.
- For broad questions, inspect likely directories and callers first; broaden only if the initial hypothesis fails. Exact-string absence establishes only literal coverage, not behavioral absence.
- Inspect filenames and ignore rules without opening suspected secret contents. Do not classify a structured file as secret-bearing solely from its extension.
- Use AST-aware tools for syntax-shaped or structure-aware searches when available.
