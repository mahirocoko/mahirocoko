# Letta → Pi: product intent, evidence and port acceptance

Date: 2026-10-23. Status: sanitized historical research summary, not an implementation or activation receipt.

## Publication boundary

This edition omits local machine paths, private task-board state, conversation quotations, terminal/session identifiers, installed-bundle fingerprints, private runtime receipts, detailed experiment accounting and links to unpublished artifacts. The original research included source inspection and bounded synthetic experiments; those private records are **not included here**. Retained experimental conclusions below are historical author-reported observations, not independently reproducible results supplied by this document.

Public source snapshots and repository-relative source references are retained where useful. Line numbers describe the inspected snapshot, not necessarily current source. Sanitization does not establish that those sources match any installed runtime, that a design was implemented, or that a human accepted it. Current implementation ownership, permissions and approval must be checked with their current owners rather than inferred from this dated report.

## Executive verdict

**Directionally aligned, with two different outcomes to prove.** Porting Letta's memory mechanisms can improve the foundation, but shipping a store/worker does not establish better use of knowledge, reduced recurrence or skill transfer. Preserve the existing companion and prove responsiveness first; evaluate behavior separately with portable tests.

The initial source/design review supported process isolation, bounded storage work, exact-root/CAS authority, one maintained-knowledge owner and nondestructive migration/rollback. It did not establish acceptance of later code, actual-root migration, runtime activation or behavioral improvement. Private design-review artifacts and subsequent task-state updates are omitted rather than presented as public proof.

Public source references used for the historical inspection:

