# Brand Skill Generator V2 Intake Design

Date: 2026-03-17
Status: Approved design draft

## Summary

Upgrade `brand-skill-generator` from a source-driven operator workflow into a two-layer system:

1. a conversational intake layer that asks for missing information one question at a time
2. the existing deterministic generator engine that runs `inspect`, `generate`, or `refresh`

The main purpose of `v2` is to stop the skill from generating misleading brand bundles when the user provides incomplete or ambiguous inputs, especially when reference websites are intended as mood sources rather than brand truth.

## Problem

The current skill behaves like a capable engine with a weak operator experience.

What works now:
- deterministic CLI execution
- source inventory building
- validation warnings
- weighted synthesis
- bundle and report rendering

What is missing:
- conversational intake when the user starts with only a brief
- source-role classification
- a structured way to distinguish `brand truth` from `mood reference`
- a user approval checkpoint before execution

This causes three practical failures:

1. incomplete user inputs force the operator to manually convert ideas into source docs
2. strong reference websites can dominate synthesis even when they were only meant to guide mood
3. the skill can technically generate a bundle even when the source posture is weak or semantically wrong

## Goals

- Accept partial user input such as a short brief, a URL, or a few files
- Detect what is missing before execution
- Ask one clarifying question at a time until the source posture is usable
- Introduce source roles so the system can treat `brand truth` and `mood reference` differently
- Summarize the execution plan and get approval before running the engine
- Preserve the existing CLI as the deterministic backend

## Non-Goals

- Replacing the current synthesis engine in `v2`
- Full freeform brand generation from prose alone without producing source material
- Automatic visual understanding from screenshots beyond the current adapters
- Multi-brand orchestration
- Browser UI for intake management

## Design Principles

- Ask before guessing
- One question at a time
- Separate conversational ambiguity handling from deterministic generation
- Preserve explicit brand truth over implied aesthetic inspiration
- Make confidence gaps visible before execution, not only after

## Proposed Architecture

`v2` introduces a new intake layer ahead of the current pipeline.

### Layer 1: Conversational Intake

Responsibilities:
- analyze the user request and existing local context
- detect known inputs and unknowns
- ask targeted clarifying questions
- assemble a normalized source plan
- obtain user approval before execution

### Layer 2: Deterministic Engine

Responsibilities:
- build source inventory
- validate sources
- synthesize the normalized brand model
- render bundle and reports

Boundary:
- the engine should not own human questioning logic
- the intake layer should not own synthesis logic

## Intake Flow

The new intake flow should be:

1. source discovery
2. gap summary
3. one-question-at-a-time clarification loop
4. intake summary
5. user approval
6. engine handoff

### 1. Source Discovery

Detect from the user message and repository context:
- brand name
- desired mode: `inspect`, `generate`, or `refresh`
- website URLs
- docs paths
- screenshot paths
- code paths
- Figma URLs
- freeform product brief

### 2. Gap Summary

Before asking the next question, the system should summarize:
- what is already known
- what is still missing
- what is ambiguous

Example:
- known: one product brief, one reference website
- missing: brand name, explicit brand docs, visual references
- ambiguous: whether the website is brand truth or mood reference

### 3. Question Loop

Ask only one question at a time.

The intake loop should stop when one of these is true:
- the source plan is good enough for the requested mode
- the user explicitly chooses to proceed with known confidence gaps
- the user stops the flow

### 4. Intake Summary

Before execution, summarize the source plan in plain language.

Example:
- brand: `Blue Ledger`
- mode: `generate`
- primary docs: `docs/brand/blue-ledger`
- mood reference: `https://stripe.com`
- warnings: no screenshots or Figma, so visual-system confidence will stay lower

### 5. User Approval

Require a lightweight approval checkpoint before invoking the engine.

Example:
- “This is the source plan I’ll use. If it looks right, I’ll run `inspect`.”

### 6. Engine Handoff

Compile the approved intake state into the existing CLI command shape.

The intake layer may:
- omit some sources from the engine run
- lower the role of some sources in later engine-aware implementations
- attach warnings to the user-facing summary

## Question Priority

The intake planner should use a stable priority order.

### Priority 1: Missing Brand Identity

If the brand name is unknown, ask for it first.

### Priority 2: Ambiguous Website Role

If a URL exists but its role is unknown, ask whether it is:
- the real brand surface
- a live product surface
- a mood reference

### Priority 3: Missing Explicit Docs

If no explicit brand docs exist but the user has a brief, ask whether the system should create a temporary brand brief first.

### Priority 4: Missing Visual Evidence

If the user expects strong visual-system output, ask for screenshots or Figma references.

### Priority 5: Execution Intent

Ask whether the user wants to:
- inspect first
- generate immediately
- refresh an existing brand skill

## Source Role Model

Add source roles at the intake level first, then extend the engine to understand them.

### `brand-truth`

