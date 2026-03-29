# Design-first UI adaptation requires disabling code-shape constraints early

When a user asks for a real visual redesign, especially one driven by a strong external aesthetic like an Apple-style product page, the visual exploration phase should not be led by a code-style doctrine. Code-shape guidance is useful later for cleanup and maintainability, but if it participates too early it pulls the work back toward existing component patterns, section structure, and repo comfort zones.

The better sequence is:

1. Lock visual direction first with a dedicated frontend design skill.
2. Allow composition, hierarchy, and pacing to change materially.
3. Screen homepage vocabulary for human clarity before implementation.
4. Apply code-style guardrails only after the visual concept is already correct.

This matters most on landing pages. A technically clean catalog-first rewrite can still fail the real test if it does not create desire. Desirability-first product storytelling must come before taxonomy, and creative visual ambition must come before maintainability constraints.
