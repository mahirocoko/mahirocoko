import { useCallback, useEffect, useRef, useState } from 'react'
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
  type SnapStation,
  findNearestSnapStation,
} from '../physics/snap.ts'
import {
  type SpringState2D,
  isSpringSettled2D,
  stepSpring2D,
} from '../physics/spring.ts'
import type { MotionMode } from './telemetry-hud.tsx'
import type { PhysicsParams } from './parameter-tuner.tsx'
import SnapStationAnchor from './snap-station-anchor.tsx'

interface SamplePoint {
  x: number
  y: number
  time: number
}

interface FluidityStageProps {
  params: PhysicsParams
  reducedMotion: boolean
  onTelemetryUpdate: (telemetry: {
    position: Point2D
    velocity: Velocity2D
    projected: Point2D
    activeStation: SnapStation
    targetStation: SnapStation | null
    mode: MotionMode
    interruptionCount: number
  }) => void
}

const STAGE_WIDTH = 760
const STAGE_HEIGHT = 500
const HALF_WIDTH = STAGE_WIDTH / 2
const HALF_HEIGHT = STAGE_HEIGHT / 2

// Constrain dragging bounds within stage with rubber-band margin
const STAGE_BOUNDS: Bounds2D = {
  minX: -HALF_WIDTH + 95,
  maxX: HALF_WIDTH - 95,
  minY: -HALF_HEIGHT + 65,
  maxY: HALF_HEIGHT - 65,
  width: STAGE_WIDTH,
  height: STAGE_HEIGHT,
}

