import { useState } from 'react'
import {
  CalendarDays,
  Check,
  Clock3,
  FileText,
  Link2,
  Mail,
  MousePointer2,
  Send,
} from 'lucide-react'

const STEPS = [
  { label: 'Open the project thread', Icon: Mail },
  { label: 'Find the latest update', Icon: MousePointer2 },
  { label: 'Read the open questions', Icon: FileText },
  { label: 'Start a clear reply', Icon: MousePointer2 },
  { label: 'Shape the key decision', Icon: FileText },
  { label: 'Send the draft', Icon: Send },
  { label: 'Open the calendar', Icon: CalendarDays },
  { label: 'Find a free window', Icon: Clock3 },
  { label: 'Name the focus block', Icon: FileText },
  { label: 'Set forty minutes', Icon: Clock3 },
  { label: 'Add the workspace link', Icon: Link2 },
  { label: 'Confirm the change', Icon: Check },
]

const TimeSavings = () => {
  const [scrolled, setScrolled] = useState(false)

  return (
    <section className="wf-time" id="proof">
      <div className="wf-time-inner">
        <header className="wf-time-header">
          <h2><strong>12</strong> steps. One sentence.</h2>
          <p>Skip the busywork. Describe the outcome once and keep the result visible.</p>
        </header>
        <div className="wf-time-frame">
          <article className="wf-time-panel wf-time-manual">
            <span className="wf-time-badge">Before</span>
            <div className="wf-time-count"><strong>12</strong><span>steps</span></div>
            <div
              className={`wf-time-steps ${scrolled ? 'is-scrolled' : ''}`}
              onScroll={(event) => setScrolled(event.currentTarget.scrollTop > 2)}
              tabIndex={0}
              aria-label="Twelve manual workflow steps"
            >
              <span className="wf-time-rail" aria-hidden="true" />
              {STEPS.map(({ label, Icon }) => (
                <div className="wf-time-step" key={label}>
                  <span className="wf-time-step-chip"><Icon aria-hidden="true" /></span>
                  <span>{label}</span>
                </div>
              ))}
              <span className="wf-time-scroll-spacer" aria-hidden="true" />
            </div>
          </article>
          <article className="wf-time-panel wf-time-voice">
            <span className="wf-time-badge is-after">After</span>
            <div className="wf-time-count"><strong>1</strong><span>sentence</span></div>
            <div className="wf-time-voice-stage">
              <blockquote>“Reply with the launch update and block forty minutes tomorrow to review it.”</blockquote>
              <div className="wf-time-mac-screen" aria-label="Result preview">
                <div className="wf-time-mac-top" aria-hidden="true">
                  <div className="wf-time-notch"><span /><span /><span /><span /><span /></div>
                </div>
                <img src="/assets/generated/product-sky.webp" alt="Original pale-blue and lavender cloud field" />
                <div className="wf-time-result-card">
                  <span>09:20</span>
                  <strong>Launch notes review</strong>
                  <small>Focus block · 40 min</small>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

export { TimeSavings }
