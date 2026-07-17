import { useRef } from 'react'
import type { CartItem } from '../types'
import { formatMoney } from '../data'
import { useModalFocus } from '../hooks/use-modal-focus'
import { CloseIcon, MinusIcon, PlusIcon } from './icons'
import { ProductImage } from './product-image'

interface CartDrawerProps {
  open: boolean
  items: CartItem[]
  subtotal: number
  onClose: () => void
  onSetQuantity: (key: string, quantity: number) => void
  onRemove: (key: string) => void
}

export const CartDrawer = ({ open, items, subtotal, onClose, onSetQuantity, onRemove }: CartDrawerProps) => {
  const panelRef = useRef<HTMLElement>(null)
  useModalFocus(open, panelRef, onClose)

  if (!open) return null

  return (
    <div className="drawer-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" ref={panelRef}>
        <div className="dialog-heading cart-heading">
          <div><span>Concept order</span><h2 id="cart-title">Your bag</h2></div>
          <button data-autofocus type="button" className="icon-button" aria-label="Close bag" onClick={onClose}><CloseIcon /></button>
        </div>
        {items.length === 0 ? (
          <div className="cart-empty">
            <span>0 objects</span>
            <h3>The rail is still clear.</h3>
            <p>Add a module or configure a complete system to begin a concept order.</p>
            <button type="button" className="text-button" onClick={onClose}>Continue exploring</button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <article className="cart-item" key={item.key}>
                  <ProductImage
                    src={item.image ?? ''}
                    alt=""
                    kind={item.key.startsWith('system-') ? 'system' : item.key.startsWith('halo') ? 'halo-light' : item.key.startsWith('pocket') ? 'pocket-tray' : 'arc-dock'}
                  />
                  <div className="cart-item__body">
                    <div><h3>{item.name}</h3><p>{item.detail}</p></div>
                    <strong>{formatMoney(item.price * item.quantity)}</strong>
                    <div className="quantity-control" aria-label={`Quantity for ${item.name}`}>
                      <button type="button" aria-label={`Decrease ${item.name}`} disabled={item.quantity === 1} onClick={() => onSetQuantity(item.key, item.quantity - 1)}><MinusIcon /></button>
                      <span>{item.quantity}</span>
                      <button type="button" aria-label={`Increase ${item.name}`} onClick={() => onSetQuantity(item.key, item.quantity + 1)}><PlusIcon /></button>
                    </div>
                    <button type="button" className="remove-button" onClick={() => onRemove(item.key)}>Remove</button>
                  </div>
                </article>
              ))}
            </div>
            <div className="cart-summary">
              <div><span>Subtotal</span><strong>{formatMoney(subtotal)}</strong></div>
              <p>Concept prices only. Tax, delivery, and payment are not implemented.</p>
              <button type="button" className="checkout-button" disabled>Concept checkout unavailable</button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
