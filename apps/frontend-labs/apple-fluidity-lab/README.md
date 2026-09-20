# Apple Fluidity Lab

Interactive laboratory exploring Apple's fluid interface principles translated to the modern web platform.

Based on Apple WWDC design talks — chiefly *Designing Fluid Interfaces* (WWDC 2018), *The Details of UI Typography* (WWDC 2020), and *Principles of Great Design* (WWDC 2026).

---

## Upstream Skill Source

- **Skill Document**: `.agents/skills/apple-design/SKILL.md`
- **Upstream Repository**: https://github.com/emilkowalski/skills
- **Pinned Upstream Commit**: `85e8e2363b713506e1d5b6e07a0eb2da66be1bc3`
- **Installed SHA-256**: `77bb63b7043bb93aca2ff4ab040c249484eef35682bb6ff7163433c31d30adc7`

---

## Purpose

Demonstrate the physical and behavioral mechanics that make Apple interfaces feel alive, responsive, and natural rather than mechanical or scripted:
1. **Response**: Latency elimination with instantaneous feedback on pointerdown.
2. **Direct Manipulation**: 1:1 pointer tracking with Pointer Events, `setPointerCapture`, and contact grab offset preservation.
3. **Interruptibility**: Animations start from the live presentation value and can be redirected or grabbed mid-flight with zero velocity discontinuity.
4. **Behavior Over Animation**: Analytical 2D damped harmonic oscillator springs driven by damping ratio ($\zeta$) and response time ($T_0$), rather than arbitrary durations or static CSS easing curves.
5. **Velocity Handoff**: Gesture release velocity continues seamlessly into the spring simulation.
6. **Momentum Projection**: Apple's exponential scroll deceleration formula ($\Delta = \frac{v}{1000} \cdot \frac{d}{1 - d}$) calculates projected landing destinations before release.
7. **Progressive Boundary Resistance**: Apple rubber-banding ($\frac{x \cdot L \cdot c}{L + c \cdot |x|}$) decelerates motion smoothly at physical stage limits.
8. **Responsive Spatial Mapping**: A fixed 760×500 logical physics coordinate space scales responsively to any viewport width (including 390×844 mobile viewports) while maintaining exact coordinate conversions and hit testing.
9. **Accessible Interaction**: Automated OS `prefers-reduced-motion` detection paired with a manual simulator override, scoped keyboard navigation on the focused stage canvas, honest ARIA semantics, and high-contrast visible focus rings.

---

## Commands

Run all commands from the repository root or the lab directory:

```bash
# Start Vite development server
pnpm --filter apple-fluidity-lab dev

# Run Vitest test suites (physics + stage geometry + interruption sync)
pnpm --filter apple-fluidity-lab test

# Typecheck and build production bundle
pnpm --filter apple-fluidity-lab build

# Run ESLint analysis
pnpm --filter apple-fluidity-lab lint
```

---

## Honest Boundaries

This lab is a focused demonstration of core physical principles and includes intentional scope limits:
- **Focused Proof, Not Exhaustive Apple HIG**: Demonstrates fluidity, spring dynamics, typography sizing, and translucent materials; it does not implement the entire Apple Human Interface Guidelines component set.
- **Single-Pointer Gesture System**: Uses the W3C Pointer Events API with `setPointerCapture` for robust 1:1 tracking; does not include multi-touch gesture arbiters (e.g. multi-finger pinch-to-zoom or canvas rotation). Standard browser pinch-to-zoom remains fully enabled at the viewport level.
- **Dark Mode Aesthetic**: Tuned for Apple system dark foundation with translucent materials (`backdrop-filter: blur()`), with fallback states for `prefers-reduced-transparency` and `prefers-contrast`.
