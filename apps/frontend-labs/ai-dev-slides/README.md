# AI Dev Talk — Slide Candidates

Three independent static HTML deck candidates were generated from the now-superseded [`docs/ai-reliability/ai-for-developers-slide-outline.md`](../../../docs/ai-reliability/ai-for-developers-slide-outline.md). The selected follow-up was later rewritten around Mahiro's directly described code workflow.

| Candidate | Model | Visual direction |
| --- | --- | --- |
| [`gemini-3.7-flash-high`](./gemini-3.7-flash-high/) | `gemini-3.7-flash-high` | Precision Studio Graphite |
| [`claude-opus-4.6-thinking`](./claude-opus-4.6-thinking/) | `claude-opus-4-6-thinking` | Strata |
| [`cursor-grok-4.6-high`](./cursor-grok-4.6-high/) | `cursor-grok-4.6-high` | Context Filament |
| [`groomed-grok-opus`](./groomed-grok-opus/) | Mahiro workflow + Main copy + Grok baseline + Kimi refinement | Active 9-slide Workflow Context Filament; Mahiro review pending |

Each candidate was implemented in its own isolated directory from the same prompt and source packet. Candidate files remain independent so visual comparison does not silently merge one model's direction into another.

The `groomed-grok-opus` candidate started after Mahiro selected Grok's visual direction and Opus's content treatment. On 18 August 2026, Mahiro replaced its tool-history narrative with a concrete code-workflow talk; `grooming-notes.md` is the current narrative contract. The three raw model candidates remain unchanged historical comparisons.

## Preview

```bash
python3 -m http.server 4320 --directory apps/frontend-labs/ai-dev-slides
```

Open <http://localhost:4320/> and select a candidate.

Common controls:

- `ArrowLeft` / `ArrowRight`, `PageUp` / `PageDown`, `Home` / `End`, `Space`
- `N` toggles speaker notes
- raw candidates keep the current slide in `#1` through `#12`
- the active groomed deck uses `#1` through `#9`

Read each raw candidate's `candidate-notes.md` for its authored visual direction and self-reported checks. For the active groomed deck, use `grooming-notes.md`; final human visual/product acceptance remains pending.
