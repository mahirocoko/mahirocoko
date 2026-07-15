import { useSectionIntro } from '../hooks/use-section-intro'

export const SiteFooter = () => {
  const footerRef = useSectionIntro<HTMLElement>()

  return (
    <footer className="site-footer" ref={footerRef}>
      <div className="policy-band" id="policies" aria-label="Prototype policies" data-motion-rule data-motion-group>
        <div data-motion-item><span>01</span><strong>Fitting</strong><p>Concept sizing guide for 18–42 mm desk edges.</p></div>
        <div data-motion-item><span>02</span><strong>Returns</strong><p>Prototype policy: 30-day evaluation window.</p></div>
        <div data-motion-item><span>03</span><strong>Service</strong><p>Concept modules are designed to detach and be serviced.</p></div>
        <div data-motion-item><span>04</span><strong>Warranty</strong><p>Prototype policy: two-year limited coverage.</p></div>
      </div>
      <div className="footer-main" data-motion-group>
        <div data-motion-item><a className="footer-mark" href="#top">DOVEL</a><p>Objects that click into focus.</p></div>
        <div className="footer-links">
          <div data-motion-item><strong>Objects</strong><a href="#shop">Shop all</a><a href="#system">Build a system</a><a href="#materials">Materials</a></div>
          <div data-motion-item><strong>Information</strong><a href="#journal">Journal</a><a href="#policies">Prototype policies</a><a href="mailto:studio@example.invalid">Concept contact</a></div>
        </div>
      </div>
      <div className="footer-bottom" data-motion-group data-motion-group-start="bottom"><span data-motion-item>Fictional commerce concept · Not a live store</span><span data-motion-item>Working name — clearance not established</span><a href="#top" data-motion-item>Back to top ↑</a></div>
    </footer>
  )
}
