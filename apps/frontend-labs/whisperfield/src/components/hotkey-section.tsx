import { useEffect, useState } from 'react'
import { GlassDownloadButton } from './glass-button'
import { useReducedMotion } from '../hooks/use-reduced-motion'

const HotkeySection = () => {
  const [active, setActive] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (!active) return
    const timer = window.setTimeout(() => setActive(false), 1500)
    return () => window.clearTimeout(timer)
  }, [active])

  return (
    <section className="wf-hotkey" aria-label="Hotkey demo">
      <div className="wf-hotkey-inner">
        <h2>
          <span>Press</span>
          <span className="wf-fn-key-wrap">
            <button className="wf-fn-key" type="button" aria-pressed={active} onClick={() => setActive(true)}><span>fn</span></button>
            <span className="wf-fn-key-shadow" aria-hidden="true" />
            {active && !reducedMotion ? (
              <span className="wf-speech-bubbles" aria-hidden="true">
                {Array.from({ length: 7 }, (_, index) => <i key={index} style={{ '--wf-bubble-index': index } as React.CSSProperties} />)}
              </span>
            ) : null}
          </span>
          <span className="wf-hotkey-nowrap">and start speaking.</span>
        </h2>
        <p>Let <strong>your voice</strong> do the <strong>work</strong>.</p>
        <span className="sr-only" role="status">{active ? 'Hotkey demo active' : 'Hotkey demo ready'}</span>
        <GlassDownloadButton />
      </div>
    </section>
  )
}

export { HotkeySection }
