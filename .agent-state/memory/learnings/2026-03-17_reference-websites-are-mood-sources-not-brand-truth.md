# Reference websites are mood sources, not brand truth, unless explicitly promoted

## Pattern

When using a source-driven brand synthesizer, a strong reference website should not be fed into the run as a normal first-class brand source if the real intention is only to borrow its mood, structure, or quality bar. The generator will synthesize what it sees, not the unstated caveat in the operator's head.

## Evidence

- A `Blue Ledger` inspect run that included `https://stripe.com` produced coherent output, but it imported Stripe vocabulary and CTA posture too directly
- The user intent was to use Stripe as a visual and tonal reference, not as the product's own brand language
- Re-running `inspect` and `generate` with explicit local brand docs only produced a cleaner and more truthful brand bundle
- The resulting bundle remained weaker in visual-system depth, but the weakness was honest and clearly tied to missing visual evidence

## Implication

Treat reference websites as `mood references` unless they are explicitly the live brand surface being synthesized. If the generator lacks source-role support, either exclude the reference website from the actual generate run or convert the intended interpretation into explicit docs first. This preserves brand truth and prevents accidental lexical drift from dominant external brands.

## Tags

brand-skill-generator, sources, brand-synthesis, reference-posture, mood-reference, blue-ledger
