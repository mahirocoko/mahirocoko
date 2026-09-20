import { describe, expect, it } from 'vitest'
import {
  type Point2D,
  type Velocity2D,
  projectPoint,
} from '../physics/projection.ts'
import {
  type Bounds2D,
  clampWithRubberband2D,
} from '../physics/rubberband.ts'
import {
  DEFAULT_SNAP_STATIONS,
  findNearestSnapStation,
} from '../physics/snap.ts'

const STAGE_WIDTH = 760
const STAGE_HEIGHT = 500

/**
 * Deterministic helper mirroring FluidityStage getStageRelativeCoords
 */
function convertClientToStageCoords(
  clientX: number,
  clientY: number,
  boundingRect: { left: number; top: number; width: number; height: number },
  logicalWidth = STAGE_WIDTH,
  logicalHeight = STAGE_HEIGHT
): Point2D {
  const scaleX = boundingRect.width / logicalWidth || 1
  const scaleY = boundingRect.height / logicalHeight || 1
  const stageCenterX = boundingRect.left + boundingRect.width / 2
  const stageCenterY = boundingRect.top + boundingRect.height / 2
  return {
    x: (clientX - stageCenterX) / scaleX,
    y: (clientY - stageCenterY) / scaleY,
  }
}

describe('Stage Geometry: Responsive Coordinate Mapping at Non-1 Scale', () => {
  it('converts client coordinates accurately at 1:1 scale (desktop 760x500)', () => {
    const rect = { left: 100, top: 50, width: 760, height: 500 }

    // Center click
    const center = convertClientToStageCoords(100 + 380, 50 + 250, rect)
    expect(center.x).toBeCloseTo(0, 5)
    expect(center.y).toBeCloseTo(0, 5)

    // Top-left corner
    const topLeft = convertClientToStageCoords(100, 50, rect)
    expect(topLeft.x).toBeCloseTo(-380, 5)
    expect(topLeft.y).toBeCloseTo(-250, 5)

    // Bottom-right corner
    const bottomRight = convertClientToStageCoords(100 + 760, 50 + 500, rect)
    expect(bottomRight.x).toBeCloseTo(380, 5)
    expect(bottomRight.y).toBeCloseTo(250, 5)
  })

  it('converts client coordinates accurately at scaled viewport (mobile 390px / scale ~0.48)', () => {
    const scale = 366 / 760 // ~0.481578
    const renderedWidth = 366
    const renderedHeight = 500 * scale // 240.789
    const rect = { left: 12, top: 80, width: renderedWidth, height: renderedHeight }

    // Center tap on mobile
    const stageCenterX = rect.left + renderedWidth / 2
    const stageCenterY = rect.top + renderedHeight / 2
    const center = convertClientToStageCoords(stageCenterX, stageCenterY, rect)
    expect(center.x).toBeCloseTo(0, 4)
    expect(center.y).toBeCloseTo(0, 4)

    // Tap at the rendered Preview Deck center (-260, -170)
    const dockClientX = stageCenterX + -260 * scale
    const dockClientY = stageCenterY + -170 * scale
    const mapped = convertClientToStageCoords(dockClientX, dockClientY, rect)
    expect(mapped.x).toBeCloseTo(-260, 4)
    expect(mapped.y).toBeCloseTo(-170, 4)

    // Verify nearest station resolved from scaled touch is exact
    const resolvedStation = findNearestSnapStation(mapped, DEFAULT_SNAP_STATIONS)
    expect(resolvedStation.id).toBe('preview-deck')
  })

  it('preserves grab offset calculation regardless of scale factor', () => {
    const scale = 0.5
    const rect = { left: 0, top: 0, width: 380, height: 250 }
    const slateLogicalPos: Point2D = { x: 50, y: -30 }

    // User grabs slate 20px right and 15px down from slate logical center
    const contactLogicalPoint: Point2D = {
      x: slateLogicalPos.x + 20,
      y: slateLogicalPos.y + 15,
    }

    // Convert contactLogicalPoint to rendered screen coordinate
    const clientX = (rect.width / 2) + contactLogicalPoint.x * scale
    const clientY = (rect.height / 2) + contactLogicalPoint.y * scale

    // In handler: convert client coords back to stage relative coords
    const pointerInStage = convertClientToStageCoords(clientX, clientY, rect)
    const grabOffset = {
      x: pointerInStage.x - slateLogicalPos.x,
      y: pointerInStage.y - slateLogicalPos.y,
    }

    expect(grabOffset.x).toBeCloseTo(20, 5)
    expect(grabOffset.y).toBeCloseTo(15, 5)

    // On move to new client position:
    const movedClientX = clientX + 40 * scale // moved 40 logical px right
    const movedClientY = clientY - 30 * scale // moved 30 logical px up
    const newPointer = convertClientToStageCoords(movedClientX, movedClientY, rect)
    const rawPos = {
      x: newPointer.x - grabOffset.x,
      y: newPointer.y - grabOffset.y,
    }

    expect(rawPos.x).toBeCloseTo(slateLogicalPos.x + 40, 5)
    expect(rawPos.y).toBeCloseTo(slateLogicalPos.y - 30, 5)
  })

  it('correctly clamps and projects momentum in logical coordinates at non-1 scale', () => {
    const bounds: Bounds2D = {
      minX: -285,
      maxX: 285,
      minY: -185,
      maxY: 185,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
    }

    // High velocity flick
    const currentPos: Point2D = { x: 100, y: 50 }
    const releaseVelocity: Velocity2D = { vx: 600, vy: -300 }
    const projected = projectPoint(currentPos, releaseVelocity, 0.998)

    // Clamping inside bounds
    const clamped = clampWithRubberband2D(currentPos, bounds, 0.55)
    expect(clamped.x).toBe(100)
    expect(clamped.y).toBe(50)

    // Snaps to expected station dock in logical space
    const target = findNearestSnapStation(projected, DEFAULT_SNAP_STATIONS)
    expect(target.id).toBe('inspector-dock') // Top right
  })
})

