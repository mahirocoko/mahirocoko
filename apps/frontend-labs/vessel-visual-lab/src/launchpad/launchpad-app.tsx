import './launchpad-styles.css'

interface ILaunchpadAppProps {
  title?: string
}

const LaunchpadApp = ({ title = 'Vessel Visual Lab' }: ILaunchpadAppProps) => {
  return (
    <div className="launchpad-shell">
      <header className="launchpad-header" role="banner">
        <div className="launchpad-brand-row">
          <span className="lp-brand-name">Vessel</span>
          <span className="lp-version-tag">V0.1-ALPHA</span>
        </div>
        <h1 className="lp-headline">{title}</h1>
        <p className="lp-desc">
          Provisional local single-asset image &amp; PDF preflight concept.
          Two complete studies exploring product-marketing editorial and macOS interface anatomy,
          with strict border restraint and a protected source invariant.
        </p>
      </header>

      <main role="main">
        <div className="lp-studies-grid">
          {/* Destination 1: Website Study */}
          <a href="/website/" className="study-destination-card" aria-label="Open responsive website study">
            <span className="study-card-eyebrow">Study 01 · Product-Marketing</span>
            <h2 className="study-card-title">Responsive Website Study</h2>
            <p className="study-card-desc">
              Complete marketing story featuring the accepted Header + Hero anatomy, interactive Optic Blade
              before-and-after proof, direct metadata audit, color profile comparison, 3-step derivative recipe,
              and local privacy specifications.
            </p>
            <div className="study-card-action">
              <span>Open Website Study</span>
              <span aria-hidden="true">→</span>
            </div>
          </a>

          {/* Destination 2: macOS Application Study */}
          <a href="/app/" className="study-destination-card" aria-label="Open macOS application interface study">
            <span className="study-card-eyebrow">Study 02 · Native Instrument</span>
            <h2 className="study-card-title">macOS Application Study</h2>
            <p className="study-card-desc">
              Interactive desktop study shell centered on the 680×440 Mac preflight workbench.
              Includes 6 simulated operational states (Ready, Empty, Inspecting, Unsupported, Source Changed, Destination Error),
              live recipe metric calculations, and derivative export simulation.
            </p>
            <div className="study-card-action">
              <span>Open App Study</span>
              <span aria-hidden="true">→</span>
            </div>
          </a>

          {/* Destination 3: Visual Direction Review */}
          <a href="/review/" className="study-destination-card" aria-label="Open visual direction review page">
            <span className="study-card-eyebrow">Evidence · Review Gate</span>
            <h2 className="study-card-title">Visual Direction Review</h2>
            <p className="study-card-desc">
              Side-by-side Codex raw generations versus the less-borders reference correction pair,
              illustrating why micro-hierarchy through typography and spacing replaced heavy card outlines.
            </p>
            <div className="study-card-action">
              <span>Open Review Evidence</span>
              <span aria-hidden="true">↗</span>
            </div>
          </a>
        </div>

        {/* Tenets Section */}
        <section className="lp-tenets-section" aria-labelledby="tenets-title">
          <h2 id="tenets-title" className="lp-tenets-title">Protected Design &amp; Architectural Tenets</h2>
          <div className="lp-tenets-grid">
            <div className="lp-tenet-item">
              <h3 className="lp-tenet-head">Less Borders v2 Restraint</h3>
              <p className="lp-tenet-body">
                Micro-hierarchy governed through optical spacing, typography, tint, and opacity.
                Borders are reserved strictly for structural window boundaries and direct interactive controls.
              </p>
            </div>

            <div className="lp-tenet-item">
              <h3 className="lp-tenet-head">The Optic Blade</h3>
              <p className="lp-tenet-body">
                Shared visual signature delivering instant proof between source Display P3 wide-gamut captures
                and clean sRGB derivatives with stripped EXIF and GPS markers.
              </p>
            </div>

            <div className="lp-tenet-item">
              <h3 className="lp-tenet-head">Protected Source Invariant</h3>
              <p className="lp-tenet-body">
                Intended product architecture requiring source assets to remain untouched on disk.
                All derivative processing targets ephemeral memory buffers; non-destructive handling is a target invariant, not an established filesystem proof.
              </p>
            </div>

            <div className="lp-tenet-item">
              <h3 className="lp-tenet-head">Local-First Target</h3>
              <p className="lp-tenet-body">
                Target product contract specifying zero network calls and on-device processing.
                Current frontend studies operate locally without network access; native runtime sandboxing remains to be implemented.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="lp-footer" role="contentinfo">
        <div>Vessel Visual Lab · Standalone Frontend Package</div>
        <div>pnpm · React 19 · Vite 8 · TypeScript 6</div>
      </footer>
    </div>
  )
}

export { LaunchpadApp }
