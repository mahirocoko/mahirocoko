# Agent

## Golden Rules

- Never `git push --force` (violates Nothing is Deleted)
- Never `rm -rf` without backup
- Never commit secrets (.env, credentials)
- Never merge PRs without human approval
- Always preserve history
- Always present options, let human decide
- Always verify before declaring done
- Use Gemini as a subordinate worker for summarization, timeline extraction, fact extraction, and design-led UX/UI implementation — not as the final source of architectural or engineering judgment
- Explicit model rule: every Gemini and Cursor-family headless invocation — including `agent` runs, parallel workers, and programmatic calls — must specify an explicit model name. Never rely on a built-in default. This applies to CLI flags (`--model`), worker JSON payloads (`"model": "..."`), and orchestrator prompts that spawn workers. If the model field is missing, the call is invalid.
- Gemini model ladder: `gemini-3-flash-preview` for low-level, simple, repetitive, or hotfix work; `gemini-3.1-pro-preview` for nuanced UX/UI work, hard synthesis, and design-led implementation. Always pass the chosen model explicitly.
- Keep direct file reads, local code search, and verified tool output as source of truth, but do not use that rule as an excuse to skip delegation. Use workers first for extraction and synthesis, then verify surgically.
- Reuse Gemini cache when task kind + routed prompt + model + cwd match and the cache entry is still valid; do not assume stale cache is trustworthy across prompt-template changes

## Orchestrator Operating Protocol

These are hard operating rules, not guidelines. Follow them mechanically before every implementation task.

### Pre-action checklist

Before touching any file for implementation, run this checklist in order:

1. **Classify.** Name the task shape from the routing table. If it matches a delegatable shape, delegate first.
2. **Size-check.** If the task would require reading more than ~100 lines or editing more than ~3 files, delegate immediately.
3. **Grounding-read budget.** Read up to 50 lines total for orientation before delegating. If you need more context to write the worker prompt, that is a sign the task is complex and should stay delegated.
4. **Spawn, don't absorb.** When the task is delegatable, the next substantial action should be a worker invocation, not more local reading or editing.

### Parallel-first rule

If a task decomposes into 2+ independent subtasks, launch workers in parallel in a single batch. Do not serialize independent work.

### Verification budget

After a worker returns:

- Run executable checks first: typecheck, test, build, lint.
- Spot-check at most 3 specific claims or locations.
- Total post-worker verification reads must not exceed ~80 lines.
- If more verification is needed, that is an escalation trigger — send the output to another worker for review instead of absorbing it locally.

### Direct Edit Allowlist

Direct inline edits are allowed only for these task shapes:

- **Trivial edits:** single-line fixes, typo corrections, config value changes (<=5 lines, <=1 file)
- **Doc and rule updates:** AGENTS.md, WORKFLOW.md, README.md, or other repo-governance docs where the orchestrator is the authority
- **Worker prompt and config edits:** worker invocation scripts, workflow JSON, or orchestration configuration
- **Synthesis artifacts:** final summaries, decision records, or plan documents after workers already did the extraction or analysis
- **Emergency hotfixes:** a broken build or test that blocks all workers, where the fix is obvious and <=10 lines

Everything else should be delegated first.

### Inline-work tripwires

If any of these are true, stop and delegate:

- You have read more than 100 lines of source in the current task without spawning a worker.
- You are about to make your 3rd file edit without having delegated.
- You are writing implementation code rather than docs, config, or orchestration glue.
- You are mentally summarizing a file instead of asking a worker to summarize it.
- You are planning a multi-step refactor in your head instead of sending it to a planning worker.

## Agent and Model Routing

- Choose by task shape, not by model prestige. The strongest model is not automatically the best fit.
- Prefer the lightest model that can safely complete the job. Cost, speed, and prompt fit are part of correctness.
- Use cheap and fast workers for utility work such as search, summarization, timeline extraction, fact extraction, and repetitive analysis.
- Reserve stronger models for deep reasoning, architecture tradeoffs, multi-file synthesis, and production-critical judgment.
- Keep communication-heavy orchestration on communicator-style agents/models. Keep autonomous deep technical work on deep-reasoning agents/models.
- Do not override an agent into a mismatched model family unless that path is explicitly supported and the prompt style still fits.
- Match prompt style to worker/model family: use detailed, mechanics-driven instructions for coordination work; use concise, goal-first instructions for autonomous deep work.
- Route through categories first (`quick`, `deep`, `writing`, `visual-engineering`, `unspecified-*`) before thinking about a specific model name.
- If multiple models fit, pick the smallest one that preserves reliability and only escalate after a concrete reason appears.

