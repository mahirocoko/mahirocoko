# GPT benchmarks and a bounded subagent-routing trial

Research date: **11 November 2026**. These are dated observations, not a live leaderboard or a universal model ranking.

## Quick findings

- **Codex + GPT-6.1 Sol Max** scored close to **Codex + GPT-6 Astra Max** on the current Coding Agent Index, at approximately one-fifth of its API cost per benchmark task.
- **Codex + GPT-6.1 Terra Xhigh** scored almost identically to Terra Max, with lower cost and active runtime. More reasoning effort did not improve this aggregate.
- **GPT-6 Luna** offers low API cost, but its coding-agent score was substantially lower. Low token prices do not guarantee low total cost once rework and supervision are included.
- These results motivated an explicitly approved, limited **Pi routing trial**. They do not establish that a Codex result transfers unchanged to Pi, visual review, or Thai copy review.

## How to read the numbers

Two different indexes are reported separately:

| Measure | Version | What it means |
| --- | --- | --- |
| Artificial Analysis Intelligence Index | **v5.0.1** | A composite of nine knowledge-work, coding, science and general evaluations |
| Artificial Analysis Coding Agent Index | **v2.0** | Equal-weight average of FrontierCode v1.1, Terminal-Bench 4.0 and SWE-Atlas-QnA-AA |

Neither index is a universal correctness percentage. Do not compare a number from one index directly with a number from the other.

General-model **time per task** is estimated from token usage and representative API speed. Coding-agent **time per task** is observed active agent wall time, excluding environment startup and evaluator overhead. Costs are average pay-per-token API costs for the relevant benchmark workload, not subscription charges or a fixed price for every real task.

The Coding Agent Index uses three attempts per task, averages those attempts within each task, and then averages task scores. That is not best-of-three performance. Model, effort, harness and execution settings remain part of the evaluated configuration. Small score differences do not establish statistical superiority; no significance analysis was performed here.

## General intelligence: current model configurations

