---
name: preserving-visual-direction
description: Coordinates direction-critical frontend work through direct raw-reference handoff, a designated visual owner, a human-owned visual lock, production-only hardening, and deterministic fidelity verification. Use when Mahiro asks for a K3-to-Sol workflow, wants an accepted frontend productionized without visual drift, names a model to own visual direction, asks to preserve an approved design exactly, asks to recreate or match a screenshot/reference exactly, or needs a raster-only vision gate. Do not use for routine frontend edits or ungated reviewer polish; raster-only writes remain blocked until direct vision preflight succeeds.
---

# Preserving Visual Direction

Coordinate ownership and evidence; do not define taste. The validated pattern is optional idea scout → visual owner → Mahiro direction gate → production owner → deterministic verification. Kimi K3 and Sol are the historical defaults, not permanent model IDs.

## Non-negotiable boundary

- Pass raw references, current product truth, and Mahiro's exact technical scope directly to the selected visual owner.
- Never translate accepted pixels into a main-authored visual brief, invariant list, design summary, copy map, or style doctrine.
- Never let a reviewer, verifier, build pass, or production owner claim Mahiro's visual acceptance.
- Never ask a production owner to extrapolate “K3 taste” or another model's taste from prose.
- Keep the visual owner and production owner distinct by default. One actor may hold both roles only after Mahiro explicitly waives separation for that locked direction.
- Keep visual and technical verdicts separate. Runtime correctness is not fidelity proof.
- Do not invoke or recreate `frontend-design`, `building-frontends`, or a reusable house-style template through this skill.

## Classify the request

Choose exactly one path before writes:

1. **New direction** — route the complete bounded surface to the human-selected visual owner.
2. **Accepted code plus renders** — skip visual ideation and create a visual lock before production hardening.
3. **Accepted raster only** — run the direct vision preflight below. Do not write until it succeeds.
4. **Routine implementation** — do not use this skill. Route CRUD, bug fixes, refactors, and already-directed components normally.

An optional idea scout may supply one interaction or composition seed. The visual owner must integrate or reject that seed; never merge the scout output directly into the accepted page.

## Workflow

### 1. Establish product truth

Inspect the current repo, target surface, real copy, owned assets, runtime states, and no-touch boundaries. Keep this factual. Do not turn product truth into visual instructions.

### 2. Prepare the direct evidence packet

Load [references/handoff-packets.md](references/handoff-packets.md). Give the visual owner:

- Mahiro's exact request
- raw reference paths or attachments
- factual repo/product sources
- target path and technical stack explicitly requested by Mahiro or the repo
- accepted/rejected baseline status

Do not add offline, font, package, accessibility, interaction, composition, or copy constraints unless Mahiro or the repo supplied them.

When delegation uses Herdr or a coding CLI, load the `direct-cli` skill rather than duplicating its launch protocol here.

### 3. Gate raster-only work

Start a fresh read-only visual-owner session and attach the exact images through a proven image-input channel. Ask for a short objective transcription: visible headline, section order, and major product surfaces. Do not hint at the answers.

Compare the response to the source yourself only for objective identity, not taste. If the model misreads or invents anatomy, stop. Report the input-channel failure; do not repair it with a main-authored summary and do not allow writes.

### 4. Let the visual owner implement

Give one writer ownership of the complete bounded visual surface. Preserve the raw candidate. Do not route it through reviewer polish, copy cleanup, or main-agent taste correction before Mahiro sees it.

Capture the candidate at agreed desktop/mobile viewports and required states after fonts and critical media load. Present those raw renders to Mahiro.

### 5. Require the human direction gate

Only Mahiro can mark a candidate accepted or rejected. Record the exact accepted source/render identities and gate status. Rejection ends that candidate; technical passes do not keep it alive.

### 6. Freeze the visual lock

Load [references/visual-lock-contract.md](references/visual-lock-contract.md). Record:

- source paths plus Git ref or content hashes
- accepted render paths/hashes, viewports, and states
- fonts/assets and capture readiness
- protected visual owners/files
- explicitly allowed production changes
- Mahiro-owned acceptance evidence

Store the lock in the repo's existing evidence location. If none exists, use `.agent-state/active/visual-lock/<job>/` temporarily and make its promotion/ignore status explicit.

### 7. Run the production pass

Give the production owner the locked source and renders directly. Require visible source/render preflight before writes and forbid visual reinterpretation.

Production-safe work normally includes types, state truth, focus/keyboard semantics, accessibility, intrinsic media dimensions, runtime resilience, build repair, and performance. Any edit that changes composition, copy fit, typography, tokens, spacing, motion personality, or responsive anatomy returns to Mahiro or the visual owner.

### 8. Verify deterministically

Capture baseline and production output with the same viewport, browser, fonts, media-loaded state, reduced-motion setting, data, and interaction state.

Check:

- full-page desktop/mobile comparison
- required component/state comparisons
- image/font loading and layout stability
- overflow, console, keyboard, focus, live regions, and reduced motion
- typecheck/lint/build or repo-local equivalents

Prefer zero visual difference for a preservation-only pass. If nonzero, quantify and localize it; repeated-capture nondeterminism must be measured rather than assumed. A technical PASS remains separate from Mahiro's final visual/product gate.

### 9. Promote or discard truthfully

Promote only the human-accepted, technically verified artifact. Back up source/evidence before cleanup, remove only explicit experiment paths, preserve unrelated work, and never call a rejected candidate complete.

## Stop gates

Stop and report instead of improvising when:

- the raster vision preflight fails
- references conflict and Mahiro has not selected authority
- no candidate has human acceptance
- the same actor is assigned visual and production ownership without Mahiro's explicit waiver
- the production owner needs a visual decision
- fonts/assets/runtime state prevent comparable captures
- evidence covers only selected sections but the claim is whole-page fidelity

## Evidence report

End with separate statements for:

1. visual owner output
2. Mahiro gate status
3. production changes
4. deterministic comparison evidence
5. functional/accessibility checks
6. residual differences and human-owned next decision

Never compress these into a generic “frontend PASS.”
