import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './app'

describe('DOVEL commerce lab', () => {
  it('adds a product to the bag and updates quantity', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getAllByRole('button', { name: /Add in graphite/i })[0])
    const drawer = screen.getByRole('dialog', { name: 'Your bag' })

    expect(within(drawer).getByRole('heading', { name: 'Arc Dock' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bag, 1 item' })).toBeInTheDocument()
    expect(within(drawer).getByRole('button', { name: 'Decrease Arc Dock' })).toBeDisabled()

    await user.click(within(drawer).getByRole('button', { name: 'Increase Arc Dock' }))
    expect(screen.getByRole('button', { name: 'Bag, 2 items' })).toBeInTheDocument()
    expect(within(drawer).getAllByText('$238')).toHaveLength(2)
  })

  it('recalculates and adds a configured system', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByTestId('builder-total')).toHaveTextContent('$427')
    expect(screen.getByText('System 01 · CSS fallback')).toBeInTheDocument()
    expect(document.querySelector('.builder-preview-stage canvas')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Add Halo Light' }))
    expect(screen.getByTestId('builder-total')).toHaveTextContent('$616')

    await user.click(screen.getByRole('button', { name: /Add configured system/i }))
    const drawer = screen.getByRole('dialog', { name: 'Your bag' })
    expect(within(drawer).getByRole('heading', { name: 'System 01 · 120 cm' })).toBeInTheDocument()
    expect(within(drawer).getByText('Configured system')).toBeInTheDocument()
  })

  it('searches products and closes with Escape', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Search' }))
    const dialog = screen.getByRole('dialog', { name: 'Search DOVEL' })
    const searchbox = within(dialog).getByRole('searchbox')
    expect(searchbox).toHaveFocus()
    await user.type(searchbox, 'tray')

    expect(within(dialog).getByText('Pocket Tray')).toBeInTheDocument()
    expect(within(dialog).queryByText('Halo Light')).not.toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: 'Search DOVEL' })).not.toBeInTheDocument()
  })

  it('opens product detail directly from search results', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Search' }))
    const searchDialog = screen.getByRole('dialog', { name: 'Search DOVEL' })
    await user.type(within(searchDialog).getByRole('searchbox'), 'light')
    await user.click(within(searchDialog).getByRole('button', { name: /Halo Light/ }))

    expect(screen.queryByRole('dialog', { name: 'Search DOVEL' })).not.toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: 'Halo Light' })).toBeInTheDocument()
  })

  it('opens a product detail and adds the selected finish to the bag', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'View Arc Dock details' }))
    const dialog = screen.getByRole('dialog', { name: 'Arc Dock' })

    expect(within(dialog).getByText('System 01 rail · all spans')).toBeInTheDocument()
    await user.click(within(dialog).getByRole('radio', { name: /Warm silver/ }))
    await user.click(within(dialog).getByRole('button', { name: 'Add to bag' }))

    expect(screen.getByRole('dialog', { name: 'Your bag' })).toHaveTextContent('Warm silver')
  })

  it('closes mobile navigation with Escape', async () => {
    const user = userEvent.setup()
    render(<App />)

    const menuButton = screen.getByRole('button', { name: 'Open navigation' })
    await user.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')

    await user.keyboard('{Escape}')
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    expect(menuButton).toHaveFocus()
  })
})
