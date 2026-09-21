import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AppWorkbench } from '../../app/app-workbench.tsx'

describe('Vessel macOS Application Study', () => {
  it('renders default ready state with sample asset telemetry and recipe controls', () => {
    render(<AppWorkbench />)

    expect(screen.getByText('Vessel — Preflight')).toBeInTheDocument()
    expect(screen.getByText('LOCAL ONLY')).toBeInTheDocument()
    expect(screen.getByText('screenshot_export_p3.png')).toBeInTheDocument()
    expect(screen.getByText('2880 × 1800 px')).toBeInTheDocument()
    expect(screen.getByText('8.4 MB (Sample)')).toBeInTheDocument()
    expect(screen.getByText('3 Privacy Tags (Sample)')).toBeInTheDocument()
    expect(screen.getByText(/Target Invariant: Source file remains untouched on disk/i)).toBeInTheDocument()

    // Canvas overlaid badges with shortened visible labels and full semantic aria descriptions
    expect(screen.getByText('DISPLAY P3')).toBeInTheDocument()
    expect(screen.getByLabelText(/Source profile: Display P3 \(Wide Gamut\)/i)).toBeInTheDocument()
    expect(screen.getByText('1× BLADE')).toBeInTheDocument()
    expect(screen.getByLabelText(/Comparison blade: 1\.0× Optic Blade/i)).toBeInTheDocument()
    expect(screen.getByText('sRGB PREVIEW')).toBeInTheDocument()
    expect(screen.getByLabelText(/Derivative profile: sRGB IEC61966-2\.1 Simulation/i)).toBeInTheDocument()

    // Default derivative metrics (concise visible line + complete aria semantics)
    const telemetry = screen.getByLabelText(/Derivative metrics summary/i)
    expect(telemetry).toHaveTextContent(/Derivative:.*1\.1 MB \(Est\.\)/i)
    expect(telemetry).toHaveTextContent(/0 Meta Tags/i)
    expect(telemetry).toHaveAttribute('aria-label', expect.stringMatching(/0 Metadata Tags \(Simulated\)/i))
  })

  it('updates derivative metrics dynamically when recipe checkboxes change', () => {
    render(<AppWorkbench />)

    const stripCheckbox = screen.getByLabelText(/Strip EXIF & Location Tags/i)
    expect(stripCheckbox).toBeChecked()

    // Uncheck Strip EXIF
    fireEvent.click(stripCheckbox)
    expect(stripCheckbox).not.toBeChecked()

    // Derivative telemetry now reflects 3 metadata tags remaining
    const telemetry = screen.getByLabelText(/Derivative metrics summary/i)
    expect(telemetry).toHaveTextContent(/3 Meta Tags/i)
    expect(telemetry).toHaveAttribute('aria-label', expect.stringMatching(/3 Metadata Tags \(Simulated\)/i))

    // Uncheck Optimize Delivery Copy
    const optimizeCheckbox = screen.getByLabelText(/Optimize Delivery Copy/i)
    fireEvent.click(optimizeCheckbox)
    expect(optimizeCheckbox).not.toBeChecked()
    expect(telemetry).toHaveTextContent(/4.5 MB \(Est\.\)/i)

    // Uncheck Convert Gamut to sRGB updates derivative tag to P3 RETAINED
    const gamutCheckbox = screen.getByLabelText(/Convert Gamut to sRGB/i)
    fireEvent.click(gamutCheckbox)
    expect(gamutCheckbox).not.toBeChecked()
    expect(screen.getByText('P3 RETAINED')).toBeInTheDocument()
    expect(screen.getByLabelText(/Derivative profile: Display P3 \(Retained\)/i)).toBeInTheDocument()
  })

  it('supports keyboard navigation on the Optic Blade slider', () => {
    render(<AppWorkbench />)

    const bladeSlider = screen.getByRole('slider', { name: /Optic blade split comparison/i })
    expect(bladeSlider).toHaveAttribute('aria-valuenow', '50')

    fireEvent.keyDown(bladeSlider, { key: 'ArrowRight' })
    expect(bladeSlider).toHaveAttribute('aria-valuenow', '55')

    fireEvent.keyDown(bladeSlider, { key: 'ArrowLeft' })
    expect(bladeSlider).toHaveAttribute('aria-valuenow', '50')
  })

  it('safely handles pointer down when setPointerCapture throws or is unmapped', () => {
    render(<AppWorkbench />)
    const stage = document.querySelector('.mac-inspection-stage')
    expect(stage).toBeInTheDocument()

    const target = stage as HTMLElement
    target.setPointerCapture = () => {
      throw new DOMException('InvalidPointerId', 'NotFoundError')
    }

    expect(() => {
      fireEvent.pointerDown(target, { clientX: 300, pointerId: 999 })
    }).not.toThrow()
  })

  it('handles Clear Deck and Load Sample lifecycle transitions', () => {
    render(<AppWorkbench />)

    const clearButton = screen.getByRole('button', { name: /Clear Deck \(Esc\)/i })
    fireEvent.click(clearButton)

    // Now in empty state
    expect(screen.getByText('No Asset Staged')).toBeInTheDocument()
    expect(screen.getByText(/Drop a PNG, JPEG, or single-page PDF to preflight/i)).toBeInTheDocument()

    // Restore sample asset
    const loadSampleButton = screen.getByRole('button', { name: /Load Sample Asset/i })
    fireEvent.click(loadSampleButton)

    expect(screen.getByText('screenshot_export_p3.png')).toBeInTheDocument()
  })

  it('demonstrates simulated operational states through the state rail', () => {
    render(<AppWorkbench />)

    // Switch to Unsupported Format state
    const unsupportedBtn = screen.getByRole('button', { name: /Unsupported Format/i })
    fireEvent.click(unsupportedBtn)
    expect(screen.getByRole('heading', { name: /Unsupported File Container/i })).toBeInTheDocument()
    expect(screen.getByText(/raw_landscape_0920.cr3/i)).toBeInTheDocument()

    // Switch to Source Modified state
    const sourceChangedBtn = screen.getByRole('button', { name: /Source Modified/i })
    fireEvent.click(sourceChangedBtn)
    expect(screen.getByText(/Source File Modified \(Simulated State\)/i)).toBeInTheDocument()

    // Switch to Destination Error state
    const destErrorBtn = screen.getByRole('button', { name: /Destination Error/i })
    fireEvent.click(destErrorBtn)
    expect(screen.getByText(/Export Canceled \(Simulated State\)/i)).toBeInTheDocument()
  })

  it('triggers honest UI study simulation feedback on drag out with non-draggable button', () => {
    render(<AppWorkbench />)

    const dragBtn = screen.getByRole('button', { name: /Drag derivative to destination/i })
    expect(dragBtn).not.toHaveAttribute('draggable')

    fireEvent.click(dragBtn)

    expect(screen.getByText(/Interaction Study Note/i)).toBeInTheDocument()
    expect(
      screen.getByText(/Frontend Study Simulation: This study creates and exports no file/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Native export behavior, file generation, and pasteboard drag integration remain to be implemented/i)
    ).toBeInTheDocument()
  })

  it('rejects unverified runtime overclaims in app workbench', () => {
    const { container } = render(<AppWorkbench />)
    const content = container.textContent || ''

    expect(content).not.toContain('100% On-Device Privacy')
    expect(content).not.toContain('O_RDONLY')
    expect(content).not.toContain('Swift + Rust')
    expect(content).not.toContain('Oxipng')
    expect(content).not.toContain('Get Vessel for Mac')
    expect(content).not.toContain('SHA256 checksum changed')
  })
})
