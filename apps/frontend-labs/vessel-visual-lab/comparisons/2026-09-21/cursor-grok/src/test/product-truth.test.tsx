import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AppStudy } from '../app/app-study'
import { Launchpad } from '../launchpad'
import { FORBIDDEN_PRODUCT_CLAIMS, PRODUCT_TRUTH } from '../shared/product-truth'
import { SAMPLE_DISCLOSURE } from '../shared/sample-asset'
import { WebsitePage } from '../website/website-page'

const collectText = (ui: ReturnType<typeof render>): string => ui.container.textContent ?? ''

describe('product truth guards', () => {
  it('keeps sample disclosure and forbids architecture/download claims on every surface', () => {
    const surfaces = [render(<Launchpad />), render(<WebsitePage />), render(<AppStudy />)]

    for (const view of surfaces) {
      const text = collectText(view)
      expect(text).toMatch(/fictional sample/i)
      for (const claim of FORBIDDEN_PRODUCT_CLAIMS) {
        expect(text).not.toMatch(claim)
      }
      expect(view.container.querySelector('a[download]')).toBeNull()
    }
  })

  it('states the study limits on the website', () => {
    const text = collectText(render(<WebsitePage />))
    expect(text).toContain(PRODUCT_TRUTH.cssPreviewDisclaimer)
    expect(text).toContain(PRODUCT_TRUTH.sourceInvariant)
    expect(text).toContain(PRODUCT_TRUTH.noDownload)
    expect(text).toContain(PRODUCT_TRUTH.studyNotice)
    expect(text).toMatch(/sample · simulation/i)
  })

  it('states the study limits in the app workbench', () => {
    const text = collectText(render(<AppStudy />))
    expect(text).toContain(SAMPLE_DISCLOSURE)
    expect(text).toContain(PRODUCT_TRUTH.sourceInvariant)
    expect(text).toMatch(/creates and exports no file/i)
  })
})
