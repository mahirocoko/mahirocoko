import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { SCORE_CHAPTERS, SYSTEM_LAYERS, TONE_STUDIES, type ToneStudy } from './content'
import { useExperience, useReducedMotion } from './hooks/use-experience'
import { atlasAudio } from './lib/audio-engine'

const loadToneField = () =>
  new Promise<{ default: typeof import('./components/tone-field').ToneField }>((resolve, reject) => {
    const load = () => {
      void import('./components/tone-field')
        .then((module) => resolve({ default: module.ToneField }))
        .catch(reject)
    }

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(load, { timeout: 1200 })
    } else {
      globalThis.setTimeout(load, 80)
    }
  })

const ToneField = lazy(loadToneField)

const Arrow = () => <span aria-hidden="true">↘</span>

const ToneFieldLoading = ({ onPluck }: { onPluck: () => void }) => (
  <div className="tone-field tone-field--loading">
    <div className="tone-field__fallback" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </div>
    <button className="tone-field__control" type="button" aria-describedby="tone-field-loading-hint" onClick={onPluck}>
      <span>Pluck field</span>
      <span aria-hidden="true">↗</span>
    </button>
    <p className="tone-field__caption" id="tone-field-loading-hint">Preparing the spatial field…</p>
  </div>
)

interface SoundToggleProps {
  enabled: boolean
  unavailable: boolean
  onToggle: () => void
}

const SoundToggle = ({ enabled, unavailable, onToggle }: SoundToggleProps) => (
  <button
    className="sound-toggle"
    type="button"
    aria-pressed={enabled}
    disabled={unavailable}
    onClick={onToggle}
  >
    <span className="sound-toggle__signal" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
    <span>{unavailable ? 'Sound unavailable' : `Sound ${enabled ? 'on' : 'off'}`}</span>
  </button>
)

interface MobileDrawerProps extends SoundToggleProps {
  open: boolean
  onClose: () => void
  onPlay: () => void
}

const MobileDrawer = ({ enabled, unavailable, open, onClose, onPlay, onToggle }: MobileDrawerProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      if (typeof dialog.showModal === 'function') dialog.showModal()
      else dialog.setAttribute('open', '')
    }

    if (!open && dialog.open) {
      if (typeof dialog.close === 'function') dialog.close()
      else dialog.removeAttribute('open')
    }
  }, [open])

  const closeAndPlay = () => {
    onClose()
    onPlay()
  }

  return (
    <dialog
      className="mobile-drawer"
      id="mobile-navigation"
      ref={dialogRef}
      aria-label="Mobile navigation"
      onCancel={onClose}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="mobile-drawer__panel">
        <div className="mobile-drawer__header">
          <a className="brand" href="#top" onClick={onClose}>
            <span className="brand__mark" aria-hidden="true"><i /><i /><i /></span>
            <span>Resonant Atlas</span>
          </a>
          <button className="menu-close" type="button" onClick={onClose} aria-label="Close navigation">
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>

        <nav className="mobile-drawer__nav" aria-label="Mobile primary navigation">
          <a href="#score" onClick={onClose}><span>01</span>Score</a>
          <a href="#studies" onClick={onClose}><span>02</span>Studies</a>
          <a href="#system" onClick={onClose}><span>03</span>System</a>
        </nav>

        <div className="mobile-drawer__actions">
          <SoundToggle enabled={enabled} unavailable={unavailable} onToggle={onToggle} />
          <button className="drawer-play" type="button" onClick={closeAndPlay}>
            <span>Play field</span><span aria-hidden="true">↗</span>
          </button>
        </div>

        <div className="mobile-drawer__footer">
          <p>Field 01 / Browser instrument</p>
          <p>No recordings · No autoplay</p>
        </div>
      </div>
    </dialog>
  )
}

interface StudyCardProps {
  study: ToneStudy
  active: boolean
  onPlay: (study: ToneStudy) => void
}

const StudyCard = ({ study, active, onPlay }: StudyCardProps) => (
  <article className="study" data-active={active || undefined} style={{ '--study-color': study.color } as React.CSSProperties}>
    <div className="study__meta">
      <span>{study.index}</span>
      <span>{study.note}</span>
    </div>
    <div className="study__stage" aria-hidden="true">
      <span className="study__axis" />
      <span className="study__wave study__wave--a" />
      <span className="study__wave study__wave--b" />
      <span className="study__node" />
    </div>
    <div className="study__copy">
      <h3>{study.name}</h3>
      <p>{study.description}</p>
      <button type="button" onClick={() => onPlay(study)}>
        <span>{active ? 'Play again' : 'Play tone'}</span>
        <span aria-hidden="true">↗</span>
      </button>
    </div>
  </article>
)

