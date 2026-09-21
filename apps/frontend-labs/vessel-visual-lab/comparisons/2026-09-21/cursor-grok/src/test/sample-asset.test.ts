import { describe, expect, it } from 'vitest'
import { DEFAULT_RECIPE, SOURCE_SAMPLE, deriveTelemetry, formatMegabytes } from '../shared/sample-asset'

describe('sample derivative telemetry', () => {
  it('matches the all-steps sample used by the workbench', () => {
    const all = deriveTelemetry(SOURCE_SAMPLE, DEFAULT_RECIPE)
    expect(formatMegabytes(all.bytes)).toBe('1.1 MB')
    expect(all.savingsPercent).toBe(87)
    expect(all.tagCount).toBe(0)
    expect(all.profile).toMatch(/sRGB/)
  })

  it('leaves source facts in place when no steps are selected', () => {
    const none = deriveTelemetry(SOURCE_SAMPLE, {
      stripTags: false,
      convertSrgb: false,
      optimize: false,
    })
    expect(none.bytes).toBe(SOURCE_SAMPLE.bytes)
    expect(none.tagCount).toBe(SOURCE_SAMPLE.privacyTagCount)
    expect(none.profile).toBe(SOURCE_SAMPLE.profile)
    expect(none.summary).toMatch(/no derivative steps/i)
  })
})
