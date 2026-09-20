import { describe, expect, it } from 'vitest'
import {
  projectDisplacement,
  projectPoint,
} from '../physics/projection.ts'
import {
  calculateRubberband,
  clampWithRubberband1D,
  clampWithRubberband2D,
} from '../physics/rubberband.ts'
import {
  DEFAULT_SNAP_STATIONS,
  findNearestSnapStation,
} from '../physics/snap.ts'
import {
  DEFAULT_SPRING_CONFIG,
  MOMENTUM_SPRING_CONFIG,
  isSpringSettled1D,
  isSpringSettled2D,
  stepSpring1D,
  stepSpring2D,
} from '../physics/spring.ts'

describe('Physics: Momentum Projection', () => {
  it('returns zero displacement for near-zero velocity', () => {
    expect(projectDisplacement(0)).toBe(0)
    expect(projectDisplacement(0.00005)).toBe(0)
  })

  it('projects displacement using Apple exponential decay formula', () => {
    // formula: (v / 1000) * d / (1 - d)
    // with d = 0.998: d / (1 - d) = 0.998 / 0.002 = 499
    // for v = 1000 px/s: (1000 / 1000) * 499 = 499 px
    const disp = projectDisplacement(1000, 0.998)
    expect(disp).toBeCloseTo(499, 1)

    // Negative velocity projects in negative direction
    const negDisp = projectDisplacement(-500, 0.998)
    expect(negDisp).toBeCloseTo(-249.5, 1)
  })

  it('projects 2D point independently on X and Y', () => {
    const start = { x: 100, y: 50 }
    const vel = { vx: 800, vy: -400 }
    const projected = projectPoint(start, vel, 0.998)

    expect(projected.x).toBeCloseTo(100 + 800 * 0.499, 1)
    expect(projected.y).toBeCloseTo(50 + -400 * 0.499, 1)
  })
})

describe('Physics: Apple Rubber-band Boundary Resistance', () => {
  it('returns zero resistance when overshoot is zero or dimension invalid', () => {
    expect(calculateRubberband(0, 400)).toBe(0)
    expect(calculateRubberband(50, 0)).toBe(0)
  })

  it('provides progressive resistance that slows before stopping', () => {
    const dim = 500
    const r50 = calculateRubberband(50, dim, 0.55)
    const r100 = calculateRubberband(100, dim, 0.55)
    const r150 = calculateRubberband(150, dim, 0.55)

    // Movement increases monotonically with overshoot
    expect(r50).toBeGreaterThan(0)
    expect(r100).toBeGreaterThan(r50)
    expect(r150).toBeGreaterThan(r100)

    // Rate of gain decreases as overshoot grows (diminishing return with equal step size)
    const step1 = r100 - r50
    const step2 = r150 - r100
    expect(step1).toBeGreaterThan(step2)

    // Resistance always stays below bounds
    expect(r150).toBeLessThan(150)
  })

  it('clamps 1D position within bounds 1:1, but rubber-bands outside', () => {
    // Within bounds [0, 300]
    expect(clampWithRubberband1D(150, 0, 300, 300)).toBe(150)
    expect(clampWithRubberband1D(0, 0, 300, 300)).toBe(0)
    expect(clampWithRubberband1D(300, 0, 300, 300)).toBe(300)

    // Overshoot past max (350 > 300)
    const clampedHigh = clampWithRubberband1D(350, 0, 300, 300)
    expect(clampedHigh).toBeGreaterThan(300)
    expect(clampedHigh).toBeLessThan(350)

    // Overshoot below min (-50 < 0)
    const clampedLow = clampWithRubberband1D(-50, 0, 300, 300)
    expect(clampedLow).toBeLessThan(0)
    expect(clampedLow).toBeGreaterThan(-50)
  })

  it('handles 2D boundary rubber-banding independently', () => {
    const bounds = {
      minX: -200,
      maxX: 200,
      minY: -150,
      maxY: 150,
      width: 400,
      height: 300,
    }

    const inside = clampWithRubberband2D({ x: 50, y: -20 }, bounds)
    expect(inside.x).toBe(50)
    expect(inside.y).toBe(-20)

    const outside = clampWithRubberband2D({ x: 300, y: -250 }, bounds)
    expect(outside.x).toBeGreaterThan(200)
    expect(outside.x).toBeLessThan(300)
    expect(outside.y).toBeLessThan(-150)
    expect(outside.y).toBeGreaterThan(-250)
  })
})

