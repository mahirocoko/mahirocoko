# Nortezh imagegen gates

**Date**: 2026-08-02  
**Tags**: `imagegen`, `frontend`, `gem`, `agy`, `codex`, `visual-gate`, `rollback`

## Durable lesson

For Mahiro's image-first website exploration, the first deliverable is one untouched provider-rendered section—not code and not a complete long-page raster.

Required sequence:

1. Ground product truth and prohibited claims.
2. Have the custom Gem author the exact prompt for the current section.
3. Preserve one reusable Visual DNA paragraph and repeat it verbatim in every later section prompt.
4. Send the section prompt unchanged to Agy/Gemini or Codex native imagegen.
5. Show the raw raster before review, rewriting, implementation, or later-section generation.
6. Stop until Mahiro selects, requests a variation, or rejects the direction.
7. Only write frontend code after explicit image selection and implementation approval.

## Failure pattern to avoid

Do not turn `brief → image direction` into `brief → implementation option → complete frontend → QA`. Mechanical quality cannot substitute for the missing visual gate. Do not bundle implementation into a recommended option during image exploration. Do not ask one imagegen prompt to render a full long marketing page: later sections, typography, and product details will drift.

## Recovery rule

If Mahiro says the raw direction does not pass, reject it without defending tests or reviewer scores. If he asks for rollback, remove all scoped artifacts and verify unrelated repository work remains untouched.
