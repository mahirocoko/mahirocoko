import { useMemo, useState } from 'react'
import { FINISHES, PRODUCTS, RAILS, formatMoney } from '../data'
import { configurationPrice } from '../hooks/use-commerce'
import type { Finish, ModuleId, RailSize, SystemConfiguration } from '../types'
import { useBuilderIntro } from '../hooks/use-builder-intro'
import { useSectionIntro } from '../hooks/use-section-intro'
import { ArrowIcon } from './icons'
import { MotionHeading } from './motion-heading'

interface SystemBuilderProps {
  onAdd: (configuration: SystemConfiguration) => void
}

export const SystemBuilder = ({ onAdd }: SystemBuilderProps) => {
  const sectionRef = useSectionIntro<HTMLElement>()
  const { canvasRef, controlsRef } = useBuilderIntro()
  const [railSize, setRailSize] = useState<RailSize>(120)
  const [finish, setFinish] = useState<Finish>('graphite')
  const [modules, setModules] = useState<ModuleId[]>(['arc-dock', 'pocket-tray'])

  const configuration = useMemo(() => ({ railSize, finish, modules }), [finish, modules, railSize])
  const total = configurationPrice(configuration)

  const toggleModule = (moduleId: ModuleId) => {
    setModules((current) => current.includes(moduleId)
      ? current.filter((id) => id !== moduleId)
      : [...current, moduleId])
  }

  return (
    <section className="builder-section" id="system" aria-labelledby="builder-title" ref={sectionRef}>
      <div className="builder-intro">
        <span data-motion-overline>System builder / 01</span>
        <div>
          <MotionHeading id="builder-title" lines={['Make the rail', 'fit the work.']} />
          <p data-motion-copy>Choose a span, finish, and only the modules you need. Every change stays attached to the same system.</p>
        </div>
      </div>
      <div className="builder-shell">
        <div className={`builder-canvas builder-canvas--${finish}`} ref={canvasRef}>
          <div className="canvas-toolbar">
            <span>Desk preview</span>
            <span>{railSize} cm · {modules.length} {modules.length === 1 ? 'module' : 'modules'}</span>
          </div>
          <div className="desk-scene" style={{ '--rail-width': `${58 + (railSize - 90) * 0.24}%` } as React.CSSProperties}>
            <div className="desk-plane" />
            <div className="system-rail">
              <i className="rail-slot" />
              <span className={`attached attached--dock ${modules.includes('arc-dock') ? 'is-present' : 'is-absent'}`} aria-hidden="true"><b /><small>ARC</small></span>
              <span className={`attached attached--light ${modules.includes('halo-light') ? 'is-present' : 'is-absent'}`} aria-hidden="true"><b /><small>HALO</small></span>
              <span className={`attached attached--tray ${modules.includes('pocket-tray') ? 'is-present' : 'is-absent'}`} aria-hidden="true"><b /><small>POCKET</small></span>
            </div>
            <span className="canvas-scale">{railSize}0 mm</span>
          </div>
          <p className="canvas-note">Concept geometry · attachment positions are illustrative</p>
        </div>

        <form className="builder-controls" ref={controlsRef} onSubmit={(event) => { event.preventDefault(); onAdd(configuration) }}>
          <fieldset>
            <legend><span>01</span> Rail span</legend>
            <div className="option-grid option-grid--rail">
              {RAILS.map((rail) => (
                <button
                  key={rail.size}
                  type="button"
                  className={railSize === rail.size ? 'is-selected' : ''}
                  aria-pressed={railSize === rail.size}
                  onClick={() => setRailSize(rail.size)}
                >
                  <strong>{rail.size} cm</strong><small>{rail.label}</small><span>{formatMoney(rail.price)}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend><span>02</span> Finish</legend>
            <div className="finish-options">
              {FINISHES.map((option) => (
                <label key={option.id}>
                  <input type="radio" name="builder-finish" value={option.id} checked={finish === option.id} onChange={() => setFinish(option.id)} />
                  <i className={`finish-swatch finish-swatch--${option.id}`} />
                  <span><strong>{option.label}</strong><small>{option.note}</small></span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend><span>03</span> Attach modules</legend>
            <div className="mobile-module-preview" aria-hidden="true">
              <div className="mobile-module-preview__rail">
                <i className="mobile-module-preview__slot" />
                <span className={`mini-attached mini-attached--dock ${modules.includes('arc-dock') ? 'is-present' : ''}`}><b /></span>
                <span className={`mini-attached mini-attached--light ${modules.includes('halo-light') ? 'is-present' : ''}`}><b /></span>
                <span className={`mini-attached mini-attached--tray ${modules.includes('pocket-tray') ? 'is-present' : ''}`}><b /></span>
              </div>
              <small>Live rail · tap modules below</small>
            </div>
            <div className="module-options">
              {PRODUCTS.map((product) => {
                const selected = modules.includes(product.id)
                return (
                  <button
                    key={product.id}
                    type="button"
                    className={selected ? 'is-selected' : ''}
                    aria-label={`${selected ? 'Remove' : 'Add'} ${product.name}`}
                    aria-pressed={selected}
                    onClick={() => toggleModule(product.id)}
                  >
                    <i>{selected ? '✓' : '+'}</i>
                    <span><strong>{product.name}</strong><small>{product.eyebrow}</small></span>
                    <b>{formatMoney(product.price)}</b>
                  </button>
                )
              })}
            </div>
          </fieldset>
          <div className="builder-total">
            <div><span>System total</span><strong data-testid="builder-total">{formatMoney(total)}</strong></div>
            <button type="submit">Add configured system <ArrowIcon /></button>
            <p>Concept price. No payment will be taken.</p>
          </div>
        </form>
      </div>
    </section>
  )
}
