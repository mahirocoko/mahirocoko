# MCP Memory Layer

Local-first MCP memory layer prototype with:

- append-only canonical JSONL log
- LanceDB-backed retrieval table
- deterministic local embeddings for v0
- MCP tools and resources built on a thin server layer

## Commands

```bash
bun install
bun run dev
bun run cursor -- "Review this diff"
bun run gemini -- "Summarize this repo"
echo '{"taskId":"task-1","prompt":"Summarize this repo","model":"gemini-2.5-flash"}' | bun run gemini-worker
bun run typecheck
bun run test
bun run reindex
```

## Cursor command

`cursor` is the assistant-facing Cursor headless command. It wraps `agent -p --output-format json` and returns a normalized JSON envelope similar to the Gemini path.

Default model policy:

- default -> `composer-2`
- `--mode plan` -> `claude-4.6-opus-high`
- explicit `--model ...` overrides the default

```bash
bun run cursor -- "Review this diff"
bun run cursor -- --mode plan --trust "Plan a refactor for this package"
bun run cursor -- --model claude-4.6-opus-high --force --cwd /path/to/project "Apply the requested refactor"
```

## Cursor worker

`cursor-worker` is the host-friendly stdin wrapper around Cursor headless CLI.

- reads one JSON payload from stdin
- runs `agent -p --output-format json`
- writes one normalized JSON result to stdout

Input shape:

```json
{
  "taskId": "task-1",
  "prompt": "Review this diff",
  "model": "gpt-5",
  "mode": "plan",
  "force": false,
  "trust": true,
  "timeoutMs": 30000,
  "cwd": "/path/to/project"
}
```

Result shape includes:

- `status`
- `taskId`
- `requestedModel`
- `reportedModel`
- `response`
- `error`
- `exitCode`
- `startedAt`
- `finishedAt`
- `durationMs`

## Gemini command

`gemini` is the ergonomic assistant-facing command. It auto-generates a task ID, accepts the prompt directly from argv, and still prints the same normalized JSON envelope as the lower-level worker.

Default model policy:

- normal / easy work -> `gemini-3-flash-preview`
- hard work with `--hard` -> `gemini-3.1-pro-preview`
- explicit `--model ...` overrides both

Task routing:

- `--task general` -> plain Gemini prompt passthrough
- `--task summarize` -> JSON summary + key points
- `--task timeline` -> JSON overview + timeline items
- `--task extract-facts` -> JSON summary + facts + warnings

Caching:

- completed Gemini results are cached locally by routed prompt + task kind + model + cwd
- repeated equivalent calls can return `cached: true` without a fresh Gemini request
- cache entries expire after 24 hours by default
- cache version mismatches invalidate old entries automatically

```bash
bun run gemini -- "Summarize this repo"
bun run gemini -- --hard "Review this architecture and propose tradeoffs"
bun run gemini -- --task summarize "Summarize the latest meeting notes"
bun run gemini -- --task timeline "Summarize the project timeline from these notes"
bun run gemini -- --model gemini-2.5-pro --timeout-ms 30000 --cwd /path/to/project "Review the current diff"
```

## Gemini worker

`gemini-worker` is a thin host-friendly wrapper around `gemini -m ... -p ... --output-format json`.

- reads one JSON payload from stdin
- runs Gemini in headless mode
- writes one normalized JSON result to stdout

Input shape:

```json
{
  "taskId": "task-1",
  "prompt": "Summarize this repo",
  "model": "gemini-2.5-flash",
  "taskKind": "summarize",
  "timeoutMs": 30000,
  "cwd": "/path/to/project"
}
```

Result shape includes:

- `status`
- `taskId`
- `requestedModel`
- `reportedModel`
- `response`
- `structuredData`
- `cached`
- `error`
- `exitCode`
- `startedAt`
- `finishedAt`
- `durationMs`
