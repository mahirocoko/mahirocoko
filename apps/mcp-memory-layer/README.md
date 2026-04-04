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
bun run cursor -- --model composer-2 "Review this diff"
bun run gemini -- --model gemini-3-flash-preview "Summarize this repo"
echo '{"taskId":"task-1","prompt":"Summarize this repo","model":"gemini-3-flash-preview"}' | bun run gemini-worker
bun run typecheck
bun run test
bun run reindex
```

## Cursor command

`cursor` is the assistant-facing Cursor headless command. It wraps `agent -p --output-format json` and returns a normalized JSON envelope similar to the Gemini path.

Model selection:

- `--model` is required on every invocation
- recommended standard model -> `composer-2`
- recommended hard review / refactor -> `claude-4.6-sonnet-medium`
- recommended hard planning -> `claude-4.6-opus-high`
- `--mode plan` is optional and should be used only when the task is complex enough that you need an explicit planning pass

```bash
bun run cursor -- --model composer-2 "Review this diff"
bun run cursor -- --model claude-4.6-sonnet-medium --trust "Refactor this package safely"
bun run cursor -- --model claude-4.6-opus-high --mode plan --trust "Plan a deep cross-module refactor"
bun run cursor -- --model claude-4.6-sonnet-medium --force --cwd /path/to/project "Apply the requested refactor"
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
  "model": "claude-4.6-opus-high",
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

Model selection:

- `--model` is required on every invocation
- recommended standard model -> `gemini-3-flash-preview`
- recommended hard-work model -> `gemini-3.1-pro-preview`

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
bun run gemini -- --model gemini-3-flash-preview "Summarize this repo"
bun run gemini -- --model gemini-3.1-pro-preview "Review this architecture and propose tradeoffs"
bun run gemini -- --model gemini-3-flash-preview --task summarize "Summarize the latest meeting notes"
bun run gemini -- --model gemini-3-flash-preview --task timeline "Summarize the project timeline from these notes"
bun run gemini -- --model gemini-3.1-pro-preview --timeout-ms 30000 --cwd /path/to/project "Review the current diff"
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
  "model": "gemini-3-flash-preview",
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

## Parallel execution playbook

Run workers in parallel only when their inputs are fully independent — neither worker's output is needed to form the other's prompt.

- **Safe:** Gemini summarizes one module while Cursor plans an unrelated refactor.
- **Unsafe:** Gemini extracts facts → you use those facts to write the Cursor prompt.

```bash
bun run gemini -- --model gemini-3-flash-preview --cwd /path/to/repo "Summarize the architecture" &
bun run cursor -- --model claude-4.6-sonnet-medium --mode plan --trust "Plan the next improvement" &
wait
```