Source: [Artificial Analysis model leaderboard](https://artificialanalysis.ai/leaderboards/models). Figures are rounded; missing data is not zero.

| Model / effort | Intelligence index | API USD/task | Estimated min/task |
| --- | ---: | ---: | ---: |
| GPT-6 Astra Max | 56.9 | 6.245 | 22.9 |
| GPT-6 Astra Xhigh | 55.3 | 3.659 | 11.3 |
| GPT-6 Astra High | 54.8 | 3.239 | 9.7 |
| GPT-6.1 Sol Max | 54.6 | 1.272 | 20.2 |
| GPT-6.1 Sol Xhigh | 52.5 | 0.764 | 9.0 |
| GPT-6 Astra Medium | 51.6 | 2.732 | 7.0 |
| GPT-6.1 Terra Max | 51.3 | 0.961 | 13.5 |
| GPT-6.1 Sol High | 50.3 | 0.591 | 6.7 |
| GPT-6.1 Sol Medium | 46.3 | 0.359 | 3.9 |
| GPT-6.1 Terra Xhigh | 45.3 | 0.401 | 6.0 |
| GPT-6 Astra Low | 43.3 | 1.424 | 3.8 |
| GPT-6.1 Terra High | 42.4 | 0.259 | 4.0 |
| GPT-6.1 Terra Medium | 38.2 | 0.169 | 2.6 |
| GPT-6.1 Sol Low | 34.8 | 0.161 | 1.7 |
| GPT-6.1 Terra Non-reasoning | 30.5 | 0.226 | 2.3 |
| GPT-6.1 Terra Low | 29.4 | 0.071 | 1.1 |
| GPT-6 Luna Max | 27.9 | 0.152 | 11.5 |
| GPT-6 Luna Xhigh | 23.5 | 0.104 | 7.1 |
| GPT-6 Luna High | 21.4 | 0.073 | 5.7 |
| GPT-6 Luna Medium | 18.5 | 0.042 | 3.4 |
| GPT-6 Luna Low | 9.7 | 0.005 | 0.6 |
| GPT-6 Luna Non-reasoning | 9.4 | 0.071 | 1.9 |
| GPT-6 Sol, Daybreak Blue Max | Not published | — | — |

## Coding agents: Codex configurations

Source: [Artificial Analysis coding agents](https://artificialanalysis.ai/agents/coding-agents). Only Codex configurations are included below; hybrid/router systems are not attributed to a single GPT model.

| Model / effort, in Codex | Coding index | API USD/task | Active min/task |
| --- | ---: | ---: | ---: |
| GPT-6 Astra Max | 54.7 | 7.036 | 24.8 |
| GPT-6.1 Sol Max | 54.1 | 1.505 | 23.7 |
| GPT-6.1 Terra Xhigh | 48.2 | 0.691 | 16.4 |
| GPT-6.1 Terra Max | 48.1 | 1.240 | 26.1 |
| GPT-6.1 Terra High | 46.3 | 0.544 | 12.7 |
| GPT-6.1 Terra Medium | 42.0 | 0.395 | 10.2 |
| GPT-6.1 Terra Non-reasoning | 39.2 | 0.454 | 9.5 |
| GPT-6.1 Terra Low | 34.9 | 0.199 | 6.3 |
| GPT-6 Luna Max | 31.2 | 0.156 | 20.8 |

Using the unrounded source values, Astra Max costs approximately **4.68 times** as much as Sol Max per coding benchmark task. Terra Xhigh costs approximately **44% less** and uses approximately **37% less active time** than Terra Max. Those comparisons describe this snapshot, not guarantees for another workload.

Missing Sol/Astra effort configurations were not inferred from their general-intelligence results.

## Older model pages

These dedicated pages displayed the current Intelligence Index version but were marked **deprecated by Artificial Analysis**. That label does not independently verify provider availability or retirement. Older-model costs are displayed source values, not reconstructed from launch pricing.

| Model / Max effort | Displayed intelligence index | API USD/task | Estimated min/task |
| --- | ---: | ---: | ---: |
| [GPT-5.6 Sol](https://artificialanalysis.ai/models/gpt-5-6-sol) | Not published | — | — |
| [GPT-5.6 Terra](https://artificialanalysis.ai/models/gpt-5-6-terra) | 32 | 3.73 | 10.9 |
| [GPT-5.6 Luna](https://artificialanalysis.ai/models/gpt-5-6-luna) | 24 | 0.33 | 8.6 |
| [GPT-6 Sol](https://artificialanalysis.ai/models/gpt-6-sol) | 44 | 2.47 | 7.4 |

The [July GPT-5.6 launch analysis](https://artificialanalysis.ai/articles/gpt-5-6-has-landed) used **Intelligence Index v4.1** and an older coding suite containing DeepSWE, Terminal-Bench v2 and SWE-Atlas-QnA. Its historical scores are not replacements for missing current scores, and score changes across those versions do not by themselves establish model regression.

## Approved local routing trial

These are the routes approved and applied during this session, not package defaults. The canonical owners remain the user-local agent descriptors; this research record does not install or synchronize them.

| Role | Trial route | Default thinking | Caller lock |
| --- | --- | --- | --- |
| `implementer` | GPT-6.1 Sol | Medium | Model only |
| `repo-scout` and `Explore` alias | GPT-6.1 Terra | Medium | Model only |
| New `verifier-high-risk` | GPT-6.1 Sol | High | Model only |

The ordinary verifier remains GPT-6.1 Terra High. Researcher, advisor/Plan, general-purpose, UI/Thai review and package memory/commit roles were left unchanged. No primary-session model, provider/auth configuration or permission setting was changed.

The high-risk verifier is for independent checks of authority, security, persistence, concurrency and recovery. It has the ordinary verifier's existing tools and a read-only product-source contract. Because that tool set includes Bash, this is **not an OS-level read-only sandbox**.

### Effort selection is not self-escalation

For a role declaring `locked: model`, Main may supply a supported `thinking` level when spawning it. If omitted, the descriptor's default applies. This does not give the child a control for raising its own reasoning effort mid-run, and it does not change Main's own thinking level. Roles that still lock thinking retain that restriction.

Start bounded implementation and discovery at Medium. Escalate for concrete ambiguity, a failed hypothesis or material risk rather than setting every role to Max. Keep a single writer per checkout and an independent reviewer; separate role/session ownership matters even when the writer and reviewer use the same model family.

Give each delegate a concrete outcome, allowed paths, non-goals, required checks, a bounded investigation budget and a useful partial-result/blocker contract. Evaluate the trial using completed-and-checked work, human interventions, scope drift, missed defects, time and total cost before considering broader migration.

### Verification and limits

- Cross-checked **22 scored general-model configurations** against their rendered leaderboard score/cost/time values.
- Checked all **nine Codex composite scores** against the mean of their three benchmark components, and verified hashes for all ten collected public pages.
- **64 native loader/resolver checks passed**, including exact changed descriptor bytes, accepted thinking overrides and rejected conflicting model overrides.
- A separate read-only verifier independently passed the routing review and confirmed the ten unaffected role descriptors remained byte-identical.
- A completed native child selected GPT-6.1 Sol with High thinking. That verifies a dispatch at the selected route, not an independent provider attestation or comparative model-quality win.
- The canonical workflow-memory update was published and its health check passed. Private memory bodies, installed descriptor copies, native session transcripts and raw runtime artifacts are deliberately not published here.

## Retrospective

The useful change was not simply choosing a newer model. It was separating public benchmark evidence, local workflow behavior and runtime configuration. Earlier local fixtures measured the installed rules and harness as well as the model; they were not a clean universal ranking. The effort discussion also exposed an important operational distinction: a recommendation to increase effort is ineffective while the role locks thinking.

Keep the routing change bounded and reversible. The immediate result is a verified configuration trial, not proof of improved daily productivity. Future work should test whether it reduces rework and human intervention without hiding defects or expanding scope. Existing canonical guidance already covers evidence-backed routing, so no duplicate learning policy was promoted from this retrospective.

## Source and methodology links

- [Artificial Analysis model leaderboard](https://artificialanalysis.ai/leaderboards/models)
- [Artificial Analysis coding-agent results](https://artificialanalysis.ai/agents/coding-agents)
- [General methodology and cost/time definitions](https://artificialanalysis.ai/methodology)
- [Intelligence Index methodology](https://artificialanalysis.ai/methodology/intelligence-benchmarking)
- [Coding Agent Index methodology](https://artificialanalysis.ai/methodology/coding-agents-benchmarking)
- [Historical GPT-5.6 launch analysis](https://artificialanalysis.ai/articles/gpt-5-6-has-landed)
- [SWE-bench](https://www.swebench.com/) and [Terminal-Bench](https://www.tbench.ai/) for benchmark-specific context

This document is a sanitized research and decision record. Raw evidence and the full personal retrospective remain local and ignored; the absence of those files from the repository is intentional.
