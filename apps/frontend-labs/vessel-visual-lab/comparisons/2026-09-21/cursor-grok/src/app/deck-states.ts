export const DECK_STATES = [
  'ready',
  'empty',
  'inspecting',
  'unsupported',
  'source-changed',
  'destination-unavailable',
] as const

export type IDeckState = (typeof DECK_STATES)[number]

export const DECK_STATE_LABEL: Record<IDeckState, string> = {
  ready: 'Ready',
  empty: 'Empty',
  inspecting: 'Inspecting',
  unsupported: 'Unsupported',
  'source-changed': 'Source changed',
  'destination-unavailable': 'Destination unavailable',
}

export const isInteractiveState = (state: IDeckState): boolean =>
  state === 'ready' || state === 'source-changed' || state === 'destination-unavailable'
