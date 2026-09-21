import { useCallback, useEffect, useRef, useState } from 'react'
import { LANDSCAPE_SRC, SAMPLE_SOURCE, UNSUPPORTED_SOURCE } from '../src/shared/facts'
import type { IRecipeSelection } from '../src/shared/facts'
import { OpticBlade } from '../src/shared/optic-blade'
import { MacWindow } from './mac-window'
import { RecipePanel, SourcePanel, StudyNotice, TelemetryPanel } from './deck-panels'
import {
  DEFAULT_RECIPE,
  computeTelemetry,
  derivativeEnabled,
  hasSource,
  recipeEnabled,
  statusMeta,
} from './study-model'
import type { DeckStatus } from './study-model'
import './app.css'

const INSPECT_MS = 900

const DERIVATIVE_NOTICE =
  'Frontend study — no file is created or exported. In the target design, the original would stay exactly where it is.'

interface IScenario {
  status: DeckStatus
  label: string
}

const SCENARIOS: IScenario[] = [
  { status: 'empty', label: 'Empty' },
  { status: 'inspecting', label: 'Inspecting' },
  { status: 'ready', label: 'Ready' },
  { status: 'unsupported', label: 'Unsupported' },
  { status: 'source-changed', label: 'Source changed' },
  { status: 'destination-unavailable', label: 'Destination unavailable' },
]

export const AppStudy = () => {
  const [status, setStatus] = useState<DeckStatus>('empty')
  const [recipe, setRecipe] = useState<IRecipeSelection>(DEFAULT_RECIPE)
  const [notice, setNotice] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = useCallback((): void => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => clearTimer, [clearTimer])

  const beginInspection = useCallback((): void => {
    clearTimer()
    setNotice(null)
    setStatus('inspecting')
    timerRef.current = setTimeout(() => {
      setStatus('ready')
      timerRef.current = null
    }, INSPECT_MS)
  }, [clearTimer])

  const applyScenario = (next: DeckStatus): void => {
    clearTimer()
    setNotice(null)
    if (next === 'inspecting') {
      beginInspection()
      return
    }
    setStatus(next)
  }

  const handleToggle = (key: keyof IRecipeSelection): void => {
    setRecipe((current) => ({ ...current, [key]: !current[key] }))
  }

  const handleCreateDerivative = (): void => {
    setNotice(DERIVATIVE_NOTICE)
  }

  const meta = statusMeta(status)
  const sourceOnDeck = hasSource(status)
  const telemetry = sourceOnDeck ? computeTelemetry(recipe) : null
  const unsupported = status === 'unsupported'

  return (
    <main className="app-stage">
      <div className="app-stage__inner">
        <h1 className="app-stage__sr-title">Vessel — desktop app study</h1>
        <p className="app-stage__hint" aria-hidden="true">
          Desktop-native window — pan horizontally to inspect ◂ ▸
        </p>

        <div className="app-stage__scroll">
          <MacWindow title="Vessel — Preflight">
            <div className="deck">
              <section className="deck__blade" aria-labelledby="blade-label">
                <div className="deck__blade-bar">
                  <h2 className="deck-col__label" id="blade-label">
                    Optic Blade
                  </h2>
                  <span className="deck__blade-hint">Drag to compare ◂ ▸</span>
                </div>

                {status === 'empty' ? (
                  <div className="deck__placeholder">
                    <p className="deck__placeholder-title">No source on the deck</p>
                    <p className="deck__placeholder-sub">Stage a PNG, JPEG, or single-page PDF.</p>
                  </div>
                ) : null}

                {unsupported ? (
                  <div className="deck__placeholder deck__placeholder--amber">
                    <p className="deck__placeholder-title">Unsupported type</p>
                    <p className="deck__placeholder-sub">
                      TIFF is outside this study&rsquo;s PNG · JPEG · single-page PDF scope.
                    </p>
                  </div>
                ) : null}

                {sourceOnDeck ? (
                  <OpticBlade
                    imageSrc={LANDSCAPE_SRC}
                    imageAlt="Staged sample source preview"
                    theme="dark"
                    derivativeFilter={
                      recipe.convertSrgb
                        ? 'saturate(0.86) contrast(1.04) brightness(0.98)'
                        : 'contrast(1.02)'
                    }
                    disabled={status === 'inspecting'}
                    dimmed={status === 'inspecting'}
                    overlayLabel={
                      status === 'inspecting'
                        ? 'Inspecting…'
                        : status === 'source-changed'
                          ? 'Source changed — re-inspect'
                          : null
                    }
                    overlayTone={status === 'inspecting' ? 'cyan' : 'amber'}
                    ariaLabel="Compare staged source with simulated derivative"
                  />
                ) : null}

                <div className="deck__blade-facts">
                  {sourceOnDeck ? (
                    <>
                      <span>
                        {SAMPLE_SOURCE.format} · {SAMPLE_SOURCE.width} × {SAMPLE_SOURCE.height}
                      </span>
                      <span>sRGB · Display-P3 master</span>
                    </>
                  ) : (
                    <>
                      <span>—</span>
                      <span>—</span>
                    </>
                  )}
                </div>
              </section>

              <div className="deck__columns">
                <RecipePanel
                  recipe={recipe}
                  disabled={!recipeEnabled(status)}
                  onToggle={handleToggle}
                />
                <SourcePanel
                  status={status}
                  facts={sourceOnDeck ? SAMPLE_SOURCE : null}
                  unsupportedFacts={unsupported ? UNSUPPORTED_SOURCE : null}
                  onLoadSample={beginInspection}
                  onClear={() => applyScenario('empty')}
                  onReinspect={beginInspection}
                />
                <TelemetryPanel telemetry={telemetry} />
              </div>

              <footer className="deck__footer">
                <p className={`deck__status deck__status--${meta.tone}`} role="status" aria-live="polite">
                  <span className="deck__status-dot" aria-hidden="true" />
                  {meta.symbol} {meta.text}
                </p>
                <div className="deck__footer-right">
                  {status === 'destination-unavailable' ? (
                    <span className="deck__dest-note">Destination: ~/Exports — unavailable</span>
                  ) : (
                    <span className="deck__footer-note">Original never leaves this Mac.</span>
                  )}
                  <button
                    type="button"
                    className="deck-btn deck-btn--primary"
                    disabled={!derivativeEnabled(status)}
                    onClick={handleCreateDerivative}
                  >
                    Create derivative copy
                  </button>
                </div>
              </footer>

              {notice ? <StudyNotice message={notice} onDismiss={() => setNotice(null)} /> : null}
            </div>
          </MacWindow>
        </div>

        <div className="app-stage__scenarios" aria-label="Study scenarios">
          <span className="app-stage__scenarios-label">Study scenarios</span>
          <div className="app-stage__scenarios-row" role="group" aria-label="Simulate deck state">
            {SCENARIOS.map((scenario) => (
              <button
                key={scenario.status}
                type="button"
                className="scenario-btn"
                aria-pressed={status === scenario.status}
                onClick={() => applyScenario(scenario.status)}
              >
                {scenario.label}
              </button>
            ))}
          </div>
          <p className="app-stage__truth">
            Frontend interaction study — simulated states and fictional samples. No file is parsed,
            created, or exported.
          </p>
        </div>
      </div>
    </main>
  )
}
