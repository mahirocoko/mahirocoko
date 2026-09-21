import { useCallback, useEffect, useMemo, useState, type DragEvent } from 'react'
import { OpticBlade } from '../shared/optic-blade'
import { LANDSCAPE_ASSET, ROUTES } from '../shared/paths'
import { PRODUCT_TRUTH } from '../shared/product-truth'
import {
  DEFAULT_RECIPE,
  SAMPLE_DISCLOSURE,
  SOURCE_SAMPLE,
  deriveTelemetry,
  formatMegabytes,
  type IRecipe,
} from '../shared/sample-asset'
import { DECK_STATE_LABEL, DECK_STATES, isInteractiveState, type IDeckState } from './deck-states'

export const AppStudy = () => {
  const [state, setState] = useState<IDeckState>('ready')
  const [recipe, setRecipe] = useState<IRecipe>(DEFAULT_RECIPE)
  const [blade, setBlade] = useState(52)
  const [notice, setNotice] = useState('')
  const [live, setLive] = useState('Ready. Sample asset staged.')

  const telemetry = useMemo(() => deriveTelemetry(SOURCE_SAMPLE, recipe), [recipe])
  const interactive = isInteractiveState(state)
  const canDrag = state === 'ready' || state === 'source-changed'
  const showBlade = state === 'ready' || state === 'source-changed' || state === 'destination-unavailable'

  const announce = useCallback((message: string) => {
    setLive(message)
  }, [])

  const setDeck = useCallback(
    (next: IDeckState) => {
      setState(next)
      setNotice('')
      announce(`${DECK_STATE_LABEL[next]}. ${SAMPLE_DISCLOSURE}`)
    },
    [announce],
  )

  const clearDeck = useCallback(() => {
    setRecipe(DEFAULT_RECIPE)
    setBlade(52)
    setDeck('empty')
  }, [setDeck])

  const loadSample = useCallback(() => {
    setRecipe(DEFAULT_RECIPE)
    setBlade(52)
    setDeck('ready')
  }, [setDeck])

  const toggleRecipe = (key: keyof IRecipe) => {
    if (!interactive || state === 'inspecting') return
    setRecipe((current) => ({ ...current, [key]: !current[key] }))
  }

  const showExportNotice = () => {
    setNotice(PRODUCT_TRUTH.studyNotice)
    announce(PRODUCT_TRUTH.studyNotice)
  }

  const onDragStart = (event: DragEvent<HTMLButtonElement>) => {
    if (!canDrag) {
      event.preventDefault()
      return
    }
    event.dataTransfer.setData('text/plain', 'vessel-derivative-study')
    event.dataTransfer.effectAllowed = 'copy'
    showExportNotice()
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (notice) {
          setNotice('')
          announce('Notice dismissed.')
          return
        }
        clearDeck()
      }
      if (event.altKey && event.key.toLowerCase() === 'v') {
        event.preventDefault()
        setNotice('')
        announce('Notice dismissed.')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [announce, clearDeck, notice])

  const fileName =
    state === 'empty'
      ? 'No asset staged'
      : state === 'unsupported'
        ? 'album-spread.pdf'
        : SOURCE_SAMPLE.fileName

  return (
    <div className="vessel-app">
      <a className="skip-link" href="#workbench">
        Skip to workbench
      </a>
      <div className="app-shell">
        <header className="app-chrome">
          <h1>Vessel — Preflight interface study</h1>
          <p>
            Compact 680×440 desktop-native workbench. {SAMPLE_DISCLOSURE} Status is announced in text,
            not color alone. {PRODUCT_TRUTH.studyNotice}
          </p>
          <fieldset>
            <legend>Study states</legend>
            <div className="state-switch">
              {DECK_STATES.map((item) => (
                <label key={item}>
                  <input
                    type="radio"
                    name="deck-state"
                    value={item}
                    checked={state === item}
                    onChange={() => setDeck(item)}
                  />
                  {DECK_STATE_LABEL[item]}
                </label>
              ))}
            </div>
          </fieldset>
        </header>

        <p className="pan-hint">Pan sideways to inspect the desktop-native utility. This is not a mobile app.</p>

        <div className="app-pan" id="workbench">
          <section className="mac-window" aria-label="Vessel preflight window" data-testid="deck-state" data-state={state}>
            <div className="titlebar">
              <div className="traffic" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <h2>
                Vessel — Preflight
                <span className="local-pill">Local only</span>
              </h2>
              <span className="dismiss-hint">Option-V to dismiss</span>
            </div>

            <div className="window-body">
              <aside className="sidebar">
                <div>
                  <p className="kicker">Source asset (read-only)</p>
                  <p className="filename">{fileName}</p>
                  {state !== 'empty' && state !== 'unsupported' ? (
                    <>
                      <dl className="facts">
                        <dt>Dimensions</dt>
                        <dd>
                          {SOURCE_SAMPLE.width} × {SOURCE_SAMPLE.height} px
                        </dd>
                        <dt>File size</dt>
                        <dd>{formatMegabytes(SOURCE_SAMPLE.bytes)}</dd>
                        <dt>Color space</dt>
                        <dd>{SOURCE_SAMPLE.profile}</dd>
                        <dt>EXIF geotag</dt>
                        <dd>{SOURCE_SAMPLE.geotag}</dd>
                        <dt>Device</dt>
                        <dd>{SOURCE_SAMPLE.device}</dd>
                        <dt>Software</dt>
                        <dd>{SOURCE_SAMPLE.software}</dd>
                      </dl>
                      <span className="privacy-flag">
                        {SOURCE_SAMPLE.privacyTagCount} privacy tags
                      </span>
                    </>
                  ) : null}
                  {state === 'unsupported' ? (
                    <p className="banner">Unsupported in this concept — {PRODUCT_TRUTH.inputScope}</p>
                  ) : null}
                </div>

                <fieldset className="recipe" disabled={!interactive}>
                  <legend className="kicker">Derivative recipe</legend>
                  <label>
                    <input
                      type="checkbox"
                      checked={recipe.stripTags}
                      onChange={() => toggleRecipe('stripTags')}
                    />
                    Strip EXIF and location tags
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={recipe.convertSrgb}
                      onChange={() => toggleRecipe('convertSrgb')}
                    />
                    Convert gamut to sRGB (preview)
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={recipe.optimize}
                      onChange={() => toggleRecipe('optimize')}
                    />
                    Optimize a delivery copy
                  </label>
                </fieldset>

                <p className="invariant">{PRODUCT_TRUTH.sourceInvariant}</p>
              </aside>

              <div className="stage">
                {state === 'source-changed' ? (
                  <p className="banner">
                    Source changed — staged facts may be stale. Reload the sample. Simulation only.
                  </p>
                ) : null}
                {state === 'destination-unavailable' ? (
                  <p className="banner">Destination unavailable. This browser study has nowhere to drop a file.</p>
                ) : null}

                {showBlade ? (
                  <OpticBlade
                    src={LANDSCAPE_ASSET}
                    alt="Sample alpine landscape staged on the Optic Blade."
                    position={blade}
                    onPositionChange={setBlade}
                    disabled={!interactive}
                    handle="plus"
                    label="Optic Blade source versus derivative"
                  >
                    <span className="stage-chip stage-chip--left">Display P3 (wide gamut)</span>
                    <span className="stage-chip stage-chip--mid">1.0× Optic Blade</span>
                    <span className="stage-chip stage-chip--right">{telemetry.profile}</span>
                    <span className="telemetry" data-testid="telemetry">
                      Derivative: {formatMegabytes(telemetry.bytes)} (saved {telemetry.savingsPercent}%) ·{' '}
                      {telemetry.tagCount} metadata tags · {telemetry.summary}
                    </span>
                  </OpticBlade>
                ) : null}

                {state === 'empty' ? (
                  <div className="empty-well">
                    <p>Empty deck. Stage one PNG, JPEG, or single-page PDF. This study loads a fictional sample only.</p>
                    <button className="primary-btn" type="button" onClick={loadSample}>
                      Load sample asset
                    </button>
                  </div>
                ) : null}

                {state === 'inspecting' ? (
                  <div className="status-well">
                    <p>Inspecting sample facts… no parser is running. This is a simulated hold state.</p>
                  </div>
                ) : null}

                {state === 'unsupported' ? (
                  <div className="status-well">
                    <p>
                      This staged sample is treated as unsupported. {PRODUCT_TRUTH.inputScope} The
                      landscape asset is reserved for supported previews.
                    </p>
                    <button className="ghost-btn" type="button" onClick={loadSample}>
                      Load sample asset
                    </button>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="window-foot">
              <button className="linkish" type="button" onClick={clearDeck}>
                Clear deck (Esc)
              </button>
              <button
                className="primary-btn"
                type="button"
                draggable={canDrag}
                disabled={!canDrag}
                onClick={() => {
                  if (canDrag) showExportNotice()
                }}
                onDragStart={onDragStart}
              >
                Drag derivative to destination
              </button>
            </div>
          </section>
        </div>

        {notice ? (
          <p className="notice" data-testid="export-notice" role="status">
            {notice}
          </p>
        ) : null}

        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {live}
        </p>

        <nav className="app-links" aria-label="Study surfaces">
          <a href={ROUTES.website}>Product website</a>
          <a href={ROUTES.root}>Launchpad</a>
        </nav>
      </div>
    </div>
  )
}
