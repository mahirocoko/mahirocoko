interface A11yControlsProps {
  osReducedMotion: boolean
  simulatorReducedMotion: boolean
  effectiveReducedMotion: boolean
  reducedTransparency: boolean
  increasedContrast: boolean
  onToggleSimulatorReducedMotion: () => void
  onToggleReducedTransparency: () => void
  onToggleIncreasedContrast: () => void
}

const A11yControls = ({
  osReducedMotion,
  simulatorReducedMotion,
  effectiveReducedMotion,
  reducedTransparency,
  increasedContrast,
  onToggleSimulatorReducedMotion,
  onToggleReducedTransparency,
  onToggleIncreasedContrast,
}: A11yControlsProps) => {
  return (
    <div className="sidebar-section" aria-label="Accessibility & Interaction Overrides">
      <div className="sidebar-heading">
        <span>Accessibility Boundaries</span>
        <span className="badge-tag">A11Y</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div className="toggle-row">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                Reduced Motion Simulator
              </span>
              {osReducedMotion && (
                <span className="badge-tag highlight" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>
                  OS Active
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              {osReducedMotion
                ? 'System prefers-reduced-motion is active. Spatial spring flight disabled.'
                : simulatorReducedMotion
                ? 'Manual simulator override active. Spatial flight disabled.'
                : 'Simulate reduced motion (immediate settle, no flight).'}
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={effectiveReducedMotion}
            aria-disabled={osReducedMotion}
            className="toggle-switch"
            onClick={osReducedMotion ? undefined : onToggleSimulatorReducedMotion}
            title={
              osReducedMotion
                ? 'Active via system setting (prefers-reduced-motion: reduce)'
                : 'Toggle reduced motion manual simulator'
            }
            aria-label="Toggle Reduced Motion simulator override"
            style={osReducedMotion ? { opacity: 0.85, cursor: 'not-allowed' } : undefined}
          >
            <span className="toggle-thumb" />
          </button>
        </div>

        <div className="toggle-row">
          <div>
            <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Reduced Transparency</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
              Solid materials, disable glass blur
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={reducedTransparency}
            className="toggle-switch"
            onClick={onToggleReducedTransparency}
            aria-label="Toggle Reduced Transparency mode"
          >
            <span className="toggle-thumb" />
          </button>
        </div>

        <div className="toggle-row">
          <div>
            <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Increased Contrast</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
              Crisp specular borders & high contrast
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={increasedContrast}
            className="toggle-switch"
            onClick={onToggleIncreasedContrast}
            aria-label="Toggle Increased Contrast mode"
          >
            <span className="toggle-thumb" />
          </button>
        </div>
      </div>

      {/* Keyboard Controls Reference */}
      <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
          Keyboard Navigation
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Keys [1] – [5]</span>
            <span style={{ color: 'var(--text-secondary)' }}>Spring directly to station</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Arrow Keys (← ↑ → ↓)</span>
            <span style={{ color: 'var(--text-secondary)' }}>Move to a directional dock</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Space / Escape</span>
            <span style={{ color: 'var(--text-secondary)' }}>Interrupt mid-flight / Stop</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Key [R]</span>
            <span style={{ color: 'var(--text-secondary)' }}>Reset to Center Stage</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default A11yControls