Use for:
- approved brand docs
- official tone guidance
- explicit positioning documents
- intentionally blessed copy decks

Role:
- highest trust for identity, voice, positioning, and constraints

### `live-product`

Use for:
- current real product pages
- production UI surfaces
- live user-facing flows

Role:
- strong signal for behavior and in-product patterns
- may conflict with docs if product drift exists

### `mood-reference`

Use for:
- websites shared as inspiration
- screenshots that express polish or visual direction
- non-brand references used only for tone, layout feel, or quality bar

Role:
- can inform visual posture and interaction feel
- must not dominate voice, identity, or positioning by default

### `supporting-reference`

Use for:
- code references
- supplemental docs
- partial visual artifacts
- secondary examples

Role:
- helpful supporting evidence
- not a source of core brand truth on its own

## Execution Rules

The intake layer should enforce these rules before engine handoff.

### Rule 1: Do Not Generate Silently Through Ambiguity

If the source posture is clearly ambiguous, do not run `generate` until the ambiguity is surfaced to the user.

### Rule 2: Make Confidence Tradeoffs Explicit

If the user wants to proceed with incomplete sources, say exactly what will remain weak.

Example:
- visual-system confidence will stay low without screenshots or Figma
- voice confidence will stay lower without explicit brand docs

### Rule 3: Mood References Are Not Brand Truth

By default:
- mood references should not shape `brandIdentity`
- mood references should not define `voice`
- mood references may influence visual and interaction posture

### Rule 4: Briefs Must Become Source Material

If the user only has a brief, the intake layer should convert it into explicit source material before calling the engine.

The first version of this can be a temporary local brand brief file created from user-approved intake data.

## Proposed New Units

### 1. Intake Analyzer

Responsibility:
- inspect the starting request and local repo context
- detect available inputs
- detect ambiguity and missing coverage

Output:
- initial intake session state

### 2. Question Planner

Responsibility:
- select the single highest-priority unanswered question
- avoid repeating already resolved questions

Output:
- next question or execution readiness

### 3. Intake Session Model

Responsibility:
- hold conversational state between questions and execution

Suggested fields:
- `brandName`
- `desiredMode`
- `brief`
- `sources`
- `sourceRoles`
- `missingCoverage`
- `ambiguities`
- `approvedSourcePlan`
- `executionReadiness`

### 4. Command Compiler

Responsibility:
- convert the approved intake session into the current CLI command format

Output:
- stable engine command
- user-facing warning summary

## UX Contract

The skill should behave like this:

- if the request is incomplete, summarize gaps first
- ask one question at a time
- explicitly classify URLs before using them as sources
- offer to create a temporary brand brief when only a short brief exists
- summarize the source plan before execution
- explain confidence gaps after execution

## Example User Journey

User says:
- “อยากได้เว็บแอพที่ทำเกี่ยวกับบันทึกรายรับรายจ่ายแบบง่ายๆ โดยโทนสีเป็นสีขาวน้ำเงิน”

Expected skill behavior:

1. detect that the request is a brief, not a ready source set
2. summarize what is missing
3. ask for the brand name
4. ask whether any shared website is brand truth or mood reference
5. ask whether to create a temporary brand brief
6. summarize the source plan
7. run `inspect` or `generate`

## Validation Evolution

Current validation only emits warnings and errors.

`v2` should extend this idea into two stages:

### Preflight Intake Validation

Purpose:
- decide what to ask next

Outputs:
- missing required identity
- ambiguous source roles
- weak visual coverage
- weak explicit brand coverage

### Engine Validation

Purpose:
- validate the concrete approved source set

Outputs:
- existing warnings and errors from the current pipeline

## Rollout Plan

### Phase 1: Skill-Level Workflow Upgrade

Deliverables:
- revised `SKILL.md`
- documented intake-first workflow
- explicit instructions to ask questions when source coverage is incomplete

### Phase 2: Intake Model and Question Planner

Deliverables:
- intake session model
- question planner
- command compiler

### Phase 3: Source Role Awareness

Deliverables:
- source roles in the model
- role-aware command compilation
- user-facing summaries that explain source role treatment

### Phase 4: Engine Alignment

Deliverables:
- validation and reporting updates that understand source roles
- future synthesis weighting updates for `mood-reference`

## Risks

### Risk: The intake flow becomes too heavy

Mitigation:
- ask only one question at a time
- stop once the requested mode is sufficiently supported

### Risk: The skill duplicates `brainstorming`

Mitigation:
- keep this flow narrow and source-focused
- do not expand into full product design or implementation planning

### Risk: The engine and intake diverge

Mitigation:
- keep CLI command compilation explicit and deterministic
- treat intake as a preflight layer, not a replacement engine

## Definition of Done

`v2` is successful when:

- the skill no longer tries to treat every provided website as equivalent truth
- partial user input can be turned into an approved source plan through dialogue
- the user sees missing confidence before execution
- the existing engine can still run with a deterministic command after intake
