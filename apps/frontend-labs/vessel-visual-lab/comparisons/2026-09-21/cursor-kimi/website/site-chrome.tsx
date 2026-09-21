interface INavItem {
  href: string
  label: string
}

const NAV_ITEMS: INavItem[] = [
  { href: '#product', label: 'Product' },
  { href: '#workflow', label: 'Workflow' },
  { href: '#color', label: 'Color' },
  { href: '#privacy', label: 'Privacy' },
  { href: '#faq', label: 'FAQ' },
]

export const SiteHeader = () => {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="site-header__mark" href="/" aria-label="Vessel — back to launchpad">
          Vessel
        </a>
        <nav className="site-header__nav" aria-label="Sections">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="site-header__actions">
          <span className="site-header__pill">Local-first study</span>
          <a className="site-header__cta" href="/app/">
            Open app study
          </a>
        </div>
      </div>
    </header>
  )
}

export const SiteFooter = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__mark">Vessel</p>
        <p className="site-footer__line">
          A frontend visual and interaction study. No production download exists, and nothing here
          parses, creates, or exports a real file.
        </p>
        <nav className="site-footer__nav" aria-label="Footer">
          <a href="#product">Product</a>
          <a href="#workflow">Workflow</a>
          <a href="#color">Color</a>
          <a href="#privacy">Privacy</a>
          <a href="#faq">FAQ</a>
          <a href="/app/">App study</a>
        </nav>
      </div>
    </footer>
  )
}
