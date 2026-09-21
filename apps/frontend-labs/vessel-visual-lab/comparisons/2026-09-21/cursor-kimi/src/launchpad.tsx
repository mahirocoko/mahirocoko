import './launchpad.css'

interface ISurfaceLink {
  href: string
  title: string
  description: string
  meta: string
}

const SURFACES: ISurfaceLink[] = [
  {
    href: '/website/',
    title: 'Product website',
    description:
      'The editorial marketing surface: what Vessel is, what it inspects, and the boundaries it keeps.',
    meta: 'Off-white · editorial · responsive',
  },
  {
    href: '/app/',
    title: 'App study',
    description:
      'The compact desktop instrument: source facts, derivative recipe, Optic Blade, and honest states.',
    meta: 'Deep ebonite · 680 × 440 window · interactive',
  },
]

export const Launchpad = () => {
  return (
    <main className="launchpad">
      <div className="launchpad__inner">
        <p className="launchpad__mark">Vessel</p>
        <h1 className="launchpad__title">Visual study surfaces</h1>
        <p className="launchpad__lede">
          A local-first preflight concept for PNG, JPEG, and single-page PDF — presented as two
          frontend studies. All file facts are fictional samples; nothing here parses, creates, or
          exports a real file.
        </p>

        <nav className="launchpad__nav" aria-label="Study surfaces">
          <ul className="launchpad__list">
            {SURFACES.map((surface) => (
              <li className="launchpad__item" key={surface.href}>
                <a className="launchpad__link" href={surface.href}>
                  <span className="launchpad__link-title">{surface.title}</span>
                  <span className="launchpad__link-desc">{surface.description}</span>
                  <span className="launchpad__link-meta">{surface.meta}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="launchpad__note">Frontend visual study — no production build exists.</p>
      </div>
    </main>
  )
}
