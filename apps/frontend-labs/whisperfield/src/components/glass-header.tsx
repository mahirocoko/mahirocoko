import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Download, Menu, X } from 'lucide-react'
import { NAV_ITEMS } from '../content'
import { HeaderBrand } from './brand'

const GlassHeader = () => {
  const [compact, setCompact] = useState(false)
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame: number | null = null
    const sync = () => {
      if (frame !== null) return
      frame = window.requestAnimationFrame(() => {
        frame = null
        setCompact(window.scrollY > 10)
      })
    }
    sync()
    window.addEventListener('scroll', sync, { passive: true })
    return () => {
      window.removeEventListener('scroll', sync)
      if (frame !== null) window.cancelAnimationFrame(frame)
    }
  }, [])

  const close = () => {
    setOpen(false)
    window.setTimeout(() => triggerRef.current?.focus(), 0)
  }

  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header className="wf-site-header">
      <div className="wf-site-header-frame">
        <div className={`wf-header-surface ${compact ? 'wf-glass-container is-compact' : ''}`}>
          {compact ? (
            <>
              <div className="wf-glass-filter" aria-hidden="true" />
              <svg className="wf-glass-definitions" aria-hidden="true">
                <defs>
                  <filter id="wf-nav-dist" x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="linearRGB">
                    <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves={2} seed={92} stitchTiles="stitch" result="noise" />
                    <feGaussianBlur in="noise" stdDeviation={2} result="blurred" />
                    <feDisplacementMap in="SourceGraphic" in2="blurred" scale={70} xChannelSelector="R" yChannelSelector="G" result="displacement" />
                  </filter>
                </defs>
              </svg>
              <div className="wf-glass-overlay" aria-hidden="true" />
              <div className="wf-glass-specular" aria-hidden="true" />
            </>
          ) : null}
          <div className={`wf-header-content ${compact ? 'wf-glass-content' : ''}`}>
            <a className="wf-header-brand-link" href="#top" aria-label="Whisperfield, back to top"><HeaderBrand compact={compact} /></a>
            <div className="wf-desktop-header-actions">
              <nav className="wf-desktop-nav" aria-label="Primary navigation">
                {NAV_ITEMS.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
              </nav>
              <a className="wf-header-download" href="/downloads/whisperfield-preview-pack.zip" download>
                <Download aria-hidden="true" /><span>Preview pack</span>
              </a>
            </div>
            <button
              ref={triggerRef}
              className="wf-menu-button"
              type="button"
              aria-label={open ? 'Close navigation' : 'Open navigation'}
              aria-expanded={open}
              aria-controls="wf-mobile-navigation"
              onClick={() => open ? close() : setOpen(true)}
            >
              {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <div id="wf-mobile-navigation" ref={panelRef} className="wf-mobile-nav" role="region" aria-label="Mobile navigation">
          <nav aria-label="Mobile primary navigation">
            {NAV_ITEMS.map((item, index) => (
              <a key={item.href} href={item.href} onClick={close}>
                <span>0{index + 1}</span>{item.label}<ArrowRight aria-hidden="true" />
              </a>
            ))}
          </nav>
          <a className="wf-mobile-nav-cta" href="/downloads/whisperfield-preview-pack.zip" download onClick={close}>Download preview pack</a>
          <p>Fictional product preview · no installer or account</p>
        </div>
      ) : null}
    </header>
  )
}

export { GlassHeader }
