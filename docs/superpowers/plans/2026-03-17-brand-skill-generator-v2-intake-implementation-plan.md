# Brand Skill Generator V2 Intake Implementation Plan

Date: 2026-03-17
Source spec: `docs/superpowers/specs/2026-03-17-brand-skill-generator-v2-intake-design.md`

## Objective

Implement `brand-skill-generator v2` as an intake-first workflow that:

- accepts partial user inputs such as a brief, a URL, or a small set of local files
- asks one clarifying question at a time when the source posture is incomplete
- classifies sources by role before execution
- summarizes an execution plan for approval
- compiles the approved plan into the existing deterministic engine

The existing CLI remains the backend engine. The new work is focused on operator experience, source-role handling, and safer execution decisions.

## Delivery Strategy

Build `v2` in five tracks, executed in dependency order:

1. intake model and question planning contracts
2. source discovery and preflight gap analysis
3. command compilation and source-role handling
4. skill-level workflow and documentation updates
5. validation and report alignment

The first milestone is not a smarter synthesizer. The first milestone is a safer, clearer preflight layer that prevents semantically wrong runs.

## V2 Cut Line

`v2` must support:

- detecting partial inputs from the user request
- summarizing known, missing, and ambiguous inputs
- asking one question at a time
- source roles for at least `brand-truth`, `live-product`, `mood-reference`, and `supporting-reference`
- user approval before execution
- deterministic compilation into the current CLI command shape

`v2` does not need:

- a browser UI
- major synthesis engine rewrites
- deep screenshot understanding improvements
- multi-brand sessions
- autonomous generation without user approval

## Phase Plan

### Phase 1: Intake Contracts and State Model

Deliverables:

- intake session model
- source role types
- question planner input and output contracts
- execution readiness model

Tasks:

- define the intake session shape separate from `IBrandSkillCommand`
- add source-role modeling without breaking current engine contracts
- define what counts as `known`, `missing`, and `ambiguous`
- define the state transitions from discovery to approval

Acceptance checks:

- the intake layer can represent both sparse and rich user inputs
- source roles are explicit rather than implied
- the system can determine whether it should ask a question or prepare execution

### Phase 2: Source Discovery and Preflight Gap Analysis

Deliverables:

- intake analyzer
- gap summary builder
- ambiguity detector

Tasks:

- inspect the initial user request for brand names, URLs, docs, screenshots, code paths, Figma URLs, and brief text
- detect missing brand identity
- detect ambiguous website roles
- detect missing explicit docs and missing visual evidence
- produce a stable preflight summary for the user

Acceptance checks:

- the analyzer can distinguish a brief from a ready source set
- URLs without a role are marked ambiguous
- the user-facing summary clearly explains what is known and what is missing

### Phase 3: Question Planner and Conversational Flow

Deliverables:

- one-question-at-a-time planner
- stable question priority order
- stop conditions for moving from questions to approval

Tasks:

- implement the priority ladder from the spec
- prevent repeated questions once an ambiguity is resolved
- support “proceed with known confidence gaps” when the user explicitly chooses to continue
- define when the intake flow is complete enough for `inspect`, `generate`, or `refresh`

Acceptance checks:

- only one question is emitted at a time
- the planner asks the most important unresolved question first
- the planner stops asking once execution readiness is reached

### Phase 4: Command Compiler and Source-Role Handling

Deliverables:

- command compiler
- source-plan summary
- role-aware pre-execution warnings

Tasks:

- convert approved intake state into the current CLI command shape
- ensure `mood-reference` inputs do not automatically become first-class synthesis sources
- support omission or downgraded handling of sources that should not directly shape identity or voice
- produce a plain-language execution summary before the engine runs

Acceptance checks:

- the compiled command is deterministic
- mood references are visibly treated differently from brand truth
- user approval happens against the same source plan the engine will actually use

### Phase 5: Validation and Reporting Alignment

Deliverables:

- preflight validation layer
- mapped engine validation presentation
- updated skill documentation

Tasks:

- split validation into preflight intake validation and engine validation
- turn current warning classes into actionable user-facing prompts
- update skill docs to describe the new intake-first workflow
- make post-run confidence gaps easier to understand in relation to intake decisions

Acceptance checks:

- the skill no longer relies on users to infer what the warnings mean
- the same missing-source classes appear consistently in intake and reporting
- the docs match the real workflow

## Suggested Implementation Order

Use this sequence to keep the engine stable while upgrading the workflow:

1. add intake model and source-role contracts
2. implement intake analyzer and gap summary
3. implement question planner
4. implement command compiler
5. integrate approval checkpoint
6. align validation and reporting language
7. update `SKILL.md`, CLI help, and README examples

## File and Module Boundaries

Recommended additions:

- `intake/`
  owns intake analyzer, question planner, and state transitions
- `model/`
  extends shared contracts for intake sessions and source roles
- `runtime/`
  compiles intake state into command execution
- `validation/`
  separates preflight validation from engine validation

Boundary rules:

- keep conversational logic out of synthesis modules
- keep CLI command execution deterministic after intake approval
- keep source-role policy centralized rather than scattered through renderers

## State and Flow Model

Suggested state progression:

1. `discovered`
2. `needs-clarification`
3. `ready-to-summarize`
4. `awaiting-approval`
5. `approved-for-execution`
6. `executed`

Core state fields:

- `brandName`
- `desiredMode`
- `brief`
- `sources`
- `sourceRoles`
- `knownInputs`
- `missingCoverage`
- `ambiguities`
- `warnings`
- `approvalStatus`

## UX and Copy Priorities

- summarize gaps before asking the next question
- keep questions short and explicit
- ask websites’ roles directly before running with them
- make tradeoffs concrete, not abstract
- tell the user what the system will do, not just what it found

Example posture:

- “Known: one brief and one URL. Missing: brand name and visual references. Ambiguous: the URL’s source role.”
- “Is this URL the real brand surface or just a mood reference?”
- “I can generate now, but visual-system confidence will stay low without screenshots or Figma.”

## Test Plan

Core conversational checks:

- brief-only input triggers gap summary and question loop
- URL-only input triggers source-role question
- mixed source input avoids unnecessary questions
- resolved ambiguities are not re-asked
- user approval is required before execution

Compilation checks:

- approved intake state compiles to the expected CLI command
- `mood-reference` sources are handled differently from `brand-truth`
- `inspect`, `generate`, and `refresh` all remain reachable

Validation checks:

- missing brand name blocks execution until resolved
- missing explicit docs produce the correct question or warning
- missing visual references produce confidence warnings without blocking inspect unnecessarily

## Risks and Mitigations

Risk:
- the intake layer becomes a second brainstorming system

Mitigation:
- keep questions source-focused and execution-focused
- avoid expanding into full product discovery or implementation design

Risk:
- source roles remain cosmetic and do not affect execution meaningfully

Mitigation:
- make command compilation role-aware from the first implementation cut

Risk:
- engine validation and intake validation drift apart

Mitigation:
- map both layers to the same missing-source taxonomy and codes where possible

Risk:
- skill docs change but actual behavior does not

Mitigation:
- land docs only alongside intake runtime changes, not ahead of them

## Definition of Done

The work is done when:

- partial user requests no longer force manual source preparation as the first step
- the skill asks one clarifying question at a time when needed
- reference websites are not silently treated as equal to brand truth
- the user approves a clear source plan before execution
- the approved source plan compiles into the current engine without ambiguity
