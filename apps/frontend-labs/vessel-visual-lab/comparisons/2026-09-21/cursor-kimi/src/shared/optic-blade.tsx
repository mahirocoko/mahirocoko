import { useCallback, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import './optic-blade.css'

export interface IOpticBladeProps {
  imageSrc: string
  imageAlt: string
  theme?: 'light' | 'dark'
  /** Simulated derivative treatment applied to the right-hand layer. */
  derivativeFilter?: string
  defaultPosition?: number
  disabled?: boolean
  dimmed?: boolean
  /** Centered overlay chip, e.g. a transient state label. */
  overlayLabel?: string | null
  overlayTone?: 'cyan' | 'amber' | 'neutral'
  sourceChip?: string
  derivativeChip?: string
  ariaLabel?: string
}

const clamp = (value: number): number => Math.min(100, Math.max(0, value))

const STEP = 2
const PAGE_STEP = 10

export const OpticBlade = ({
  imageSrc,
  imageAlt,
  theme = 'light',
  derivativeFilter,
  defaultPosition = 50,
  disabled = false,
  dimmed = false,
  overlayLabel = null,
  overlayTone = 'neutral',
  sourceChip = 'Source',
  derivativeChip = 'Derivative',
  ariaLabel = 'Optic Blade source versus derivative comparison',
}: IOpticBladeProps) => {
  const [position, setPosition] = useState<number>(defaultPosition)
  const surfaceRef = useRef<HTMLDivElement | null>(null)
  const draggingRef = useRef<boolean>(false)

  const positionFromClientX = useCallback((clientX: number): number => {
    const surface = surfaceRef.current
    if (!surface) return 50
    const rect = surface.getBoundingClientRect()
    if (rect.width === 0) return 50
    return clamp(((clientX - rect.left) / rect.width) * 100)
  }, [])

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>): void => {
    if (disabled) return
    draggingRef.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
    setPosition(positionFromClientX(event.clientX))
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>): void => {
    if (disabled || !draggingRef.current) return
    setPosition(positionFromClientX(event.clientX))
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>): void => {
    draggingRef.current = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (disabled) return
    const key = event.key
    let next: number | null = null
    if (key === 'ArrowLeft' || key === 'ArrowDown') next = clamp(position - STEP)
    if (key === 'ArrowRight' || key === 'ArrowUp') next = clamp(position + STEP)
    if (key === 'PageDown') next = clamp(position - PAGE_STEP)
    if (key === 'PageUp') next = clamp(position + PAGE_STEP)
    if (key === 'Home') next = 0
    if (key === 'End') next = 100
    if (next !== null) {
      event.preventDefault()
      setPosition(next)
    }
  }

  const showSourceChip = position >= 16
  const showDerivativeChip = position <= 84

  const rootClass = [
    'optic-blade',
    `optic-blade--${theme}`,
    dimmed ? 'is-dimmed' : '',
    disabled ? 'is-disabled' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      ref={surfaceRef}
      className={rootClass}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      data-testid="optic-blade"
    >
      <img className="optic-blade__img" src={imageSrc} alt={imageAlt} draggable={false} />
      <div
        className="optic-blade__derivative"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
        aria-hidden="true"
      >
        <img
          className="optic-blade__img"
          src={imageSrc}
          alt=""
          draggable={false}
          style={derivativeFilter ? { filter: derivativeFilter } : undefined}
        />
      </div>

      <div className="optic-blade__divider" style={{ left: `${position}%` }} aria-hidden="true" />

      <div
        className="optic-blade__handle"
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-valuetext={`Derivative revealed from ${Math.round(position)} percent`}
        aria-disabled={disabled}
        style={{ left: `${position}%` }}
        onKeyDown={handleKeyDown}
      >
        <span className="optic-blade__handle-glyph" aria-hidden="true">
          ◂▸
        </span>
      </div>

      {showSourceChip ? <span className="optic-blade__chip optic-blade__chip--source">{sourceChip}</span> : null}
      {showDerivativeChip ? (
        <span className="optic-blade__chip optic-blade__chip--derivative">{derivativeChip}</span>
      ) : null}

      {overlayLabel ? (
        <span className={`optic-blade__overlay optic-blade__overlay--${overlayTone}`}>{overlayLabel}</span>
      ) : null}
    </div>
  )
}
