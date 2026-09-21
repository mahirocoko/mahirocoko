import { LANDSCAPE_ASSET, ROUTES } from './shared/paths'
import { SAMPLE_DISCLOSURE } from './shared/sample-asset'

export const Launchpad = () => {
  return (
    <div className="launchpad">
      <a className="skip-link" href="#launchpad-main">
        Skip to launchpad
      </a>
      <div className="launchpad__inner">
        <img
          className="launchpad__mark"
          src={LANDSCAPE_ASSET}
          alt="Alpine lake at sunrise used as Vessel’s shared Optic Blade sample."
        />
        <p className="launchpad__kicker">Frontend study · fictional samples</p>
        <main id="launchpad-main">
          <h1>Vessel</h1>
          <p className="launchpad__lede">
            A local single-asset preflight concept. Two surfaces, one shared landscape, no production
            download.
          </p>
          <nav aria-label="Study surfaces">
            <a href={ROUTES.website}>
              Product website
              <span>Off-white editorial story for the outgoing airlock.</span>
            </a>
            <a href={ROUTES.app}>
              Mac interface study
              <span>Compact ebonite workbench, 680×440 instrument.</span>
            </a>
          </nav>
        </main>
        <p className="launchpad__foot">{SAMPLE_DISCLOSURE}</p>
      </div>
    </div>
  )
}
