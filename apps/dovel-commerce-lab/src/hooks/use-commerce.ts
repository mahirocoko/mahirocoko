import { useMemo, useState } from 'react'
import type { CartItem, Finish, Product, SystemConfiguration } from '../types'
import { PRODUCTS, RAILS } from '../data'

const finishLabel = (finish: Finish) => finish === 'graphite' ? 'Graphite' : 'Warm silver'

export const configurationPrice = (configuration: SystemConfiguration) => {
  const railPrice = RAILS.find((rail) => rail.size === configuration.railSize)?.price ?? 0
  const modulePrice = configuration.modules.reduce((total, moduleId) => {
    return total + (PRODUCTS.find((product) => product.id === moduleId)?.price ?? 0)
  }, 0)
  return railPrice + modulePrice
}

export const useCommerce = () => {
  const [cart, setCart] = useState<CartItem[]>([])

  const addProduct = (product: Product, finish: Finish) => {
    const key = `${product.id}-${finish}`
    setCart((current) => {
      const existing = current.find((item) => item.key === key)
      if (existing) {
        return current.map((item) => item.key === key ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...current, {
        key,
        name: product.name,
        detail: finishLabel(finish),
        price: product.price,
        quantity: 1,
        image: product.image,
      }]
    })
  }

  const addConfiguration = (configuration: SystemConfiguration) => {
    const moduleNames = configuration.modules
      .map((moduleId) => PRODUCTS.find((product) => product.id === moduleId)?.name)
      .filter(Boolean)
      .join(' + ')
    const key = `system-${configuration.railSize}-${configuration.finish}-${configuration.modules.join('-')}`
    setCart((current) => {
      const existing = current.find((item) => item.key === key)
      if (existing) {
        return current.map((item) => item.key === key ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...current, {
        key,
        name: `System 01 · ${configuration.railSize} cm`,
        detail: `${finishLabel(configuration.finish)} · ${moduleNames || 'Rail only'}`,
        price: configurationPrice(configuration),
        quantity: 1,
        image: undefined,
      }]
    })
  }

  const setQuantity = (key: string, quantity: number) => {
    if (quantity < 1) return
    setCart((current) => current.map((item) => item.key === key ? { ...item, quantity } : item))
  }

  const removeItem = (key: string) => {
    setCart((current) => current.filter((item) => item.key !== key))
  }

  const itemCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart])
  const subtotal = useMemo(() => cart.reduce((total, item) => total + item.price * item.quantity, 0), [cart])

  return { cart, itemCount, subtotal, addProduct, addConfiguration, setQuantity, removeItem }
}
