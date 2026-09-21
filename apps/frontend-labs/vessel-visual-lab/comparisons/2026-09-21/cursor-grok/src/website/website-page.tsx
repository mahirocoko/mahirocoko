import { useEffect, useMemo, useRef, useState } from 'react'
import { OpticBlade } from '../shared/optic-blade'
import { LANDSCAPE_ASSET, ROUTES } from '../shared/paths'
import { PRODUCT_TRUTH } from '../shared/product-truth'
import {
  SAMPLE_DISCLOSURE,
  WEBSITE_SAMPLE,
  deriveTelemetry,
  formatMegabytes,
  DEFAULT_RECIPE,
} from '../shared/sample-asset'

interface ISearchItem {
  href: string
  label: string
}

const SEARCH_ITEMS: ISearchItem[] = [
  { href: '#inspect', label: 'Metadata and privacy audit' },
  { href: '#color', label: 'Color profile preview' },
  { href: '#recipe', label: 'Derivative recipe' },
  { href: '#lifecycle', label: 'Stage, inspect, choose, drag out' },
  { href: '#scope', label: 'Local-first boundary' },
  { href: '#faq', label: 'Limitations and FAQ' },
  { href: '#cta', label: 'Open the app study' },
]

export const WebsitePage = () => {
  const [blade, setBlade] = useState(50)
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLDialogElement>(null)
  const derivative = deriveTelemetry(WEBSITE_SAMPLE, DEFAULT_RECIPE)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return SEARCH_ITEMS
    return SEARCH_ITEMS.filter((item) => item.label.toLowerCase().includes(needle))
  }, [query])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchRef.current?.showModal()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const closeSearch = () => {
    searchRef.current?.close()
    setQuery('')
  }

  return (
    <div className="website">
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <header className="website-header">
        <a className="brand" href={ROUTES.website}>
          Vessel
          <small>V0.1-ALPHA</small>
        </a>
        <nav className="site-nav" aria-label="Page">
          <a href="#inspect">Inspect</a>
          <a href="#recipe">Architecture</a>
          <a href="#scope">Specs</a>
        </nav>
        <div className="header-actions">
          <details className="nav-more">
            <summary>Menu</summary>
            <div className="nav-panel">
              <a href="#inspect">Inspect</a>
              <a href="#recipe">Architecture</a>
              <a href="#scope">Specs</a>
              <button type="button" onClick={() => searchRef.current?.showModal()}>
                Search this page
              </button>
            </div>
          </details>
          <button
            className="btn btn-ghost header-search"
            type="button"
            onClick={() => searchRef.current?.showModal()}
          >
            <span className="kbd">⌘K</span>
            Search
          </button>
          <a className="btn btn-solid" href={ROUTES.app}>
            App study
          </a>
        </div>
      </header>

      <main id="content" className="website-main">
        <section className="hero" aria-labelledby="hero-title">
          <p className="hero__kicker">Local · Single-asset · Preflight</p>
          <h1 id="hero-title">
            The outgoing <span className="soft">airlock</span> for everything you share.
          </h1>
          <p className="hero__lede">
            Inspect hidden metadata, verify color profiles, and stage clean derivative files before
            transmission. Originals remain untouched on disk.
          </p>
          <div className="hero__actions">
            <a className="btn btn-solid" href={ROUTES.app}>
              Open the Mac interface study
            </a>
            <a className="btn btn-ghost" href="#scope">
              View technical specs
            </a>
          </div>
          <figure>
            <OpticBlade
              src={LANDSCAPE_ASSET}
              alt="Sample alpine landscape used as the Optic Blade proof. Fictional metadata overlays."
              position={blade}
              onPositionChange={setBlade}
              handle="reticle"
              caption="P3 → sRGB"
              label="Optic Blade sample comparison"
            >
              <span className="blade-chip blade-chip--source chip-1">Source · original (untouched)</span>
              <span className="blade-chip blade-chip--source chip-2">
                {WEBSITE_SAMPLE.width} × {WEBSITE_SAMPLE.height} px
              </span>
              <span className="blade-chip blade-chip--source chip-3">{formatMegabytes(WEBSITE_SAMPLE.bytes)}</span>
              <span className="blade-chip blade-chip--source chip-4">Color: Display P3</span>
              <span className="blade-chip blade-chip--source chip-5">
                12 metadata tags detected (EXIF / GPS / device)
              </span>
              <span className="blade-chip blade-chip--derive chip-1">Derivative preview</span>
              <span className="blade-chip blade-chip--derive chip-2">
                {formatMegabytes(derivative.bytes)} (−{derivative.savingsPercent}%)
              </span>
              <span className="blade-chip blade-chip--derive chip-3">Color: sRGB IEC61966</span>
              <span className="blade-chip blade-chip--derive chip-4">Metadata: stripped</span>
              <span className="blade-chip blade-chip--derive chip-5">Sample · simulation</span>
            </OpticBlade>
            <figcaption>01 / Direct metadata audit</figcaption>
          </figure>
        </section>

        <section className="section" id="inspect" aria-labelledby="inspect-title">
          <p className="section__kicker">01 / Direct metadata audit</p>
          <div className="section__grid">
            <div>
              <h2 id="inspect-title">What this sample is carrying</h2>
              <p>
                {SAMPLE_DISCLOSURE} Vessel is meant to expose available metadata, dimensions, byte size,
                and color-profile facts before anything leaves the machine. This page does not open,
                parse, or scan a real file.
              </p>
            </div>
            <p className="note">
              <strong>Privacy-relevant tags are labeled in words, not color alone.</strong> Amber tint
              marks location and device fields in this simulation. The labels are authored sample copy,
              not an automated detector.
            </p>
          </div>
          <ul className="tag-list">
            <li>
              <span className="privacy">EXIF GPS (privacy-relevant)</span>
              <span>{WEBSITE_SAMPLE.geotag}</span>
            </li>
            <li>
              <span className="privacy">Device (privacy-relevant)</span>
              <span>{WEBSITE_SAMPLE.device}</span>
            </li>
            <li>
              <span>Color profile</span>
              <span>{WEBSITE_SAMPLE.profile}</span>
            </li>
            <li>
              <span>Byte size</span>
              <span>{formatMegabytes(WEBSITE_SAMPLE.bytes)}</span>
            </li>
            <li>
              <span>Pixel dimensions</span>
              <span>
                {WEBSITE_SAMPLE.width} × {WEBSITE_SAMPLE.height}
              </span>
            </li>
            <li>
              <span>Tag count (sample)</span>
              <span>{WEBSITE_SAMPLE.privacyTagCount} listed facts</span>
            </li>
          </ul>
        </section>

        <section className="section" id="color" aria-labelledby="color-title">
          <p className="section__kicker">02 / Color profile</p>
          <div className="section__grid">
            <div>
              <h2 id="color-title">A preview of intent, not a conversion certificate</h2>
              <p>
                The Optic Blade above uses the same clean landscape on both sides. The warmer left and
                cooler right are CSS filters. They stand in for a Display P3 source versus an sRGB
                delivery preview.
              </p>
            </div>
            <p className="note">
              <strong>{PRODUCT_TRUTH.cssPreviewDisclaimer}</strong> A future native build would have to
              prove conversion with real profiles. This study does not.
            </p>
          </div>
        </section>

        <section className="section" id="recipe" aria-labelledby="recipe-title">
          <p className="section__kicker">03 / Derivative recipe</p>
          <h2 id="recipe-title">Choose explicit steps. Keep the source.</h2>
          <div className="section__grid">
            <ol className="recipe-list">
              <li>
                <b>Remove metadata and location tags</b>
                Strip simulated EXIF, GPS, and device packets from the derivative only.
              </li>
              <li>
                <b>Preview sRGB conversion</b>
                Stage a delivery color interpretation. Preview here is CSS, not a native profile engine.
              </li>
              <li>
                <b>Optimize a delivery copy</b>
                Simulate a smaller outgoing file. This page does not encode or rewrite bytes.
              </li>
            </ol>
            <p className="note">
              <strong>Protected source.</strong> {PRODUCT_TRUTH.sourceInvariant}
            </p>
          </div>
        </section>

        <section className="section" id="lifecycle" aria-labelledby="lifecycle-title">
          <p className="section__kicker">04 / Lifecycle</p>
          <h2 id="lifecycle-title">Stage, inspect, choose, drag out</h2>
          <p>One asset at a time. The intended loop is short and local.</p>
          <div className="lifecycle">
            <div>
              <span>01 Stage</span>
              <p>Bring one PNG, JPEG, or single-page PDF onto the deck.</p>
            </div>
            <div>
              <span>02 Inspect</span>
              <p>Read the facts the file already carries — size, profile, tags.</p>
            </div>
            <div>
              <span>03 Choose</span>
              <p>Tick only the derivative steps you want for the outgoing copy.</p>
            </div>
            <div>
              <span>04 Drag out</span>
              <p>Hand the derivative to a destination. The source stays put.</p>
            </div>
          </div>
        </section>

        <section className="section" id="scope" aria-labelledby="scope-title">
          <p className="section__kicker">05 / Boundary</p>
          <h2 id="scope-title">Local-first target, narrow input, honest ceiling</h2>
          <div className="section__grid">
            <p>{PRODUCT_TRUTH.localFirst}</p>
            <p>
              {PRODUCT_TRUTH.inputScope} Multi-page PDF, RAW, video, and folders are outside this
              concept. There is no claim of complete format coverage.
            </p>
          </div>
        </section>

        <section className="section" id="faq" aria-labelledby="faq-title">
          <p className="section__kicker">06 / Limitations</p>
          <h2 id="faq-title">What this study is not</h2>
          <dl className="faq">
            <div>
              <dt>Does this parse my files?</dt>
              <dd>No. Every dimension, tag count, and saving figure is a fictional sample.</dd>
            </div>
            <div>
              <dt>Can I download Vessel?</dt>
              <dd>{PRODUCT_TRUTH.noDownload}</dd>
            </div>
            <div>
              <dt>Does the drag-out write a file?</dt>
              <dd>{PRODUCT_TRUTH.studyNotice}</dd>
            </div>
            <div>
              <dt>Is the original mutated?</dt>
              <dd>It must not be, as a product invariant. This frontend cannot prove native disk behavior.</dd>
            </div>
            <div>
              <dt>Is location stripping complete?</dt>
              <dd>No. This study cannot certify that location or device tags are gone from a real file.</dd>
            </div>
          </dl>
        </section>

        <section className="section cta-block" id="cta" aria-labelledby="cta-title">
          <p className="section__kicker">07 / Continue</p>
          <h2 id="cta-title">Open the instrument, not an installer</h2>
          <p>
            The compact macOS workbench is an interactive study of Ready, Empty, Inspecting, and the
            failure states around a single staged asset.
          </p>
          <div className="hero__actions">
            <a className="btn btn-solid" href={ROUTES.app}>
              Open the Mac interface study
            </a>
            <a className="btn btn-ghost" href={ROUTES.root}>
              Back to launchpad
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>Vessel v0.1-alpha · frontend visual study · {SAMPLE_DISCLOSURE}</p>
      </footer>

      <dialog className="search-dialog" ref={searchRef} aria-labelledby="search-title">
        <h2 id="search-title">Jump in this page</h2>
        <p>This search only lists sections on this page. It does not query files or a network index.</p>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Filter sections"
          placeholder="Filter sections"
        />
        {filtered.length === 0 ? (
          <p className="empty-filter">No matching sections.</p>
        ) : (
          <ul>
            {filtered.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={closeSearch}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        )}
        <button className="btn btn-ghost" type="button" onClick={closeSearch}>
          Close
        </button>
      </dialog>
    </div>
  )
}
