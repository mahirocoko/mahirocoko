import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { NudgeCollectionStage } from '../components/nudge-collection-stage'
import { FILTERS, SECTIONS, getSectionById, type FilterName } from '../content'

const getReturnHref = (filter: string | null) => {
  if (!filter || !FILTERS.includes(filter as FilterName) || filter === 'All') return '/#sections'
  return `/?filter=${encodeURIComponent(filter)}#sections`
}

export const SectionDetailPage = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const requestedFilter = searchParams.get('filter')
  const section = getSectionById(id) ?? SECTIONS[0]
  const usedFallback = section.id !== id
  const collectionHref = getReturnHref(requestedFilter)
  const returnLabel = requestedFilter && FILTERS.includes(requestedFilter as FilterName) && requestedFilter !== 'All'
    ? requestedFilter
    : 'all'
  const index = SECTIONS.indexOf(section) + 1

  return (
    <div className="app-shell section-detail">
      <a className="skip-link" href="#section-stage">Skip to section preview</a>
      <header className="masthead">
        <div className="masthead__inner">
          <Link className="wordmark" to={collectionHref} aria-label="Back to Nudge collection">nudge<span>•</span></Link>
          <nav aria-label="Section navigation"><Link to={collectionHref}>Collection</Link><span>{section.title} / {String(index).padStart(2, '0')}</span></nav>
          <span className="masthead__counter">{section.category} section</span>
        </div>
      </header>

      <main>
        <SectionShowcase section={section} />

        <section className="section-detail__intro" aria-labelledby="section-title">
          <Link className="section-detail__back" to={collectionHref}>← Back to {returnLabel} sections</Link>
          {usedFallback && <p className="section-detail__warning" role="status">That section was not found, so the first Nudge section is shown instead.</p>}
          <p className="eyebrow">{String(index).padStart(2, '0')} / {section.category}</p>
          <h1 id="section-title">{section.title}</h1>
          <p>{section.description}</p>
        </section>

        <section className="section-detail__notes" id="section-notes" aria-label={`${section.title} interaction notes`}>
          <div><p className="eyebrow">Intent</p><h2>Bounded response, visible fallback, no borrowed mechanism.</h2></div>
          <dl>
            {section.notes.map((note) => <div key={note.term}><dt>{note.term}</dt><dd>{note.detail}</dd></div>)}
          </dl>
        </section>

        <PromptPanel prompt={section.prompt} title={section.title} />

        <section className="section-detail__closing">
          <p>One behavior, one clear job.</p>
          <Link className="closing-cta__link" to={collectionHref}>Return to the collection <span aria-hidden="true">↑</span></Link>
        </section>
      </main>
    </div>
  )
}

type SectionShowcaseProps = {
  section: (typeof SECTIONS)[number]
}

const SectionShowcase = ({ section }: SectionShowcaseProps) => {
  const [replayKey, setReplayKey] = useState(0)
  const reducedMotion = useReducedMotion()
  const [copyStatus, setCopyStatus] = useState('')

  const copyPrompt = async () => {
    try {
      if (!window.navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable')
      await window.navigator.clipboard.writeText(section.prompt)
      setCopyStatus('Prompt copied to clipboard.')
    } catch {
      setCopyStatus('Copy failed. Select the prompt text below.')
    }
  }

  return (
    <section className="section-showcase" id="section-stage" aria-label={`${section.title} live preview`}>
      <div className="section-showcase__canvas">
        <NudgeCollectionStage section={section} variant="detail" replayKey={replayKey} />
      </div>
      <aside className="section-showcase__panel" aria-label={`${section.title} controls`}>
        <div className="section-showcase__title"><div><strong>{section.title}</strong><span>{section.category}</span></div><span>0{SECTIONS.indexOf(section) + 1}</span></div>
        <p className="section-showcase__hint">{section.cue}</p>
        <div className="section-showcase__actions">
          <a href="#section-notes">More ↓</a>
          <button type="button" disabled={reducedMotion} onClick={() => setReplayKey((value) => value + 1)}>{reducedMotion ? 'Motion reduced' : '↻ Replay'}</button>
        </div>
        <button className="section-showcase__copy" type="button" onClick={copyPrompt}>Copy Prompt</button>
        <p aria-live="polite">{copyStatus || 'Original prompt · free to inspect'}</p>
      </aside>
    </section>
  )
}

const useReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(() => (
    typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ))

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  return reducedMotion
}


type PromptPanelProps = {
  prompt: string
  title: string
}

const PromptPanel = ({ prompt, title }: PromptPanelProps) => {
  const promptId = useMemo(() => `prompt-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, [title])

  return (
    <section className="prompt-panel" aria-labelledby="prompt-title">
      <div>
        <p className="eyebrow">Implementation prompt</p>
        <h2 id="prompt-title">Original AI build prompt for {title}.</h2>
        <p>Use this as a detailed implementation brief. It is not a paid unlock or marketplace item.</p>
      </div>
      <div className="prompt-panel__copy">
        <p>The same prompt is available as selectable text for manual copy or editing.</p>
        <span className="prompt-panel__label" id={`${promptId}-label`}>Selectable prompt fallback</span>
        <div className="prompt-panel__text" id={promptId} role="textbox" tabIndex={0} aria-labelledby={`${promptId}-label`}>{prompt}</div>
      </div>
    </section>
  )
}
