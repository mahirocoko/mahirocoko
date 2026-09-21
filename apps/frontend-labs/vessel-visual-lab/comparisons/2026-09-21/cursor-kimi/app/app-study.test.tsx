import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AppStudy } from './app-study'

const loadSampleToReady = (): void => {
  fireEvent.click(screen.getByRole('button', { name: /load sample asset/i }))
  act(() => {
    vi.advanceTimersByTime(1000)
  })
}

describe('app study', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts in the empty state with a disabled derivative action', () => {
    render(<AppStudy />)

    expect(screen.getByText(/empty — load a sample to begin/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create derivative copy/i })).toBeDisabled()
    expect(screen.getAllByText('—').length).toBeGreaterThan(0)
  })

  it('loads the sample through inspecting into ready', () => {
    render(<AppStudy />)

    fireEvent.click(screen.getByRole('button', { name: /load sample asset/i }))
    expect(screen.getByText(/inspecting — reading metadata/i)).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.getByText(/ready — source protected/i)).toBeInTheDocument()
    expect(screen.getByText('harbor-morning.png')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create derivative copy/i })).toBeEnabled()
  })

  it('updates derivative telemetry when recipe steps change', () => {
    render(<AppStudy />)
    loadSampleToReady()

    expect(screen.getByText('5.2 MB · −38%')).toBeInTheDocument()
    expect(screen.getByText('0 of 12 tags')).toBeInTheDocument()
    expect(screen.getByText('sRGB · preview only')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('checkbox', { name: /optimize delivery copy/i }))
    expect(screen.getByText('8.2 MB · −2%')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('checkbox', { name: /remove metadata/i }))
    expect(screen.getByText('8.4 MB · 0%')).toBeInTheDocument()
    expect(screen.getByText('12 of 12 tags')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('checkbox', { name: /convert to srgb/i }))
    expect(screen.getByText('Display-P3 · as source')).toBeInTheDocument()
  })

  it('clears the deck back to empty', () => {
    render(<AppStudy />)
    loadSampleToReady()

    fireEvent.click(screen.getByRole('button', { name: /clear deck/i }))
    expect(screen.getByText(/empty — load a sample to begin/i)).toBeInTheDocument()
    expect(screen.queryByText('harbor-morning.png')).not.toBeInTheDocument()
  })

  it('reaches the unsupported state via scenarios', () => {
    render(<AppStudy />)

    fireEvent.click(screen.getByRole('button', { name: 'Unsupported' }))
    expect(
      screen.getByText(/unsupported — png, jpeg, single-page pdf only/i),
    ).toBeInTheDocument()
    expect(screen.getByText('field-notes.tiff')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create derivative copy/i })).toBeDisabled()
  })

  it('handles source-changed with a re-inspect path back to ready', () => {
    render(<AppStudy />)

    fireEvent.click(screen.getByRole('button', { name: 'Source changed' }))
    expect(screen.getByText(/source changed — re-inspect before deriving/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create derivative copy/i })).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: /re-inspect/i }))
    expect(screen.getByText(/inspecting — reading metadata/i)).toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.getByText(/ready — source protected/i)).toBeInTheDocument()
  })

  it('blocks the derivative action when the destination is unavailable', () => {
    render(<AppStudy />)

    fireEvent.click(screen.getByRole('button', { name: 'Destination unavailable' }))
    expect(screen.getByText(/destination unavailable — choose another folder/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create derivative copy/i })).toBeDisabled()
    expect(screen.getByText(/destination: ~\/exports — unavailable/i)).toBeInTheDocument()
  })

  it('shows a non-blocking notice instead of exporting a file', () => {
    render(<AppStudy />)
    loadSampleToReady()

    fireEvent.click(screen.getByRole('button', { name: /create derivative copy/i }))
    expect(screen.getByText(/no file is created or exported/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /dismiss notice/i }))
    expect(screen.queryByText(/no file is created or exported/i)).not.toBeInTheDocument()
  })

  it('operates the optic blade from the keyboard', () => {
    render(<AppStudy />)
    loadSampleToReady()

    const slider = screen.getByRole('slider', {
      name: /compare staged source with simulated derivative/i,
    })
    expect(slider).toHaveAttribute('aria-valuenow', '50')

    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    expect(slider).toHaveAttribute('aria-valuenow', '52')

    fireEvent.keyDown(slider, { key: 'ArrowLeft' })
    expect(slider).toHaveAttribute('aria-valuenow', '50')

    fireEvent.keyDown(slider, { key: 'Home' })
    expect(slider).toHaveAttribute('aria-valuenow', '0')

    fireEvent.keyDown(slider, { key: 'End' })
    expect(slider).toHaveAttribute('aria-valuenow', '100')
  })
})
