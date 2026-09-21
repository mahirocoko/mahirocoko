import type { IRecipeSelection } from '../src/shared/facts'
import { SAMPLE_SOURCE } from '../src/shared/facts'

/**
 * State model for the app study. All values are fictional samples —
 * the study parses, creates, and exports nothing.
 */

export type DeckStatus =
  | 'empty'
  | 'inspecting'
  | 'ready'
  | 'unsupported'
  | 'source-changed'
  | 'destination-unavailable'

export interface ITelemetry {
  projectedSize: string
  metadata: string
  colorTarget: string
}

export interface IStatusMeta {
  symbol: string
  tone: 'emerald' | 'cyan' | 'amber' | 'neutral'
  text: string
}

export const DEFAULT_RECIPE: IRecipeSelection = {
  removeMetadata: true,
  convertSrgb: true,
  optimize: true,
}

const BASE_MB = 8.4
const METADATA_MB = 0.2
const OPTIMIZE_RATIO = 0.63

export const computeTelemetry = (recipe: IRecipeSelection): ITelemetry => {
  const afterMetadata = recipe.removeMetadata ? BASE_MB - METADATA_MB : BASE_MB
  const projected = recipe.optimize ? afterMetadata * OPTIMIZE_RATIO : afterMetadata
  const rounded = Math.round(projected * 10) / 10
  const savings = Math.round((1 - rounded / BASE_MB) * 100)
  const savingsText = savings > 0 ? `−${savings}%` : '0%'
  return {
    projectedSize: `${rounded.toFixed(1)} MB · ${savingsText}`,
    metadata: recipe.removeMetadata
      ? `0 of ${SAMPLE_SOURCE.tagCount} tags`
      : `${SAMPLE_SOURCE.tagCount} of ${SAMPLE_SOURCE.tagCount} tags`,
    colorTarget: recipe.convertSrgb ? 'sRGB · preview only' : 'Display-P3 · as source',
  }
}

export const statusMeta = (status: DeckStatus): IStatusMeta => {
  switch (status) {
    case 'empty':
      return { symbol: '○', tone: 'neutral', text: 'Empty — load a sample to begin' }
    case 'inspecting':
      return { symbol: '◌', tone: 'cyan', text: 'Inspecting — reading metadata…' }
    case 'ready':
      return { symbol: '●', tone: 'emerald', text: 'Ready — source protected' }
    case 'unsupported':
      return { symbol: '▲', tone: 'amber', text: 'Unsupported — PNG, JPEG, single-page PDF only' }
    case 'source-changed':
      return { symbol: '▲', tone: 'amber', text: 'Source changed — re-inspect before deriving' }
    case 'destination-unavailable':
      return { symbol: '▲', tone: 'amber', text: 'Destination unavailable — choose another folder' }
  }
}

/** Whether the recipe controls accept input in this state. */
export const recipeEnabled = (status: DeckStatus): boolean =>
  status === 'ready' || status === 'source-changed' || status === 'destination-unavailable'

/** Whether the derivative action is offered in this state. */
export const derivativeEnabled = (status: DeckStatus): boolean => status === 'ready'

/** Whether a source asset is on the deck (facts and blade are shown). */
export const hasSource = (status: DeckStatus): boolean =>
  status === 'ready' ||
  status === 'inspecting' ||
  status === 'source-changed' ||
  status === 'destination-unavailable'