- [Pi source snapshot](https://github.com/mahirocoko/mahiro-pi/tree/649135bff1ee8aacdbf946da6665ba615f4fabfb)
- [Letta Code source snapshot](https://github.com/letta-ai/letta-code/tree/c25f091d0fce1f032e5cdf67ce131d5b474e6576)
- [Earlier research and evaluation proposals](2026-10-22-harness-memory-skills-self-improvement.md)

These pins identify source, not an installed-build or deployment attestation.

## Product intent

The research target is a persistent coding companion that retains useful context and becomes better at work, not merely a larger memory directory:

- Relevant knowledge must be discoverable and correctly applied before decisions; project organization should not artificially hide relevant shared knowledge.
- Workers receive task-relevant, identity-scoped context, not the entire private corpus.
- After a correction, measure whether the same failure recurs on new eligible work. Skill creation, correct selection, application and transfer are separate claims.
- Experiments should evaluate bounded outcomes without requiring a human to score every output. Automated scores do not replace human-owned product acceptance.
- Include visual judgment, but do not equate automated preference scores with personal taste or use experiments to override an accepted production design.
- The primary UI must remain responsive while memory work runs. A correct result delivered by a blocking implementation is insufficient.

Do **not** expand a first memory port into automatic skill installation, a universal taste judge, a competing preference store or a recursive self-rewriting framework.

## P0 — port foundations and safety

| Requirement | Evidence the port must produce |
| --- | --- |
| Preserve the companion and existing data | Disposable-root migration/restart tests preserving identity, authoritative source/provenance and existing documents; no implicit reseed/overwrite. Separate data migration from activation. |
| Keep knowledge relevant across projects | Tests for shared identity/preferences and explicit relevant cross-project discovery; worker views stay separately scoped. |
| Keep heavy work off the UI event loop | Actual host-shaped projection/read/edit/integrate/cancel measurements at representative corpus sizes; distinguish model latency from event-loop blocking. |
| Avoid corpus-sized work for a small edit | Evidence of bounded/delta I/O or a clearly isolated worker design, including projection/readback as well as writes. Background LLM execution alone is insufficient. |
| Preserve authority and privacy | Exact-root checks, role/lease/generation/revision binding, revocation and stale-callback tests. Child processes must not inherit broader tool/credential/corpus authority by accident. |
| Correct publication and recovery | Committed-state projection, CAS/conflicts, interruption/crash recovery, data rollback and unchanged-baseline retention; migration and promotion remain separate actions. |
| Honest operation | Observability distinguishes queued/running/failed/committed/integrated/active. A successful tool return or Git commit is not proof of learning or current runtime activation. |

Private latency receipts are omitted. This report sets no arbitrary performance SLA: choose an explicit acceptable blocking/latency target before runtime acceptance.

## P1 — behavioral acceptance, not more storage

Start with a bounded current-owner discovery pilot. Give the same synthetic task requirements to baseline and candidate; change one discovery procedure at a time.

- Correct current facts despite stale or conflicting history.
- Return unknown when source/tests do not establish deployment, activation or human approval.
- Deliver authoritative evidence before the final decision, with grounded citations and a correct outcome.
- Keep near-miss questions that do not need memory correct; measure unnecessary reads rather than inventing a hidden failure rule.
- Prevent the solver from reading or rewriting protected fixtures/answer keys.
- Include new task families, negative cases, cost and latency. Repeating one corrected task is not transfer.

A read event plus a correct answer is an **observable application proxy**, not access to the model's internal reasoning or proof of causality. Compare complete outcomes and regressions; allow rejecting every candidate in favor of baseline.

## P2 — follow-on learning capabilities

After P1, evaluate one curated skill versus one bounded agent-generated skill, then one refinement cycle versus the best single-pass method. Do not claim storage rollback alone implements behavioral candidate selection.

Taste evaluation needs raw visual evidence and technical checks plus a separately calibrated blind visual judge. Development references are not an unseen holdout. Public references are not blanket licenses to redistribute assets or source.

These follow-ons need a suitable extension/testing seam, **not all their implementation inside the first memory port**.

## Historical source direction matrix

Paths below are relative to the pinned Pi source checkout linked above. These are static source findings, not executed tests or runtime measurements.

| Area | Observed source | Assessment |
| --- | --- | --- |
| Identity/projection/discovery | `lib/agent-memory/runtime.ts:831-855`; `lib/agent-memory/retrieval.ts:75-108,131-204`; `lib/agent-memory/store.ts:981-1032` | One-owner Core/index projection and bounded discovery are valuable foundations. Actual decision-time use remains to be measured. |
| Worker context | `agents/managed-memory-writer.md:1-40`; `lib/agent-memory/runtime.ts:513-536,777-804`; `lib/guards/index.ts:936-1056` | Retain identity-bound views and non-inherited corpus. Background dispatch is not proof of OS/thread isolation. |
| Synchronous storage | `lib/agent-memory/store.ts:217-226`; `lib/agent-memory/runtime.ts:831-855` | Synchronous work exists in the inspected owners, including request-time projection. This is not a newly measured live latency regression. |
| Corpus rewrite | `lib/agent-memory/store.ts:435-487` | Inspected `writeRevision` iterates and writes all `next.files` for changed revisions. Address storage work, not only model-process isolation. |
| Recovery/preservation | `lib/agent-memory/store.ts:735-760,817-900`; `docs/bootstrap.md:64-78,144-148` | Preserve root protection, CAS/conflict and rollback contracts. They do not establish migration or behavioral efficacy. |
| Two different reflection owners | `agents/managed-memory-writer.md`; `agents/memory-reflector.md:1-10`; `docs/agent-memory.md:136-150` | Synthesized maintained knowledge and low-authority literal historical quotes are different roles. Do not merge them or promote quotes into instructions. |
| Skills | The mapped writer does not manage skills | Do not advertise automatic skill growth/transfer as already delivered by the memory path. Evaluate it separately. |

## Sanitized experimental findings

The following summaries preserve negative findings and methodological lessons without publishing private runtime evidence. Detailed versions, model selections, prompts, counts, timings, costs, hashes, review logs and invocation records are omitted. **This public document cannot independently substantiate the reported outcomes or reproduce those experiments.** None is a current installation receipt or permission to run more inference.

### Controller calibration is not model efficacy

The original research reported scripted controller/oracle checks before model trials. Such checks can find grader defects and malformed-input failures but cannot establish persistent-memory learning, native responsiveness or taste improvement. A controller without solver filesystem/shell/network access is still not an OS sandbox by itself. Live adapters need trusted call/result traces; replayed or assistant-invented read logs are insufficient.

### Native completion and discovery-protocol failures

An initial synthetic native smoke reportedly produced a plausible answer while failing the end-to-end completion contract. An ambiguous hidden expected spelling also exposed a rubric-visibility defect. Neither a plausible answer nor offline reconstruction converts the original failed invocation into a clean success.

A later bounded discovery comparison reportedly failed in both arms because output did not comply with the mediated action protocol. This is evidence of a harness/protocol mismatch in that experiment, **not evidence that a candidate improves memory or that discovery generally regresses**. Do not salvage extra JSON objects, accept imagined tool results or retry to erase the failure. No native persistent memory was exercised by those synthetic routing probes.

### Pre-delivered evidence: baseline retained

A subsequent application-only comparison supplied both arms the same synthetic evidence packet before their final response. The author reported correct application in both arms and extra overhead without an observed accuracy gain for the generic discovery reminder. The resulting decision was **retain baseline; do not promote the candidate**.

Controller preloads are not solver discovery. These small curated cases were not a fully blind final holdout or a statistical consistency proof. Native completion remained nonclean under an explicit compatibility contract; application grading was not a clean native-success claim. Changed protocols and cases prevent treating earlier failure versus later application success as a controlled causal improvement estimate.

### No observed scheduling gap, no skill candidate

A separate baseline scheduling probe reportedly solved all sampled basic/stress cases under a published specification. With no observed gap in that sample, the conditional skill proposal did not trigger: no candidate or comparison was manufactured merely to claim a gain. This supports only the reported bounded calculation outcome, not a general conclusion that skills never help.

### Alternate tool-channel/startup boundaries remained unresolved

Source-only SDK feasibility checks found useful seams for explicit tool allowlists, synthetic resource loading and in-memory session/settings construction. They did **not** establish a complete credential-free startup recipe or transitive absence of private context. Empty credential stores alone do not disable later ambient-auth checks/refresh. API availability does not grant runtime permission. One source-inspection branch exceeded its declared operating budget; source-reading time alone must not be reported as whole-job compliance.

A separate synthetic OS-boundary probe reportedly terminated before producing a usable sandbox result. Absence of sandboxed writes is not denial proof, and that failure does not establish universal lack of sandbox support. Metadata-only model lookup likewise did not establish usable inference, visual capability, taste or skill-learning improvement.

A later read-only fixture review supported **pattern reuse only**, not execution admission or acceptance of the memory port. A fixture with synthetic provider setup, environment redirection or broad trusted tools is not a ready-made solver confinement boundary. Historical source versions and actual loaded runtime must be reconciled before compatibility claims.

## Evidence and acceptance limits

Keep these claims separate:

1. **Public source support:** inspect the pinned sources and verify the relevant mechanism. This document does not attest to their current deployment.
2. **Historical private observations:** the sanitized summaries above are author-reported and lack public receipts. Independent reproduction is still required before using them as acceptance evidence.
3. **Runtime correctness:** requires executed host-shaped tests, migration/recovery checks and trusted traces under scoped authority.
4. **Behavioral improvement:** requires fair paired tasks, protected holdouts, transfer/regression checks and full cost/coverage accounting.
5. **Human acceptance:** remains with the human owner; neither source review nor experimental output establishes it.

No persistent-memory learning, skill acquisition/transfer, taste improvement, Pi responsiveness, actual-root migration or later implementation acceptance is established by the retained experiment summaries. Unmeasured billing, internal retries, retention and OS confinement remain unknown, not zero or safe by implication.

## Handoff

The useful request to a port author is:

> Preserve the companion/data/authority contracts; remove parent-side blocking and corpus-sized small-operation work; provide a portable adapter/testing seam; and keep native memory correctness, runtime responsiveness and demonstrated learning as separate acceptance gates. Use these requirements as evidence targets, not as a demand to build all self-improvement features in the first port.

This historical research does not grant source-write, inference, profile/auth/default changes, migration, activation, commit, push or release authority. It does not claim current task delivery, read acknowledgement or product acceptance. Any further execution requires its own current scope, budget and technical gates.
