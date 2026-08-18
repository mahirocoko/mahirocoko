# Grooming notes

Current narrative owner: Mahiro's directly described code workflow, clarified with the main agent on 18 August 2026  
Visual lineage: Cursor Grok Context Filament baseline + Kimi K3 workflow-deck refinement  
Human visual/product acceptance: pending

## Current thesis

This is no longer a tool-history deck. It explains the code workflow Mahiro actually uses.

The memorable distinction is limited to entry:

- **New project:** create context and rules.
- **Existing project:** load context and rules.
- **After entry:** both use the same understand → execute → verify → learn → retain loop.

The prior AI Chat → Claude Code → MCP → OpenCode → Letta chronology is superseded in the active deck. Because the package is still untracked, its dated historical files and assets remain in place until Git can preserve them.

## Binding content contracts

- `mahiro-style` supplies doctrine while a new repo is silent; once local docs exist, repo-local reality wins.
- The exact bootstrap skill is `mahiro-docs-rules-init`.
- CocoIndex is two jobs: `cocoindex-rules-init` establishes secret-safe project rules, then `ccc` owns indexing and semantic search.
- Existing work starts from `recap`, repo docs, Git state, current behavior, and code ownership—not a global redesign preference.
- `project` owns finding/cloning/tracking external repos; `learn` owns studying their architecture, patterns, commands, and gotchas.
- External source intake ends in Keep / Adapt / Reject, never blind copying.
- Model names are dated working examples. Routing principles—capability, effort, risk, cost, and main-context isolation—are durable.
- Start with the main agent doing the work. Use a Letta subagent when role or context needs separation; use Agy, Cursor, Codex, or Pi as optional direct executor lanes only when executor-specific capability or environment is useful.
- Herdr and Agent Halo support direct/multi-lane visibility; they are not required for every task. `ccc`, browser evidence, and Mahiro Skills can be used at every execution layer.
- Agent verification is not Mahiro acceptance.
- `rrr` writes both a retrospective and durable local lesson note; there is no current `--store` mode.
- `mahiro-guidance-refine` proposes evidence-backed repo-guidance changes and requires approval before editing docs or rules.
- `git-commit` runs only after explicit human authorization.

## Active slide jobs

### 1 — Workflow poster

Promise the practical code workflow. New and existing projects are named as two entry modes, not two unrelated systems.

### 2 — Two entry modes

Show create-context and load-context paths converging into one shared loop. This is the deck thesis.

### 3 — New project bootstrap

Stack/structure → `mahiro-style` → `mahiro-docs-rules-init` → `cocoindex-rules-init` / `ccc`. Sync exclusions, pass filename-only preflight and the explicit strict scan gate before indexing. Close by handing source-of-truth ownership to repo-local docs.

### 4 — Existing project re-entry

`recap` → AGENTS/docs/Git state → current behavior → `ccc` or exact search. `mahiro-style` fills gaps only.

### 5 — Shared execution loop

Define done, choose main or specialist execution, implement, verify with real evidence, then return product/visual acceptance to Mahiro. Current model examples remain secondary.

### 6 — Choose the execution path

Show the escalation path Main → Letta subagent → direct executor lane. The durable point is to add orchestration only when the task needs it, not to send every job to direct CLI.

### 7 — Learn from source

Use `project` and `learn` when blocked or when a useful external repo appears. Bring evidence back through Keep / Adapt / Reject.

### 8 — Close the loop

Place retrospection, guidance refinement, contract drift audit, explicit commit, and handoff in the order they become useful.

### 9 — Q&A

Project only one centered `Q&A`. Discussion prompts remain in speaker notes.

## Controls

| Input | Action |
| --- | --- |
| `→` `PageDown` `Space` | Next |
| `←` `PageUp` `Shift+Space` | Previous |
| `Home` / `End` | First / last |
| On-slide **ก่อนหน้า** / **ถัดไป** | Previous / next |
| Horizontal swipe / pointer drag | Previous / next |
| `N` | Toggle speaker notes (`<dialog>`) |
| URL hash | `#1`–`#9` |

`prefers-reduced-motion` disables view transitions and dialog motion. The active runtime derives the total from the DOM.
