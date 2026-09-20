/**
 * Apple Designing Fluid Interfaces (WWDC 2018) rubber-band resistance.
 *
 * Provides progressive logarithmic-like soft resistance when dragging past boundaries,
 * avoiding jarring hard stops while giving immediate physical feedback.
 */

/**
 * Calculates rubber-band damped displacement for a given overshoot distance.
 *
 * @param overshoot Distance past the boundary (can be positive or negative)
 * @param dimension Dimension of the constraint zone (width or height, in px)
 * @param constant Apple resistance constant (standard 0.55)
 * @returns Damped displacement in px
 */
export const calculateRubberband = (
  overshoot: number,
  dimension: number,
  constant = 0.55
): number => {
  if (dimension <= 0 || Math.abs(overshoot) < 0.0001) {
    return 0
  }
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot))
}

/**
 * Clamps or rubber-bands a 1D position within a bounded range [min, max].
 *
 * @param position Raw target position
 * @param min Minimum boundary
 * @param max Maximum boundary
 * @param dimension Viewport or track dimension along this axis
 * @param constant Apple resistance constant (default 0.55)
 * @returns Position with rubber-band dampening applied if beyond bounds
 */
export const clampWithRubberband1D = (
  position: number,
  min: number,
  max: number,
  dimension: number,
  constant = 0.55
): number => {
  if (position < min) {
    const overshoot = position - min
    return min + calculateRubberband(overshoot, dimension, constant)
  }
  if (position > max) {
    const overshoot = position - max
    return max + calculateRubberband(overshoot, dimension, constant)
  }
  return position
}

export interface Bounds2D {
  minX: number
  maxX: number
  minY: number
  maxY: number
  width: number
  height: number
}

/**
 * Applies rubber-band damping in 2D independently across X and Y axes.
 */
export const clampWithRubberband2D = (
  point: { x: number; y: number },
  bounds: Bounds2D,
  constant = 0.55
): { x: number; y: number } => {
  return {
    x: clampWithRubberband1D(point.x, bounds.minX, bounds.maxX, bounds.width, constant),
    y: clampWithRubberband1D(point.y, bounds.minY, bounds.maxY, bounds.height, constant),
  }
}
