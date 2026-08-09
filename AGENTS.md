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

- Prefer `cocoindex-code` MCP `search`, when available, for semantic codebase search, broad repo exploration, fuzzy implementation lookup, and unfamiliar modules.
- If the MCP tool is unavailable but the CLI exists, use `ccc search` for semantic search and `ccc index` or `ccc search --refresh` when the index may be stale.
- Before `ccc init`, `ccc index`, `ccc search --refresh`, or equivalent MCP indexing, inspect filenames and effective ignore/filter rules without opening suspected secret contents. Never chain `ccc init && ccc index` before that check.
- If credential, service-account, dotenv, private-key, token-store, or other evidence-backed secret-bearing paths are present or not conclusively excluded, stop and configure verified targeted exclusions first. Do not classify JSON, YAML/YML, TOML, XML, or TXT as secret-bearing by extension alone; keep them eligible unless path evidence justifies exclusion. A local embedding backend does not make unintended secret reads acceptable.
- After exclusion-policy changes, reset or safely rebuild stale indexes before relying on semantic results that may retain previously indexed content.
- Use semantic search as a token-saving first pass: narrow the repo to candidate files and line ranges instead of reading broad source trees blindly.
- Run `ccc search` from the repo root, or pass `--path`, because its default scope is the current working directory.
- Treat semantic results as candidate locations. Read only the returned files or ranges needed for verification before editing or making strong claims.
- Use `rg` for exact text, regex, symbol, and filename search.
- Use AST-aware tools for syntax-shaped or structure-aware search.
- Go directly to file reads, `rg`, or AST-aware tools for known paths, exact symbols, and tiny lookups; CocoIndex is a locator, not a replacement for source reads.
- Treat requests like `search the codebase`, `find where X is implemented`, `how does this repo work`, `ดู repo หน่อย`, `หาโค้ดส่วนนี้`, and `สรุปไฟล์นี้` as CocoIndex-first triggers when available.
- After meaningful code changes, refresh or re-index before relying on semantic results that may be stale.
