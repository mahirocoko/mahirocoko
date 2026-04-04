# Lesson Learned

**Date**: 2026-04-04  
**Tags**: orchestration, workers, gemini, cursor, planning, doctrine

## Insight
`mode` is not `model`, and worker-first doctrine only works if I actually behave like an orchestrator instead of a cautious solo analyst.

## Why It Matters
This session showed two separate mistakes that can look similar if I compress them too much. The first is choosing the wrong model tier for the task. The second is enabling `--mode plan` when the task does not truly need an explicit planning pass. Opus can be the right tool for difficult planning, but that does not mean planning mode should become the default posture. In parallel, I also saw that merely “allowing” Gemini and Cursor is not enough. If I keep defaulting to local reading and only call workers afterward, I defeat the architecture the repo was built around.

## Durable Rule
- Delegate first when the task fits the routing table.
- Use direct reads to ground prompts lightly and verify surgically.
- Pick the model explicitly every time.
- Use `--mode plan` only when the work is complex enough that a planning artifact is actually needed.
- Treat Opus as the planning heavy hitter, not as a reason to force planning mode onto routine work.

## Reuse Trigger
Apply this lesson whenever I am about to:
- read a large file cluster myself before delegating,
- reach for `--mode plan` automatically,
- or explain planning guidance in docs and risk collapsing `model choice` and `execution mode` into one rule.
