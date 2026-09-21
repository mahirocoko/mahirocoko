import { useCallback, useId, useRef, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'

export interface IOpticBladeProps {
  src: string
  alt: string
  position: number
  onPositionChange: (value: number) => void
  disabled?: boolean
  label?: string
  handle: 'reticle' | 'plus'
  caption?: ReactNode
  children?: ReactNode
}

const clamp = (value: number): number => Math.min(100, Math.max(0, value))

export const OpticBlade = ({
  src,
  alt,
  position,
  onPositionChange,
  disabled = false,
  label = 'Compare source and derivative',
  handle,
  caption,
  children,
}: IOpticBladeProps) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const labelId = useId()

  const setFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current
      if (!track || disabled) return
      const rect = track.getBoundingClientRect()
      if (rect.width === 0) return
      onPositionChange(clamp(((clientX - rect.left) / rect.width) * 100))
    },
    [disabled, onPositionChange],
  )

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    setFromClientX(event.clientX)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || !event.currentTarget.hasPointerCapture(event.pointerId)) return
    setFromClientX(event.clientX)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    const step = event.shiftKey ? 10 : 2
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault()
      onPositionChange(clamp(position - step))
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault()
      onPositionChange(clamp(position + step))
    } else if (event.key === 'Home') {
      event.preventDefault()
      onPositionChange(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      onPositionChange(100)
    } else if (event.key === 'PageDown') {
      event.preventDefault()
      onPositionChange(clamp(position - 10))
    } else if (event.key === 'PageUp') {
      event.preventDefault()
      onPositionChange(clamp(position + 10))
    }
  }

  return (
    <div className="optic-blade" ref={trackRef}>
      <p className="sr-only" id={labelId}>
        {label}. Use arrow keys to move the comparison blade.
      </p>
      <img className="optic-blade__full optic-blade__derivative" src={src} alt="" />
      <div className="optic-blade__source" style={{ width: `${position}%` }}>
        <img className="optic-blade__full" src={src} alt="" />
      </div>
      <div
        className={disabled ? 'optic-blade__slider is-disabled' : 'optic-blade__slider'}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-labelledby={labelId}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-valuetext={`${Math.round(position)} percent source, ${Math.round(100 - position)} percent derivative`}
        aria-disabled={disabled || undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onKeyDown={onKeyDown}
      >
        <span className="optic-blade__rule" style={{ left: `${position}%` }} />
        <span className={`optic-blade__handle optic-blade__handle--${handle}`} style={{ left: `${position}%` }}>
          {handle === 'plus' ? <span aria-hidden="true">+</span> : <span className="optic-blade__reticle" aria-hidden="true" />}
        </span>
        {caption ? (
          <span className="optic-blade__caption" style={{ left: `${position}%` }}>
            {caption}
          </span>
        ) : null}
      </div>
      <img className="sr-only" src={src} alt={alt} />
      {children}
    </div>
  )
}
