/**
 * Shared fictional sample facts for the Vessel frontend study.
 * Every value here is a simulated sample — no real file is ever parsed.
 */

export interface ISourceFacts {
  fileName: string
  format: string
  width: number
  height: number
  byteSize: string
  profile: string
  tagCount: number
}

export interface IRecipeSelection {
  removeMetadata: boolean
  convertSrgb: boolean
  optimize: boolean
}

export const LANDSCAPE_SRC = '/assets/vessel-landscape.png'

export const SAMPLE_SOURCE: ISourceFacts = {
  fileName: 'harbor-morning.png',
  format: 'PNG',
  width: 2400,
  height: 1350,
  byteSize: '8.4 MB',
  profile: 'Display-P3',
  tagCount: 12,
}

export const UNSUPPORTED_SOURCE: ISourceFacts = {
  fileName: 'field-notes.tiff',
  format: 'TIFF',
  width: 3024,
  height: 4032,
  byteSize: '21.7 MB',
  profile: 'Adobe RGB',
  tagCount: 31,
}

export const sourceFactsLine = (facts: ISourceFacts): string =>
  `${facts.format} · ${facts.width} × ${facts.height} · ${facts.byteSize}`