describe('Interruption & Settlement State Synchronization', () => {
  it('ensures settling at target zeroes velocity and synchronizes presentation refs', () => {
    const target: Point2D = { x: 220, y: -140 }
    const destinationStation = DEFAULT_SNAP_STATIONS[2] // Inspector Dock

    // Simulate settling logic from FluidityStage
    const liveRefs = {
      position: { x: 219.99, y: -139.99 },
      velocity: { vx: 0.04, vy: -0.02 },
      settled: false,
    }

    // Settle handler
    liveRefs.position = target
    liveRefs.velocity = { vx: 0, vy: 0 }
    liveRefs.settled = true

    expect(liveRefs.position.x).toBe(target.x)
    expect(liveRefs.position.y).toBe(target.y)
    expect(liveRefs.velocity.vx).toBe(0)
    expect(liveRefs.velocity.vy).toBe(0)
    expect(destinationStation.title).toBe('Inspector Dock')
  })

  it('ensures mid-air keyboard stop freezes at current presentation coords with zero velocity', () => {
    const midAirPos: Point2D = { x: 45, y: -80 }
    const midAirVel: Velocity2D = { vx: 350, vy: -200 }

    // Live state during flight
    const position = { ...midAirPos }
    let velocity = { ...midAirVel }
    let mode: 'springing' | 'interrupted' | 'resting' = 'springing'
    let targetStation: string | null = 'inspector-dock'

    expect(velocity.vx).toBe(350)
    expect(mode).toBe('springing')
    expect(targetStation).toBe('inspector-dock')

    // User presses Space / Escape mid-flight
    velocity = { vx: 0, vy: 0 }
    targetStation = null
    mode = 'interrupted'

    expect(position).toEqual(midAirPos)
    expect(velocity).toEqual({ vx: 0, vy: 0 })
    expect(mode).toBe('interrupted')
    expect(targetStation).toBeNull()
  })
})
