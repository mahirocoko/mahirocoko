/**
 * Apple Designing Fluid Interfaces (WWDC 2018) momentum projection.
 *
 * Rather than textbook v²/(2·a), Apple interfaces use exponential deceleration decay:
 *   project(v) = (v / 1000) * d / (1 - d)
 * where d is decelerationRate (~0.998 for standard iOS scroll deceleration, ~0.99 for snappier sheets).
 */

export interface Point2D {
  x: number
  y: number
}

export interface Velocity2D {
  vx: number
  vy: number
}

/**
 * Calculates projected resting displacement from release velocity using exponential decay.
 *
 * @param velocity Release velocity in pixels per second (px/s)
 * @param decelerationRate Exponential decay rate (default 0.998)
 * @returns Projected displacement in pixels
 */
export const projectDisplacement = (velocity: number, decelerationRate = 0.998): number => {
  if (Math.abs(velocity) < 0.0001) {
    return 0
  }
  return (velocity / 1000) * (decelerationRate / (1 - decelerationRate))
}

/**
 * Projects destination point given current position and velocity vector.
 */
export const projectPoint = (
  current: Point2D,
  velocity: Velocity2D,
  decelerationRate = 0.998
): Point2D => {
  return {
    x: current.x + projectDisplacement(velocity.vx, decelerationRate),
    y: current.y + projectDisplacement(velocity.vy, decelerationRate),
  }
}