const FluidityStage = ({
  params,
  reducedMotion,
  onTelemetryUpdate,
}: FluidityStageProps) => {
  const scalerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [stageScale, setStageScale] = useState<number>(1)

  // Motion & Position States
  const [position, setPosition] = useState<Point2D>({ x: 0, y: 0 })
  const [velocity, setVelocity] = useState<Velocity2D>({ vx: 0, vy: 0 })
  const [projected, setProjected] = useState<Point2D>({ x: 0, y: 0 })
  const [activeStation, setActiveStation] = useState<SnapStation>(DEFAULT_SNAP_STATIONS[1]) // Center
  const [targetStation, setTargetStation] = useState<SnapStation | null>(null)
  const [mode, setMode] = useState<MotionMode>('resting')
  const [interruptionCount, setInterruptionCount] = useState<number>(0)
  const [isPressing, setIsPressing] = useState<boolean>(false)

  // Animation & Interaction Refs
  const rafIdRef = useRef<number | null>(null)
  const springStateRef = useRef<SpringState2D>({
    x: { position: 0, target: 0, velocity: 0 },
    y: { position: 0, target: 0, velocity: 0 },
  })
  const positionRef = useRef<Point2D>({ x: 0, y: 0 })
  const velocityRef = useRef<Velocity2D>({ vx: 0, vy: 0 })
  const grabOffsetRef = useRef<Point2D>({ x: 0, y: 0 })
  const sampleHistoryRef = useRef<SamplePoint[]>([])
  const lastFrameTimeRef = useRef<number>(0)
  const isDraggingRef = useRef<boolean>(false)
  const reducedMotionRef = useRef(reducedMotion)

  useEffect(() => {
    reducedMotionRef.current = reducedMotion
  }, [reducedMotion])

  // Responsive scaling observer for logical 760x500 coordinate system
  useEffect(() => {
    const updateScale = () => {
      if (!scalerRef.current) return
      const containerWidth = scalerRef.current.clientWidth
      if (containerWidth > 0) {
        const nextScale = Math.min(1, containerWidth / STAGE_WIDTH)
        setStageScale(nextScale)
      }
    }

    updateScale()

    if (typeof ResizeObserver !== 'undefined' && scalerRef.current) {
      const ro = new ResizeObserver(updateScale)
      ro.observe(scalerRef.current)
      return () => ro.disconnect()
    }

    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  // Keep positionRef in sync
  useEffect(() => {
    positionRef.current = position
  }, [position])

  // Sync telemetry out to parent
  useEffect(() => {
    onTelemetryUpdate({
      position,
      velocity,
      projected,
      activeStation,
      targetStation,
      mode,
      interruptionCount,
    })
  }, [
    position,
    velocity,
    projected,
    activeStation,
    targetStation,
    mode,
    interruptionCount,
    onTelemetryUpdate,
  ])

  // Stop running spring loop
  const cancelSpringLoop = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }
  }, [])

  // Start analytical spring simulation
  const startSpringToTarget = useCallback(
    (target: Point2D, initialVel: Velocity2D, destinationStation: SnapStation) => {
      cancelSpringLoop()

      if (reducedMotion) {
        // Non-vestibular immediate/gentle settle without spatial flight
        positionRef.current = target
        velocityRef.current = { vx: 0, vy: 0 }
        springStateRef.current = {
          x: { position: target.x, target: target.x, velocity: 0 },
          y: { position: target.y, target: target.y, velocity: 0 },
        }
        setPosition(target)
        setVelocity({ vx: 0, vy: 0 })
        setProjected(target)
        setActiveStation(destinationStation)
        setTargetStation(null)
        setMode('resting')
        return
      }

      setMode('springing')
      setTargetStation(destinationStation)

      springStateRef.current = {
        x: {
          position: positionRef.current.x,
          target: target.x,
          velocity: initialVel.vx,
        },
        y: {
          position: positionRef.current.y,
          target: target.y,
          velocity: initialVel.vy,
        },
      }

      lastFrameTimeRef.current = performance.now()

      const tick = (now: number) => {
        if (reducedMotionRef.current) {
          positionRef.current = target
          velocityRef.current = { vx: 0, vy: 0 }
          springStateRef.current = {
            x: { position: target.x, target: target.x, velocity: 0 },
            y: { position: target.y, target: target.y, velocity: 0 },
          }
          setPosition(target)
          setVelocity({ vx: 0, vy: 0 })
          setProjected(target)
          setActiveStation(destinationStation)
          setTargetStation(null)
          setMode('resting')
          rafIdRef.current = null
          return
        }

        const dt = Math.min((now - lastFrameTimeRef.current) / 1000, 0.064) // Clamp to prevent spike
        lastFrameTimeRef.current = now

        const nextSpringState = stepSpring2D(springStateRef.current, params.spring, dt)
        springStateRef.current = nextSpringState

        const nextPos: Point2D = {
          x: nextSpringState.x.position,
          y: nextSpringState.y.position,
        }
        const nextVel: Velocity2D = {
          vx: nextSpringState.x.velocity,
          vy: nextSpringState.y.velocity,
        }

        positionRef.current = nextPos
        velocityRef.current = nextVel

        setPosition(nextPos)
        setVelocity(nextVel)

        if (isSpringSettled2D(nextSpringState)) {
          // Settled cleanly: synchronize all live refs to exact target with zero velocity
          cancelSpringLoop()
          positionRef.current = target
          velocityRef.current = { vx: 0, vy: 0 }
          springStateRef.current = {
            x: { position: target.x, target: target.x, velocity: 0 },
            y: { position: target.y, target: target.y, velocity: 0 },
          }
          setPosition(target)
          setVelocity({ vx: 0, vy: 0 })
          setProjected(target)
          setActiveStation(destinationStation)
          setTargetStation(null)
          setMode('resting')
        } else {
          rafIdRef.current = requestAnimationFrame(tick)
        }
      }

      rafIdRef.current = requestAnimationFrame(tick)
    },
    [cancelSpringLoop, params.spring, reducedMotion]
  )

  // Navigate directly via dock button click or keyboard shortcut
  const snapToStation = useCallback(
    (station: SnapStation) => {
      cancelSpringLoop()
      const target = { x: station.x, y: station.y }
      // Start with zero velocity if resting or interrupted to avoid stale velocity jump
      const initialVel = mode === 'springing' || mode === 'dragging'
        ? velocityRef.current
        : { vx: 0, vy: 0 }
      velocityRef.current = initialVel
      startSpringToTarget(target, initialVel, station)
    },
    [cancelSpringLoop, mode, startSpringToTarget]
  )

  // Convert client viewport coordinates to stage-relative coords (origin at center)
  // Accounts for dynamic responsive visual scaling of the stage viewport
  const getStageRelativeCoords = useCallback((clientX: number, clientY: number): Point2D => {
    if (!stageRef.current) return { x: 0, y: 0 }
    const rect = stageRef.current.getBoundingClientRect()
    const scaleX = rect.width / STAGE_WIDTH || 1
    const scaleY = rect.height / STAGE_HEIGHT || 1
    const stageCenterX = rect.left + rect.width / 2
    const stageCenterY = rect.top + rect.height / 2
    return {
      x: (clientX - stageCenterX) / scaleX,
      y: (clientY - stageCenterY) / scaleY,
    }
  }, [])

  // Pointer Down (Principle 1 & 2: Immediate response + Grab offset integrity + Mid-flight interrupt)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    // 1. Capture pointer
    e.currentTarget.setPointerCapture(e.pointerId)
    setIsPressing(true)
    isDraggingRef.current = true

    // 2. Check if interrupting a flying spring
    if (mode === 'springing') {
      cancelSpringLoop()
      setInterruptionCount((prev) => prev + 1)
      setMode('interrupted')
    } else {
      setMode('dragging')
    }

    // 3. Compute exact contact grab offset from presentation position in logical coordinates
    const pointerInStage = getStageRelativeCoords(e.clientX, e.clientY)
    const current = positionRef.current
    grabOffsetRef.current = {
      x: pointerInStage.x - current.x,
      y: pointerInStage.y - current.y,
    }

    // 4. Initialize sample history for velocity measurement
    const now = performance.now()
    sampleHistoryRef.current = [{ x: current.x, y: current.y, time: now }]
  }

  // Pointer Move (Principle 2 & 9: 1:1 tracking + Boundary rubber-banding + Continuous momentum projection)
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return

    const pointerInStage = getStageRelativeCoords(e.clientX, e.clientY)
    const now = performance.now()

    // 1:1 direct tracking minus contact offset
    const rawPos: Point2D = {
      x: pointerInStage.x - grabOffsetRef.current.x,
      y: pointerInStage.y - grabOffsetRef.current.y,
    }

    // Apply Apple 2D rubber-banding at boundaries
    const clampedPos = clampWithRubberband2D(rawPos, STAGE_BOUNDS, params.rubberbandConstant)

    positionRef.current = clampedPos
    setPosition(clampedPos)

    // Update velocity sample history (keep last 100ms)
    const history = sampleHistoryRef.current
    history.push({ x: clampedPos.x, y: clampedPos.y, time: now })
    while (history.length > 2 && now - history[0].time > 100) {
      history.shift()
    }

    // Compute live velocity from samples
    if (history.length >= 2) {
      const oldest = history[0]
      const newest = history[history.length - 1]
      const dt = (newest.time - oldest.time) / 1000
      if (dt > 0.005) {
        const currentVx = (newest.x - oldest.x) / dt
        const currentVy = (newest.y - oldest.y) / dt
        const currentVel = { vx: currentVx, vy: currentVy }
        velocityRef.current = currentVel
        setVelocity(currentVel)

        // Live momentum projection (§6)
        const proj = projectPoint(clampedPos, currentVel, params.decelerationRate)
        setProjected(proj)

        // Highlight projected target station ahead of release (§8 Hint in gesture direction)
        const nearest = findNearestSnapStation(proj, DEFAULT_SNAP_STATIONS)
        setTargetStation(nearest)
      }
    }
  }

  // Pointer Up / Cancel (Principle 5 & 6: Velocity handoff + Destination projection + Spring snap)
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return

    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // In case capture was released earlier
    }

    isDraggingRef.current = false
    setIsPressing(false)

    // Compute final release velocity from recent window
    const history = sampleHistoryRef.current
    let releaseVx = 0
    let releaseVy = 0

    if (history.length >= 2) {
      const oldest = history[0]
      const newest = history[history.length - 1]
      const dt = (newest.time - oldest.time) / 1000
      const elapsedSinceLast = (performance.now() - newest.time) / 1000

      // If finger stopped moving before release, decay velocity to zero
      if (dt > 0.005 && elapsedSinceLast < 0.06) {
        releaseVx = (newest.x - oldest.x) / dt
        releaseVy = (newest.y - oldest.y) / dt
      }
    }

    const finalVelocity: Velocity2D = { vx: releaseVx, vy: releaseVy }
    velocityRef.current = finalVelocity
    setVelocity(finalVelocity)

    // Project destination using Apple's formula
    const finalProjected = projectPoint(
      positionRef.current,
      finalVelocity,
      params.decelerationRate
    )
    setProjected(finalProjected)

    // Snap to station nearest the projected point
    const destination = findNearestSnapStation(finalProjected, DEFAULT_SNAP_STATIONS)
    startSpringToTarget({ x: destination.x, y: destination.y }, finalVelocity, destination)
  }

  // Keyboard accessibility navigation scoped to the focused stage surface
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Exclude interactive form controls (range inputs, buttons) so native keyboard behavior is preserved
    const target = e.target as HTMLElement | null
    if (
      target &&
      target.closest('button, input, textarea, select, a[href], [contenteditable="true"]')
    ) {
      return
    }

    // Station 1-5 keys
    const stationMap: Record<string, SnapStation> = {
      '1': DEFAULT_SNAP_STATIONS[0],
      '2': DEFAULT_SNAP_STATIONS[1],
      '3': DEFAULT_SNAP_STATIONS[2],
      '4': DEFAULT_SNAP_STATIONS[3],
      '5': DEFAULT_SNAP_STATIONS[4],
    }

    if (stationMap[e.key]) {
      e.preventDefault()
      snapToStation(stationMap[e.key])
      return
    }

    // Arrow navigation between docks
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      snapToStation(DEFAULT_SNAP_STATIONS[0]) // Preview deck
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      snapToStation(DEFAULT_SNAP_STATIONS[3]) // Quick stash
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      snapToStation(DEFAULT_SNAP_STATIONS[0])
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      snapToStation(DEFAULT_SNAP_STATIONS[2]) // Inspector dock
    } else if (e.key === ' ' || e.key === 'Escape') {
      e.preventDefault()
      // Space or Escape interrupts mid-flight and stops cleanly at current position
      cancelSpringLoop()
      const currentPos = positionRef.current
      velocityRef.current = { vx: 0, vy: 0 }
      springStateRef.current = {
        x: { position: currentPos.x, target: currentPos.x, velocity: 0 },
        y: { position: currentPos.y, target: currentPos.y, velocity: 0 },
      }
      setPosition(currentPos)
      setVelocity({ vx: 0, vy: 0 })
      setProjected(currentPos)
      setTargetStation(null)
      setMode('interrupted')
      setInterruptionCount((prev) => prev + 1)
    } else if (e.key.toLowerCase() === 'r') {
      e.preventDefault()
      snapToStation(DEFAULT_SNAP_STATIONS[1]) // Center
    }
  }

  // Center coordinate of stage
  const stageCenter = { x: HALF_WIDTH, y: HALF_HEIGHT }

  // Tile rendering position
  const tilePixelX = stageCenter.x + position.x
  const tilePixelY = stageCenter.y + position.y

  // Projected line vector
  const projPixelX = stageCenter.x + projected.x
  const projPixelY = stageCenter.y + projected.y

  return (
    <div className="stage-container">
      {/* Scaler Frame ensures responsive proportional scaling without clipping or horizontal overflow */}
      <div
        ref={scalerRef}
        className="stage-scaler-frame"
        style={{
          width: '100%',
          maxWidth: `${STAGE_WIDTH}px`,
          height: `${STAGE_HEIGHT * stageScale}px`,
        }}
      >
        <div
          ref={stageRef}
          className="stage-viewport"
          style={{
            width: `${STAGE_WIDTH}px`,
            height: `${STAGE_HEIGHT}px`,
            transform: `scale(${stageScale})`,
            transformOrigin: 'top left',
          }}
          role="region"
          aria-label="Fluid Motion Interactive Canvas. Use keys 1 to 5, arrow keys, Space to stop, or R to reset."
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          <div className="stage-grid-overlay" />

          {/* Snap Station Docks */}
          {DEFAULT_SNAP_STATIONS.map((station) => (
            <SnapStationAnchor
              key={station.id}
              station={station}
              isActive={activeStation.id === station.id && mode === 'resting'}
              isProjectedTarget={targetStation?.id === station.id && mode !== 'resting'}
              stageCenter={stageCenter}
              onSelect={snapToStation}
            />
          ))}

          {/* Momentum Projection Vector Line (Visible during drag or spring) */}
          {(mode === 'dragging' || mode === 'springing') && (
            <svg className="vector-line" width={STAGE_WIDTH} height={STAGE_HEIGHT}>
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="8"
                  markerHeight="6"
                  refX="7"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 8 3, 0 6" fill="rgba(10, 132, 255, 0.7)" />
                </marker>
              </defs>
              <line
                x1={tilePixelX}
                y1={tilePixelY}
                x2={projPixelX}
                y2={projPixelY}
                stroke="rgba(10, 132, 255, 0.5)"
                strokeWidth="2"
                strokeDasharray="4 4"
                markerEnd="url(#arrowhead)"
              />
              <circle
                cx={projPixelX}
                cy={projPixelY}
                r="4"
                fill="rgba(10, 132, 255, 0.8)"
              />
            </svg>
          )}

          {/* The Draggable Slate Object ("Fluid Dynamic Slate") */}
          {/* Honest semantics: presentation element with pointer drag surface; stage and station buttons handle keyboard navigation */}
          <div
            className={`fluid-slate ${isPressing ? 'pressing' : ''} ${
              mode === 'dragging' ? 'dragging' : ''
            } ${mode === 'springing' ? 'settling' : ''}`}
            style={{
              transform: `translate3d(${tilePixelX - 85}px, ${tilePixelY - 55}px, 0)`,
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            aria-hidden="true"
          >
            <div className="slate-top-bar">
              <span
                className={`slate-status-dot ${
                  mode === 'dragging'
                    ? 'active-drag'
                    : mode === 'interrupted'
                    ? 'interrupted'
                    : ''
                }`}
              />
              <span className="slate-id-label">FLUID-01</span>
            </div>

            <div className="slate-content">
              <h3>{mode === 'interrupted' ? 'Mid-Air' : activeStation.title}</h3>
              <p>
                {mode === 'dragging'
                  ? '1:1 Tracking'
                  : mode === 'springing'
                  ? 'Springing…'
                  : mode === 'interrupted'
                  ? 'Interrupted'
                  : 'Docked'}
              </p>
            </div>

            <div className="slate-footer">
              <span>{Math.round(position.x)}, {Math.round(position.y)}</span>
              <span>{Math.round(Math.hypot(velocity.vx, velocity.vy))} px/s</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
        <button
          type="button"
          className="button-apple"
          onClick={() => snapToStation(DEFAULT_SNAP_STATIONS[1])}
        >
          Center Stage [2]
        </button>
        <button
          type="button"
          className="button-apple"
          onClick={() => snapToStation(DEFAULT_SNAP_STATIONS[0])}
        >
          Preview Deck [1]
        </button>
        <button
          type="button"
          className="button-apple"
          onClick={() => snapToStation(DEFAULT_SNAP_STATIONS[2])}
        >
          Inspector Dock [3]
        </button>
      </div>
    </div>
  )
}

export default FluidityStage
