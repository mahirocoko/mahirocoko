import React, { useState, useRef, useCallback, useEffect } from 'react'
import './app-styles.css'

type TWorkbenchState = 'ready' | 'empty' | 'inspecting' | 'unsupported' | 'source_changed' | 'destination_unavailable'

interface IAppWorkbenchProps {
  initialState?: TWorkbenchState
}

interface IAssetSpec {
  filename: string
  dimensions: string
  fileSize: string
  colorSpace: string
  exifGeotag: string
  device: string
  software: string
  privacyTagsCount: number
}

const SAMPLE_ASSET: IAssetSpec = {
  filename: 'screenshot_export_p3.png',
  dimensions: '2880 × 1800 px',
  fileSize: '8.4 MB (Sample)',
  colorSpace: 'Display P3',
  exifGeotag: '37.7749° N, 122.4194° W',
  device: 'Mac Studio (Sample)',
  software: 'Screen Export (Sample)',
  privacyTagsCount: 3,
}

const AppWorkbench = ({ initialState = 'ready' }: IAppWorkbenchProps) => {
  const [appState, setAppState] = useState<TWorkbenchState>(initialState)
  const [splitPos, setSplitPos] = useState<number>(50)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [scaleMode, setScaleMode] = useState<'100' | '85'>('100')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Recipe checkboxes
  const [stripExif, setStripExif] = useState<boolean>(true)
  const [convertGamut, setConvertGamut] = useState<boolean>(true)
  const [losslessReencode, setLosslessReencode] = useState<boolean>(true)

  const stageRef = useRef<HTMLDivElement>(null)

  const updateSplit = useCallback((clientX: number) => {
    if (!stageRef.current) return
    const rect = stageRef.current.getBoundingClientRect()
    const rawPct = ((clientX - rect.left) / rect.width) * 100
    const clampedPct = Math.max(5, Math.min(95, rawPct))
    setSplitPos(clampedPct)
  }, [])

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true)
    updateSplit(e.clientX)
    try {
      ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    } catch {
      // safe fallback: synthetic, unmapped, or detached pointer event cannot throw
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    updateSplit(e.clientX)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false)
    try {
      ;(e.target as HTMLElement).releasePointerCapture?.(e.pointerId)
    } catch {
      // safe fallback
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setSplitPos((prev) => Math.max(5, prev - 5))
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      setSplitPos((prev) => Math.min(95, prev + 5))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setSplitPos(5)
    } else if (e.key === 'End') {
      e.preventDefault()
      setSplitPos(95)
    }
  }

  const handleClearDeck = useCallback(() => {
    setAppState('empty')
    setToastMessage('Deck cleared. Press ⌘O or click "Load Sample Asset" to stage a file.')
  }, [])

  const handleLoadSample = useCallback(() => {
    setAppState('ready')
    setStripExif(true)
    setConvertGamut(true)
    setLosslessReencode(true)
    setToastMessage(null)
  }, [])

  const handleDragOut = (e: React.MouseEvent) => {
    e.preventDefault()
    setToastMessage(
      'Frontend Study Simulation: This study creates and exports no file. Native export behavior, file generation, and pasteboard drag integration remain to be implemented and proven in a native Mac application.'
    )
  }

  // Keyboard shortcut listener: Esc to clear deck, ⌥V dismiss simulation
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (appState !== 'empty') {
          handleClearDeck()
        }
      }
    }
    window.addEventListener('keydown', handleGlobalKey)
    return () => window.removeEventListener('keydown', handleGlobalKey)
  }, [appState, handleClearDeck])

  // Compute live derivative metrics (simulated estimations)
  const calculateDerivativeMetrics = () => {
    if (appState !== 'ready') {
      return {
        sizeText: '—',
        savedPctText: '',
        tagsVisible: '—',
        metadataFullText: '—',
      }
    }

    let estSizeMb = 8.4
    let tagsRemaining = 3

    if (stripExif) {
      tagsRemaining = 0
      estSizeMb -= 0.1
    }
    if (convertGamut) {
      estSizeMb -= 0.2
    }
    if (losslessReencode) {
      estSizeMb = 1.1
    } else {
      estSizeMb = Number((estSizeMb * 0.55).toFixed(1))
    }

    const savedPct = Math.round(((8.4 - estSizeMb) / 8.4) * 100)

    return {
      sizeText: `${estSizeMb.toFixed(1)} MB (Est.)`,
      savedPctText: savedPct > 0 ? `(Saved ~${savedPct}%)` : '(No change)',
      tagsVisible: `${tagsRemaining} Meta Tags`,
      metadataFullText: `${tagsRemaining} Metadata Tags (Simulated)`,
    }
  }

  const metrics = calculateDerivativeMetrics()

  return (
    <div className="app-study-shell">
      {/* Top Study Control Bar */}
      <header className="study-control-bar" role="toolbar" aria-label="Study controls">
        <div className="study-title-group">
          <span className="study-title">Vessel macOS Application Study</span>
          <span className="study-scale-badge">680 × 440 Native Anatomy</span>
        </div>

        {/* State Switcher Rail */}
        <div className="study-states-rail" role="group" aria-label="Simulated application states">
          <button
            type="button"
            className="state-pill-btn"
            aria-pressed={appState === 'ready'}
            onClick={() => setAppState('ready')}
          >
            Ready
          </button>
          <button
            type="button"
            className="state-pill-btn"
            aria-pressed={appState === 'empty'}
            onClick={() => setAppState('empty')}
          >
            Empty Deck
          </button>
          <button
            type="button"
            className="state-pill-btn"
            aria-pressed={appState === 'inspecting'}
            onClick={() => setAppState('inspecting')}
          >
            Inspecting
          </button>
          <button
            type="button"
            className="state-pill-btn"
            aria-pressed={appState === 'unsupported'}
            onClick={() => setAppState('unsupported')}
          >
            Unsupported Format
          </button>
          <button
            type="button"
            className="state-pill-btn"
            aria-pressed={appState === 'source_changed'}
            onClick={() => setAppState('source_changed')}
          >
            Source Modified
          </button>
          <button
            type="button"
            className="state-pill-btn"
            aria-pressed={appState === 'destination_unavailable'}
            onClick={() => setAppState('destination_unavailable')}
          >
            Destination Error
          </button>
        </div>

        {/* Scale Controls & Study Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div className="scale-controls" role="group" aria-label="Window review scale">
            <button
              type="button"
              className="scale-btn"
              aria-pressed={scaleMode === '100'}
              onClick={() => setScaleMode('100')}
            >
              100%
            </button>
            <button
              type="button"
              className="scale-btn"
              aria-pressed={scaleMode === '85'}
              onClick={() => setScaleMode('85')}
            >
              85%
            </button>
          </div>

          <div className="study-nav-links">
            <a href="/website/" className="study-nav-link">
              Website Study ↗
            </a>
            <a href="/review/" className="study-nav-link">
              Visual Direction ↗
            </a>
          </div>
        </div>
      </header>

      {/* Main Viewport Stage */}
      <main className="study-viewport-stage">
        {/* Screen Reader Live Region for Application State */}
        <div className="sr-only" role="status" aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
          {appState === 'ready' && 'Vessel is ready. Sample asset screenshot_export_p3.png loaded.'}
          {appState === 'empty' && 'Vessel deck is empty. No asset loaded.'}
          {appState === 'inspecting' && 'Vessel is demonstrating inspection state.'}
          {appState === 'unsupported' && 'Vessel demonstration: Unsupported file container.'}
          {appState === 'source_changed' && 'Vessel demonstration: Source modified state.'}
          {appState === 'destination_unavailable' && 'Vessel demonstration: Destination error state.'}
        </div>

        {/* The 680x440 Mac Window Frame */}
        <div
          className="mac-window-frame"
          style={{
            transform: scaleMode === '85' ? 'scale(0.85)' : 'none',
          }}
        >
          {/* Mac Window Titlebar */}
          <div className="mac-titlebar">
            <div className="mac-traffic-lights" aria-hidden="true">
              <span className="traffic-light traffic-close" />
              <span className="traffic-light traffic-min" />
              <span className="traffic-light traffic-zoom" />
            </div>

            <div className="mac-window-title-block">
              <span className="mac-window-title">Vessel — Preflight</span>
              <span className="mac-local-badge">LOCAL ONLY</span>
            </div>

            <span className="mac-shortcut-hint">⌥V to dismiss</span>
          </div>

          {/* Mac Window Body (Two-Column Layout) */}
          <div className="mac-window-body">
            {/* Left Sidebar */}
            <aside className="mac-sidebar" aria-label="Asset facts and derivative recipe">
              <div className="mac-section-label">Source Asset (Sample Preview)</div>

              {appState === 'ready' && (
                <>
                  <div className="mac-asset-name">{SAMPLE_ASSET.filename}</div>

                  <div className="mac-spec-table">
                    <div className="mac-spec-row">
                      <span className="mac-spec-key">Dimensions:</span>
                      <span className="mac-spec-val">{SAMPLE_ASSET.dimensions}</span>
                    </div>
                    <div className="mac-spec-row">
                      <span className="mac-spec-key">File Size:</span>
                      <span className="mac-spec-val">{SAMPLE_ASSET.fileSize}</span>
                    </div>
                    <div className="mac-spec-row">
                      <span className="mac-spec-key">Color Space:</span>
                      <span className="mac-spec-val">{SAMPLE_ASSET.colorSpace}</span>
                    </div>
                    <div className="mac-spec-row">
                      <span className="mac-spec-key">EXIF Geotag:</span>
                      <span className="mac-spec-val">{SAMPLE_ASSET.exifGeotag}</span>
                    </div>
                    <div className="mac-spec-row">
                      <span className="mac-spec-key">Device:</span>
                      <span className="mac-spec-val">{SAMPLE_ASSET.device}</span>
                    </div>
                    <div className="mac-spec-row">
                      <span className="mac-spec-key">Software:</span>
                      <span className="mac-spec-val">{SAMPLE_ASSET.software}</span>
                    </div>
                  </div>

                  <div className="mac-privacy-badge" role="status" aria-label="3 sample privacy tags detected">
                    <span>3 Privacy Tags (Sample)</span>
                  </div>
                </>
              )}

              {appState === 'empty' && (
                <div style={{ color: '#8e8e93', fontSize: 11.5, padding: '10px 0' }}>
                  <p style={{ margin: '0 0 8px', color: '#dedede', fontWeight: 500 }}>No asset staged</p>
                  <p style={{ margin: 0, lineHeight: 1.45 }}>
                    Drop a PNG, JPEG, or single-page PDF to preflight, or press ⌘O.
                  </p>
                </div>
              )}

              {appState === 'inspecting' && (
                <div style={{ color: '#8e8e93', fontSize: 11.5, padding: '10px 0' }}>
                  <p style={{ margin: '0 0 6px', color: '#60a5fa', fontWeight: 500 }}>
                    ⟳ Demonstrating Inspection State...
                  </p>
                  <p style={{ margin: 0, lineHeight: 1.45 }}>
                    Simulating header discovery for IFD0, EXIF, GPS, and ICC profile blocks.
                  </p>
                </div>
              )}

              {appState === 'unsupported' && (
                <div style={{ color: '#8e8e93', fontSize: 11.5, padding: '4px 0' }}>
                  <div className="mac-asset-name">raw_landscape_0920.cr3</div>
                  <div className="mac-spec-table" style={{ margin: '6px 0' }}>
                    <div className="mac-spec-row">
                      <span className="mac-spec-key">Container:</span>
                      <span className="mac-spec-val">Canon RAW (CR3)</span>
                    </div>
                    <div className="mac-spec-row">
                      <span className="mac-spec-key">Size:</span>
                      <span className="mac-spec-val">48.2 MB</span>
                    </div>
                  </div>
                  <div className="banner-warning" role="alert">
                    <strong>Unsupported Format Demo:</strong> Vessel targets PNG, JPEG, and single-page PDF only.
                  </div>
                </div>
              )}

              {appState === 'source_changed' && (
                <div style={{ color: '#8e8e93', fontSize: 11.5, padding: '4px 0' }}>
                  <div className="mac-asset-name">{SAMPLE_ASSET.filename}</div>
                  <div className="banner-warning" role="alert">
                    <strong>Source Modified Demo:</strong> Demonstrates interface handling when external modification is detected.
                  </div>
                </div>
              )}

              {appState === 'destination_unavailable' && (
                <div style={{ color: '#8e8e93', fontSize: 11.5, padding: '4px 0' }}>
                  <div className="mac-asset-name">{SAMPLE_ASSET.filename}</div>
                  <div className="banner-error" role="alert">
                    <strong>Destination Error Demo:</strong> Demonstrates interface handling when destination drop directory is unwritable.
                  </div>
                </div>
              )}

              <div className="mac-sidebar-divider" />

              <div className="mac-section-label">Derivative Recipe</div>

              <div className="mac-recipe-group">
                <label className="mac-checkbox-label">
                  <input
                    type="checkbox"
                    checked={stripExif}
                    disabled={appState !== 'ready'}
                    onChange={(e) => setStripExif(e.target.checked)}
                  />
                  <span>Strip EXIF &amp; Location Tags</span>
                </label>

                <label className="mac-checkbox-label">
                  <input
                    type="checkbox"
                    checked={convertGamut}
                    disabled={appState !== 'ready'}
                    onChange={(e) => setConvertGamut(e.target.checked)}
                  />
                  <span>Convert Gamut to sRGB</span>
                </label>

                <label className="mac-checkbox-label">
                  <input
                    type="checkbox"
                    checked={losslessReencode}
                    disabled={appState !== 'ready'}
                    onChange={(e) => setLosslessReencode(e.target.checked)}
                  />
                  <span>Optimize Delivery Copy</span>
                </label>
              </div>

              <div className="mac-untouched-note">
                Target Invariant: Source file remains untouched on disk.
              </div>
            </aside>

            {/* Right Canvas (Inspection / Optic Blade) */}
            <div className="mac-canvas-container">
              <div
                ref={stageRef}
                className="mac-inspection-stage"
                onPointerDown={appState === 'ready' ? handlePointerDown : undefined}
                onPointerMove={appState === 'ready' ? handlePointerMove : undefined}
                onPointerUp={appState === 'ready' ? handlePointerUp : undefined}
                onPointerCancel={appState === 'ready' ? handlePointerUp : undefined}
              >
                {appState === 'ready' && (
                  <>
                    {/* Left P3 Source Layer */}
                    <div className="mac-stage-img-layer">
                      <img
                        src="/assets/vessel-landscape.png"
                        alt="Staged source asset in Display P3 wide gamut"
                      />
                    </div>

                    {/* Right sRGB Derivative Layer */}
                    <div
                      className="mac-stage-derivative-layer"
                      style={{ width: `${100 - splitPos}%` }}
                      aria-hidden={splitPos >= 100}
                    >
                      <img
                        src="/assets/vessel-landscape.png"
                        alt="Derivative preview"
                        style={{
                          filter: convertGamut ? 'saturate(0.96) contrast(1.02)' : 'none',
                        }}
                      />
                    </div>

                    {/* Canvas Overlaid Badges */}
                    <span
                      className="canvas-tag-p3"
                      title="Display P3 (Wide Gamut)"
                      aria-label="Source profile: Display P3 (Wide Gamut)"
                    >
                      DISPLAY P3
                    </span>
                    <span
                      className="canvas-tag-blade"
                      title="1.0× Optic Blade split comparison"
                      aria-label="Comparison blade: 1.0× Optic Blade"
                    >
                      1× BLADE
                    </span>
                    <span
                      className="canvas-tag-srgb"
                      title={convertGamut ? 'sRGB IEC61966-2.1 Simulation' : 'Display P3 (Retained)'}
                      aria-label={
                        convertGamut
                          ? 'Derivative profile: sRGB IEC61966-2.1 Simulation'
                          : 'Derivative profile: Display P3 (Retained)'
                      }
                    >
                      {convertGamut ? 'sRGB PREVIEW' : 'P3 RETAINED'}
                    </span>

                    {/* Optic Blade Divider & Reticle */}
                    <div
                      className="mac-blade-divider"
                      style={{ left: `${splitPos}%` }}
                      role="slider"
                      tabIndex={0}
                      aria-label="Optic blade split comparison"
                      aria-valuenow={Math.round(splitPos)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      onKeyDown={handleKeyDown}
                    >
                      <div className="mac-blade-reticle" title="Drag to compare P3 source with sRGB derivative">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </div>
                    </div>

                    {/* Bottom Derivative Telemetry Pill */}
                    <div
                      className="canvas-bottom-telemetry"
                      role="status"
                      title="Estimated derivative size and stripped metadata simulation"
                      aria-label={`Derivative metrics summary: ${metrics.sizeText} ${metrics.savedPctText} • ${metrics.metadataFullText}`}
                    >
                      Derivative: {metrics.sizeText}{' '}
                      <span className="telemetry-saved">{metrics.savedPctText}</span> •{' '}
                      {metrics.tagsVisible}
                    </div>
                  </>
                )}

                {appState === 'empty' && (
                  <div className="canvas-state-placeholder">
                    <div className="placeholder-icon">↓</div>
                    <h2 className="placeholder-title">No Asset Staged</h2>
                    <p className="placeholder-desc">
                      Drop a PNG, JPEG, or single-page PDF onto the deck to inspect metadata and preview color handling.
                    </p>
                    <button
                      type="button"
                      className="btn-clear-deck"
                      onClick={handleLoadSample}
                      style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', padding: '6px 14px', marginTop: 8 }}
                    >
                      Load Sample Asset (screenshot_export_p3.png)
                    </button>
                  </div>
                )}

                {appState === 'inspecting' && (
                  <div className="canvas-state-placeholder">
                    <div className="placeholder-icon" style={{ animation: 'spin 1.5s linear infinite' }}>⟳</div>
                    <h2 className="placeholder-title">Simulated Inspection State</h2>
                    <p className="placeholder-desc">
                      Demonstration of preflight header discovery for EXIF metadata and embedded color profiles.
                    </p>
                  </div>
                )}

                {appState === 'unsupported' && (
                  <div className="canvas-state-placeholder">
                    <div className="placeholder-icon" style={{ color: '#f59e0b' }}>⚠</div>
                    <h2 className="placeholder-title">Unsupported File Container</h2>
                    <p className="placeholder-desc">
                      Vessel targets PNG, JPEG, and single-page PDF preflight only. RAW containers, animated files, and multi-page documents are out of scope.
                    </p>
                    <button
                      type="button"
                      className="btn-clear-deck"
                      onClick={handleLoadSample}
                      style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', padding: '6px 14px', marginTop: 8 }}
                    >
                      Switch back to Supported Sample
                    </button>
                  </div>
                )}

                {appState === 'source_changed' && (
                  <div className="canvas-state-placeholder">
                    <div className="placeholder-icon" style={{ color: '#f59e0b' }}>⚡</div>
                    <h2 className="placeholder-title">Source File Modified (Simulated State)</h2>
                    <p className="placeholder-desc">
                      Demonstrates workflow guard: if the source asset changes externally while staged, export is paused until reloaded.
                    </p>
                    <button
                      type="button"
                      className="btn-clear-deck"
                      onClick={handleLoadSample}
                      style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', padding: '6px 14px', marginTop: 8 }}
                    >
                      Reload Source Asset
                    </button>
                  </div>
                )}

                {appState === 'destination_unavailable' && (
                  <div className="canvas-state-placeholder">
                    <div className="placeholder-icon" style={{ color: '#ef4444' }}>⊘</div>
                    <h2 className="placeholder-title">Export Canceled (Simulated State)</h2>
                    <p className="placeholder-desc">
                      Demonstrates workflow guard: if the drop target destination is unavailable or read-only, user is notified without modifying source.
                    </p>
                    <button
                      type="button"
                      className="btn-clear-deck"
                      onClick={handleLoadSample}
                      style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', padding: '6px 14px', marginTop: 8 }}
                    >
                      Reset State
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <footer className="mac-actionbar">
            <button
              type="button"
              className="btn-clear-deck"
              onClick={handleClearDeck}
              disabled={appState === 'empty'}
            >
              Clear Deck (Esc)
            </button>

            <button
              type="button"
              className="btn-drag-out"
              disabled={appState !== 'ready'}
              onClick={handleDragOut}
              aria-label="Drag derivative to destination (simulation)"
            >
              <span>Drag Derivative to Destination</span>
              <span aria-hidden="true">→</span>
            </button>
          </footer>

          {/* Non-blocking Simulation Toast */}
          {toastMessage && (
            <div className="sim-notice-toast" role="status" aria-live="polite">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong className="sim-notice-title">Interaction Study Note</strong>
                <button
                  type="button"
                  onClick={() => setToastMessage(null)}
                  style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', padding: 0 }}
                  aria-label="Dismiss notice"
                >
                  ✕
                </button>
              </div>
              <p className="sim-notice-body">{toastMessage}</p>
            </div>
          )}
        </div>

        {/* Study Caption / Notes */}
        <aside className="study-explanation-caption">
          Visual and behavioral study for the Vessel macOS preflight instrument concept.
          The 680×440 window maintains authentic desktop scale, micro-hierarchy without redundant card outlines,
          and truthful UI simulation where no real filesystem files are written.
        </aside>
      </main>
    </div>
  )
}

export { AppWorkbench }
