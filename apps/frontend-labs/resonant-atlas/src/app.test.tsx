import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { App } from './app'

vi.mock('./components/tone-field', () => ({
  ToneField: ({ onPluck }: { onPluck: () => void }) => (
    <button type="button" onClick={onPluck}>Pluck field</button>
  ),
}))

vi.mock('./hooks/use-experience', () => ({
  useExperience: vi.fn(),
  useReducedMotion: () => false,
}))

vi.mock('./lib/audio-engine', () => ({
  atlasAudio: {
    supported: true,
    setEnabled: vi.fn(async () => true),
    playTone: vi.fn(() => true),
  },
}))

describe('Resonant Atlas', () => {
  it('renders the complete semantic page structure', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 1, name: 'Shape what sound leaves behind.' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Three ways to leave a trace.' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Each layer knows when to speak.' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeInTheDocument()
  })

  it('keeps sound off until the user opts in', async () => {
    const user = userEvent.setup()
    render(<App />)

    const header = screen.getByRole('banner')
    const toggle = within(header).getByRole('button', { name: 'Sound off' })
    expect(toggle).toHaveAttribute('aria-pressed', 'false')

    await user.click(toggle)
    expect(within(header).getByRole('button', { name: 'Sound on' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('exposes every tone as a real button', () => {
    render(<App />)

    expect(screen.getAllByRole('button', { name: 'Play tone' })).toHaveLength(3)
  })

  it('opens a modal mobile navigation with the complete site directory', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Open navigation' }))

    const dialog = screen.getByRole('dialog', { name: 'Mobile navigation' })
    const navigation = within(dialog).getByRole('navigation', { name: 'Mobile primary navigation' })
    expect(within(navigation).getByRole('link', { name: /01\s*Score/ })).toHaveAttribute('href', '#score')
    expect(within(navigation).getByRole('link', { name: /02\s*Studies/ })).toHaveAttribute('href', '#studies')
    expect(within(navigation).getByRole('link', { name: /03\s*System/ })).toHaveAttribute('href', '#system')

    await user.click(within(dialog).getByRole('button', { name: 'Close navigation' }))
    expect(screen.queryByRole('dialog', { name: 'Mobile navigation' })).not.toBeInTheDocument()
  })

  it('provides a conventional footer directory and utility controls', () => {
    render(<App />)

    const footer = screen.getByRole('contentinfo')
    expect(within(footer).getByRole('navigation', { name: 'Footer navigation' })).toBeInTheDocument()
    expect(within(footer).getByRole('button', { name: 'Play field' })).toBeInTheDocument()
    expect(within(footer).getByRole('link', { name: /Back to top/ })).toHaveAttribute('href', '#top')
  })
})
