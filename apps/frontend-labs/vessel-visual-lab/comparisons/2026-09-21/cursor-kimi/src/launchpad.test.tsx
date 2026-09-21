import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Launchpad } from './launchpad'

describe('launchpad', () => {
  it('links to both study surfaces', () => {
    render(<Launchpad />)

    const website = screen.getByRole('link', { name: /product website/i })
    const app = screen.getByRole('link', { name: /app study/i })

    expect(website).toHaveAttribute('href', '/website/')
    expect(app).toHaveAttribute('href', '/app/')
  })

  it('states the study boundary honestly', () => {
    render(<Launchpad />)

    expect(screen.getByText(/no production build exists/i)).toBeInTheDocument()
    expect(screen.getByText(/nothing here parses, creates, or/i)).toBeInTheDocument()
  })
})
