# Learning — Separate frontend taste from production engineering

**Date:** 2026-07-31  
**Tags:** frontend, model-routing, kimi-k3, gpt-5.6-sol, visual-fidelity, direct-cli, agent-halo

## Durable lesson

For direction-critical frontend work, do not ask one model to own both raw visual taste and production closure when evidence shows the roles have different winners.

Recommended selective pipeline:

1. Establish product truth and visible boundaries.
2. Use Gemini only when a divergent interaction seed is useful.
3. Let Kimi K3 own the complete visual integration.
4. Require Mahiro to lock the direction.
5. Give Sol the accepted source plus desktop/mobile/state renders as authoritative inputs.
6. Require visible image preflight before writes and forbid reinterpretation.
7. Validate with deterministic loaded screenshots, state interactions, accessibility, console, overflow, and pixel diff.

Evidence from Agent Halo:

- Exact K3 production pass: desktop/mobile pixel diff 0.
- New simulator feature: full-page desktop/mobile diff 0 after K3 direction → Sol production.
- Per-state K3↔Sol differences were 0–29 antialiased pixels, below K3 self-capture variance of 20–126 pixels.
- Sol improved typed state truth, live announcements, roving focus, intrinsic images, and mobile focus return without CSS drift.

Scope boundary: this proves Sol can preserve and harden accepted K3 direction. It does not prove Sol independently originates K3-quality taste or can extrapolate it to unspecified pages.

## Operational correction

For a Mahiro-approved, bounded, isolated Cursor implementation lane, launch with:

```bash
cursor-agent --model <exact-model> --yolo --trust
```

Confirm the visible header says `Run Everything`. `herdr agent prompt` only submits the prompt; it does not enable YOLO. Keep normal approvals for broad, destructive, or review-only lanes.

When cleaning experiment directories, first create and verify a source/evidence backup that excludes regenerable dependencies and build outputs. Delete only through an explicit allowlist with a protected keep path.
