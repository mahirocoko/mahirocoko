# Astra effort vs Sol High benchmark

## Question

How much do `gpt-6-astra` low, medium, and high differ on bounded coding work, and does Astra Low outperform `gpt-5.6-sol` high on this sample?

## Matrix

- `gpt-6-astra` + low
- `gpt-6-astra` + medium
- `gpt-6-astra` + high
- `gpt-5.6-sol` + high
- Three independent tasks: easy, medium, hard
- Twelve fresh interactive Codex sessions

Each task uses one identical prompt file across all four configurations. Candidate labels were shuffled once and kept separate from deterministic grading until reveal.

## Execution reality

- Codex CLI `0.153.4`
- Visible pane-first Direct CLI sessions launched through Herdr
- `--model <model> -c model_reasoning_effort=<effort>`
- `--sandbox workspace-write --ask-for-approval never`
- The current Codex user configuration, `~/.codex/AGENTS.md`, RTK, plugins, and skills were intentionally present. This measures the real local Direct CLI workflow, not isolated base-model capability.
- Model and effort were verified from each fresh TUI startup and later `/status` output.
- No network requirement and no package installation
- Fresh copied OS-temporary workspace and fresh session for every run
- Public and hidden tests use only Node.js built-ins
- Per-task quality score is deterministic: public tests 20%, hidden tests 70%, protected-file integrity 10%
- Tier results are primary. The secondary aggregate weights easy 20%, medium 30%, and hard 50%.
- Latency and approximate context usage are reported separately, not mixed into correctness.

## Fairness and limitations

- Candidate workspaces were independent temporary roots; hidden tests and candidate mapping were not ancestors of the workspaces.
- Transcript audit found no hidden-test, grader, or mapping references in any candidate session.
- This is filesystem separation, not a chroot or separate OS user. A deliberately adversarial candidate could attempt a machine-wide search.
- The four prompts in each wave were dispatched in a stable A/B/C/D order with about 30 seconds between shell launches because the controller yielded each command before launching the next. Reported elapsed time is per run, but machine-load conditions were not perfectly simultaneous or randomized by task.
- `/status` context-used values are rounded and include the Direct CLI context plus tool interaction. They are a cost proxy, not exact billed input/output token counts.
- The first easy timing wrapper completed model work but failed afterward on zsh's read-only `status` variable; its elapsed values come from the command-task durations. No model run was repeated.
- Three evaluator interpretations were corrected uniformly after shared failures exposed them: the easy suffix-fit expectation, medium assumptions about initial-file persistence plus empty-owner handling for `ack`/`fail`, and the ambiguous treatment of top-level `attempt` on a legacy direct input. All existing outputs were regraded; no model received a follow-up prompt.
- One run per task/config is directional workflow evidence, not a universal model ranking.

## Reproduce deterministic grading

```bash
node grader.mjs
node reveal.mjs
```

See `RESULTS.md` for the revealed table and bounded routing conclusion.
