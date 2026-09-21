import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { AppStudy } from '../app/app-study'
import { DECK_STATE_LABEL, DECK_STATES } from '../app/deck-states'
import { PRODUCT_TRUTH } from '../shared/product-truth'
import { SOURCE_SAMPLE, deriveTelemetry, DEFAULT_RECIPE } from '../shared/sample-asset'

const windowOf = () => within(screen.getByTestId('deck-state'))

describe('app study interactions', () => {
  it('exposes all six coherent deck states', async () => {
    const user = userEvent.setup()
    render(<AppStudy />)

    for (const state of DECK_STATES) {
      await user.click(screen.getByRole('radio', { name: DECK_STATE_LABEL[state] }))
      expect(screen.getByTestId('deck-state')).toHaveAttribute('data-state', state)
    }
  })

  it('updates sample derivative telemetry from the recipe checkboxes', async () => {
    const user = userEvent.setup()
    render(<AppStudy />)
    const telemetry = screen.getByTestId('telemetry')
    const baseline = deriveTelemetry(SOURCE_SAMPLE, DEFAULT_RECIPE)
    expect(telemetry).toHaveTextContent(`saved ${baseline.savingsPercent}%`)
    expect(telemetry).toHaveTextContent('0 metadata tags')

    await user.click(screen.getByRole('checkbox', { name: /strip exif and location tags/i }))
    expect(screen.getByTestId('telemetry')).toHaveTextContent('3 metadata tags')

    await user.click(screen.getByRole('checkbox', { name: /optimize a delivery copy/i }))
    expect(screen.getByTestId('telemetry')).not.toHaveTextContent('1.1 MB')
  })

  it('clears the deck and loads the sample asset', async () => {
    const user = userEvent.setup()
    render(<AppStudy />)
    await user.click(windowOf().getByRole('button', { name: /clear deck/i }))
    expect(screen.getByTestId('deck-state')).toHaveAttribute('data-state', 'empty')
    expect(windowOf().getByRole('button', { name: /load sample asset/i })).toBeInTheDocument()

    await user.click(windowOf().getByRole('button', { name: /load sample asset/i }))
    expect(screen.getByTestId('deck-state')).toHaveAttribute('data-state', 'ready')
    expect(windowOf().getByText(SOURCE_SAMPLE.fileName)).toBeInTheDocument()
  })

  it('shows a non-blocking notice that no file is exported', async () => {
    const user = userEvent.setup()
    render(<AppStudy />)
    await user.click(windowOf().getByRole('button', { name: /drag derivative to destination/i }))
    expect(screen.getByTestId('export-notice')).toHaveTextContent(PRODUCT_TRUTH.studyNotice)
    expect(screen.getByTestId('deck-state')).toBeInTheDocument()
  })

  it('moves the Optic Blade with the keyboard', async () => {
    const user = userEvent.setup()
    render(<AppStudy />)
    const slider = windowOf().getByRole('slider', { name: /optic blade/i })
    expect(slider).toHaveAttribute('aria-valuenow', '52')
    slider.focus()
    await user.keyboard('{ArrowRight}{ArrowRight}')
    expect(slider).toHaveAttribute('aria-valuenow', '56')
  })

  it('disables derivative drag when the destination is unavailable', async () => {
    const user = userEvent.setup()
    render(<AppStudy />)
    await user.click(screen.getByRole('radio', { name: /destination unavailable/i }))
    expect(windowOf().getByRole('button', { name: /drag derivative to destination/i })).toBeDisabled()
  })
})
