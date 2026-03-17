# Generated brand skills set direction, but frontend output still benefits from an uncodixfy review pass

## Pattern

When implementing a product UI from a generated brand skill, the brand skill can successfully anchor posture, scope, and tone without being deep enough to fully protect the final interface from agent-default frontend patterns. The most reliable workflow is to use the brand skill to guide the first implementation pass, then run a stricter UI review skill such as `uncodixfy` on the concrete result and trim away badges, decorative copy, gradient-heavy surfaces, and other recognizable AI-dashboard residue.

## Evidence

- `Blue Ledger` had a usable generated brand skill derived from a design spec, implementation plan, and brand brief
- That skill was enough to keep the product implementation aligned with the desired white-and-blue, calm, reliable finance posture
- The first implementation pass was functional and verified, but a later `uncodixfy` review still found pill overload, decorative card treatment, and explanatory copy that made the UI feel more agent-generated than product-native
- A focused cleanup after the review made the result quieter and more credible without changing the underlying product behavior

## Implication

Treat generated brand skills as directional constraints, not as a guarantee that the first frontend draft is visually disciplined. For product UI work, the stable pattern is layered: use the brand skill to get into the right lane quickly, then use a stricter review pass to remove default stylistic drift. This preserves speed without trusting first-draft aesthetics too much.

## Tags

blue-ledger, frontend, brand-skill, uncodixfy, review-pass, ui-quality