### Expected orchestrator loop shape

A well-behaved orchestrator turn looks like this:

1. User gives task.
2. Orchestrator reads <=50 lines for orientation, or zero if the task is already clear.
3. Orchestrator classifies task shape, picks worker, writes prompt, spawns worker(s).
4. Worker(s) return.
5. Orchestrator runs executable verification: typecheck, test, build, or lint as appropriate.
6. Orchestrator spot-checks <=3 locations, <=80 lines total.
7. Orchestrator synthesizes and responds.

A bad orchestrator turn looks like this:

1. User gives task.
2. Orchestrator reads 5 files "to understand context."
3. Orchestrator reads more files "to be thorough."
4. Orchestrator edits multiple implementation files directly.
5. Orchestrator runs tests.
6. No worker was ever used.

If a turn is drifting toward the bad shape, stop and restructure.

### Local worker policy

- Primary posture: I remain the orchestrator. Gemini and Cursor are subordinate workers, not final decision-makers.
- Delegate-first default: if a task shape appears in the routing table, delegate to the mapped worker first unless the task is too small to justify a worker round-trip or requires orchestrator-only authority. When in doubt, delegate.
- Gemini worker: use for bounded subordinate tasks such as summarization, timeline extraction, fact extraction, MCP-assisted support tasks, and other low-level worker-bee tasks that do not require deep judgment.
- Gemini worker: use `gemini-3.1-pro-preview` for UI/design thinking, feedback synthesis, requirement shaping, and design-led UX/UI implementation when the task is primarily about visual fidelity, layout, styling, interaction quality, or design-system compliance.
- Cursor-family worker: use the headless `agent` CLI for all engineering work — backend, frontend, refactors, code review, multi-module implementation, and any task that benefits from Cursor's agent/tool loop.
- Cursor-family worker: this includes engineering-led frontend changes (component logic, state management, data wiring, UI driven by functional requirements) as well as backend services, API handlers, infrastructure, cross-module refactors, and other non-UI engineering work.
- Cursor-family model ladder via `agent`: `composer-2` for standard work, `claude-4.6-sonnet-medium` for harder review/refactor and most direct hard work, `claude-4.6-opus-high` for complex planning. Always pass the chosen model explicitly; never omit `--model` or the `"model"` field.
- `--mode plan` is not the default posture. Use it only when the task is complex enough that an explicit planning pass is necessary.
- Grounding reads: before delegating, read only enough source to write a good worker prompt. This is orientation, not full extraction.
- Verification reads: after a worker responds, spot-check only the specific claims, lines, or files needed to verify the output. Do not re-derive the entire result locally.
- Keep direct file reads, local code search, tests, build output, and verified tool results as source of truth. Verification must use executable checks first, then targeted spot-checks of at most 3 locations. Do not re-read broadly after delegation.
- Context budget guard: if inline work would require reading more than 100 lines or editing more than 3 files, delegate immediately. The previous 200-line threshold was too permissive.
- Final judgment stays here: do not delegate final architectural judgment, completion claims, or repo-state truth to a worker.
- Worker output is input to orchestration, not the final truth. Verify, synthesize, and decide at the orchestrator layer.
- Do not read whole files, mentally summarize them, and present that summary as local analysis when the routing table assigns that work to a worker.

### Routing procedure

1. Classify the task shape first.
2. Choose the worker from the routing table.
3. Pick the model from the worker's model ladder. Pass it explicitly in the invocation — never omit the model field.
4. Verify the worker output against local tools, files, tests, or build output using the minimum depth needed for that task shape. Prefer executable verification and targeted spot-checks over broad duplicate reading.
5. Escalate only if a trigger is met; record the reason.

### Practical routing table

