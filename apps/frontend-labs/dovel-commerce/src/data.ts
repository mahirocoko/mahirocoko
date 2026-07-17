import type { Finish, Product, RailSize } from './types'

export const PRODUCTS: Product[] = [
  {
    id: 'arc-dock',
    name: 'Arc Dock',
    eyebrow: 'Rest + charge',
    description: 'An angled landing place that keeps one screen visible without letting it take over the desk.',
    price: 119,
    image: '/assets/products/arc-dock.webp',
    dimension: '92 × 74 × 118 mm',
    features: ['15° resting angle', 'Weighted aluminum body', 'Shared rail attachment foot'],
    compatibility: 'System 01 rail · all spans',
  },
  {
    id: 'halo-light',
    name: 'Halo Light',
    eyebrow: 'Task light',
    description: 'A narrow, low-glare blade that turns with the work and leaves the rest of the room alone.',
    price: 189,
    image: '/assets/products/halo-light.webp',
    dimension: '420 × 32 × 520 mm',
    features: ['Rotating light blade', 'Low-glare warm task light', 'Mechanical angle ring'],
    compatibility: 'System 01 rail · all spans',
  },
  {
    id: 'pocket-tray',
    name: 'Pocket Tray',
    eyebrow: 'Catch + keep',
    description: 'Pale ash nested in graphite aluminum for the small objects that otherwise drift across a desk.',
    price: 89,
    image: '/assets/products/pocket-tray.webp',
    dimension: '210 × 112 × 28 mm',
    features: ['Removable pale ash insert', 'Shallow catch profile', 'Shared rail attachment foot'],
    compatibility: 'System 01 rail · all spans',
  },
]

export const FINISHES: { id: Finish; label: string; note: string }[] = [
  { id: 'graphite', label: 'Graphite', note: 'Quiet, low-reflection anodized aluminum' },
  { id: 'silver', label: 'Warm silver', note: 'Soft satin aluminum with a warm cast' },
]

export const RAILS: { size: RailSize; price: number; label: string }[] = [
  { size: 90, price: 179, label: 'Compact desk' },
  { size: 120, price: 219, label: 'Everyday desk' },
  { size: 150, price: 259, label: 'Wide desk' },
]

export const formatMoney = (value: number) => `$${value.toLocaleString('en-US')}`
