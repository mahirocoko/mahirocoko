import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Pause, Play, Search } from 'lucide-react'
import { IntegrationIcon } from './integration-icon'
import type { IntegrationName } from '../constants/integrations'
import { useReducedMotion } from '../hooks/use-reduced-motion'
import { useSectionVisibility } from '../hooks/use-section-visibility'

type ScenarioPhase = 'idle' | 'recording' | 'processing' | 'card' | 'complete' | 'done' | 'flat'

interface Scenario {
  id: 'calendar' | 'slack' | 'gmail' | 'notion' | 'linear' | 'weather'
  label: string
  duration: number
  icon: IntegrationName
  dock: IntegrationName[]
  schedule: number[]
}

const SCENARIOS: Scenario[] = [
  { id: 'calendar', label: 'Calendar: new focus block', duration: 9500, icon: 'Calendar', dock: ['Calendar', 'Notes'], schedule: [400, 1200, 2400, 3200, 6200, 8100, 9100] },
  { id: 'slack', label: 'Messages: draft reply', duration: 10000, icon: 'Messages', dock: ['Messages'], schedule: [400, 1300, 2400, 3000, 7000, 8600, 9600] },
  { id: 'gmail', label: 'Mail: compose and send', duration: 11000, icon: 'Gmail', dock: ['Gmail'], schedule: [400, 1400, 2400, 3200, 7500, 9600, 10600] },
  { id: 'notion', label: 'Notes: create project page', duration: 9500, icon: 'Notion', dock: ['Notion'], schedule: [400, 1200, 2200, 2900, 6200, 8100, 9100] },
  { id: 'linear', label: 'Linear: create issue', duration: 11000, icon: 'Linear', dock: ['Linear'], schedule: [400, 1400, 2400, 3200, 8200, 9800, 10800] },
  { id: 'weather', label: 'Search: review tomorrow', duration: 9500, icon: 'Search', dock: ['Search'], schedule: [400, 1200, 2200, 2800, 7000, 8300, 9300] },
]

const DOCK_INTEGRATIONS: IntegrationName[] = ['Whisperfield', 'Calendar', 'Messages', 'Notion', 'Linear', 'Gmail', 'Notes', 'GitHub', 'Figma']
const PHASES: ScenarioPhase[] = ['recording', 'processing', 'card', 'complete', 'done', 'flat']

const useScenarioPhase = (scenario: Scenario, active: boolean, reducedMotion: boolean) => {
  const [phase, setPhase] = useState<ScenarioPhase>(reducedMotion ? 'flat' : 'idle')

  useEffect(() => {
    if (reducedMotion) {
      setPhase('flat')
      return
    }
    setPhase('idle')
    if (!active) return
    const timers = PHASES.map((nextPhase, index) => window.setTimeout(() => setPhase(nextPhase), scenario.schedule[index]))
    return () => timers.forEach(window.clearTimeout)
  }, [active, reducedMotion, scenario])

  return phase
}

const ScenarioCapsule = ({ scenario, phase }: { scenario: Scenario; phase: ScenarioPhase }) => (
  <div className="wf-agent-capsule">
    <IntegrationIcon name={scenario.icon} compact />
    {phase === 'done' || phase === 'flat' ? (
      <span className="wf-agent-capsule-done"><Check aria-hidden="true" />complete</span>
    ) : (
      <span className="wf-agent-capsule-bars" aria-hidden="true"><i /><i /><i /><i /><i /></span>
    )}
  </div>
)

const CalendarScenario = ({ phase }: { phase: ScenarioPhase }) => (
  <div className="wf-mini-app wf-mini-calendar" data-phase={phase}>
    <header><span>My Calendar</span><small>Tomorrow</small></header>
    <div className="wf-mini-calendar-body">
      <div className="wf-mini-calendar-form">
        <strong>Launch notes review</strong>
        <span>Tomorrow · 09:20 · 40 min</span>
        <span>Workspace review</span>
      </div>
      <div className="wf-mini-calendar-day"><i /><i /><b>09:20<br />Launch notes review</b><i /></div>
    </div>
  </div>
)

const SlackScenario = ({ phase }: { phase: ScenarioPhase }) => (
  <div className="wf-mini-app wf-mini-slack" data-phase={phase}>
    <header><strong># launch-room</strong><span>8 members</span></header>
    <div className="wf-mini-thread">
      <p><b>Mina</b><span>Can we move the first review to Friday?</span></p>
      <p><b>Whisperfield</b><span>Friday works. I’ll share the open questions beside the launch note before then.</span></p>
    </div>
    <div className="wf-mini-composer">Reply prepared <Check aria-hidden="true" /></div>
  </div>
)

const GmailScenario = ({ phase }: { phase: ScenarioPhase }) => (
  <div className="wf-mini-app wf-mini-gmail" data-phase={phase}>
    <header>New message <span>— □ ×</span></header>
    <dl><dt>To</dt><dd>mina@studio.example</dd><dt>Subject</dt><dd>Launch review · Friday</dd></dl>
    <div className="wf-mini-mail-body">Hi Mina,<br /><br />Friday works for the first review. I’ll attach the open questions to the launch note before then.<br /><br />— Mahiro</div>
    <span className="wf-mini-action-status">Prepared</span>
  </div>
)

