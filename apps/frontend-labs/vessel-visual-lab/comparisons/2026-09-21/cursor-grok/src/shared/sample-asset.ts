export interface IRecipe {
  stripTags: boolean
  convertSrgb: boolean
  optimize: boolean
}

export interface ISourceFacts {
  fileName: string
  width: number
  height: number
  bytes: number
  profile: string
  geotag: string
  device: string
  software: string
  privacyTagCount: number
  tagLabels: string[]
}

export interface IDerivativeTelemetry {
  bytes: number
  savingsPercent: number
  profile: string
  tagCount: number
  summary: string
}

export const SAMPLE_DISCLOSURE =
  'Fictional sample for this frontend study. Facts are simulated, not parsed from disk.'

export const SOURCE_SAMPLE: ISourceFacts = {
  fileName: 'screenshot_export_p3.png',
  width: 2880,
  height: 1800,
  bytes: 8_400_000,
  profile: 'Display P3',
  geotag: '37.7749° N, 122.4194° W',
  device: 'Mac Studio',
  software: 'Screen Export',
  privacyTagCount: 3,
  tagLabels: ['EXIF GPS', 'Device', 'Software'],
}

export const WEBSITE_SAMPLE: ISourceFacts = {
  fileName: 'alpine-crossing.png',
  width: 2560,
  height: 1600,
  bytes: 8_400_000,
  profile: 'Display P3',
  geotag: '46.5197° N, 9.8432° E',
  device: 'Field camera',
  software: 'Capture One (sample)',
  privacyTagCount: 12,
  tagLabels: ['EXIF', 'GPS', 'Device', 'Software', 'ICC', 'Maker notes'],
}

export const DEFAULT_RECIPE: IRecipe = {
  stripTags: true,
  convertSrgb: true,
  optimize: true,
}

export const formatMegabytes = (bytes: number): string => {
  const mega = bytes / 1_000_000
  return `${mega.toFixed(1)} MB`
}

export const deriveTelemetry = (source: ISourceFacts, recipe: IRecipe): IDerivativeTelemetry => {
  let bytes = source.bytes
  let profile = source.profile
  let tagCount = source.privacyTagCount
  const steps: string[] = []

  if (recipe.stripTags) {
    tagCount = 0
    bytes -= 120_000
    steps.push('metadata stripped')
  }

  if (recipe.convertSrgb) {
    profile = 'sRGB IEC61966-2.1'
    bytes -= 180_000
    steps.push('sRGB preview')
  }

  if (recipe.optimize) {
    bytes = Math.round(bytes * 0.14)
    steps.push('delivery optimize')
  }

  bytes = Math.max(80_000, bytes)
  const savingsPercent = Math.round((1 - bytes / source.bytes) * 100)
  const summary =
    steps.length === 0
      ? 'No derivative steps selected (sample).'
      : `Sample derivative · ${steps.join(' · ')}`

  return { bytes, savingsPercent, profile, tagCount, summary }
}