describe('Physics: Snap Station Selection', () => {
  it('selects the center station when projected destination is near origin', () => {
    const nearest = findNearestSnapStation({ x: 10, y: -15 }, DEFAULT_SNAP_STATIONS)
    expect(nearest.id).toBe('stage-anchor')
    expect(nearest.x).toBe(0)
    expect(nearest.y).toBe(0)
  })

  it('selects correct quadrant dock based on projected position', () => {
    // Top-Left projection
    const tl = findNearestSnapStation({ x: -230, y: -150 }, DEFAULT_SNAP_STATIONS)
    expect(tl.id).toBe('preview-deck')

    // Top-Right projection
    const tr = findNearestSnapStation({ x: 280, y: -190 }, DEFAULT_SNAP_STATIONS)
    expect(tr.id).toBe('inspector-dock')

    // Bottom-Left projection
    const bl = findNearestSnapStation({ x: -240, y: 160 }, DEFAULT_SNAP_STATIONS)
    expect(bl.id).toBe('quick-stash')

    // Bottom-Right projection
    const br = findNearestSnapStation({ x: 250, y: 180 }, DEFAULT_SNAP_STATIONS)
    expect(br.id).toBe('archive-tray')
  })
})

describe('Physics: Analytical Spring Integration & Interruption', () => {
  it('critically damped spring smoothly approaches target without overshoot', () => {
    let state = { position: 100, target: 0, velocity: 0 }
    const dt = 1 / 60 // 60fps frame delta

    let minPos = state.position
    for (let frame = 0; frame < 120; frame++) {
      state = stepSpring1D(state, DEFAULT_SPRING_CONFIG, dt)
      if (state.position < minPos) {
        minPos = state.position
      }
    }

    // Critical damping should not significantly cross target < 0
    expect(minPos).toBeGreaterThanOrEqual(-0.01)
    expect(state.position).toBe(0)
    expect(state.velocity).toBe(0)
    expect(isSpringSettled1D(state)).toBe(true)
  })

  it('underdamped momentum spring exhibits controlled physical overshoot', () => {
    let state = { position: 100, target: 0, velocity: 0 }
    const dt = 1 / 60

    let minPos = state.position
    for (let frame = 0; frame < 120; frame++) {
      state = stepSpring1D(state, MOMENTUM_SPRING_CONFIG, dt)
      if (state.position < minPos) {
        minPos = state.position
      }
    }

    // Underdamped spring overshoots 0 past target
    expect(minPos).toBeLessThan(-0.5)
    // Eventually settles
    expect(state.position).toBe(0)
  })

  it('supports mid-flight interruption and velocity redirection seamlessly', () => {
    // Start spring towards target 300 with zero velocity
    let state = { position: 0, target: 300, velocity: 0 }
    const dt = 1 / 60

    // Step 5 frames
    for (let i = 0; i < 5; i++) {
      state = stepSpring1D(state, DEFAULT_SPRING_CONFIG, dt)
    }

    // Verify it is moving mid-flight
    expect(state.position).toBeGreaterThan(0)
    expect(state.velocity).toBeGreaterThan(10)

    // User interrupts mid-flight and redirects towards -200 with an injected reverse fling velocity (-500)
    const interruptedPos = state.position
    const newTarget = -200
    const reverseVelocity = -500

    let redirectedState = {
      position: interruptedPos,
      target: newTarget,
      velocity: reverseVelocity,
    }

    // Next step must start from presentation value (interruptedPos)
    redirectedState = stepSpring1D(redirectedState, DEFAULT_SPRING_CONFIG, dt)
    expect(redirectedState.position).toBeLessThan(interruptedPos)

    // Advance to settle
    for (let i = 0; i < 120; i++) {
      redirectedState = stepSpring1D(redirectedState, DEFAULT_SPRING_CONFIG, dt)
    }

    expect(redirectedState.position).toBe(newTarget)
    expect(redirectedState.velocity).toBe(0)
  })

  it('handles 2D spring state independently for X and Y', () => {
    let state2D = {
      x: { position: -100, target: 0, velocity: 500 },
      y: { position: 200, target: 0, velocity: -200 },
    }
    const dt = 1 / 60

    state2D = stepSpring2D(state2D, DEFAULT_SPRING_CONFIG, dt)
    expect(state2D.x.position).toBeGreaterThan(-100)
    expect(state2D.y.position).toBeLessThan(200)

    // Step to completion
    for (let i = 0; i < 150; i++) {
      state2D = stepSpring2D(state2D, DEFAULT_SPRING_CONFIG, dt)
    }

    expect(isSpringSettled2D(state2D)).toBe(true)
    expect(state2D.x.position).toBe(0)
    expect(state2D.y.position).toBe(0)
  })

  it('safely handles non-positive dt and instant response edge cases', () => {
    const state = { position: 50, target: 0, velocity: 10 }
    const zeroDt = stepSpring1D(state, DEFAULT_SPRING_CONFIG, 0)
    expect(zeroDt.position).toBe(50)

    const instant = stepSpring1D(state, { dampingRatio: 1, response: 0 }, 0.016)
    expect(instant.position).toBe(0)
    expect(instant.velocity).toBe(0)
  })
})
