import { useEffect, useState } from 'react'
import type { Point2D, Velocity2D } from './physics/projection.ts'
import {
  DEFAULT_SNAP_STATIONS,
  type SnapStation,
} from './physics/snap.ts'
import {
  DEFAULT_SPRING_CONFIG,
} from './physics/spring.ts'
import TelemetryHud, { type MotionMode } from './components/telemetry-hud.tsx'
import ParameterTuner, { type PhysicsParams } from './components/parameter-tuner.tsx'
import ExperimentGuide from './components/experiment-guide.tsx'
import { EXPERIMENT_STEPS } from './data/experiments.ts'
import A11yControls from './components/a11y-controls.tsx'
import FluidityStage from './components/fluidity-stage.tsx'
import './styles/fluidity.css'

const DEFAULT_PHYSICS_PARAMS: PhysicsParams = {
  spring: DEFAULT_SPRING_CONFIG,
  decelerationRate: 0.998,
  rubberbandConstant: 0.55,
}

const App = () => {
  // Physics parameters state
  const [params, setParams] = useState<PhysicsParams>(DEFAULT_PHYSICS_PARAMS)

  // Guided experiment state
  const [activeExperimentId, setActiveExperimentId] = useState<string>(EXPERIMENT_STEPS[0].id)

  // Observe OS prefers-reduced-motion media query
  const [osReducedMotion, setOsReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
    return false
  })

  // Manual simulator override
  const [simulatorReducedMotion, setSimulatorReducedMotion] = useState<boolean>(false)

  // Effective reduced motion state (OS setting or manual simulation)
  const effectiveReducedMotion = osReducedMotion || simulatorReducedMotion

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (e: MediaQueryListEvent) => {
      setOsReducedMotion(e.matches)
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const [reducedTransparency, setReducedTransparency] = useState<boolean>(false)
  const [increasedContrast, setIncreasedContrast] = useState<boolean>(false)

  // Live telemetry state
  const [telemetry, setTelemetry] = useState<{
    position: Point2D
    velocity: Velocity2D
    projected: Point2D
    activeStation: SnapStation
    targetStation: SnapStation | null
    mode: MotionMode
    interruptionCount: number
  }>({
    position: { x: 0, y: 0 },
    velocity: { vx: 0, vy: 0 },
    projected: { x: 0, y: 0 },
    activeStation: DEFAULT_SNAP_STATIONS[1],
    targetStation: null,
    mode: 'resting',
    interruptionCount: 0,
  })

  // Class modifiers based on accessibility preferences
  const rootClasses = [
    'lab-root',
    effectiveReducedMotion ? 'lab-reduced-motion' : '',
    reducedTransparency ? 'lab-reduced-transparency' : '',
    increasedContrast ? 'lab-increased-contrast' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={rootClasses}>
      {/* Top Header */}
      <header className="lab-header">
        <div className="lab-title-group">
          <h1>Apple Fluidity Lab</h1>
          <p>Direct Manipulation, Momentum Projection, Analytical Springs & Mid-Flight Interruption</p>
        </div>
        <div className="header-badges">
          <span className="badge-tag highlight">WWDC 2018 / 2026</span>
          <span className="badge-tag">ANALYTICAL SPRINGS</span>
          <span className="badge-tag">1:1 GRAB OFFSET</span>
        </div>
      </header>

      {/* Main Workspace: Stage Canvas + Inspector Sidebar */}
      <main className="lab-workspace">
        <FluidityStage
          params={params}
          reducedMotion={effectiveReducedMotion}
          onTelemetryUpdate={setTelemetry}
        />

        <aside className="lab-sidebar" aria-label="Controls and Telemetry">
          <TelemetryHud
            position={telemetry.position}
            velocity={telemetry.velocity}
            projected={telemetry.projected}
            activeStation={telemetry.activeStation}
            targetStation={telemetry.targetStation}
            mode={telemetry.mode}
            interruptionCount={telemetry.interruptionCount}
          />

          <ExperimentGuide
            steps={EXPERIMENT_STEPS}
            activeExperimentId={activeExperimentId}
            onSelectExperiment={setActiveExperimentId}
          />

          <ParameterTuner
            params={params}
            onChange={setParams}
            onReset={() => setParams(DEFAULT_PHYSICS_PARAMS)}
          />

          <A11yControls
            osReducedMotion={osReducedMotion}
            simulatorReducedMotion={simulatorReducedMotion}
            effectiveReducedMotion={effectiveReducedMotion}
            reducedTransparency={reducedTransparency}
            increasedContrast={increasedContrast}
            onToggleSimulatorReducedMotion={() => setSimulatorReducedMotion((v) => !v)}
            onToggleReducedTransparency={() => setReducedTransparency((v) => !v)}
            onToggleIncreasedContrast={() => setIncreasedContrast((v) => !v)}
          />
        </aside>
      </main>
    </div>
  )
}

export default App
