import type { ReactNode } from 'react'

export interface IMacWindowProps {
  title: string
  children: ReactNode
}

/**
 * Decorative macOS-style window frame for the study.
 * The traffic-light dots are inert set dressing, not controls.
 */
export const MacWindow = ({ title, children }: IMacWindowProps) => {
  return (
    <div className="mac-window" role="group" aria-label={`${title} study window`}>
      <div className="mac-window__chrome">
        <span className="mac-window__lights" aria-hidden="true">
          <span className="mac-window__light mac-window__light--red" />
          <span className="mac-window__light mac-window__light--amber" />
          <span className="mac-window__light mac-window__light--green" />
        </span>
        <span className="mac-window__title">{title}</span>
        <span className="mac-window__badge">Local-first</span>
      </div>
      <div className="mac-window__body">{children}</div>
    </div>
  )
}
