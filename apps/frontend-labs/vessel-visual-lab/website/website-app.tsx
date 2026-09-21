import React, { useState, useRef, useCallback, useEffect } from 'react'
import './website-styles.css'

interface IWebsiteAppProps {
  initialSplit?: number
}

interface ISearchItem {
  id: string
  title: string
  section: string
  category: string
}

const SEARCH_ITEMS: ISearchItem[] = [
  { id: 'inspect', title: 'Direct Metadata Audit & Header Inspection', section: '#inspect', category: 'Inspection' },
  { id: 'profiles', title: 'Display P3 vs sRGB Color Gamut Handling', section: '#profiles', category: 'Color' },
  { id: 'architecture', title: 'Protected Source Invariant & 3-Step Recipe Concept', section: '#architecture', category: 'Security' },
  { id: 'lifecycle', title: 'Four-Step Lifecycle: Stage, Inspect, Choose, Drag Out', section: '#lifecycle', category: 'Workflow' },
  { id: 'specs', title: 'Local Architecture & Evidence Status', section: '#specs', category: 'Specifications' },
  { id: 'faq', title: 'Honest Limitations & Project Boundaries', section: '#faq', category: 'Transparency' },
]

const WebsiteApp = ({ initialSplit = 50 }: IWebsiteAppProps) => {
  const [splitPos, setSplitPos] = useState<number>(initialSplit)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [mobileMode, setMobileMode] = useState<'blade' | 'source' | 'derivative'>('blade')
  const [gamutDemo, setGamutDemo] = useState<'p3' | 'srgb' | 'untagged'>('p3')
  const [searchOpen, setSearchOpen] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const stageRef = useRef<HTMLDivElement>(null)

  const updateSplit = useCallback((clientX: number) => {
    if (!stageRef.current) return
    const rect = stageRef.current.getBoundingClientRect()
    const rawPct = ((clientX - rect.left) / rect.width) * 100
    const clampedPct = Math.max(5, Math.min(95, rawPct))
    setSplitPos(clampedPct)
  }, [])

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true)
    updateSplit(e.clientX)
    try {
      ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    } catch {
      // safe fallback: synthetic, unmapped, or detached pointer event cannot throw
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    updateSplit(e.clientX)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false)
    try {
      ;(e.target as HTMLElement).releasePointerCapture?.(e.pointerId)
    } catch {
      // safe fallback
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setSplitPos((prev) => Math.max(5, prev - 5))
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      setSplitPos((prev) => Math.min(95, prev + 5))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setSplitPos(5)
    } else if (e.key === 'End') {
      e.preventDefault()
      setSplitPos(95)
    }
  }

  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      } else if (e.key === 'Escape') {
        setSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handleGlobalKey)
    return () => window.removeEventListener('keydown', handleGlobalKey)
  }, [])

  const filteredSearch = SEARCH_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeSplit = mobileMode === 'source' ? 100 : mobileMode === 'derivative' ? 0 : splitPos

  return (
    <div className="site-shell">
      {/* Header */}
      <header className="site-header" role="banner">
        <div className="header-brand-group">
          <a href="/website/" className="brand-logo" aria-label="Vessel homepage">
            Vessel
          </a>
          <span className="brand-badge">V0.1-ALPHA</span>
        </div>

        <nav className="header-nav" aria-label="Main Navigation">
          <a href="#inspect" className="nav-link">Inspect</a>
          <a href="#profiles" className="nav-link">Profiles</a>
          <a href="#architecture" className="nav-link">Architecture</a>
          <a href="#specs" className="nav-link">Specs</a>
          <a href="#faq" className="nav-link">Limitations</a>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="search-trigger"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search shortcut"
          >
            <span>Search</span>
            <kbd>⌘K</kbd>
          </button>
          <a
            href="/app/"
            className="btn-primary-pill"
            aria-label="Open interactive application study"
          >
            Launch App Study
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section" aria-labelledby="hero-title">
        <span className="eyebrow-tag">Local Single-Asset Preflight</span>
        <h1 id="hero-title" className="hero-headline">
          The outgoing <span className="airlock-muted">airlock</span>{' '}
          <br />
          for everything you share.
        </h1>
        <p className="hero-subtitle">
          Inspect metadata, preview color profile handling, and stage clean derivative files
          before transmission. Originals remain untouched on disk as an intended product invariant.
        </p>
        <div className="hero-ctas">
          <a href="/app/" className="btn-primary-pill">
            Open Mac App Study
          </a>
          <a href="#specs" className="btn-secondary-pill">
            View Technical Specs
          </a>
        </div>

        {/* Hero Optic Blade Workbench */}
        <div className="hero-workbench-container">
          <div className="hero-workbench-card">
            <div
              ref={stageRef}
              className="workbench-split-stage"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {/* Left / Source Layer */}
              <div className="workbench-img-layer layer-source">
                <img
                  src="/assets/vessel-landscape.png"
                  alt="Untouched high-resolution mountain lake source asset in Display P3 gamut"
                />
              </div>

              {/* Right / Derivative Layer with clip-path or width */}
              <div
                className="layer-derivative"
                style={{ width: `${100 - activeSplit}%` }}
                aria-hidden={activeSplit >= 100}
              >
                <img
                  src="/assets/vessel-landscape.png"
                  alt="Clean derivative preview with converted sRGB gamut and stripped metadata"
                />
              </div>

              {/* Overlaid Source Telemetry */}
              {activeSplit > 15 && (
                <div className="workbench-telemetry-left" aria-label="Source asset metrics">
                  <span className="telemetry-pill telemetry-pill-dark">SOURCE: SAMPLE ASSET (UNTOUCHED)</span>
                  <span className="telemetry-pill telemetry-pill-dark">2560 × 1600 PX</span>
                  <span className="telemetry-pill telemetry-pill-dark">8.4 MB (SIMULATED)</span>
                  <span className="telemetry-pill telemetry-pill-dark">COLOR: DISPLAY P3</span>
                  <span className="telemetry-pill telemetry-pill-amber">12 SAMPLE METADATA TAGS</span>
                </div>
              )}

              {/* Overlaid Derivative Telemetry */}
              {activeSplit < 85 && (
                <div className="workbench-telemetry-right" aria-label="Derivative asset metrics">
                  <span className="telemetry-pill telemetry-pill-emerald">DERIVATIVE PREVIEW (SIMULATED)</span>
                  <span className="telemetry-pill telemetry-pill-emerald">EST. 1.2 MB (~85% REDUCTION)</span>
                  <span className="telemetry-pill telemetry-pill-emerald">COLOR: sRGB IEC61966 SIMULATION</span>
                  <span className="telemetry-pill telemetry-pill-emerald">METADATA: PURGED IN DERIVATIVE</span>
                </div>
              )}

              {/* Optic Blade Slider Handle */}
              <div
                className="optic-blade-divider"
                style={{ left: `${activeSplit}%` }}
                role="slider"
                tabIndex={0}
                aria-label="Optic Blade split comparison"
                aria-valuenow={Math.round(activeSplit)}
                aria-valuemin={0}
                aria-valuemax={100}
                onKeyDown={handleKeyDown}
              >
                <div className="optic-blade-handle">
                  <div className="optic-reticle-circle" title="Drag to compare P3 source with sRGB derivative">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="9" />
                      <line x1="12" y1="3" x2="12" y2="21" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                    </svg>
                  </div>
                  <span className="optic-gamut-pill">P3 → sRGB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile segmented controls to guarantee legibility on narrow viewports */}
          <div className="workbench-mode-tabs" role="group" aria-label="Workbench view mode">
            <button
              type="button"
              aria-pressed={mobileMode === 'blade'}
              className="workbench-tab-btn"
              onClick={() => setMobileMode('blade')}
            >
              Optic Blade Split
            </button>
            <button
              type="button"
              aria-pressed={mobileMode === 'source'}
              className="workbench-tab-btn"
              onClick={() => setMobileMode('source')}
            >
              Source Only (P3)
            </button>
            <button
              type="button"
              aria-pressed={mobileMode === 'derivative'}
              className="workbench-tab-btn"
              onClick={() => setMobileMode('derivative')}
            >
              Derivative Only (sRGB)
            </button>
          </div>
        </div>
      </section>

      {/* Section Divider 01 */}
      <div className="section-spine-marker">
        <div className="spine-tick" />
        <span className="spine-label">01 / Direct Metadata Audit</span>
      </div>

      {/* Section 01: Direct Metadata Audit */}
      <section id="inspect" className="content-section" aria-labelledby="inspect-title">
        <div className="section-header-block">
          <h2 id="inspect-title" className="section-title">
            Inspect every chunk before transmission.
          </h2>
          <p className="section-description">
            Vessel's product concept models surfacing embedded metadata chunks in local working memory.
            Inspect camera settings, hardware identifiers, and GPS coordinates before any image leaves your Mac.
          </p>
          <p className="section-description" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Note: All metadata values, tags, coordinates, and hostnames shown below are fictional sample data for this frontend visual study.
          </p>
        </div>

        <div className="audit-grid">
          {/* EXIF Optics Card */}
          <article className="audit-category-card">
            <div className="audit-category-header">
              <h3 className="audit-category-title">Camera & Exposure</h3>
              <span className="audit-category-status status-stripped">Stripped on Export</span>
            </div>
            <div className="audit-tag-list">
              <div className="audit-tag-row">
                <span className="tag-name">Camera Body</span>
                <span className="tag-value">Sony Alpha 7R V</span>
              </div>
              <div className="audit-tag-row">
                <span className="tag-name">Lens Spec</span>
                <span className="tag-value">FE 24-70mm F2.8 GM II</span>
              </div>
              <div className="audit-tag-row">
                <span className="tag-name">Focal Length</span>
                <span className="tag-value">48 mm (35mm equiv)</span>
              </div>
              <div className="audit-tag-row">
                <span className="tag-name">Aperture / Shutter</span>
                <span className="tag-value">f/8.0 · 1/250 sec</span>
              </div>
              <div className="audit-tag-row">
                <span className="tag-name">ISO Sensitivity</span>
                <span className="tag-value">ISO 100</span>
              </div>
            </div>
          </article>

          {/* Geotag Card */}
          <article className="audit-category-card">
            <div className="audit-category-header">
              <h3 className="audit-category-title">Geotag & Location</h3>
              <span className="audit-category-status status-stripped">Stripped on Export</span>
            </div>
            <div className="audit-tag-list">
              <div className="audit-tag-row">
                <span className="tag-name">GPS Latitude</span>
                <span className="tag-value">37.7749° N</span>
              </div>
              <div className="audit-tag-row">
                <span className="tag-name">GPS Longitude</span>
                <span className="tag-value">122.4194° W</span>
              </div>
              <div className="audit-tag-row">
                <span className="tag-name">Altitude</span>
                <span className="tag-value">18.2 m Above Sea Level</span>
              </div>
              <div className="audit-tag-row">
                <span className="tag-name">Satellites</span>
                <span className="tag-value">9 Locks Recorded</span>
              </div>
              <div className="audit-tag-row">
                <span className="tag-name">Time Ref (UTC)</span>
                <span className="tag-value">2026:09:20 14:22:04</span>
              </div>
            </div>
          </article>

          {/* Device & Creation Card */}
          <article className="audit-category-card">
            <div className="audit-category-header">
              <h3 className="audit-category-title">Host & Software</h3>
              <span className="audit-category-status status-stripped">Stripped on Export</span>
            </div>
            <div className="audit-tag-list">
              <div className="audit-tag-row">
                <span className="tag-name">Host Hardware</span>
                <span className="tag-value">Mac Studio (M2 Max)</span>
              </div>
              <div className="audit-tag-row">
                <span className="tag-name">Host Name</span>
                <span className="tag-value">sample-workstation.local</span>
              </div>
              <div className="audit-tag-row">
                <span className="tag-name">Software Signature</span>
                <span className="tag-value">Screen Export 15.4</span>
              </div>
              <div className="audit-tag-row">
                <span className="tag-name">User ID / Creator</span>
                <span className="tag-value">501 (Admin)</span>
              </div>
              <div className="audit-tag-row">
                <span className="tag-name">Original Date</span>
                <span className="tag-value">2026-09-20 22:05:11</span>
              </div>
            </div>
          </article>

          {/* Color & Bitstream Card */}
          <article className="audit-category-card">
            <div className="audit-category-header">
              <h3 className="audit-category-title">Color Space & Canvas</h3>
              <span className="audit-category-status status-verified">Converted to sRGB</span>
            </div>
            <div className="audit-tag-list">
              <div className="audit-tag-row">
                <span className="tag-name">Source Profile</span>
                <span className="tag-value">Display P3 (Wide Gamut)</span>
              </div>
              <div className="audit-tag-row">
                <span className="tag-name">Embedded ICC</span>
                <span className="tag-value">3,144 bytes</span>
              </div>
              <div className="audit-tag-row">
                <span className="tag-name">Pixel Dimensions</span>
                <span className="tag-value">2560 × 1600 px (16:10)</span>
              </div>
              <div className="audit-tag-row">
                <span className="tag-name">Color Depth</span>
                <span className="tag-value">8-bit per channel (RGB)</span>
              </div>
              <div className="audit-tag-row">
                <span className="tag-name">Alpha Channel</span>
                <span className="tag-value">None (Opaque)</span>
              </div>
            </div>
          </article>
        </div>

        {/* Truthful Unknown / Unsupported Treatment Note */}
        <div className="audit-rule-callout">
          <h4 className="audit-rule-title">Explicit Handling of Unknown or Corrupted Chunks</h4>
          <p className="audit-rule-text">
            The intended design never guesses or silently interpolates malformed bytes. Proprietary MakerNotes
            (such as unparsed binary blocks) are flagged to be purged. Corrupted metadata triggers an explicit warning,
            and single-page PDF preflight targets stream inspection without destructive rasterization.
          </p>
        </div>
      </section>

      {/* Section Divider 02 */}
      <div className="section-spine-marker">
        <div className="spine-tick" />
        <span className="spine-label">02 / Color Gamut Integrity</span>
      </div>

      {/* Section 02: Color Gamut Comparison */}
      <section id="profiles" className="content-section" aria-labelledby="profiles-title">
        <div className="section-header-block">
          <h2 id="profiles-title" className="section-title">
            Stop wide-gamut clipping before it happens.
          </h2>
          <p className="section-description">
            Modern Mac displays capture in wide Display P3. When shared across unmanaged web platforms or chat viewers,
            out-of-gamut tones can clip or shift unpredictably.
          </p>
        </div>

        <div className="gamut-comparison-layout">
          <div className="gamut-spec-panel">
            <div className="gamut-spec-item">
              <h3 className="gamut-spec-title">
                <span style={{ color: '#d97706' }}>●</span> Display P3 (Wide Gamut)
              </h3>
              <p className="gamut-spec-body">
                Covers roughly 25% larger color volume than sRGB, particularly in vivid greens and sunset reds.
                Ideal for master authoring, but can cause unpredictable appearance on unmanaged consumer displays.
              </p>
            </div>

            <div className="gamut-spec-item">
              <h3 className="gamut-spec-title">
                <span style={{ color: '#059669' }}>●</span> sRGB IEC61966-2.1 (Target Intent)
              </h3>
              <p className="gamut-spec-body">
                The universal web and messaging standard. Vessel's target concept specifies perceptual matrix conversion
                so derivative files render reliably across consumer screens.
              </p>
            </div>

            <div className="gamut-spec-item">
              <h3 className="gamut-spec-title">
                <span style={{ color: '#8e8e93' }}>●</span> Untagged Fallback Prevention
              </h3>
              <p className="gamut-spec-body">
                Stripping ICC profiles without converting to sRGB produces washed-out images. The target pipeline intends to
                convert pixel values to standard sRGB space rather than simply stripping tags.
              </p>
            </div>
          </div>

          <div className="gamut-interactive-card">
            <img
              src="/assets/vessel-landscape.png"
              alt="Gamut comparison study simulation on mountain lake landscape"
              className="gamut-visual-img"
              style={{
                filter: gamutDemo === 'p3' ? 'none' : gamutDemo === 'srgb' ? 'saturate(0.95) contrast(1.02)' : 'saturate(0.8) brightness(1.04)',
              }}
            />
            <div className="gamut-controls-bar">
              <button
                type="button"
                className="gamut-btn"
                aria-pressed={gamutDemo === 'p3'}
                onClick={() => setGamutDemo('p3')}
              >
                Display P3 (Sample Source)
              </button>
              <button
                type="button"
                className="gamut-btn"
                aria-pressed={gamutDemo === 'srgb'}
                onClick={() => setGamutDemo('srgb')}
              >
                sRGB Converted (CSS Simulation)
              </button>
              <button
                type="button"
                className="gamut-btn"
                aria-pressed={gamutDemo === 'untagged'}
                onClick={() => setGamutDemo('untagged')}
              >
                Untagged Simulation (Clipped)
              </button>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.75rem 0 0', textAlign: 'center' }}>
              Visual simulation only: CSS preview filters demonstrate perceived gamut shifts and do not constitute native color-management or ICC profile conversion proof.
            </p>
          </div>
        </div>
      </section>

      {/* Section Divider 03 */}
      <div className="section-spine-marker">
        <div className="spine-tick" />
        <span className="spine-label">03 / Protected Source Invariant</span>
      </div>

      {/* Section 03: The Derivative Recipe & Protected Source Invariant */}
      <section id="architecture" className="content-section" aria-labelledby="arch-title">
        <div className="section-header-block">
          <h2 id="arch-title" className="section-title">
            The 3-step derivative recipe concept.
          </h2>
          <p className="section-description">
            Vessel proposes three explicit transformations in temporary working memory while keeping the source asset strictly untouched.
          </p>
        </div>

        <div className="recipe-cards-grid">
          <article className="recipe-step-card">
            <span className="recipe-step-num">RECIPE STEP 01</span>
            <h3 className="recipe-step-title">Strip EXIF &amp; Location Tags</h3>
            <p className="recipe-step-detail">
              Intended to purge IFD0, ExifIFD, GPSIFD, and InteropIFD blocks. Targets eliminating camera serials,
              geolocation tags, exposure timestamps, and local computer identifiers.
            </p>
          </article>

          <article className="recipe-step-card">
            <span className="recipe-step-num">RECIPE STEP 02</span>
            <h3 className="recipe-step-title">Convert Gamut to sRGB</h3>
            <p className="recipe-step-detail">
              Intended to map wide gamut Display P3 or Adobe RGB pixel values to standard sRGB IEC61966-2.1.
              Helps avoid oversaturation on unmanaged monitors and clipping in chat clients.
            </p>
          </article>

          <article className="recipe-step-card">
            <span className="recipe-step-num">RECIPE STEP 03</span>
            <h3 className="recipe-step-title">Optimize Delivery Copy</h3>
            <p className="recipe-step-detail">
              Proposes lossless delivery recompression with optimal filter selection to reduce byte payload
              while retaining image fidelity. Estimated reductions vary by asset content.
            </p>
          </article>
        </div>

        <div className="immutable-source-banner">
          <div>
            <h3 className="immutable-title">Original source preservation is a required design invariant.</h3>
            <p className="immutable-text">
              The Vessel architecture specifies strictly non-destructive handling. Source assets must never be overwritten,
              replaced, or mutated on disk. All proposed transforms target temporary memory buffers, materializing
              only a separate derivative when exported.
            </p>
          </div>
          <span className="immutable-code-badge">TARGET INVARIANT</span>
        </div>
      </section>

      {/* Section Divider 04 */}
      <div className="section-spine-marker">
        <div className="spine-tick" />
        <span className="spine-label">04 / Four-Step Lifecycle</span>
      </div>

      {/* Section 04: Four-Step Lifecycle */}
      <section id="lifecycle" className="content-section" aria-labelledby="lifecycle-title">
        <div className="section-header-block">
          <h2 id="lifecycle-title" className="section-title">
            Stage, inspect, choose, drag out.
          </h2>
          <p className="section-description">
            A focused preflight ritual designed for deliberate single-asset sharing. This study models the end-to-end interface flow.
          </p>
        </div>

        <div className="lifecycle-stepper">
          <div className="lifecycle-step">
            <span className="lifecycle-num">01 / STAGE</span>
            <h3 className="lifecycle-name">Drop Single Asset</h3>
            <p className="lifecycle-desc">
              Stage one PNG, JPEG, or single-page PDF onto Vessel’s compact deck, or press ⌥V from any app.
            </p>
          </div>

          <div className="lifecycle-step">
            <span className="lifecycle-num">02 / INSPECT</span>
            <h3 className="lifecycle-name">Inspect Telemetry</h3>
            <p className="lifecycle-desc">
              Inspect dimensions, estimated byte size, color space, and sample privacy tags in the Optic Blade viewport.
            </p>
          </div>

          <div className="lifecycle-step">
            <span className="lifecycle-num">03 / CHOOSE</span>
            <h3 className="lifecycle-name">Toggle Recipe</h3>
            <p className="lifecycle-desc">
              Select intended transformations: strip metadata, convert gamut to sRGB, and optimize delivery copy, previewing estimated outcomes.
            </p>
          </div>

          <div className="lifecycle-step">
            <span className="lifecycle-num">04 / DRAG OUT</span>
            <h3 className="lifecycle-name">Drag to Destination</h3>
            <p className="lifecycle-desc">
              Target export gesture: drag the clean derivative directly into Slack, Mail, Messages, Finder, or browser dropzones.
            </p>
          </div>
        </div>
      </section>

      {/* Section Divider 05 */}
      <div className="section-spine-marker">
        <div className="spine-tick" />
        <span className="spine-label">05 / Local Specifications &amp; Status</span>
      </div>

      {/* Section 05: Specs & Format Scope */}
      <section id="specs" className="content-section" aria-labelledby="specs-title">
        <div className="section-header-block">
          <h2 id="specs-title" className="section-title">
            Local-first architecture and evidence status.
          </h2>
          <p className="section-description">
            Vessel is designed as a local-first preflight concept. The table below outlines the intended product boundary,
            what this frontend study demonstrates, and what remains to be proven in a native implementation.
          </p>
        </div>

        <div className="specs-table-wrapper">
          <table className="specs-table">
            <thead>
              <tr>
                <th>Dimension</th>
                <th>Intended Product Boundary</th>
                <th>Current Study Evidence &amp; Native Proof Remaining</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="specs-prop-name">Network &amp; Telemetry</td>
                <td><strong>Local-First Target</strong></td>
                <td>Current study operates entirely client-side without network requests. Native implementation must prove sandboxed local-only runtime with zero telemetry and zero network entitlements.</td>
              </tr>
              <tr>
                <td className="specs-prop-name">Initial Target Formats</td>
                <td><code>PNG</code>, <code>JPEG</code>, <code>Single-page PDF</code></td>
                <td>Concept models preflight for these three target formats using sample assets. Actual native format parsing and PDF stream inspection are not yet implemented.</td>
              </tr>
              <tr>
                <td className="specs-prop-name">Explicitly Out of Scope</td>
                <td><code>RAW</code>, <code>Animated GIF/APNG</code>, <code>Multi-page PDF</code>, <code>Batch Processing</code></td>
                <td>Explicitly excluded from initial product scope. The UI demonstrates graceful rejection for unsupported files; batch workflows and multi-page reflow are intentionally unsupported.</td>
              </tr>
              <tr>
                <td className="specs-prop-name">Source File Handling</td>
                <td><strong>Protected Source Invariant</strong></td>
                <td>Demonstrated as an interface contract. Native implementation must enforce non-destructive read-only access so original files are never overwritten or modified.</td>
              </tr>
              <tr>
                <td className="specs-prop-name">Derivative Pipeline &amp; Export</td>
                <td><strong>Ephemeral Generation &amp; Drag-Out</strong></td>
                <td>Simulated UI controls and dynamic metric estimations. Native implementation must still prove actual image processing, memory-buffer lifecycle, and OS drag-promise delivery.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section Divider 06 */}
      <div className="section-spine-marker">
        <div className="spine-tick" />
        <span className="spine-label">06 / Honest Limitations</span>
      </div>

      {/* Section 06: Honest Limitations & FAQ */}
      <section id="faq" className="content-section" aria-labelledby="faq-title">
        <div className="section-header-block">
          <h2 id="faq-title" className="section-title">
            Honest boundaries. No false claims.
          </h2>
          <p className="section-description">
            Vessel solves deliberate preflight for outgoing assets. We explicitly do not claim universal safety, universal formats, or magical AI redaction.
          </p>
        </div>

        <div className="faq-grid">
          <div className="faq-item">
            <h3 className="faq-question">Does Vessel redact faces or credit card numbers in image pixels?</h3>
            <p className="faq-answer">
              No. Vessel is conceived to inspect and strip file metadata chunks (EXIF, GPS, device identifiers) and convert color profiles.
              It does not run optical character recognition (OCR) or computer-vision pixel blurring. Visual redaction of pixel content must be performed before staging.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="faq-question">Is Vessel a batch-processing utility for 1,000 files?</h3>
            <p className="faq-answer">
              No. Vessel is deliberately focused on a single-asset airlock workflow. It is designed for the moment you are about
              to share an asset to a client, public channel, or third-party, giving you deliberate visual inspection.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="faq-question">What happens if an asset contains malformed or unverified metadata?</h3>
            <p className="faq-answer">
              The concept isolates unverified or proprietary chunks rather than attempting repair or silent interpolation.
              Users can choose to purge unverified chunks during derivative generation.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="faq-question">How does derivative drag-out work in this study versus a native app?</h3>
            <p className="faq-answer">
              In this web study, drag-out is a visual simulation with non-destructive feedback; no file is exported.
              In a native macOS build, the concept relies on OS pasteboard drag promises where the derivative writes directly
              to the destination upon drop.
            </p>
          </div>
        </div>
      </section>

      {/* Final Action Section */}
      <section className="final-cta-card">
        <h2 className="final-cta-title">Explore the macOS Study</h2>
        <p className="final-cta-desc">
          Test the interactive 680×440 macOS application interface study with live recipe toggles,
          keyboard Optic Blade navigation, and six simulated operational states.
        </p>
        <div className="final-cta-buttons">
          <a href="/app/" className="btn-primary-pill">
            Launch App Interface Study →
          </a>
          <a href="/review/" className="btn-secondary-pill">
            Visual Direction Review &amp; Provenance
          </a>
          <a href="/" className="btn-secondary-pill">
            Lab Launchpad
          </a>
        </div>
      </section>

      {/* Site Footer */}
      <footer className="site-footer" role="contentinfo">
        <div>
          <strong>Vessel Visual Lab</strong> · Standalone Frontend Study · v0.1-alpha
        </div>
        <nav className="footer-nav" aria-label="Footer links">
          <a href="/website/">Website Study</a>
          <a href="/app/">App Study</a>
          <a href="/review/">Review Evidence</a>
          <a href="/">Launchpad</a>
        </nav>
      </footer>

      {/* Search Palette Modal */}
      {searchOpen && (
        <div
          className="search-modal-backdrop"
          onClick={() => setSearchOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Quick search navigation"
        >
          <div className="search-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="search-modal-header">
              <input
                id="site-search-input"
                type="text"
                className="search-modal-input"
                placeholder="Search specs, audit, color profiles, or architecture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                aria-label="Search sections, specs, and study topics"
              />
            </div>
            <div className="search-modal-results">
              {filteredSearch.map((item) => (
                <a
                  key={item.id}
                  href={item.section}
                  className="search-result-item"
                  onClick={() => setSearchOpen(false)}
                >
                  <span>{item.title}</span>
                  <span className="brand-badge">{item.category}</span>
                </a>
              ))}
              {filteredSearch.length === 0 && (
                <div style={{ padding: '1rem', color: '#888', textAlign: 'center', fontSize: '0.85rem' }}>
                  No matching sections found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export { WebsiteApp }