const NotionScenario = ({ phase }: { phase: ScenarioPhase }) => (
  <div className="wf-mini-app wf-mini-notion" data-phase={phase}>
    <header>Workspace / Launch study</header>
    <h3>Launch review questions</h3>
    <p>Three decisions to settle before Friday</p>
    <ul><li>Confirm the primary workflow</li><li>Review the new compact header</li><li>Assign the follow-up owner</li></ul>
    <span className="wf-mini-saved"><Check aria-hidden="true" />Page created</span>
  </div>
)

const LinearScenario = ({ phase }: { phase: ScenarioPhase }) => (
  <div className="wf-mini-app wf-mini-linear" data-phase={phase}>
    <header><span>WF</span> New issue <small>Design</small></header>
    <h3>Review launch workflow before Friday</h3>
    <p>Compare the compact header and preserve the three open questions in the project note.</p>
    <div><span>High priority</span><span>Mahiro</span><span>Friday</span></div>
    <span className="wf-mini-action-status"><Check aria-hidden="true" />Issue prepared</span>
  </div>
)

const WeatherScenario = ({ phase }: { phase: ScenarioPhase }) => (
  <div className="wf-mini-app wf-mini-weather" data-phase={phase}>
    <header><Search aria-hidden="true" />Weather for tomorrow’s walk</header>
    <div className="wf-mini-weather-main"><strong>24°</strong><span>Soft cloud cover<br />Light wind after 09:00</span></div>
    <div className="wf-mini-weather-days"><span>09<br /><b>23°</b></span><span>11<br /><b>25°</b></span><span>13<br /><b>26°</b></span><span>15<br /><b>25°</b></span></div>
  </div>
)

const ScenarioCanvas = ({ scenario, phase }: { scenario: Scenario; phase: ScenarioPhase }) => {
  const components = {
    calendar: CalendarScenario,
    slack: SlackScenario,
    gmail: GmailScenario,
    notion: NotionScenario,
    linear: LinearScenario,
    weather: WeatherScenario,
  }
  const Component = components[scenario.id]
  return (
    <div className="wf-agent-scenario" key={scenario.id}>
      <ScenarioCapsule scenario={scenario} phase={phase} />
      <Component phase={phase} />
    </div>
  )
}

const AgentMode = () => {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reducedMotion = useReducedMotion()
  const { ref, visible } = useSectionVisibility<HTMLElement>(0.2)
  const scenario = SCENARIOS[index]
  const active = visible && !paused && !reducedMotion
  const phase = useScenarioPhase(scenario, active, reducedMotion)

  useEffect(() => {
    if (!active) return
    const timer = window.setTimeout(() => setIndex((current) => (current + 1) % SCENARIOS.length), scenario.duration)
    return () => window.clearTimeout(timer)
  }, [active, scenario])

  const move = (step: number) => {
    setIndex((current) => (current + step + SCENARIOS.length) % SCENARIOS.length)
    setPaused(true)
  }

  return (
    <section ref={ref} className="wf-agent" id="modes">
      <div className="wf-agent-inner">
        <header className="wf-agent-header">
          <h2>Agent Mode</h2>
          <p>Voice to actions across integrated apps. Zero context switching.</p>
          <div className="wf-agent-nav" aria-label="Action scenario" onFocusCapture={() => setPaused(true)}>
            <button type="button" aria-label="Previous action scenario" onClick={() => move(-1)}><ArrowLeft aria-hidden="true" /></button>
            <div role="group" aria-label="Action scenario choices">
              {SCENARIOS.map((item, itemIndex) => (
                <button
                  className={`wf-agent-dot ${itemIndex === index ? 'is-active' : ''}`}
                  key={item.id}
                  type="button"
                  aria-label={item.label}
                  aria-pressed={itemIndex === index}
                  onClick={() => { setIndex(itemIndex); setPaused(true) }}
                >
                  <span className="wf-agent-dot-track">
                    {itemIndex === index ? (
                      <i
                        style={{
                          animationDuration: `${item.duration}ms`,
                          animationPlayState: active ? 'running' : 'paused'
                        }}
                      />
                    ) : null}
                  </span>
                </button>
              ))}
            </div>
            <button type="button" aria-label="Next action scenario" onClick={() => move(1)}><ArrowRight aria-hidden="true" /></button>
            <button type="button" aria-label={`${paused ? 'Play' : 'Pause'} action scenario autoplay`} aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
              {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
            </button>
          </div>
        </header>
        <div className="wf-agent-frame">
          <div className="wf-agent-screen">
            <img className="wf-agent-wallpaper" src="/assets/generated/product-sky.webp" alt="" />
            <div className="wf-agent-rich-stage"><ScenarioCanvas scenario={scenario} phase={phase} /></div>
            <div className="wf-agent-dock">
              <ul>
                {DOCK_INTEGRATIONS.map((name) => (
                  <li className={scenario.dock.includes(name) && active ? 'is-glowing' : ''} key={name}>
                    <IntegrationIcon name={name} compact /><i />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export { AgentMode }
