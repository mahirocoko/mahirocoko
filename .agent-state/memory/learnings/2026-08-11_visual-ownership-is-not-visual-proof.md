# Visual ownership is not visual proof

**Date**: 2026-08-11  
**Tags**: visual-direction, model-routing, k3, gemini, human-gate, prompt-mediation, frontend

## Context

K3's Cursor image channel claimed to read three Spartan AI screenshots but described an unrelated crypto page. Gemini 3.6 read the same images correctly. A Gemini-authored KumoWisp candidate was rejected because it tested the wrong ownership route. Mahiro then explicitly approved Gemini 3.6 as prompt owner and K3 as visual/code owner, but the resulting K3 candidate was also rejected despite build success, zero overflow, and clean console output.

## Lesson

A correct workflow chain proves process integrity, not visual quality. Keep four claims separate:

1. **Image-channel grounding** — can the selected model identify the actual pixels?
2. **Ownership correctness** — did the requested model author the visual/code surface?
3. **Technical correctness** — does the candidate build, render, and behave safely?
4. **Visual acceptance** — did Mahiro accept the result?

A Gemini-authored prompt may be an explicitly approved fallback when K3 cannot ingest pixels, but it does not transfer source taste automatically. Never promote the result merely because the prompt is grounded, K3 used YOLO, hashes match, or browser checks pass.

## Apply Next Time

- Run a blind headline/section identity probe before allowing visual writes.
- When ownership itself is under test, do not substitute another implementation model without Mahiro's approval.
- Test one bounded hero/section before building a complete landing page.
- Treat intermediary prompts as experiment inputs, not acceptance evidence.
- Stop production handoff immediately after a human rejection.
- Preserve rejected evidence until Mahiro asks for cleanup, then delete only scoped artifacts and retain the durable lesson.
