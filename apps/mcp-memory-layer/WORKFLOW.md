# MCP Memory Layer Workflow

This document defines the worker-first orchestration loop for `apps/mcp-memory-layer`.

## Core posture

- The orchestrator routes, compares, verifies, and decides.
- Gemini and the Cursor-family `agent` worker do the heavy lifting first.
- Local reads stay shallow before delegation and surgical after worker output.
- Every Gemini and Cursor-family `agent` invocation must declare a model explicitly. No implicit defaults.

## Default loop

1. Orient with minimal grounding.
2. Delegate the right shape of work to Gemini or the Cursor-family `agent` worker.
3. Run workers headlessly whenever possible.
4. Use parallel execution only when worker jobs are independent.
5. Verify with tests, build output, and small targeted reads.
6. Synthesize the result at the orchestrator layer.

## When to use Gemini

Use Gemini for bounded extraction and synthesis work:

- summarize files or docs
- extract facts or timelines
- compare options before implementation
- narrow a large search space before coding

Recommended model ladder:

- `gemini-3-flash-preview` -> normal/easy extraction and summarization
- `gemini-3.1-pro-preview` -> harder synthesis, tradeoffs, or nuanced analysis

Examples:

```bash
bun run gemini -- --model gemini-3-flash-preview --task summarize "Summarize the retrieval pipeline"
bun run gemini -- --model gemini-3.1-pro-preview --cwd /path/to/repo "Review this architecture and propose tradeoffs"
echo '{"taskId":"task-1","prompt":"Summarize this repo","model":"gemini-3-flash-preview","taskKind":"summarize","cwd":"/path/to/repo"}' | bun run gemini-worker
```

## When to use Cursor-family `agent`

Use the Cursor-family `agent` headless path for applied coding work:

- implementation and refactoring
- code review
- patch planning inside the codebase
- edits that benefit from an agent/tool loop

Recommended model ladder:

- `composer-2` -> standard implementation and review
- `claude-4.6-sonnet-medium` -> harder review/refactor and most direct hard work
- `claude-4.6-opus-high` -> complex planning

`--mode plan` is not the default posture. Use it only when the task is complex enough that you need an explicit planning pass. When you do need real planning, start with Opus.

Examples:

```bash
agent -p --model composer-2 --output-format json "Review this diff"
agent -p --model claude-4.6-sonnet-medium --output-format json "Refactor this module safely"
agent -p --model claude-4.6-opus-high --output-format json "Plan a refactor for this package"
agent -p --model claude-4.6-opus-high --output-format json "Plan a deep cross-module refactor"
echo '{"taskId":"task-1","prompt":"Review this diff","model":"composer-2","cwd":"/path/to/repo"}' | bun run cursor-worker

# Repo-local wrapper around the same headless path
bun run cursor -- --model composer-2 "Review this diff"
```

## Headless and parallel usage

Headless is the default posture for local workers. Prefer `agent -p --output-format json ...` or repo-local worker wrappers over interactive usage.

## Parallel execution playbook

Run workers in parallel only when their inputs are fully independent — neither worker's output is needed to form the other's prompt.

**Independent (safe to parallelize):**

- Gemini summarizes one module while Cursor reviews a different file
- Gemini extracts facts from docs while Cursor plans an unrelated refactor
- Two Gemini workers analyze separate subsystems before you synthesize
- Five Cursor workers review five unrelated modules in parallel, then you compare the results

**Dependent (must sequence):**

- Gemini extracts facts → you use those facts to write the Cursor prompt
- Cursor produces a plan → you send that plan to Gemini for critique

Example parallel pattern:

```bash
bun run gemini -- --model gemini-3-flash-preview --cwd /path/to/repo "Summarize the memory retrieval architecture" &
agent -p --model claude-4.6-opus-high --output-format json "Plan the next safe retrieval improvement" &
wait
# Synthesize both outputs here before proceeding
```

Programmatic equivalent:

- `src/features/orchestration/run-parallel-workers.ts` provides the same fan-out and collect pattern for independent jobs without relying on ad-hoc shell `&` and `wait`.
- `bun run orchestrate -- --file <workflow.json>` exposes that pattern as a package CLI for static JSON-defined workflows.
- There is no special two-worker limit in the orchestration layer. Fan out as many independent Gemini/Cursor jobs as the machine and upstream tools can safely support.
- Use parallel workflow field `maxConcurrency` when you want bounded fan-out instead of firing every independent job at once.
- Orchestration results now include run summary metadata such as total/completed/failed/skipped job counts plus started/finished timestamps and total duration.
- Use workflow field `timeoutMs` when you want a deadline for the entire orchestration run; active jobs are bounded by the remaining time and unstarted jobs become skipped work.
- CLI and MCP orchestration runs append JSONL trace entries under `data/traces/orchestration-trace.jsonl` for later inspection.
- CLI and MCP orchestration runs return a `requestId` when tracing is enabled, so you can jump straight from a workflow result to its trace entry.
- Use per-job fields `retries` and `retryDelayMs` when a worker call may fail transiently and should be retried with exponential backoff.
- Code-level runners also accept `onJobComplete` for incremental progress. This is library-only for now; parallel callbacks arrive in completion order, and sequential `totalJobs` still counts steps that may later be skipped.
- `bun run orchestrate -- --file <workflow.json> --dry-run` validates the static spec, checks template syntax, and prints the normalized plan without executing workers.

Example sequential pattern (when Gemini output feeds Cursor):

```bash
SUMMARY=$(bun run gemini -- --model gemini-3-flash-preview --cwd /path/to/repo "Summarize the retrieval module")
agent -p --model claude-4.6-opus-high --output-format json "Given this summary: $SUMMARY — plan the next improvement"
```

Programmatic equivalent:

- `src/features/orchestration/run-sequential-workers.ts` runs dependent steps in order and lets each later step derive its next worker job from earlier results.
- `bun run orchestrate -- --file <workflow.json>` supports static sequential job lists when you want a CLI wrapper around that execution model.
- Sequential JSON workflows can interpolate earlier results with placeholders like `{{last.result.response}}` or `{{results.0.result.response}}`.
- Interpolation helpers include `{{default(path, "fallback")}}` and `{{json(path)}}`.
- Static sequential jobs can set `continueOnFailure: false` when a failed step should halt the workflow.
- Code-level sequential step builders can return `null` to skip a step entirely based on earlier results.

MCP equivalent:

- The `orchestrate_workflow` MCP tool accepts the same static workflow spec and runs it through the same orchestration runtime.
- The `list_orchestration_traces` MCP tool reads persisted orchestration trace entries for later inspection.
- The `list-orchestration-traces` CLI command reads the same persisted trace file with optional filters like `--source`, `--mode`, `--status`, `--request-id`, `--task-id`, and `--limit`, plus `--format text` for a terminal-friendly table view or `--format detail` for expanded per-trace blocks.

Typical trace inspection loop:

1. Run `bun run orchestrate -- --file <workflow.json>`
2. Copy `requestId` from the JSON result
3. Run `bun run list-orchestration-traces -- --format detail --request-id <that-request-id>`

## Verification rule

Worker output is never the final truth.

- verify with `bun run typecheck`
- verify with `bun run test`
- verify with `bun run build`
- spot-check only the files and claims that matter

The orchestrator should not re-read large file clusters after delegation unless verification truly requires it.
