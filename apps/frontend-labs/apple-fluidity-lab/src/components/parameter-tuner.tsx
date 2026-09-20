import type { SpringConfig } from '../physics/spring.ts'

export interface PhysicsParams {
  spring: SpringConfig
  decelerationRate: number
  rubberbandConstant: number
}

interface ParameterTunerProps {
  params: PhysicsParams
  onChange: (params: PhysicsParams) => void
  onReset: () => void
}

const ParameterTuner = ({ params, onChange, onReset }: ParameterTunerProps) => {
  const updateSpring = (partial: Partial<SpringConfig>) => {
    onChange({
      ...params,
      spring: {
        ...params.spring,
        ...partial,
      },
    })
  }

  const applyPreset = (preset: { dampingRatio: number; response: number; decel?: number }) => {
    onChange({
      ...params,
      spring: {
        dampingRatio: preset.dampingRatio,
        response: preset.response,
      },
      decelerationRate: preset.decel ?? params.decelerationRate,
    })
  }

  return (
    <div className="sidebar-section" aria-label="Physics Engine Parameters">
      <div className="sidebar-heading">
        <span>Spring & Drag Tuning</span>
        <button
          type="button"
          className="button-apple"
          style={{ padding: '2px 8px', fontSize: '0.7rem' }}
          onClick={onReset}
          title="Reset to Apple WWDC defaults"
        >
          Reset
        </button>
      </div>

      <div className="slider-group">
        {/* Damping Ratio Slider */}
        <div className="slider-row">
          <div className="slider-header">
            <span className="slider-label">Damping Ratio (ζ)</span>
            <span className="slider-readout">
              {params.spring.dampingRatio.toFixed(2)}
              {params.spring.dampingRatio === 1 ? ' (critical)' : params.spring.dampingRatio < 1 ? ' (bounce)' : ' (overdamped)'}
            </span>
          </div>
          <input
            type="range"
            min="0.4"
            max="1.4"
            step="0.02"
            value={params.spring.dampingRatio}
            onChange={(e) => updateSpring({ dampingRatio: Number.parseFloat(e.target.value) })}
            aria-label="Damping Ratio"
          />
        </div>

        {/* Response Slider */}
        <div className="slider-row">
          <div className="slider-header">
            <span className="slider-label">Response Time (T₀)</span>
            <span className="slider-readout">{params.spring.response.toFixed(2)}s</span>
          </div>
          <input
            type="range"
            min="0.15"
            max="0.80"
            step="0.01"
            value={params.spring.response}
            onChange={(e) => updateSpring({ response: Number.parseFloat(e.target.value) })}
            aria-label="Response Time"
          />
        </div>

        {/* Momentum Deceleration Rate */}
        <div className="slider-row">
          <div className="slider-header">
            <span className="slider-label">Deceleration Rate (d)</span>
            <span className="slider-readout">{params.decelerationRate.toFixed(3)}</span>
          </div>
          <input
            type="range"
            min="0.980"
            max="0.999"
            step="0.001"
            value={params.decelerationRate}
            onChange={(e) =>
              onChange({ ...params, decelerationRate: Number.parseFloat(e.target.value) })
            }
            aria-label="Deceleration Rate"
          />
        </div>

        {/* Rubber-band Constant */}
        <div className="slider-row">
          <div className="slider-header">
            <span className="slider-label">Rubberband Constant (c)</span>
            <span className="slider-readout">{params.rubberbandConstant.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="0.9"
            step="0.05"
            value={params.rubberbandConstant}
            onChange={(e) =>
              onChange({ ...params, rubberbandConstant: Number.parseFloat(e.target.value) })
            }
            aria-label="Rubberband Resistance Constant"
          />
        </div>
      </div>

      {/* Quick Presets */}
      <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        <button
          type="button"
          className="button-apple"
          style={{ fontSize: '0.72rem', padding: '4px 8px' }}
          onClick={() => applyPreset({ dampingRatio: 1.0, response: 0.38 })}
        >
          Critically Damped (1.0)
        </button>
        <button
          type="button"
          className="button-apple"
          style={{ fontSize: '0.72rem', padding: '4px 8px' }}
          onClick={() => applyPreset({ dampingRatio: 0.82, response: 0.40 })}
        >
          Momentum Flick (0.82)
        </button>
        <button
          type="button"
          className="button-apple"
          style={{ fontSize: '0.72rem', padding: '4px 8px' }}
          onClick={() => applyPreset({ dampingRatio: 0.65, response: 0.46 })}
        >
          Bouncy Spring (0.65)
        </button>
        <button
          type="button"
          className="button-apple"
          style={{ fontSize: '0.72rem', padding: '4px 8px' }}
          onClick={() => applyPreset({ dampingRatio: 1.0, response: 0.28, decel: 0.990 })}
        >
          Snappy Sheet (0.28s)
        </button>
      </div>
    </div>
  )
}

export default ParameterTuner
