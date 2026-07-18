import { useMemo } from 'react'
import { Link, Route, Routes, useSearchParams } from 'react-router'
import { NudgeCollectionStage } from './components/nudge-collection-stage'
import { FILTERS, SECTIONS, type FilterName } from './content'
import { SectionDetailPage } from './pages/section-detail-page'

export const App = () => (
  <Routes>
    <Route path="/" element={<GalleryPage />} />
    <Route path="/sections/:id" element={<SectionDetailPage />} />
    <Route path="*" element={<GalleryPage />} />
  </Routes>
)

const isFilterName = (value: string | null): value is FilterName => FILTERS.includes(value as FilterName)

const GalleryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedFilter = searchParams.get('filter')
  const filter = isFilterName(requestedFilter) ? requestedFilter : 'All'
  const visibleSections = useMemo(
    () => SECTIONS.filter((section) => filter === 'All' || section.category === filter),
    [filter],
  )

  const selectFilter = (nextFilter: FilterName) => {
    const nextSearchParams = new URLSearchParams(searchParams)
    if (nextFilter === 'All') nextSearchParams.delete('filter')
    else nextSearchParams.set('filter', nextFilter)
    setSearchParams(nextSearchParams, { replace: true })
  }

  const detailHref = (id: string) => {
    if (filter === 'All') return `/sections/${id}`
    return `/sections/${id}?filter=${encodeURIComponent(filter)}`
  }

  const selectHeroFilter = (name: FilterName) => {
    selectFilter(name)
    const catalogue = document.getElementById('sections')
    if (catalogue && typeof catalogue.scrollIntoView === 'function') catalogue.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#sections">Skip to sections</a>
      <header className="masthead">
        <div className="masthead__inner">
          <Link className="wordmark" to="/" aria-label="Nudge home">nudge<span>•</span></Link>
          <nav aria-label="Primary navigation">
            <a href="#sections">Gallery</a>
            <a href="#method">How it works</a>
          </nav>
          <a className="masthead__action" href="#sections">Browse 06 sections</a>
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__statement">
            <p className="hero__pill">Copy prompt → build it</p>
            <h1 id="hero-title">Sections that move<br /><em>with intent.</em></h1>
          </div>
          <aside className="hero__index" aria-label="Interaction index">
            <p>Categories ↓</p>
            <div>
              {FILTERS.filter((name) => name !== 'All').map((name) => (
                <button key={name} type="button" onClick={() => selectHeroFilter(name)}>{name}</button>
              ))}
            </div>
          </aside>
        </section>

        <section className="catalogue" id="sections" aria-labelledby="catalogue-title">
          <div className="catalogue__bar">
            <div>
              <p className="eyebrow">The collection</p>
              <h2 id="catalogue-title">Motion you can inspect.</h2>
            </div>
            <div className="filter-rail" role="group" aria-label="Filter sections">
              {FILTERS.map((name) => (
                <button
                  className={filter === name ? 'filter is-selected' : 'filter'}
                  key={name}
                  type="button"
                  aria-pressed={filter === name}
                  onClick={() => selectFilter(name)}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
          <p className="results" aria-live="polite">{visibleSections.length} {visibleSections.length === 1 ? 'section' : 'sections'} in {filter === 'All' ? 'the library' : filter}</p>

          <div className="study-grid">
            {visibleSections.map((section) => (
              <article className="study-card" key={section.id}>
                <Link className="study-card__link" to={detailHref(section.id)} aria-label={`Open ${section.title} section`}>
                  <div className="study-card__stage">
                    <span>{section.category}</span>
                    <NudgeCollectionStage section={section} variant="compact" />
                  </div>
                  <div className="study-card__title-row"><h3>{section.title}</h3><span aria-hidden="true">↗</span></div>
                  <p>{section.description}</p>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="process-section" id="method" aria-labelledby="process-title">
          <div className="process-section__copy">
            <p className="eyebrow">How it works</p>
            <h2 id="process-title">A section, then the thinking behind it.</h2>
            <p>Play with the live surface first. Open it when the behavior earns a closer look, then copy the original build prompt into your coding tool.</p>
            <a href="#sections">See the collection <span aria-hidden="true">→</span></a>
          </div>
          <div className="process-section__prompt" aria-label="Prompt workflow example">
            <div><span>Nudge field note</span><span>Free to inspect</span></div>
            <strong>Build a bounded response.</strong>
            <p>Keep the static composition complete. Add pointer depth only for fine pointers. Make every action work without motion.</p>
            <ol><li>Preview</li><li>Open</li><li>Copy</li><li>Build</li></ol>
          </div>
          <div className="process-section__steps" aria-label="Nudge workflow">
            <span>01 Preview</span><span>02 Inspect</span><span>03 Copy</span><span>04 Adapt</span>
          </div>
        </section>

        <section className="closing-cta" aria-labelledby="closing-title">
          <p className="eyebrow">Keep it useful</p>
          <h2 id="closing-title">Your next page can<br />move with purpose.</h2>
          <p>Six original interaction studies, each paired with a build prompt and a motion-safe fallback.</p>
          <a className="closing-cta__link" href="#sections">Browse the collection</a>
          <p className="closing-cta__note">Open lab · no account · no checkout</p>
        </section>
      </main>

      <footer id="about">
        <div className="footer__about"><Link className="wordmark" to="/" aria-label="Nudge home">nudge<span>•</span></Link><p>Nudge is an original interaction-section lab: compact browser behaviors, prompt notes, and stable fallbacks.</p></div>
        <div className="footer__links">
          <div><p>Library</p><a href="#sections">All sections</a><a href="#method">Method note</a></div>
          <div><p>Inputs</p><a href="#sections">Fine pointer</a><a href="#top">Reduced motion</a></div>
          <div><p>Boundary</p><span>No paywall</span><span>No checkout</span></div>
        </div>
        <div className="footer__bottom"><span>© 2026 Nudge lab</span><a href="#top">Back to top ↑</a></div>
      </footer>
    </div>
  )
}
