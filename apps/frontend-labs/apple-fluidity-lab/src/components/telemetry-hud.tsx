import type { Point2D, Velocity2D } from '../physics/projection.ts'
import type { SnapStation } from '../physics/snap.ts'

export type MotionMode = 'resting' | 'dragging' | 'springing' | 'interrupted'

interface TelemetryHudProps {
  position: Point2D
  velocity: Velocity2D
  projected: Point2D
  activeStation: SnapStation
  targetStation: SnapStation | null
  mode: MotionMode
  interruptionCount: number
}

const TelemetryHud = ({
  position,
  velocity,
  projected,
  activeStation,
  targetStation,
  mode,
  interruptionCount,
}: TelemetryHudProps) => {
  const modeLabel = {
    resting: 'Resting (Docked)',
    dragging: 'Direct Manipulation (1:1)',
    springing: 'Spring Active (Projected)',
    interrupted: 'Interrupted (Mid-Air)',
  }[mode]

  const modeAccent = {
    resting: 'accent-green',
    dragging: 'accent-blue',
    springing: 'accent-orange',
    interrupted: 'accent-orange',
  }[mode]

  const speed = Math.round(Math.hypot(velocity.vx, velocity.vy))

  return (
    <div className="sidebar-section" aria-label="Live Physics Telemetry">
      <div className="sidebar-heading">
        <span>Physics Telemetry</span>
        <span className={`badge-tag ${mode === 'interrupted' ? 'highlight' : ''}`}>
          {mode.toUpperCase()}
        </span>
      </div>

      <div className="telemetry-grid">
        <div className="telemetry-cell">
          <span className="telemetry-label">Status</span>
          <span className={`telemetry-value ${modeAccent}`} style={{ fontSize: '0.8rem' }}>
            {modeLabel}
          </span>
        </div>

        <div className="telemetry-cell">
          <span className="telemetry-label">Speed</span>
          <span className="telemetry-value">
            {speed} <small style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>px/s</small>
          </span>
        </div>

        <div className="telemetry-cell">
          <span className="telemetry-label">Position (X, Y)</span>
          <span className="telemetry-value">
            {Math.round(position.x)}, {Math.round(position.y)}
          </span>
        </div>

        <div className="telemetry-cell">
          <span className="telemetry-label">Velocity (Vx, Vy)</span>
          <span className="telemetry-value">
            {Math.round(velocity.vx)}, {Math.round(velocity.vy)}
          </span>
        </div>

        <div className="telemetry-cell">
          <span className="telemetry-label">Projected Landing</span>
          <span className="telemetry-value">
            {Math.round(projected.x)}, {Math.round(projected.y)}
          </span>
        </div>

        <div className="telemetry-cell">
          <span className="telemetry-label">Target Station</span>
          <span className="telemetry-value accent-blue" style={{ fontSize: '0.8rem' }}>
            {targetStation ? targetStation.title : mode === 'interrupted' ? 'None (Interrupted)' : activeStation.title}
          </span>
        </div>

        <div className="telemetry-cell" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="telemetry-label">Mid-Flight Interruptions</span>
            <span className="badge-tag highlight">{interruptionCount} caught</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TelemetryHud