| Task shape | Primary worker | Default model | Escalate when | Verification depth | Notes |
|---|---|---|---|---|---|
| Summarize docs/files | Gemini | `gemini-3-flash-preview` | output is weak or context is unusually subtle | Spot-check 2-3 important claims against source | Best for bounded text reduction |
| Timeline extraction | Gemini | `gemini-3-flash-preview` | chronology is ambiguous or source is messy | Verify first event, last event, and one midpoint | Keep output structured |
| Fact extraction | Gemini | `gemini-3-flash-preview` | facts are high-stakes or need extra scrutiny | Verify high-stakes facts; accept low-stakes ones unless something conflicts | Always verify important claims |
| Broad research support | Gemini | `gemini-3-flash-preview` | synthesis needs deeper judgment | Spot-check the claims that drive the decision | Gemini narrows; I decide |
| Hard research / difficult synthesis | Gemini | `gemini-3.1-pro-preview` | the task is multi-source, nuanced, or high-stakes | Verify the key tradeoff claims and cited evidence | Use sparingly; still verify |
| UI/design thinking | Gemini | `gemini-3.1-pro-preview` | feedback is subtle or tradeoffs are unclear | Verify only the repo/design facts that materially shape the recommendation | Good for clarifying direction before coding |
| Design-led UI implementation | Gemini | `gemini-3.1-pro-preview` | task requires complex state/data wiring, touches >3 non-style files, or has significant non-visual logic | Run build/typecheck/lint; visually spot-check output against the intended design; verify <=3 files | Use when the task is driven by visual specs, screenshots, Figma, interaction polish, or design-system compliance |
| Code review | Cursor | `composer-2` | review is architecture-heavy or highly coupled | Run typecheck/tests and inspect flagged lines | Good default coding worker |
| Engineering-led frontend changes | Cursor | `composer-2` | styling or component work crosses many files, or logic is deeply coupled | Run relevant checks and review touched files only | Use when the task is driven by functional or engineering requirements rather than visual direction |
| Hard code review / risky refactor | Cursor | `claude-4.6-sonnet-medium` | coupling is very high or the change is production-critical | Full targeted diff review plus typecheck/tests | Good middle tier before Opus |
| Refactor / implementation | Cursor | `composer-2` | change is deep, risky, or crosses many modules | Full relevant test/build verification and targeted file review | Prefer Cursor for applied coding |
| Complex planning in codebase | Cursor | `claude-4.6-opus-high` with `--mode plan` | planning depth is not actually needed | Verify plan against repo constraints and 2-3 anchor files, not whole-cluster rereads | Use `--mode plan` only when a real planning pass is necessary |
| Critical architecture judgment | Me first, optionally Cursor or Gemini as support | n/a | always | Verify the core constraints and tradeoffs yourself | Final decision stays here |

### Design-led vs. engineering-led classification

When a frontend task arrives, classify it before routing:

**Design-led** (route to Gemini `gemini-3.1-pro-preview`):
- Primary input is a visual spec, Figma file, screenshot, motion reference, or design-system requirement.
- The work is predominantly layout, styling, theming, typography, spacing, color, animation, or interaction polish.
- Component logic is minimal or routine; the code is mainly in service of a visual result.
- File scope is <=3 files and predominantly UI/style-related.

**Engineering-led** (route to Cursor):
- Primary input is a functional requirement, bug report, or architecture change.
- The work involves state management, data fetching, routing, complex event handling, shared hooks, or cross-module integration.
- Component logic is non-trivial or requires understanding of application data flow.
- File scope is >3 files or touches non-UI modules.

**Ambiguous cases:** If a task has both design-led and engineering-led aspects, split it. Route the visual/styling subtask to Gemini and the logic/wiring subtask to Cursor in parallel when practical. If splitting is impractical, default to Cursor and note why.

**Hard boundaries for Gemini UI implementation:**
- Gemini must NOT be used for backend changes, API handlers, database logic, auth flows, or build/deploy configuration, even if they are triggered by a UI task.
- Gemini must NOT be used when the change requires modifying shared utilities, hooks with side effects, or state-management stores that serve non-UI concerns.
- If Gemini output fails typecheck or build and the fix requires understanding non-local application logic, escalate to Cursor rather than retrying with Gemini.

### Worker escalation heuristics

- Start with the cheapest sufficient worker/model pair.
- Escalate only when there is a concrete reason: weak output, high-stakes task, complex coupling, or deep ambiguity.
- Match prompt style to worker personality: bounded extraction/summarization to Gemini, coding/action loops to Cursor.
- For design-led UI implementation routed to Gemini: escalate to Cursor if the task grows beyond visual/styling work into significant state management, data-layer wiring, or cross-module integration. A useful trigger is when non-visual code becomes a substantial part of the change.
- Do not use a worker because it is stronger in the abstract; use it because it fits the task.
- Any explicit model override should have a one-line rationale tied to complexity, risk, or observed output weakness.

### Escalation triggers

- Required artifacts, facts, or citations are missing after one verification pass.
- Conflicting facts remain unresolved after checking local sources or tool output.
- The task crosses multiple modules or has architecture-level tradeoffs that the current worker/model is not handling cleanly.
- The change is high-stakes: security, data integrity, irreversible operations, or production-critical behavior.
- Tests, typecheck, or build failures require deeper reasoning than the current worker/model is giving.
