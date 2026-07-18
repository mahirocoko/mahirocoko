import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { App } from './app'

describe('Nudge interaction gallery', () => {
  const getSectionCatalogue = () => within(screen.getByRole('region', { name: 'Motion you can inspect.' }))
  const getFilterRail = () => within(screen.getByRole('group', { name: 'Filter sections' }))
  const renderAt = (initialEntries = ['/']) => render(<MemoryRouter initialEntries={initialEntries}><App /></MemoryRouter>)

  afterEach(() => {
    vi.restoreAllMocks()
    Object.defineProperty(window.navigator, 'clipboard', { configurable: true, value: undefined })
  })

  it('renders the original gallery thesis and all registry sections', () => {
    renderAt()

    expect(screen.getByRole('heading', { level: 1, name: /Sections that move/i })).toBeVisible()
    expect(getSectionCatalogue().getAllByRole('article')).toHaveLength(6)
    expect(getSectionCatalogue().getAllByRole('link', { name: /^Open .+ section$/ })).toHaveLength(6)
    expect(getSectionCatalogue().getByRole('link', { name: 'Open Tilt Field section' })).toHaveAttribute('href', '/sections/tilt-field')
    expect(screen.getByText('No paywall')).toBeVisible()
    expect(document.querySelectorAll('.study-card .nudge-stage--compact')).toHaveLength(6)
    for (const id of ['tilt-field', 'reading-queue', 'soft-radar', 'travel-scrub', 'type-signal', 'surface-fold']) {
      expect(document.querySelector(`.study-card .nudge-stage--compact[data-section="${id}"]`)).toBeInTheDocument()
    }
  })

  it('filters sections with an accessible selected state', async () => {
    const user = userEvent.setup()
    renderAt()

    await user.click(getFilterRail().getByRole('button', { name: 'Pointer' }))

    expect(getFilterRail().getByRole('button', { name: 'Pointer' })).toHaveAttribute('aria-pressed', 'true')
    expect(getSectionCatalogue().getAllByRole('article')).toHaveLength(2)
    expect(screen.getByText('2 sections in Pointer')).toBeVisible()
  })

  it('opens every card at a section route and preserves the collection filter', async () => {
    const user = userEvent.setup()
    renderAt(['/?filter=Layout'])

    expect(getSectionCatalogue().getAllByRole('article')).toHaveLength(2)
    await user.click(getSectionCatalogue().getByRole('link', { name: 'Open Reading Queue section' }))

    expect(screen.getByRole('heading', { level: 1, name: 'Reading Queue' })).toBeVisible()
    expect(screen.getByRole('link', { name: '← Back to Layout sections' })).toHaveAttribute('href', '/?filter=Layout#sections')
    expect(screen.getByRole('heading', { name: /Original AI build prompt for Reading Queue/i })).toBeVisible()
  })

  it('gives the lead section a stable generated print field with keyboard-operable selection', async () => {
    const user = userEvent.setup()
    renderAt(['/sections/tilt-field'])

    const field = screen.getByLabelText('Tilt Field print field — choose a generated print to bring it forward')
    const prints = within(field).getAllByRole('button')
    expect(prints).toHaveLength(6)
    expect(document.querySelector('.section-showcase .nudge-stage--detail[data-section="tilt-field"]')).toBeInTheDocument()
    await user.click(prints[1])
    expect(prints[1]).toHaveAttribute('aria-pressed', 'true')
  })

  it('renders every detail showcase as the matching generated-media variant', () => {
    for (const id of ['tilt-field', 'reading-queue', 'soft-radar', 'travel-scrub', 'type-signal', 'surface-fold']) {
      const { unmount } = renderAt([`/sections/${id}`])
      expect(document.querySelector(`.section-showcase .nudge-stage--detail[data-section="${id}"]`)).toBeInTheDocument()
      expect(document.querySelector(`.section-showcase .nudge-stage--${id}`)).toBeInTheDocument()
      unmount()
    }
  })

  it('keeps Reading Queue focus selection keyboard and touch operable', async () => {
    const user = userEvent.setup()
    renderAt(['/sections/reading-queue'])

    const queue = screen.getByLabelText('Reading Queue numbered focus selection')
    const rows = within(queue).getAllByRole('button')
    expect(rows).toHaveLength(4)
    await user.click(rows[2])
    expect(rows[2]).toHaveAttribute('aria-pressed', 'true')
  })

  it('uses a safe fallback for an invalid section id', () => {
    renderAt(['/sections/not-real?filter=Pointer'])

    expect(screen.getByText('That section was not found, so the first Nudge section is shown instead.')).toBeVisible()
    expect(screen.getByRole('heading', { level: 1, name: 'Tilt Field' })).toBeVisible()
    expect(screen.getByRole('link', { name: '← Back to Pointer sections' })).toHaveAttribute('href', '/?filter=Pointer#sections')
  })

  it('copies the prompt with async clipboard success status', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(window.navigator, 'clipboard', { configurable: true, value: { writeText } })
    renderAt(['/sections/soft-radar'])

    fireEvent.click(screen.getByRole('button', { name: 'Copy Prompt' }))

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(expect.stringContaining('Build an original React and CSS interactive section named Soft Radar')))
    expect(await screen.findByText('Prompt copied to clipboard.')).toBeVisible()
    expect(screen.getByRole('textbox', { name: 'Selectable prompt fallback' })).toHaveTextContent('/assets/gallery/nudge-field-03.png')
  })

  it('reports clipboard failure and keeps selectable prompt fallback', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('blocked'))
    Object.defineProperty(window.navigator, 'clipboard', { configurable: true, value: { writeText } })
    renderAt(['/sections/type-signal'])

    fireEvent.click(screen.getByRole('button', { name: 'Copy Prompt' }))

    expect(await screen.findByText('Copy failed. Select the prompt text below.')).toBeVisible()
    expect(screen.getByRole('textbox', { name: 'Selectable prompt fallback' })).toHaveTextContent('Type Signal')
  })
})
