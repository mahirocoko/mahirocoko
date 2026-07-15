import { useMemo, useRef, useState } from 'react'
import { PRODUCTS, formatMoney } from '../data'
import { useModalFocus } from '../hooks/use-modal-focus'
import type { Product } from '../types'
import { CloseIcon, SearchIcon } from './icons'

interface SearchDialogProps {
  open: boolean
  onClose: () => void
  onSelectProduct: (product: Product) => void
}

export const SearchDialog = ({ open, onClose, onSelectProduct }: SearchDialogProps) => {
  const [query, setQuery] = useState('')
  const panelRef = useRef<HTMLDivElement>(null)
  useModalFocus(open, panelRef, onClose)

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return PRODUCTS
    return PRODUCTS.filter((product) => `${product.name} ${product.description}`.toLowerCase().includes(normalized))
  }, [query])

  if (!open) return null

  return (
    <div className="modal-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-title" ref={panelRef}>
        <div className="dialog-heading">
          <div><span>Find an object</span><h2 id="search-title">Search DOVEL</h2></div>
          <button type="button" className="icon-button" aria-label="Close search" onClick={onClose}><CloseIcon /></button>
        </div>
        <label className="search-field">
          <SearchIcon />
          <input
            data-autofocus
            type="search"
            aria-label="Search products"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Dock, light, tray…"
          />
          <kbd aria-hidden="true">ESC</kbd>
        </label>
        <div className="search-results" aria-live="polite">
          <p>{results.length} {results.length === 1 ? 'object' : 'objects'}</p>
          <div className="search-results__list" key={query.trim().toLowerCase()}>
            {results.length ? results.map((product) => (
              <button key={product.id} type="button" onClick={() => onSelectProduct(product)}>
                <span><small>{product.eyebrow}</small><strong>{product.name}</strong></span>
                <span className="search-result-action"><b>{formatMoney(product.price)}</b><small>View details →</small></span>
              </button>
            )) : <div className="search-empty">No object matches “{query}”. Try dock, light, or tray.</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
