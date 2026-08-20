# oh-my-opencode-slim centers orchestration around host-owned tasks

**Date**: 2026-08-19  
**Tags**: `opencode`, `orchestration`, `background-tasks`, `prompt-cache`, `multiplexer`, `testing`

## Lesson

`oh-my-opencode-slim` is a useful reference for building orchestration as a host plugin rather than replacing the host runtime. OpenCode remains authoritative for model execution, sessions, native tasks, permissions, and most tool execution. Slim layers agent definitions, local task indexing, generation and lease fencing, reconciliation, prompt-safe state projection, pane visibility, and optional UI surfaces around those contracts.

Its most load-bearing implementation idea is prompt-cache discipline: deterministic context is appended without rewriting earlier payload content; `latest` isolates refreshed volatile state at the trailing edge, while `checkpoint-compatible` appends bounded stable snapshots. Both invariants are protected by property tests, snapshots, a source tripwire, and runtime telemetry.

The codebase is also a reminder that strong subsystem tests do not prove the composition boundary. Its configuration, hook, task-state, cache, multiplexer, and interview tests are broad, while the large v1 factory, v2 setup adapter, real host/process integrations, and external tool edges have materially lower end-to-end confidence.

## Durable behavior

- When studying orchestration plugins, separate host-owned execution truth from plugin-owned coordination indexes and UI projections.
- Treat prompt order and byte-prefix stability as explicit contracts whenever hooks mutate model requests.
- Use generation IDs, leases, and reconciliation for asynchronous task control instead of trusting local optimistic state.
- Audit the composition root and adapter boundaries separately from well-tested subsystems before claiming runtime confidence.
- Distinguish documented package exports from convenient internal source barrels when mapping integration surfaces.

## Detailed source

- `.agent-state/learn/alvinunreal/oh-my-opencode-slim/repo.md`
- `.agent-state/learn/alvinunreal/oh-my-opencode-slim/2026-08-19/2230_ARCHITECTURE.md`
- `.agent-state/learn/alvinunreal/oh-my-opencode-slim/2026-08-19/2230_TESTING.md`
- `.agent-state/learn/alvinunreal/oh-my-opencode-slim/2026-08-19/2230_API-SURFACE.md`

## Orchestration follow-up — 2026-08-20

The transferable unit from Slim is not an exact model mapping. It is the whole lane contract: role, prompt, permissions, tools/MCPs, context, effort, and validation owner. Slim leaves every built-in `DEFAULT_MODELS` entry undefined; generated presets and user config supply model identity later, and the author's real daily preset differs materially from the onboarding OpenAI preset.

Mahiro Code should keep Sol High as the durable main and preserve fresh verification, but its routing taxonomy currently groups narrow scout/status work with long execution under Luna Max more broadly than evidence supports. Split those task classes before testing lower-effort scout routes. Also state read-only boundaries honestly: current repo-scout/verifier definitions exclude Edit/Write but retain Bash, so they are partially restricted rather than hard read-only.

Do not import Slim's unmeasured `2x/5x/10x` prompt statistics, generic Designer taste, automatic fanout, or exact Terra/Sol/Luna assignments. Compare route changes on real tasks with controlled packets and track DoD completion, repeated continue prompts, rework, elapsed time, cost, verifier refutations, coordination overhead, and Mahiro-found defects.

Detailed study: `.agent-state/learn/alvinunreal/oh-my-opencode-slim/2026-08-20/1107_ORCHESTRATION-MODEL-ROUTING.md`.
