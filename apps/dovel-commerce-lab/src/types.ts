export type Finish = 'graphite' | 'silver'
export type ModuleId = 'arc-dock' | 'halo-light' | 'pocket-tray'
export type RailSize = 90 | 120 | 150

export interface Product {
  id: ModuleId
  name: string
  eyebrow: string
  description: string
  price: number
  image: string
  dimension: string
  features: string[]
  compatibility: string
}

export interface CartItem {
  key: string
  name: string
  detail: string
  price: number
  quantity: number
  image?: string
}

export interface SystemConfiguration {
  railSize: RailSize
  finish: Finish
  modules: ModuleId[]
}
