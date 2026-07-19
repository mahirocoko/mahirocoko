import { Check, LockKeyhole, Settings, Shield, UserRound, Wrench } from 'lucide-react'
import { useState } from 'react'
import { PRIVACY_PANELS } from '../content'

const TAB_ICONS = [Settings, Shield, UserRound, Wrench]

const PrivacySection = () => {
  const [activeId, setActiveId] = useState('privacy')
  const panel = PRIVACY_PANELS.find((item) => item.id === activeId) ?? PRIVACY_PANELS[1]
  const primarySettings = panel.settings.slice(0, 3)

  return (
    <section className="wf-privacy" id="privacy">
      <header className="wf-privacy-header">
        <LockKeyhole aria-hidden="true" />
        <h2>Privacy in <strong>Whisperfield</strong><br />you&apos;re in control</h2>
        <p>Your data belongs to you. This fictional interface keeps capture and sharing choices explicit.</p>
      </header>
      <div className="wf-privacy-stage">
        <img src="/assets/generated/privacy-sky.webp" alt="" />
        <div className="wf-privacy-window">
          <span className="wf-privacy-lights" aria-hidden="true"><i /><i /><i /></span>
          <div className="wf-privacy-tabs" role="group" aria-label="Privacy settings sections">
            {PRIVACY_PANELS.map((item, index) => {
              const Icon = TAB_ICONS[index]
              return (
                <button key={item.id} type="button" aria-pressed={activeId === item.id} onClick={() => setActiveId(item.id)}>
                  <Icon aria-hidden="true" /><span>{item.label}</span>
                </button>
              )
            })}
          </div>
          <div className="wf-privacy-divider" />
          <div className="wf-privacy-content" role="region" aria-label="Settings preview" aria-live="polite">
            <div className="wf-privacy-group">
              <strong>{panel.title}</strong>
              <div>
                {primarySettings.map((setting) => (
                  <span className="wf-privacy-option" key={setting.label}>
                    <i className={setting.enabled ? 'is-on' : ''}>{setting.enabled ? <Check aria-hidden="true" /> : null}</i>
                    <span>{setting.label}<small>{setting.detail}</small></span>
                  </span>
                ))}
              </div>
            </div>
            <div className="wf-privacy-divider" />
            <div className="wf-privacy-group is-sharing">
              <strong>Optional sharing</strong>
              <span className="wf-privacy-option"><i /><span>{panel.description}<small>Never includes raw audio or a full transcript tied to you.</small></span></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export { PrivacySection }
