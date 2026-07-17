import { PRODUCTS } from '../data'
import { ProductImage } from './product-image'

export const SystemHero = () => (
  <div
    className="system-hero"
    role="img"
    aria-label="DOVEL Arc Dock, Halo Light, and Pocket Tray presented as one modular desk system"
  >
    {PRODUCTS.map((product, index) => (
      <div className={`system-hero__product system-hero__product--${product.id}`} key={product.id}>
        <ProductImage src={product.image} alt="" kind={product.id} />
        <span>0{index + 1} / {product.name}</span>
      </div>
    ))}
    <div className="system-hero__rail" aria-hidden="true"><i /><i /><i /></div>
    <p>One rail · three shared attachment feet</p>
  </div>
)
