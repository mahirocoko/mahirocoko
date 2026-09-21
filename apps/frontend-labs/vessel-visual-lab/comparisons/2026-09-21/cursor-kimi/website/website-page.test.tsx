import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WebsitePage } from './website-page'

describe('website surface', () => {
  it('renders exactly one h1 with the reference headline', () => {
    render(<WebsitePage />)

    const titles = screen.getAllByRole('heading', { level: 1 })
    expect(titles).toHaveLength(1)
    expect(titles[0]).toHaveTextContent('Preflight the file.')
    expect(titles[0]).toHaveTextContent('Keep the original.')
  })

  it('exposes section navigation and a truthful app-study CTA', () => {
    render(<WebsitePage />)

    for (const label of ['Product', 'Workflow', 'Color', 'Privacy', 'FAQ']) {
      const links = screen.getAllByRole('link', { name: label })
      expect(links.some((link) => link.getAttribute('href') === `#${label.toLowerCase()}`)).toBe(
        true,
      )
    }

    const headerCta = screen.getByRole('link', { name: 'Open app study' })
    expect(headerCta).toHaveAttribute('href', '/app/')

    const heroCta = screen.getAllByRole('link', { name: 'Open the app study' })
    expect(heroCta.length).toBeGreaterThan(0)
    for (const link of heroCta) {
      expect(link).toHaveAttribute('href', '/app/')
    }
  })

  it('marks samples and previews as simulations', () => {
    render(<WebsitePage />)

    expect(screen.getAllByText(/fictional sample/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/css-simulated preview/i)).toBeInTheDocument()
    expect(screen.getByText(/not proof of native color conversion/i)).toBeInTheDocument()
  })

  it('never offers a fake production download', () => {
    render(<WebsitePage />)

    expect(screen.queryByRole('link', { name: /download/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /download/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/download for mac/i)).not.toBeInTheDocument()
    expect(screen.getByText(/no production download exists/i)).toBeInTheDocument()
  })

  it('includes a keyboard-operable optic blade', () => {
    render(<WebsitePage />)

    const slider = screen.getByRole('slider', {
      name: /compare sample source with simulated derivative/i,
    })
    expect(slider).toHaveAttribute('aria-valuemin', '0')
    expect(slider).toHaveAttribute('aria-valuemax', '100')
    expect(slider).toHaveAttribute('aria-valuenow', '50')
  })
})
