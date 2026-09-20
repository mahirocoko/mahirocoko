/**
 * Apple Fluid Analytical Spring Solver (WWDC 2018 / 2026).
 *
 * Implements Apple's parameterized spring physics using Damping Ratio (zeta) and Response (T0, seconds).
 * Uses exact closed-form analytical integration per frame dt:
 * - Unconditionally stable across variable frame rates
 * - Allows instantaneous mid-flight interruption without phase stutter
 * - Preserves release velocity on gesture handoff
 * - Evaluates X and Y independently to prevent artificial desynchronization
 */

export interface SpringConfig {
  /**
   * Damping ratio (zeta).
   * 1.0 = critically damped (graceful settle, no overshoot; standard UI default)
   * ~0.8 = underdamped (subtle overshoot/bounce; reserved for momentum flicks)
   * <0.6 = high bounce
   */
  dampingRatio: number
  /**
   * Response time in seconds (T0).
   * Time constant for reaching target (typically 0.30 - 0.45s).
   */
  response: number
}

export interface SpringState1D {
  position: number
  target: number
  velocity: number
}

export interface SpringState2D {
  x: SpringState1D
  y: SpringState1D
}

export const DEFAULT_SPRING_CONFIG: SpringConfig = {
  dampingRatio: 1.0, // Critically damped default
  response: 0.38,    // Snappy Apple response
}

export const MOMENTUM_SPRING_CONFIG: SpringConfig = {
  dampingRatio: 0.82, // Subtle physical bounce on flick
  response: 0.40,
}

/**
 * Checks if a 1D spring state has practically settled at target.
 */
export const isSpringSettled1D = (
  state: SpringState1D,
  distanceThreshold = 0.2,
  velocityThreshold = 1.0
): boolean => {
  return (
    Math.abs(state.position - state.target) <= distanceThreshold &&
    Math.abs(state.velocity) <= velocityThreshold
  )
}

/**
 * Checks if both X and Y components have settled.
 */
export const isSpringSettled2D = (
  state: SpringState2D,
  distanceThreshold = 0.2,
  velocityThreshold = 1.0
): boolean => {
  return (
    isSpringSettled1D(state.x, distanceThreshold, velocityThreshold) &&
    isSpringSettled1D(state.y, distanceThreshold, velocityThreshold)
  )
}

/**
 * Steps a 1D spring forward by delta-time dt (seconds) using closed-form analytical ODE solution.
 */
export const stepSpring1D = (
  state: SpringState1D,
  config: SpringConfig,
  dt: number
): SpringState1D => {
  const { dampingRatio: zeta, response } = config

  // Guard against non-positive dt or invalid response
  if (dt <= 0) {
    return { ...state }
  }

  if (response <= 0.001) {
    return {
      position: state.target,
      target: state.target,
      velocity: 0,
    }
  }

  const omegaN = (2 * Math.PI) / response
  const xRel = state.position - state.target
  const v0 = state.velocity

  let newPosition: number
  let newVelocity: number

  if (Math.abs(zeta - 1.0) < 0.0001) {
    // Critically damped (zeta == 1)
    const c1 = xRel
    const c2 = v0 + omegaN * c1
    const decay = Math.exp(-omegaN * dt)

    newPosition = (c1 + c2 * dt) * decay + state.target
    newVelocity = (c2 - omegaN * (c1 + c2 * dt)) * decay
  } else if (zeta < 1.0) {
    // Underdamped (zeta < 1)
    const omegaD = omegaN * Math.sqrt(1 - zeta * zeta)
    const a = xRel
    const b = (v0 + zeta * omegaN * a) / omegaD
    const decay = Math.exp(-zeta * omegaN * dt)
    const cosT = Math.cos(omegaD * dt)
    const sinT = Math.sin(omegaD * dt)

    newPosition = decay * (a * cosT + b * sinT) + state.target
    newVelocity =
      decay *
      ((-zeta * omegaN * a + omegaD * b) * cosT -
        (zeta * omegaN * b + omegaD * a) * sinT)
  } else {
    // Overdamped (zeta > 1)
    const omegaD = omegaN * Math.sqrt(zeta * zeta - 1)
    const r1 = -zeta * omegaN + omegaD
    const r2 = -zeta * omegaN - omegaD
    const c2 = (v0 - r1 * xRel) / (r2 - r1)
    const c1 = xRel - c2
    const exp1 = Math.exp(r1 * dt)
    const exp2 = Math.exp(r2 * dt)

    newPosition = c1 * exp1 + c2 * exp2 + state.target
    newVelocity = c1 * r1 * exp1 + c2 * r2 * exp2
  }

  // Snap to exact target if settled
  if (
    Math.abs(newPosition - state.target) < 0.2 &&
    Math.abs(newVelocity) < 1.0
  ) {
    return {
      position: state.target,
      target: state.target,
      velocity: 0,
    }
  }

  return {
    position: newPosition,
    target: state.target,
    velocity: newVelocity,
  }
}

/**
 * Steps independent X and Y springs forward by dt.
 */
export const stepSpring2D = (
  state: SpringState2D,
  config: SpringConfig,
  dt: number
): SpringState2D => {
  return {
    x: stepSpring1D(state.x, config, dt),
    y: stepSpring1D(state.y, config, dt),
  }
}
