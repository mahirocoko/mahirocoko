import { useState, type CSSProperties, type PointerEvent } from 'react'
import { SECTIONS, type Section } from '../content'

type NudgeCollectionStageProps = {
  section: Section
  variant?: 'compact' | 'detail'
  replayKey?: number
}

type Print = {
  id: string
  title: string
  imagePath: string
  x: number
  y: number
  rotate: number
  depth: number
}

const clamp = (value: number) => Math.min(100, Math.max(0, value))

const supportsFinePointer = () => (
  typeof window !== 'undefined'
  && typeof window.matchMedia === 'function'
  && window.matchMedia('(hover: hover) and (pointer: fine)').matches
)

const FIELD_PRINTS: Print[] = SECTIONS.map((item, index) => ({
  id: item.id,
  title: item.title,
  imagePath: item.imagePath,
  x: [8, 24, 41, 59, 76, 91][index],
  y: [61, 37, 57, 31, 53, 39][index],
  rotate: [-14, 8, -5, 6, -9, 13][index],
  depth: [.16, .09, .05, .11, .08, .14][index],
}))

const queueItems = ['Specimen', 'Field note', 'Prompt', 'Build']
const typePhrase = 'READ THE SIGNAL'
const typeWords = typePhrase.split(' ')

export const NudgeCollectionStage = ({ section, variant = 'compact', replayKey = 0 }: NudgeCollectionStageProps) => {
  const [pointer, setPointer] = useState({ x: 50, y: 50 })
  const [selectedPrint, setSelectedPrint] = useState(section.id)
  const [selectedQueue, setSelectedQueue] = useState(1)
  const [typeIndex, setTypeIndex] = useState(5)
  const isDetail = variant === 'detail'

  const updatePointer = (event: PointerEvent<HTMLElement>) => {
    if (!supportsFinePointer() || event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    setPointer({
      x: clamp(((event.clientX - bounds.left) / bounds.width) * 100),
      y: clamp(((event.clientY - bounds.top) / bounds.height) * 100),
    })
  }

  const resetPointer = () => setPointer({ x: 50, y: 50 })
  const style = { '--pointer-x': pointer.x, '--pointer-y': pointer.y } as CSSProperties

  return (
    <div
      className={`nudge-stage nudge-stage--${variant} nudge-stage--${section.id}`}
      data-replay={replayKey}
      data-section={section.id}
      style={style}
      onPointerMove={updatePointer}
      onPointerLeave={resetPointer}
    >
      <img className="nudge-stage__ambient" src={section.imagePath} alt="" aria-hidden="true" loading="lazy" />
      {section.id === 'tilt-field' && <TiltField activeId={selectedPrint} onSelect={setSelectedPrint} interactive={isDetail} />}
      {section.id === 'reading-queue' && <ReadingQueue selected={selectedQueue} onSelect={setSelectedQueue} interactive={isDetail} />}
      {section.id === 'soft-radar' && <SoftRadar section={section} />}
      {section.id === 'travel-scrub' && <TravelScrub />}
      {section.id === 'type-signal' && <TypeSignal activeIndex={typeIndex} onSelect={setTypeIndex} interactive={isDetail} />}
      {section.id === 'surface-fold' && <SurfaceFold section={section} />}
      <p className="nudge-stage__cue">{section.cue}</p>
    </div>
  )
}

type VariantProps = {
  interactive: boolean
}

const TiltField = ({ activeId, onSelect, interactive }: VariantProps & { activeId: string; onSelect: (id: string) => void }) => (
  <div className="nudge-stage__composition nudge-field" aria-label={interactive ? 'Tilt Field print field — choose a generated print to bring it forward' : undefined}>
    {FIELD_PRINTS.map((print) => {
      const className = print.id === activeId ? 'nudge-print is-active' : 'nudge-print'
      const style = {
        '--print-x': print.x,
        '--print-y': print.y,
        '--print-rotate': `${print.rotate}deg`,
        '--print-depth': print.depth,
      } as CSSProperties
      if (!interactive) {
        return <span className={className} key={print.id} style={style} aria-hidden="true"><img src={print.imagePath} alt="" loading="lazy" /></span>
      }
      return (
        <button
          className={className}
          key={print.id}
          type="button"
          style={style}
          aria-pressed={print.id === activeId}
          aria-label={`Bring ${print.title} generated print forward`}
          onClick={() => onSelect(print.id)}
          onFocus={() => onSelect(print.id)}
        >
          <img src={print.imagePath} alt="" />
        </button>
      )
    })}
  </div>
)

const ReadingQueue = ({ selected, onSelect, interactive }: VariantProps & { selected: number; onSelect: (index: number) => void }) => (
  <div className="nudge-stage__composition nudge-queue" aria-label={interactive ? 'Reading Queue numbered focus selection' : undefined}>
    <div className="nudge-queue__stack" aria-hidden="true">
      {FIELD_PRINTS.slice(0, 3).map((print, offset) => <img className={offset === selected % 3 ? 'is-active' : undefined} key={print.id} src={print.imagePath} alt="" style={{ '--queue-offset': offset } as CSSProperties} />)}
    </div>
    <div className="nudge-queue__list">
      {queueItems.map((item, index) => {
        const className = index === selected ? 'nudge-queue__row is-selected' : 'nudge-queue__row'
        const content = <><span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong><i /></>
        if (!interactive) return <span className={className} key={item} aria-hidden="true">{content}</span>
        return <button className={className} key={item} type="button" aria-pressed={index === selected} onClick={() => onSelect(index)} onFocus={() => onSelect(index)}>{content}</button>
      })}
    </div>
  </div>
)

const SoftRadar = ({ section }: { section: Section }) => (
  <div className="nudge-stage__composition nudge-radar" aria-hidden="true">
    <img className="nudge-radar__print nudge-radar__print--one" src={section.imagePath} alt="" loading="lazy" />
    <img className="nudge-radar__print nudge-radar__print--two" src={FIELD_PRINTS[4].imagePath} alt="" loading="lazy" />
    <span className="nudge-radar__ring nudge-radar__ring--one" />
    <span className="nudge-radar__ring nudge-radar__ring--two" />
    <span className="nudge-radar__ring nudge-radar__ring--three" />
    <span className="nudge-radar__signal" />
  </div>
)

const TravelScrub = () => (
  <div className="nudge-stage__composition nudge-scrub" aria-label="Travel Scrub local media ribbon">
    <div className="nudge-scrub__ribbon" aria-hidden="true">
      {FIELD_PRINTS.slice(1, 5).map((print, index) => <img key={print.id} src={print.imagePath} alt="" style={{ '--scrub-item': index } as CSSProperties} loading="lazy" />)}
    </div>
    <div className="nudge-scrub__rail" aria-hidden="true"><span /></div>
    <div className="nudge-scrub__labels"><span>01 / 04</span><span>local scrub</span></div>
  </div>
)

const TypeSignal = ({ activeIndex, onSelect, interactive }: VariantProps & { activeIndex: number; onSelect: (index: number) => void }) => (
  <div className="nudge-stage__composition nudge-type" aria-label={interactive ? 'Type Signal readable phrase and generated image strips' : undefined}>
    <div className="nudge-type__strips" aria-hidden="true">
      {FIELD_PRINTS.slice(3, 6).map((print, index) => <img key={print.id} src={print.imagePath} alt="" style={{ '--type-strip': index } as CSSProperties} loading="lazy" />)}
    </div>
    <p className="nudge-type__phrase" aria-label={typePhrase}>
      {typeWords.map((word, wordIndex) => {
        const wordStart = typeWords.slice(0, wordIndex).reduce((total, item) => total + item.length + 1, 0)
        return (
          <span className="nudge-type__word" key={word} aria-hidden={!interactive}>
            {word.split('').map((letter, letterOffset) => {
              const index = wordStart + letterOffset
              const className = index === activeIndex ? 'nudge-type__letter is-active' : 'nudge-type__letter'
              if (!interactive) return <span className={className} key={`${letter}-${index}`}>{letter}</span>
              return <button className={className} key={`${letter}-${index}`} type="button" aria-label={`Inspect letter ${letter}`} onClick={() => onSelect(index)} onFocus={() => onSelect(index)}>{letter}</button>
            })}
          </span>
        )
      })}
    </p>
  </div>
)

const SurfaceFold = ({ section }: { section: Section }) => (
  <div className="nudge-stage__composition nudge-fold" aria-hidden="true">
    <div className="nudge-fold__plane nudge-fold__plane--left"><img src={FIELD_PRINTS[0].imagePath} alt="" loading="lazy" /></div>
    <div className="nudge-fold__plane nudge-fold__plane--right"><img src={section.imagePath} alt="" loading="lazy" /></div>
    <span className="nudge-fold__seam" />
  </div>
)
