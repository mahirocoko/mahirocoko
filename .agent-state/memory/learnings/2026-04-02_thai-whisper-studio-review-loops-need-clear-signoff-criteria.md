# Learning Note

**Date**: 2026-04-02  
**Tags**: review, gemini, product-owner, ui, signoff, thai-whisper-studio

## Lesson

AI-to-AI redesign loops converge much faster when the sign-off criteria are named explicitly and repeated consistently. For `thai-whisper-studio`, the useful criteria were not vague style goals like “more minimal” or “more product-like.” The useful criteria were concrete: keep runtime clarity, make the transcript the payoff, prevent the primary CTA from dominating the success state, and keep the tone calm without losing actionability.

## Why it mattered here

The app was small, but the review risk was high because a tiny interface can lose its usefulness with only a few over-aggressive cuts. Gemini improved once the feedback stopped being broad aesthetic guidance and became direct acceptance checks against the real diff. That turned the loop from subjective redesign talk into concrete product review.

## Reuse

For future AI-assisted UI reviews:

1. Define sign-off criteria before the second iteration.
2. Review from actual diffs, not model summaries.
3. Separate “proposal quality” from “verified implementation quality.”
4. Treat success-state hierarchy as a first-class product concern in small tools.

## Slug

`thai-whisper-studio-review-loops-need-clear-signoff-criteria`
