import type { Finish, Product } from '../types'
import { formatMoney } from '../data'
import { ArrowIcon } from './icons'
import { ProductImage } from './product-image'

interface ProductCardProps {
  product: Product
  finish: Finish
  detailOpen: boolean
  transitionActive: boolean
  onAdd: (product: Product, finish: Finish) => void
  onOpen: (product: Product) => void
}

export const ProductCard = ({ product, finish, detailOpen, transitionActive, onAdd, onOpen }: ProductCardProps) => (
  <article className="product-card" id={product.id} data-motion-item>
    <button className="product-card__media" type="button" aria-label={`View ${product.name} details`} onClick={() => onOpen(product)}>
      <ProductImage
        src={product.image}
        alt={`${product.name} studio render`}
        kind={product.id}
        viewTransitionName={transitionActive && !detailOpen ? `product-${product.id}` : undefined}
      />
      <span>{product.eyebrow}</span>
    </button>
    <div className="product-card__body" id={`${product.id}-details`}>
      <div>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
      </div>
      <div className="product-card__meta">
        <span>{product.dimension}</span>
        <strong>{formatMoney(product.price)}</strong>
      </div>
      <button type="button" className="add-button" onClick={() => onAdd(product, finish)}>
        Add in {finish === 'graphite' ? 'graphite' : 'warm silver'} <ArrowIcon />
      </button>
      <button type="button" className="detail-button" onClick={() => onOpen(product)}>View object details</button>
    </div>
  </article>
)
