import { ArrowUp, ExternalLink } from 'lucide-react'
import { BrandLockup } from './brand'

const SiteFooter = () => (
  <footer className="site-footer">
    <nav className="wf-footer-directory" aria-label="Footer navigation">
      <div><h3>Product</h3><ul><li><a href="#proof">Proof</a></li><li><a href="#modes">Modes</a></li><li><a href="#privacy">Privacy</a></li></ul></div>
      <div><h3>Company</h3><ul><li><a href="#notes">Field notes</a></li><li><a href="#access">Pricing</a></li><li><a href="#top">Back to top</a></li></ul></div>
      <div><h3>Legal</h3><ul><li><a href="https://www.voiceos.com/" target="_blank" rel="noreferrer">Reference study</a></li><li><span>Original assets</span></li><li><span>No runtime dependency</span></li></ul></div>
    </nav>
    <div className="wf-footer-mark" aria-label="Whisperfield">
      <span className="wf-footer-lockup-full"><BrandLockup /></span>
      <img className="wf-footer-lockup-compact" src="/assets/generated/whisperfield-mark.svg" alt="" />
    </div>
    <div className="wf-footer-bottom">
      <span>Copyright © 2026 Whisperfield frontend lab. Original assets.</span>
      <span className="wf-footer-utilities">
        <a href="https://www.voiceos.com/" target="_blank" rel="noreferrer" aria-label="Open VoiceOS reference"><ExternalLink aria-hidden="true" /></a>
        <a href="#top" aria-label="Back to top"><ArrowUp aria-hidden="true" /></a>
        <span className="wf-footer-locale">EN</span>
      </span>
    </div>
  </footer>
)

export { SiteFooter }
