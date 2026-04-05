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
echo '{"mode":"parallel","jobs":[{"kind":"gemini","input":{"prompt":"Summarize this repo","model":"gemini-3-flash-preview"}},{"kind":"cursor","input":{"prompt":"Review this diff","model":"composer-2"}}]}' | bun run orchestrate -- --file -
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
- **Safe:** Five Cursor jobs review five unrelated files/modules in parallel.
- **Unsafe:** Gemini extracts facts → you use those facts to write the Cursor prompt.

```bash
bun run gemini -- --model gemini-3-flash-preview --cwd /path/to/repo "Summarize the architecture" &
bun run cursor -- --model claude-4.6-sonnet-medium --mode plan --trust "Plan the next improvement" &
wait
```

## Orchestrate command

`orchestrate` is the package-level workflow runner for static JSON-defined parallel or sequential job specs.

Flags:

- `--file <path>` -> workflow JSON file path, or `-` to read from stdin
- `--cwd <path>` -> optional default cwd applied to jobs that do not set their own `input.cwd`

Result envelope includes:

- `mode`
- `status`
- `results`
- `summary.totalJobs`
- `summary.finishedJobs`
- `summary.completedJobs`
- `summary.failedJobs`
- `summary.skippedJobs`
- `summary.startedAt`
- `summary.finishedAt`
- `summary.durationMs`

Trace artifact:

- orchestration runs append JSONL entries to `data/traces/orchestration-trace.jsonl`
- trace entries include workflow mode, status, job kinds, task IDs, summary counts, and source (`cli` or `mcp`)

Parallel workflow fields:

- `maxConcurrency` -> optional positive integer limit for how many parallel jobs run at once
- `timeoutMs` -> optional workflow-level deadline in milliseconds; bounds started jobs and stops launching new ones after expiry

Parallel example:

```bash
echo '{"mode":"parallel","jobs":[{"kind":"gemini","input":{"prompt":"Summarize this repo","model":"gemini-3-flash-preview"}},{"kind":"cursor","input":{"prompt":"Review this diff","model":"composer-2"}}]}' | bun run orchestrate -- --file -
```

Larger fan-out example:

```bash
echo '{"mode":"parallel","jobs":[{"kind":"cursor","input":{"prompt":"Review module A","model":"composer-2"}},{"kind":"cursor","input":{"prompt":"Review module B","model":"composer-2"}},{"kind":"cursor","input":{"prompt":"Review module C","model":"composer-2"}},{"kind":"cursor","input":{"prompt":"Review module D","model":"composer-2"}},{"kind":"cursor","input":{"prompt":"Review module E","model":"composer-2"}}]}' | bun run orchestrate -- --file -
```

Concurrency-limited example:

```bash
echo '{"mode":"parallel","maxConcurrency":2,"jobs":[{"kind":"cursor","input":{"prompt":"Review module A","model":"composer-2"}},{"kind":"cursor","input":{"prompt":"Review module B","model":"composer-2"}},{"kind":"cursor","input":{"prompt":"Review module C","model":"composer-2"}},{"kind":"cursor","input":{"prompt":"Review module D","model":"composer-2"}}]}' | bun run orchestrate -- --file -
```

The orchestration layer is not limited to one Gemini plus one Cursor. It can fan out many independent jobs of the same or different worker kinds, subject to local machine capacity and upstream tool/runtime limits.

Timeout behavior:

- workflow `timeoutMs` is enforced across the whole orchestration run
- started jobs receive an effective timeout bounded by the remaining workflow time
- once the workflow deadline expires, remaining jobs are not started and count as `summary.skippedJobs`

Sequential example:

```bash
echo '{"mode":"sequential","steps":[{"kind":"gemini","input":{"prompt":"Summarize the retrieval module","model":"gemini-3-flash-preview"}},{"kind":"cursor","input":{"prompt":"Plan the next improvement from that summary","model":"claude-4.6-opus-high","mode":"plan"}}]}' | bun run orchestrate -- --file -
```

Sequential interpolation example:

```bash
echo '{"mode":"sequential","steps":[{"kind":"gemini","input":{"prompt":"Summarize the retrieval module","model":"gemini-3-flash-preview"}},{"kind":"cursor","input":{"prompt":"Given this summary: {{last.result.response}}","model":"claude-4.6-opus-high","mode":"plan"}}]}' | bun run orchestrate -- --file -
```

Interpolation helpers:

- `{{default(path, "fallback")}}` -> use a fallback value when the path is missing, null, or empty
- `{{json(path)}}` -> JSON-stringify the resolved value

Helper example:

```bash
echo '{"mode":"sequential","steps":[{"kind":"gemini","input":{"prompt":"Summarize the retrieval module","model":"gemini-3-flash-preview"}},{"kind":"cursor","input":{"prompt":"Summary: {{default(last.result.response, "missing")}} Raw: {{json(default(last.result.raw, last.result.response))}}","model":"claude-4.6-opus-high","mode":"plan"}}]}' | bun run orchestrate -- --file -
```

MCP tool:

- `orchestrate_workflow` runs the same static workflow spec through the MCP server
- input shape: `{ "spec": <parallel-or-sequential workflow>, "cwd": "/optional/default/cwd" }`
- `list_orchestration_traces` lists persisted orchestration trace entries with optional filters like `source`, `mode`, `status`, `requestId`, `taskId`, and `limit`

Trace inspection CLI:

```bash
bun run list-orchestration-traces
bun run list-orchestration-traces -- --limit 50 --source cli
bun run list-orchestration-traces -- --format text --limit 20
bun run list-orchestration-traces -- --format detail --request-id workflow_123
```
