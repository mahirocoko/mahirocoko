import { useEffect, useRef, useState } from 'react'
import { BagIcon, MenuIcon, SearchIcon } from './icons'

interface SiteHeaderProps {
  itemCount: number
  onOpenSearch: () => void
  onOpenCart: () => void
}

export const SiteHeader = ({ itemCount, onOpenSearch, onOpenCart }: SiteHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    if (!menuOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  return (
    <>
      <div className="announcement">Concept store · Prototype policies apply</div>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="DOVEL home">DOVEL</a>
        <nav className={menuOpen ? 'is-open' : ''} aria-label="Primary navigation">
          <a href="#shop" onClick={closeMenu}>Shop</a>
          <a href="#system" onClick={closeMenu}>System</a>
          <a href="#journal" onClick={closeMenu}>Journal</a>
        </nav>
        <div className="header-actions">
          <button type="button" className="icon-button search-button" aria-label="Search" onClick={onOpenSearch}>
            <SearchIcon /><span>Search</span>
          </button>
          <button type="button" className="bag-button" aria-label={`Bag, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`} onClick={onOpenCart}>
            <BagIcon /><span>Bag</span><b aria-hidden="true">{itemCount}</b>
          </button>
          <button
            ref={menuButtonRef}
            type="button"
            className="icon-button menu-button"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <MenuIcon />
          </button>
        </div>
      </header>
    </>
  )
}
