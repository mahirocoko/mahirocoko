# Host-managed Gemini workers need thin wrapper boundaries

**Date**: 2026-04-03
**Tags**: #orchestration #gemini #worker #wrapper #contracts #runtime-boundaries

## Lesson

When I want to use `gemini -p` as a subordinate worker, the right design is not to make Gemini behave like a native runtime notification source. The stable boundary is a thin host-managed wrapper that owns task context, invokes Gemini in headless mode, normalizes stdout/stderr into a machine-readable envelope, and lets the host decide how to re-emit completion or failure.

## Why it mattered today

The code and docs study showed that `-p` is a genuine headless path and works well for one-shot worker behavior, but `-m` only pins the requested model at the start of the flow. Downstream routing, fallback, availability, and auth-driven adjustments can still alter the effective model. That means the wrapper must preserve both the requested model and whatever the runtime reports back.

At the orchestration level, OpenCode and Oh My OpenAgent reinforced the same pattern: async work is surfaced through host-side managers, hooks, queues, or event bridges. The worker itself is not the source of native runtime reminders. That architectural agreement made the implementation choice much simpler.

## Durable takeaway

For subordinate CLI workers, optimize for:

1. one clean stdin contract
2. one clean stdout result envelope
3. explicit failure categories
4. host-owned retries, notifications, and scheduling

If a wrapper is meant for another orchestrator to consume, failure labeling is part of the product surface. A schema mismatch from worker output is not caller `invalid_input`; it is an output/normalization failure and should be reported that way.
