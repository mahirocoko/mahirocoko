import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { WebsiteApp } from '../../website/website-app.tsx'

describe('Vessel Website Study', () => {
  it('renders hero title, airlock signature, and navigation landmarks', () => {
    render(<WebsiteApp />)

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByLabelText('Vessel homepage')).toHaveTextContent('Vessel')
    expect(screen.getByText('V0.1-ALPHA')).toBeInTheDocument()

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent(/The outgoing airlock for everything you share/i)
  })

  it('renders primary CTA pointing to the macOS application study with truthful label', () => {
    render(<WebsiteApp />)
    const primaryCta = screen.getByRole('link', { name: /Open Mac App Study/i })
    expect(primaryCta).toHaveAttribute('href', '/app/')
  })

  it('provides accessible and keyboard-operable Optic Blade comparison slider', () => {
    render(<WebsiteApp initialSplit={50} />)

    const slider = screen.getByRole('slider', { name: /Optic Blade split comparison/i })
    expect(slider).toBeInTheDocument()
    expect(slider).toHaveAttribute('aria-valuenow', '50')

    // Press ArrowRight to move blade right
    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    expect(slider).toHaveAttribute('aria-valuenow', '55')

    // Press ArrowLeft to move blade left
    fireEvent.keyDown(slider, { key: 'ArrowLeft' })
    expect(slider).toHaveAttribute('aria-valuenow', '50')
  })

  it('safely handles pointer down when setPointerCapture throws or is unmapped', () => {
    render(<WebsiteApp />)
    const stage = document.querySelector('.workbench-split-stage')
    expect(stage).toBeInTheDocument()

    const target = stage as HTMLElement
    target.setPointerCapture = () => {
      throw new DOMException('InvalidPointerId', 'NotFoundError')
    }

    expect(() => {
      fireEvent.pointerDown(target, { clientX: 400, pointerId: 999 })
    }).not.toThrow()
  })

  it('renders mobile mode switch using group and aria-pressed semantics without tablist', () => {
    render(<WebsiteApp />)
    const modeGroup = screen.getByRole('group', { name: /Workbench view mode/i })
    expect(modeGroup).toBeInTheDocument()

    const bladeButton = screen.getByRole('button', { name: /Optic Blade Split/i })
    expect(bladeButton).toHaveAttribute('aria-pressed', 'true')

    const sourceButton = screen.getByRole('button', { name: /Source Only \(P3\)/i })
    expect(sourceButton).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(sourceButton)
    expect(sourceButton).toHaveAttribute('aria-pressed', 'true')
    expect(bladeButton).toHaveAttribute('aria-pressed', 'false')
  })

  it('renders concrete direct metadata audit facts with neutral sample host and sample disclaimer', () => {
    render(<WebsiteApp />)

    expect(screen.getByText('Sony Alpha 7R V')).toBeInTheDocument()
    expect(screen.getByText('37.7749° N')).toBeInTheDocument()
    expect(screen.getByText('122.4194° W')).toBeInTheDocument()
    expect(screen.getByText('sample-workstation.local')).toBeInTheDocument()

    // Concise visible note that values are fictional sample data
    expect(screen.getByText(/fictional sample data for this frontend visual study/i)).toBeInTheDocument()

    // Explicit handling of unknown or corrupted chunks
    expect(screen.getByText(/Explicit Handling of Unknown or Corrupted Chunks/i)).toBeInTheDocument()
  })

  it('explains the protected source invariant and 3-step derivative recipe concept', () => {
    render(<WebsiteApp />)

    expect(screen.getByRole('heading', { name: /The 3-step derivative recipe concept/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Original source preservation is a required design invariant/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Strip EXIF & Location Tags/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Convert Gamut to sRGB/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Optimize Delivery Copy/i })).toBeInTheDocument()
  })

  it('renders evidence status table and specifies format boundaries', () => {
    render(<WebsiteApp />)

    expect(screen.getByRole('heading', { name: /Local-first architecture and evidence status/i })).toBeInTheDocument()
    expect(screen.getByText(/Initial Target Formats/i)).toBeInTheDocument()
    expect(screen.getByText(/Explicitly Out of Scope/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Single-page PDF/i).length).toBeGreaterThan(0)
  })

  it('communicates honest limitations and truthful frontend-study CTA', () => {
    render(<WebsiteApp />)

    expect(screen.getByRole('heading', { name: /Honest boundaries. No false claims./i })).toBeInTheDocument()
    expect(screen.getByText(/Does Vessel redact faces or credit card numbers in image pixels\?/i)).toBeInTheDocument()

    const appStudyLink = screen.getByRole('link', { name: /Launch App Interface Study →/i })
    expect(appStudyLink).toHaveAttribute('href', '/app/')
  })

  it('rejects unverified runtime overclaims and old marketing slogans', () => {
    const { container } = render(<WebsiteApp />)
    const content = container.textContent || ''

    expect(content).not.toContain('100% On-Device Privacy')
    expect(content).not.toContain('O_RDONLY')
    expect(content).not.toContain('Swift + Rust')
    expect(content).not.toContain('Oxipng')
    expect(content).not.toContain('Get Vessel for Mac')
    expect(content).not.toContain('mahiro-studio.local')
  })
})
