# Learning: Verify capability layers and isolate evaluation priors

**Date**: 2026-07-10
**Tags**: GPT-5.6, Codex, Letta-Code, direct-cli, uncodixify, skill-policy, runtime-verification

## Lesson

New model capabilities should be verified independently at three layers:

1. **Provider/product claim** — what the announcement says.
2. **Native runtime** — what the current CLI/model selector actually exposes.
3. **Host integration** — what Letta Code or another orchestrator currently wires through.

GPT-5.6 demonstrated why this matters. Codex 0.144.1 exposes Sol/Terra/Luna with separate reasoning effort and supports ultra automatic delegation for Sol/Terra, while Luna stops at max. Letta Code 0.28.0 supports GPT-5.6 through max but does not expose ultra. A model handle alone is also insufficient because effort may be stored separately or resolve to an unintended default.

Evaluation policy must isolate strong prompting/skill priors. To understand GPT-5.6 Sol's native UI taste, do not load `uncodixify` before the baseline rendered pass. Use repo rules, product brief, explicit references, and native model judgment first. Then apply `uncodixify` in audit mode if concrete generic-AI drift appears; use enforce mode only after explicit request or accepted findings.

## Operational Rules

- Keep Codex model slug and `model_reasoning_effort` separate.
- Use Sol high for normal flagship work; enable ultra only for genuinely parallelizable jobs.
- Choose either manual multi-pane fanout or one deliberate ultra lane by default; avoid nested delegation explosions.
- Treat installed skill copies as runtime artifacts, not canonical source. Pull source, compare, sync deliberately, and reload.
- For design-taste experiments, compare rendered outcomes—not source code alone—and keep prompt/assets/viewport/commit fixed across lanes.

## Reuse

Before the next GPT-5.6 or frontend taste experiment, read:

- `docs/openai/gpt-5-6-model-guide.md`
- `mahiro-skills` v0.1.52 `skills/direct-cli/SKILL.md`
- `mahiro-skills` v0.1.52 `skills/uncodixify/SKILL.md`
- memory note `mahiro-skills/direct-cli.md`
