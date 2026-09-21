import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LaunchpadApp } from '../launchpad/launchpad-app.tsx'

describe('Vessel Root Launchpad', () => {
  it('renders title, brand, and destinations for all studies and review', () => {
    render(<LaunchpadApp />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Vessel Visual Lab')
    expect(screen.getByText('V0.1-ALPHA')).toBeInTheDocument()

    const websiteLink = screen.getByRole('link', { name: /Open responsive website study/i })
    expect(websiteLink).toHaveAttribute('href', '/website/')

    const appLink = screen.getByRole('link', { name: /Open macOS application interface study/i })
    expect(appLink).toHaveAttribute('href', '/app/')

    const reviewLink = screen.getByRole('link', { name: /Open visual direction review page/i })
    expect(reviewLink).toHaveAttribute('href', '/review/')
  })

  it('renders key protected tenets with truthful target invariant and local-first framing', () => {
    render(<LaunchpadApp />)

    expect(screen.getByText('Less Borders v2 Restraint')).toBeInTheDocument()
    expect(screen.getByText('The Optic Blade')).toBeInTheDocument()
    expect(screen.getByText('Protected Source Invariant')).toBeInTheDocument()
    expect(screen.getByText('Local-First Target')).toBeInTheDocument()
  })

  it('rejects unverified runtime overclaims on launchpad', () => {
    const { container } = render(<LaunchpadApp />)
    const content = container.textContent || ''

    expect(content).not.toContain('100% On-Device Privacy')
    expect(content).not.toContain('Immutable Source Guarantee')
    expect(content).not.toContain('O_RDONLY')
    expect(content).not.toContain('Swift + Rust')
    expect(content).not.toContain('Oxipng')
    expect(content).not.toContain('Get Vessel for Mac')
  })
})
