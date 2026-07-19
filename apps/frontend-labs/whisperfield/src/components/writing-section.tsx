import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { WRITING_SCENARIOS } from '../content'
import { INTEGRATION_NAMES } from '../constants/integrations'
import { useReducedMotion } from '../hooks/use-reduced-motion'
import { useSectionVisibility } from '../hooks/use-section-visibility'
import { IntegrationIcon } from './integration-icon'

const SCENARIOS = WRITING_SCENARIOS.slice(0, 2)
const CYCLE_MS = 8500

const WritingDock = () => (
  <div className="wf-dict-dock" aria-label="Example writing destinations">
    {INTEGRATION_NAMES.slice(0, 9).map((name) => <IntegrationIcon name={name} compact key={name} />)}
  </div>
)

const MailWindow = ({ index }: { index: number }) => {
  const scenario = SCENARIOS[index]
  return (
    <div className="wf-dict-app-window">
      <div className="wf-dict-titlebar"><span><i /><i /><i /></span><p><IntegrationIcon name={index === 0 ? 'Mail' : 'Notion'} compact />{scenario.channel}</p></div>
      <div className="wf-dict-app-body">
        <p><span>Title</span>{scenario.title}</p>
        <i />
        <p><span>Draft</span>{scenario.draft}</p>
      </div>
    </div>
  )
}

const AutoFormatCard = ({ index }: { index: number }) => {
  const scenario = SCENARIOS[index]
  return (
    <aside className="wf-format-card">
      <div className="wf-format-card-inner">
        <h3>Auto <strong>Formats</strong></h3>
        <p>Your words, perfectly structured</p>
        <div className="wf-format-flow">
          <div className="wf-format-speech"><IntegrationIcon name="Mail" compact /><span><i /><i /><i /><i /><i /></span></div>
          <svg viewBox="0 0 200 60" aria-hidden="true"><path d="M88 0 Q60 60 0 60 L200 60 Q140 60 112 0 Z" /></svg>
          <div className="wf-format-preview">
            <span className="wf-format-lights"><i /><i /><i /></span>
            <p><small>To:</small> studio@whisperfield.test</p>
            <strong>{scenario.shapedLabel}</strong>
            <span>{scenario.shapedText}</span>
            <i /><i /><i />
          </div>
        </div>
      </div>
    </aside>
  )
}

const WritingSection = () => {
  const { ref, visible } = useSectionVisibility<HTMLElement>(.2)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [phase, setPhase] = useState<'idle' | 'shortcut' | 'recording' | 'typing' | 'done'>('idle')
  const reducedMotion = useReducedMotion()
  const running = visible && !paused && !reducedMotion

  useEffect(() => {
    if (!running) return
    const timer = window.setTimeout(() => setIndex((current) => (current + 1) % SCENARIOS.length), CYCLE_MS)
    return () => window.clearTimeout(timer)
  }, [index, running])

  useEffect(() => {
    if (reducedMotion) {
      setPhase('done')
      return
    }
    if (!running) {
      setPhase('idle')
      return
    }
    setPhase('idle')
    const timers = [
      window.setTimeout(() => setPhase('shortcut'), 300),
      window.setTimeout(() => setPhase('recording'), 1700),
      window.setTimeout(() => setPhase('typing'), 3600),
      window.setTimeout(() => setPhase('done'), 6900),
    ]
    return () => timers.forEach(window.clearTimeout)
  }, [index, reducedMotion, running])

  const select = (next: number) => {
    setIndex((next + SCENARIOS.length) % SCENARIOS.length)
    setPaused(true)
  }

  return (
    <section ref={ref} className="wf-writing" id="writing">
      <div className="wf-writing-inner">
        <header className="wf-writing-header">
          <h2>Dictation Mode</h2>
          <p>Writes <strong>what you meant</strong>, not what you said.</p>
          <div className="wf-writing-nav" aria-label="Writing scenario">
            <button type="button" aria-label="Previous writing scenario" onClick={() => select(index - 1)}><ArrowLeft aria-hidden="true" /></button>
            <div role="group" aria-label="Writing scenario choices">
              {SCENARIOS.map((scenario, itemIndex) => (
                <button className={itemIndex === index ? 'is-active' : ''} key={scenario.id} type="button" aria-label={scenario.label} aria-pressed={itemIndex === index} onClick={() => select(itemIndex)}>
                  {itemIndex === index ? <i style={{ animationDuration: `${CYCLE_MS}ms`, animationPlayState: running ? 'running' : 'paused' }} /> : null}
                </button>
              ))}
            </div>
            <button type="button" aria-label="Next writing scenario" onClick={() => select(index + 1)}><ArrowRight aria-hidden="true" /></button>
          </div>
        </header>
        <div className="wf-writing-stage">
          <div className="wf-dict-frame">
            <img className="wf-dict-wallpaper" src="/assets/generated/product-sky.webp" alt="" />
            <span className={`wf-dict-shortcut ${phase === 'shortcut' ? 'is-visible' : ''}`} aria-hidden="true">fn</span>
            <div className={`wf-dict-app ${phase === 'recording' || phase === 'typing' || phase === 'done' ? 'is-visible' : ''}`}><MailWindow index={index} /></div>
            <div className="wf-dict-bottom">
              <span className={`wf-dict-pill ${phase === 'recording' || phase === 'typing' ? 'is-recording' : ''}`}><i /><i /><i /><i /><i /></span>
              <WritingDock />
            </div>
          </div>
          <AutoFormatCard index={index} />
        </div>
      </div>
    </section>
  )
}

export { WritingSection }
