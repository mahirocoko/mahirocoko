import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AppStudy } from '../app/app-study'
import { Launchpad } from '../launchpad'
import { ROUTES } from '../shared/paths'
import { WebsitePage } from '../website/website-page'

describe('navigation', () => {
  it('launchpad links both study surfaces', () => {
    render(<Launchpad />)
    expect(screen.getByRole('link', { name: /product website/i })).toHaveAttribute('href', ROUTES.website)
    expect(screen.getByRole('link', { name: /mac interface study/i })).toHaveAttribute('href', ROUTES.app)
  })

  it('website header and CTAs open the app study, not a production download', () => {
    render(<WebsitePage />)
    const appLinks = screen.getAllByRole('link', { name: /app study|mac interface study/i })
    expect(appLinks.length).toBeGreaterThan(0)
    for (const link of appLinks) {
      expect(link).toHaveAttribute('href', ROUTES.app)
      expect(link).not.toHaveAttribute('download')
    }
    expect(screen.queryByRole('link', { name: /download vessel|get vessel for mac/i })).not.toBeInTheDocument()
  })

  it('app study can return to the website and launchpad', () => {
    render(<AppStudy />)
    expect(screen.getByRole('link', { name: /product website/i })).toHaveAttribute('href', ROUTES.website)
    expect(screen.getByRole('link', { name: /launchpad/i })).toHaveAttribute('href', ROUTES.root)
  })
})
