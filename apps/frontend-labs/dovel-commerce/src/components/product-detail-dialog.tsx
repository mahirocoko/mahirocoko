import { useRef } from 'react'
import { FINISHES, formatMoney } from '../data'
import { useModalFocus } from '../hooks/use-modal-focus'
import type { Finish, Product } from '../types'
import { ArrowIcon, CloseIcon } from './icons'
import { ProductImage } from './product-image'

interface ProductDetailDialogProps {
  product: Product | null
  finish: Finish
  transitionActive: boolean
  onFinishChange: (finish: Finish) => void
  onClose: () => void
  onAdd: (product: Product, finish: Finish) => void
}

export const ProductDetailDialog = ({ product, finish, transitionActive, onFinishChange, onClose, onAdd }: ProductDetailDialogProps) => {
  const panelRef = useRef<HTMLDivElement>(null)
  const open = product !== null

  useModalFocus(open, panelRef, onClose)

  if (!product) return null

  return (
    <div className="modal-layer product-detail-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="product-detail-dialog" role="dialog" aria-modal="true" aria-labelledby="product-detail-title" ref={panelRef}>
        <button data-autofocus type="button" className="icon-button product-detail-close" aria-label="Close product details" onClick={onClose}>
          <CloseIcon />
        </button>
        <div className="product-detail-media">
          <ProductImage
            src={product.image}
            alt={`${product.name} studio render`}
            kind={product.id}
            viewTransitionName={transitionActive ? `product-${product.id}` : undefined}
          />
          <span>{product.eyebrow}</span>
        </div>
        <div className="product-detail-copy">
          <p className="overline">System 01 object · {product.id}</p>
          <h2 id="product-detail-title">{product.name}</h2>
          <p className="product-detail-description">{product.description}</p>
          <fieldset className="product-detail-finishes">
            <legend>Order finish</legend>
            {FINISHES.map((option) => (
              <label key={option.id}>
                <input type="radio" name="detail-finish" checked={finish === option.id} onChange={() => onFinishChange(option.id)} />
                <i className={`finish-swatch finish-swatch--${option.id}`} />
                <span><strong>{option.label}</strong><small>{option.note}</small></span>
              </label>
            ))}
          </fieldset>
          <p className="product-detail-finish-note">Studio render shown in warm silver. Your selected finish applies to the concept order.</p>
          <div className="product-detail-action">
            <div><small>Concept price</small><strong>{formatMoney(product.price)}</strong></div>
            <button type="button" onClick={() => onAdd(product, finish)}>Add to bag <ArrowIcon /></button>
          </div>
          <dl className="product-detail-specs">
            <div><dt>Dimensions</dt><dd>{product.dimension}</dd></div>
            <div><dt>Compatibility</dt><dd>{product.compatibility}</dd></div>
          </dl>
          <ul className="product-detail-features">
            {product.features.map((feature) => <li key={feature}>{feature}</li>)}
          </ul>
          <p className="product-detail-policy">Fictional concept object. No payment, manufacturing claim, or delivery promise.</p>
        </div>
      </div>
    </div>
  )
}
