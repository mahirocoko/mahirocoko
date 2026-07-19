import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { App } from './app'

describe('Whisperfield', () => {
  it('renders the complete semantic landing anatomy', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 1, name: 'Say it. Watch the work move.' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '12 steps. One sentence.' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Agent Mode' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Dictation Mode' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Privacy in Whisperfield/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Wall of Love' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Pricing' })).toBeInTheDocument()
    const footer = screen.getByRole('contentinfo')
    expect(within(footer).getByRole('navigation', { name: 'Footer navigation' })).toBeInTheDocument()
    expect(within(footer).getByRole('heading', { name: 'Product' })).toBeInTheDocument()
    expect(within(footer).getByRole('heading', { name: 'Company' })).toBeInTheDocument()
    expect(within(footer).getByRole('heading', { name: 'Legal' })).toBeInTheDocument()
  })

  it('keeps a static Hero input and destination family in reduced motion', () => {
    const originalMatchMedia = window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })

    try {
      render(<App />)
      expect(document.querySelector('.wf-hero-flow-input')).toBeInTheDocument()
      expect(document.querySelectorAll('.wf-hero-flow-output.is-static .wf-hero-flow-icon')).toHaveLength(7)
      expect(document.querySelector('.wf-hero-flow-input animate')).not.toBeInTheDocument()
    } finally {
      Object.defineProperty(window, 'matchMedia', { configurable: true, value: originalMatchMedia })
    }
  })

  it('opens and closes the complete mobile navigation', async () => {
    const user = userEvent.setup()
    render(<App />)

    const trigger = screen.getByRole('button', { name: 'Open navigation' })
    await user.click(trigger)
    const dialog = screen.getByRole('region', { name: 'Mobile navigation' })
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(within(dialog).getByRole('navigation', { name: 'Mobile primary navigation' })).toBeInTheDocument()
    expect(within(dialog).getByRole('link', { name: /Proof/ })).toHaveFocus()
    expect(screen.getByRole('button', { name: 'Close navigation' })).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('region', { name: 'Mobile navigation' })).not.toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveFocus()
  })

  it('collapses the desktop navigation into the layered glass container after scrolling', async () => {
    render(<App />)

    const glass = document.querySelector('.wf-header-surface')
    expect(glass).not.toHaveClass('wf-glass-container')
    expect(glass).not.toHaveClass('is-compact')
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 120 })
    fireEvent.scroll(window)
    await waitFor(() => {
      expect(glass).toHaveClass('wf-glass-container', 'is-compact')
      expect(glass?.querySelector('.wf-glass-filter')).toBeInTheDocument()
    })

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
    fireEvent.scroll(window)
    await waitFor(() => {
      expect(glass).not.toHaveClass('wf-glass-container', 'is-compact')
      expect(glass?.querySelector('.wf-glass-filter')).not.toBeInTheDocument()
    })
  })

  it('keeps the Agent Scenario progress indicator rendered when autoplay is paused', async () => {
    render(<App />)

    const firstDotTrack = document.querySelector('.wf-agent-dot.is-active .wf-agent-dot-track')
    const progressBeforePause = firstDotTrack?.querySelector('i')
    expect(progressBeforePause).toBeInTheDocument()

    const pauseBtn = screen.getByRole('button', { name: 'Pause action scenario autoplay' })
    fireEvent.click(pauseBtn)

    await waitFor(() => {
      const progressEl = firstDotTrack?.querySelector('i')
      expect(progressEl).toBeInTheDocument()
      expect(progressEl).toBe(progressBeforePause)
      expect(progressEl?.style.animationPlayState).toBe('paused')
    })
  })

  it('advances Action Mode automatically while pointer presence does not pause it', () => {
    vi.useFakeTimers()
    try {
      render(<App />)
      const section = screen.getByRole('heading', { name: 'Agent Mode' }).closest('section')
      expect(screen.getByRole('button', { name: 'Calendar: new focus block' })).toHaveAttribute('aria-pressed', 'true')
      fireEvent.mouseEnter(section as HTMLElement)
      act(() => vi.advanceTimersByTime(9500))
      expect(screen.getByRole('button', { name: 'Messages: draft reply' })).toHaveAttribute('aria-pressed', 'true')
    } finally {
      vi.useRealTimers()
    }
  })

  it('changes the action and writing demo states', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('button', { name: 'Calendar: new focus block' })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'Next action scenario' }))
    expect(screen.getByRole('button', { name: 'Messages: draft reply' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Play action scenario autoplay' })).toBeInTheDocument()

    expect(screen.getByText('Tone: concise and warm')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Brief' }))
    expect(screen.getByText('Format: working brief')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Brief' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('runs the visibility-gated Dictation staging sequence', () => {
    vi.useFakeTimers()
    try {
      render(<App />)
      const appWindow = document.querySelector('.wf-dict-app')
      const shortcut = document.querySelector('.wf-dict-shortcut')
      expect(appWindow).not.toHaveClass('is-visible')

      act(() => vi.advanceTimersByTime(400))
      expect(shortcut).toHaveClass('is-visible')

      act(() => vi.advanceTimersByTime(1400))
      expect(shortcut).not.toHaveClass('is-visible')
      expect(appWindow).toHaveClass('is-visible')
      expect(document.querySelector('.wf-dict-pill')).toHaveClass('is-recording')
    } finally {
      vi.useRealTimers()
    }
  })

  it('switches privacy and billing state without creating live behavior', async () => {
    const user = userEvent.setup()
    render(<App />)

    const privacyStates = [
      ['General', 'On this device'],
      ['Privacy', 'Private by default'],
      ['Profiles', 'Match the moment'],
      ['Advanced', 'Visible boundaries'],
    ] as const
    for (const [tab, title] of privacyStates) {
      await user.click(screen.getByRole('button', { name: tab }))
      expect(document.querySelector('.wf-privacy-group > strong')).toHaveTextContent(title)
    }

    expect(screen.getByText('$11.99')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Monthly' }))
    expect(screen.getByText('$29.99')).toBeInTheDocument()
    const pricing = screen.getByRole('heading', { name: 'Pricing' }).closest('section')
    expect(within(pricing as HTMLElement).queryByRole('link')).not.toBeInTheDocument()
    const notePause = screen.getByRole('button', { name: 'Pause field notes' })
    await user.click(notePause)
    expect(notePause).toHaveAttribute('aria-pressed', 'true')
  })

  it('exposes a local visual hotkey state', async () => {
    const user = userEvent.setup()
    render(<App />)

    const key = screen.getByRole('button', { name: 'fn' })
    const section = screen.getByRole('region', { name: 'Hotkey demo' })
    expect(key).toHaveAttribute('aria-pressed', 'false')
    await user.click(key)
    expect(key).toHaveAttribute('aria-pressed', 'true')
    expect(within(section).getByRole('status')).toHaveTextContent('Hotkey demo active')
  })

  it('bounds the local hotkey visual state', () => {
    vi.useFakeTimers()
    try {
      render(<App />)
      const key = screen.getByRole('button', { name: 'fn' })
      fireEvent.click(key)
      expect(key).toHaveAttribute('aria-pressed', 'true')
      expect(document.querySelectorAll('.wf-speech-bubbles i')).toHaveLength(7)

      act(() => vi.advanceTimersByTime(1500))
      expect(key).toHaveAttribute('aria-pressed', 'false')
      expect(document.querySelector('.wf-speech-bubbles')).not.toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })
})
