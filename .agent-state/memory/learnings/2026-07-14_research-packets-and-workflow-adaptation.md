# Learning: Research handoffs and workflow adaptations should transfer decisions, not just information

**Date**: 2026-07-14  
**Tags**: research, handoff, evidence, game-topup, suppliers, unit-economics, fable-method, intent-gate, verification, subagents

## Lesson

A strong research deliverable does more than summarize findings. It gives the next person enough structure to continue the work without recreating the decision model.

The minimum useful handoff shape is:

```text
mission and scope
→ named decisions and owners
→ evidence hierarchy and status vocabulary
→ comparable workstreams and artifacts
→ reusable RFI/register/model templates
→ allowed outcomes
→ stop gates and Definition of Done
```

This became clear in the Thailand game-top-up study. A broad provider list was not enough. The transferable packet had to separate payment from fulfillment, distinguish authorized inventory from public API claims, define a common SKU basket, expose pre-funded balance risk, provide supplier/gateway questions, and model margin after tax, FX, refund, fraud, support, and working capital. Research completion also had to allow `Go`, `Conditional Go`, `Pilot Only`, or `No-go`; production readiness is a stricter later gate.

The same principle applies when learning an external agent workflow. First map overlap with Mahiro Code, then adopt only the missing delta. From `Sahir619/fable-method`, the valuable additions were:

- a conditional intent gate before ambiguous behavior changes;
- the cheapest disconfirming check before broad edits;
- a bounded repair budget that stops repeated failed hypotheses;
- named completion claims mapped to evidence;
- an independent verifier trying to disprove claims;
- technical verdicts: `VERIFIED`, `VERIFIED WITH CAVEATS`, `REFUTED`, and `BLOCKED`.

Do not copy the upstream three-skill surface merely because its framing is memorable. Keep the adaptation in memory, dogfood it on several medium/high-risk tasks, measure wrong-direction prevention and ceremony cost, then promote only proven primitives into canonical `mahiro-skills` docs/templates/tests.