const App = () => {
  const reducedMotion = useReducedMotion()
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [activeStudy, setActiveStudy] = useState<string | null>(null)
  const [energy, setEnergy] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useExperience(reducedMotion)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return

    const desktop = window.matchMedia('(min-width: 981px)')
    const handleDesktop = () => {
      if (desktop.matches) setMenuOpen(false)
    }

    desktop.addEventListener('change', handleDesktop)
    return () => desktop.removeEventListener('change', handleDesktop)
  }, [])

  const toggleSound = async () => {
    const next = !soundEnabled
    const enabled = await atlasAudio.setEnabled(next)
    setSoundEnabled(enabled && next)
    if (enabled && next) setEnergy(performance.now())
  }

  const playStudy = async (study: ToneStudy) => {
    let enabled = soundEnabled
    if (!enabled) {
      enabled = await atlasAudio.setEnabled(true)
      setSoundEnabled(enabled)
    }

    if (enabled) atlasAudio.playTone(study.frequency, 0.86, study.id === 'fold' ? 'triangle' : 'sine')
    setActiveStudy(study.id)
    setEnergy(performance.now())
  }

  const playField = () => {
    void playStudy(TONE_STUDIES[1])
  }

  return (
    <div className="site-shell">
      <header className="masthead">
        <a className="brand" href="#top" aria-label="Resonant Atlas, back to top">
          <span className="brand__mark" aria-hidden="true"><i /><i /><i /></span>
          <span>Resonant Atlas</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#score">Score</a>
          <a href="#studies">Studies</a>
          <a href="#system">System</a>
        </nav>
        <SoundToggle
          enabled={soundEnabled}
          unavailable={!atlasAudio.supported}
          onToggle={() => void toggleSound()}
        />
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label="Open navigation"
          onClick={() => setMenuOpen(true)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </header>

      <MobileDrawer
        enabled={soundEnabled}
        unavailable={!atlasAudio.supported}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onPlay={playField}
        onToggle={() => void toggleSound()}
      />

      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero__copy">
            <p className="eyebrow"><span>Field 01</span><span>Browser instrument</span></p>
            <h1 id="hero-title">Shape what sound leaves behind.</h1>
            <div className="hero__footer">
              <p>
                An original spatial atlas where gesture becomes geometry, and geometry returns as tone.
              </p>
              <a className="text-link" href="#score">Enter the score <Arrow /></a>
            </div>
          </div>
          <Suspense fallback={<ToneFieldLoading onPluck={playField} />}>
            <ToneField energy={energy} reducedMotion={reducedMotion} onPluck={playField} />
          </Suspense>
          <p className="hero__index" aria-hidden="true">RA—01 / 2026</p>
        </section>

        <section className="premise" aria-labelledby="premise-title">
          <p className="section-kicker" data-reveal>What is being archived?</p>
          <div className="premise__statement" data-reveal>
            <h2 id="premise-title">Not the recording.<br />The act of making it.</h2>
            <p>
              Resonant Atlas keeps the readable page, spatial scene, motion clock, and audio engine separate—then lets one gesture coordinate them.
            </p>
          </div>
          <dl className="truth-strip" data-reveal>
            <div><dt>Source</dt><dd>Real-time synthesis</dd></div>
            <div><dt>Input</dt><dd>Pointer · touch · keyboard</dd></div>
            <div><dt>Audio</dt><dd>Explicit opt-in</dd></div>
            <div><dt>Fallback</dt><dd>DOM-first and reduced</dd></div>
          </dl>
        </section>

        <section className="score" id="score" data-score aria-labelledby="score-title">
          <div className="score__header" data-reveal>
            <p className="section-kicker">One signal, three movements</p>
            <h2 id="score-title">A score should coordinate.<br />It should not conduct everything.</h2>
          </div>
          <div className="score__body">
            <div className="score-field" data-score-field data-active="0" aria-hidden="true">
              <div className="score-field__dial">
                <span className="score-field__orbit score-field__orbit--a" />
                <span className="score-field__orbit score-field__orbit--b" />
                <span className="score-field__orbit score-field__orbit--c" />
                <span className="score-field__needle" />
              </div>
              <div className="score-field__legend">
                <span>Intent</span><span>State</span><span>Release</span>
              </div>
            </div>
            <div className="score__chapters">
              {SCORE_CHAPTERS.map((chapter, index) => (
                <article
                  className="score-chapter"
                  data-score-chapter
                  data-active={index === 0 ? 'true' : 'false'}
                  key={chapter.title}
                >
                  <p>{chapter.index} / 03</p>
                  <h3>{chapter.title}</h3>
                  <p>{chapter.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="studies" id="studies" aria-labelledby="studies-title">
          <div className="studies__header" data-reveal>
            <div>
              <p className="section-kicker">Playable studies</p>
              <h2 id="studies-title">Three ways to leave a trace.</h2>
            </div>
            <p>
              Each study shares one instrument contract while preserving a different rhythm, range, and visual response.
            </p>
          </div>
          <div className="studies__grid">
            {TONE_STUDIES.map((study) => (
              <StudyCard
                active={activeStudy === study.id}
                key={study.id}
                onPlay={(selected) => void playStudy(selected)}
                study={study}
              />
            ))}
          </div>
        </section>

        <section className="system" id="system" aria-labelledby="system-title">
          <div className="system__intro" data-reveal>
            <p className="section-kicker">The quiet architecture</p>
            <h2 id="system-title">Each layer knows when to speak.</h2>
            <p>The atlas keeps meaning, space, motion, and sound distinct so each layer can fall back without breaking the field.</p>
          </div>
          <ol className="system-map" data-reveal>
            {SYSTEM_LAYERS.map((layer, index) => (
              <li key={layer.owner}>
                <span className="system-map__index">0{index + 1}</span>
                <div><p>{layer.label}</p><h3>{layer.owner}</h3></div>
                <p>{layer.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="assurance" aria-labelledby="assurance-title">
          <div data-reveal>
            <p className="section-kicker">When the field goes quiet</p>
            <h2 id="assurance-title">Nothing important disappears.</h2>
          </div>
          <div className="assurance__notes" data-reveal>
            <article><span>01</span><h3>No autoplay</h3><p>Audio begins only after an explicit control is pressed.</p></article>
            <article><span>02</span><h3>Motion has an exit</h3><p>Reduced motion keeps every message and playable control intact.</p></article>
            <article><span>03</span><h3>Render on demand</h3><p>The spatial scene pauses offscreen and while the document is hidden.</p></article>
            <article><span>04</span><h3>Canvas is optional</h3><p>Semantic content and a composed visual fallback remain without WebGL.</p></article>
          </div>
        </section>

        <section className="finale" aria-labelledby="finale-title">
          <div className="finale__rings" aria-hidden="true"><i /><i /><i /><i /></div>
          <p className="section-kicker">End of Field 01</p>
          <h2 id="finale-title">Ready to hear the page breathe?</h2>
          <button type="button" onClick={playField}>
            <span>{soundEnabled ? 'Play closing tone' : 'Enable and play tone'}</span>
            <span aria-hidden="true">↗</span>
          </button>
        </section>
      </main>

      <footer className="footer" aria-labelledby="footer-title">
        <div className="footer__lead">
          <a className="brand" href="#top"><span className="brand__mark" aria-hidden="true"><i /><i /><i /></span><span>Resonant Atlas</span></a>
          <h2 id="footer-title">An instrument for the trace a gesture leaves behind.</h2>
        </div>

        <div className="footer__directory">
          <nav aria-label="Footer navigation">
            <p>Explore</p>
            <a href="#score">Score</a>
            <a href="#studies">Studies</a>
            <a href="#system">System</a>
          </nav>
          <section aria-labelledby="footer-instrument-title">
            <p id="footer-instrument-title">Instrument</p>
            <SoundToggle
              enabled={soundEnabled}
              unavailable={!atlasAudio.supported}
              onToggle={() => void toggleSound()}
            />
            <button className="footer__play" type="button" onClick={playField}>
              <span>Play field</span><span aria-hidden="true">↗</span>
            </button>
          </section>
          <section aria-labelledby="footer-about-title">
            <p id="footer-about-title">About this field</p>
            <span>Original frontend architecture study.</span>
            <span>No recordings or autoplay.</span>
            <span>No copied assets.</span>
          </section>
        </div>

        <div className="footer__bottom">
          <p>© 2026 Mahiro Frontend Labs</p>
          <p>Field 01 · Browser instrument</p>
          <a href="#top">Back to top <span aria-hidden="true">↑</span></a>
        </div>
      </footer>
    </div>
  )
}

export { App }
