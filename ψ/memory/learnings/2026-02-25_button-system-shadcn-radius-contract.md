# Learning: Button System Stabilization via Shadcn Radius Contract

## Pattern
When a design-system artifact is actively evolving under user feedback, the safest path is:
1) restore visual readability first,
2) lock a simple token contract for export,
3) then expand component examples.

In this session, switching to a single base `radius` token reduced ambiguity and made the handoff to shadcn/ui implementation easier. Derived sizes remain documented for developers using CSS `calc(...)`, but the design variable source stays minimal.

## Why It Worked
- Reduced token complexity lowered accidental breakage risk.
- Per-variant column layout for buttons made hover/disabled comparison faster.
- Continuous screenshot verification caught regressions early and rebuilt confidence.

## Apply Next Time
- Before bulk replacement, capture and protect baseline section styling.
- Prefer minimal export schema first; add complexity only when required by implementation.
- Present interaction states where developers consume them (inside variant columns), not in separate disconnected blocks.
