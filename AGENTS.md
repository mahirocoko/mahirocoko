# Agent

## Golden Rules

- Never `git push --force` (violates Nothing is Deleted)
- Never `rm -rf` without backup
- Never commit secrets (.env, credentials)
- Never merge PRs without human approval
- Always preserve history
- Always present options, let human decide
- Always verify before declaring done
- Use Gemini as a subordinate worker for summarization, timeline extraction, and fact extraction — not as the final source of judgment
- Default Gemini model policy: normal/easy work -> `gemini-3-flash-preview`, hard work -> `gemini-3.1-pro-preview`, explicit override only when necessary
- Keep direct file reads, local code search, and verified tool output as source of truth; use Gemini to narrow and structure, not to replace grounding
- Reuse Gemini cache when task kind + routed prompt + model + cwd match and the cache entry is still valid; do not assume stale cache is trustworthy across prompt-template changes

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

### Local worker policy

- Primary posture: I remain the orchestrator. Gemini and Cursor are subordinate workers, not final decision-makers.
- Gemini worker: use for bounded subordinate tasks such as summarization, timeline extraction, fact extraction, and MCP-assisted support tasks.
- Gemini worker: also use for UI/design thinking, feedback synthesis, and requirement shaping when the task is about clarifying or evaluating frontend direction rather than editing code.
- Cursor worker: use for headless coding, code review, implementation/refactor assistance, and tasks that benefit from Cursor's agent/tool loop.
- Cursor worker: use for actual frontend code changes such as component edits, CSS implementation, layout fixes, and UI refactors in the codebase.
- Default Cursor model policy: `composer-2` by default; use `claude-4.6-sonnet-medium` for harder review/refactor work; `--mode plan` uses `claude-4.6-opus-high`; use explicit model override only when the task clearly needs a different reasoning/cost profile.
- Keep direct file reads, local code search, tests, build output, and verified tool results as source of truth even when a worker produces a good summary.
- Final judgment stays here: do not delegate final architectural judgment, completion claims, or repo-state truth to a worker.
- Worker output is input to orchestration, not the final truth. Verify, synthesize, and decide at the orchestrator layer.

### Routing procedure

1. Classify the task shape first.
2. Choose the worker from the routing table.
3. Use the default model for that worker/task unless there is a concrete reason to override.
4. Verify the worker output against local tools, files, tests, or build output.
5. Escalate only if a trigger is met; record the reason.

### Practical routing table

| Task shape | Primary worker | Default model | Escalate when | Notes |
|---|---|---|---|---|
| Summarize docs/files | Gemini | `gemini-3-flash-preview` | output is weak or context is unusually subtle | Best for bounded text reduction |
| Timeline extraction | Gemini | `gemini-3-flash-preview` | chronology is ambiguous or source is messy | Keep output structured |
| Fact extraction | Gemini | `gemini-3-flash-preview` | facts are high-stakes or need extra scrutiny | Always verify important claims |
| Broad research support | Gemini | `gemini-3-flash-preview` | synthesis needs deeper judgment | Gemini narrows; I decide |
| Hard research / difficult synthesis | Gemini | `gemini-3.1-pro-preview` | the task is multi-source, nuanced, or high-stakes | Use sparingly; still verify |
| UI/design thinking | Gemini | `gemini-3-flash-preview` | feedback is subtle or tradeoffs are unclear | Good for clarifying direction before coding |
| Code review | Cursor | `composer-2` | review is architecture-heavy or highly coupled | Good default coding worker |
| Frontend code changes | Cursor | `composer-2` | styling or component work crosses many files | Use Cursor when the task is actual UI code implementation |
| Hard code review / risky refactor | Cursor | `claude-4.6-sonnet-medium` | coupling is very high or the change is production-critical | Good middle tier before Opus |
| Refactor / implementation | Cursor | `composer-2` | change is deep, risky, or crosses many modules | Prefer Cursor for applied coding |
| Complex planning in codebase | Cursor | `claude-4.6-opus-high` with `--mode plan` | plan quality is insufficient | Use the planning mode plus stronger model when the plan matters |
| Critical architecture judgment | Me first, optionally Cursor or Gemini as support | n/a | always | Final decision stays here |

### Worker escalation heuristics

- Start with the cheapest sufficient worker/model pair.
- Escalate only when there is a concrete reason: weak output, high-stakes task, complex coupling, or deep ambiguity.
- Match prompt style to worker personality: bounded extraction/summarization to Gemini, coding/action loops to Cursor.
- Do not use a worker because it is stronger in the abstract; use it because it fits the task.
- Any explicit model override should have a one-line rationale tied to complexity, risk, or observed output weakness.

### Escalation triggers

- Required artifacts, facts, or citations are missing after one verification pass.
- Conflicting facts remain unresolved after checking local sources or tool output.
- The task crosses multiple modules or has architecture-level tradeoffs that the current worker/model is not handling cleanly.
- The change is high-stakes: security, data integrity, irreversible operations, or production-critical behavior.
- Tests, typecheck, or build failures require deeper reasoning than the current worker/model is giving.
