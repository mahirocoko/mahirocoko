import { useRef, useState, type KeyboardEvent } from 'react'
import { Reveal } from '@/components/Reveal'
import {
  getNotchState,
  getStateAnnouncement,
  notchStates,
  type NotchStateId,
} from '@/simulator/states'

export function NotchSimulator() {
  const [activeId, setActiveId] = useState<NotchStateId>('working')
  const [liveMessage, setLiveMessage] = useState('')
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])
  const active = getNotchState(activeId)

  const selectState = (id: NotchStateId, moveFocus: boolean) => {
    const nextState = getNotchState(id)

    if (id !== activeId) {
      setActiveId(id)
      setLiveMessage(getStateAnnouncement(nextState))
    }

    if (moveFocus) {
      const nextIndex = notchStates.findIndex((state) => state.id === id)
      buttonRefs.current[nextIndex]?.focus()
    }
  }

  const onGroupKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return

    const index = notchStates.findIndex((state) => state.id === activeId)
    let next = index
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      next = (index + 1) % notchStates.length
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      next = (index - 1 + notchStates.length) % notchStates.length
    } else if (event.key === 'Home') {
      next = 0
    } else if (event.key === 'End') {
      next = notchStates.length - 1
    } else {
      return
    }
    event.preventDefault()
    const nextState = notchStates[next] ?? notchStates[0]
    selectState(nextState.id, true)
  }

  return (
    <section
      id="preview"
      aria-labelledby="preview-heading"
      className="mx-auto w-full max-w-[1000px] px-5 pt-4 pb-20 md:px-8 md:pb-24"
    >
      <Reveal className="flex flex-col items-center text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-halo-orange">
          Interactive preview
        </p>
        <h2
          id="preview-heading"
          className="mt-3 text-balance text-3xl font-semibold leading-[1.15] tracking-tight text-neutral-900 md:text-4xl"
        >
          Try the notch, right here
        </h2>
        <p className="mt-5 max-w-xl text-pretty leading-relaxed text-neutral-600 md:text-[17px]">
          A simulated preview of Agent Halo's notch states — not a live Letta
          session. Every state maps to a real status the app projects locally
          on your Mac.
        </p>
      </Reveal>

      <Reveal delay={120}>
        <figure className="mt-12 overflow-hidden rounded-2xl bg-white shadow-[0_24px_64px_-24px_rgba(17,24,39,0.25)] ring-1 ring-neutral-900/10">
          <div className="relative h-11 border-b border-neutral-900/5 bg-neutral-50">
            <div
              className="absolute left-4 top-1/2 hidden -translate-y-1/2 items-center gap-3 text-[11px] font-medium text-neutral-400 sm:flex"
              aria-hidden
            >
              <span className="text-neutral-600">Letta Code</span>
              <span>Presence</span>
              <span>Ritual</span>
              <span>Window</span>
            </div>
            <div
              className="absolute right-4 top-1/2 hidden -translate-y-1/2 items-center gap-3 text-[11px] font-medium text-neutral-400 md:flex"
              aria-hidden
            >
              <span>Bridge 127.0.0.1</span>
              <span className="flex items-center gap-1.5 text-halo-green">
                <span className="size-1.5 rounded-full bg-halo-green" />
                Local only
              </span>
            </div>

            <div
              className={`absolute left-1/2 top-0 -translate-x-1/2 bg-neutral-950 shadow-lg transition-[width,height] duration-300 ease-out ${
                active.id === 'idle'
                  ? 'h-[18px] w-[120px] rounded-b-[10px]'
                  : `h-[76px] w-[min(360px,calc(100%-2rem))] rounded-b-2xl ${active.notchRingClass}`
              }`}
              aria-hidden
            >
              {active.id === 'idle' ? (
                <span className="mx-auto mt-[7px] block size-1 rounded-full bg-neutral-700" />
              ) : (
                <div
                  key={active.id}
                  className="notch-pop flex h-full items-center gap-3 px-4"
                >
                  <span
                    className={`size-2 shrink-0 rounded-full ${active.dotClass}`}
                  />
                  <div className="min-w-0 text-left">
                    <p
                      className={`truncate text-[13px] font-semibold ${active.titleClass}`}
                    >
                      {active.title}
                    </p>
                    <p className="truncate text-[11px] text-neutral-400">
                      {active.subtitle}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex min-h-[120px] flex-col items-center justify-end px-5 pt-14 pb-5 text-center">
            <div>
              <p
                key={active.id}
                className="notch-pop text-sm font-semibold text-neutral-900"
              >
                {active.captionTitle}
              </p>
              <p className="mx-auto mt-1.5 max-w-md text-pretty text-[13px] leading-relaxed text-neutral-500">
                {active.caption}
              </p>
            </div>
            <p className="sr-only" role="status" aria-atomic="true">
              {liveMessage}
            </p>
          </div>

          <div
            role="radiogroup"
            aria-label="Notch preview state"
            aria-describedby="preview-disclaimer"
            onKeyDown={onGroupKeyDown}
            className="flex flex-wrap items-center justify-center gap-2 border-t border-neutral-900/5 bg-neutral-50/60 px-4 py-4"
          >
            {notchStates.map((state, index) => {
              const selected = state.id === activeId
              return (
                <button
                  key={state.id}
                  ref={(el) => {
                    buttonRefs.current[index] = el
                  }}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => selectState(state.id, true)}
                  className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 ${
                    selected
                      ? 'bg-neutral-900 text-white ring-1 ring-neutral-900'
                      : 'bg-white text-neutral-700 ring-1 ring-neutral-900/10 hover:bg-neutral-100'
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full ${state.dotClass}`}
                    aria-hidden
                  />
                  {state.label}
                </button>
              )
            })}
          </div>
          <figcaption
            id="preview-disclaimer"
            className="border-t border-neutral-900/5 px-5 py-3 text-center text-[13px] text-neutral-500"
          >
            Simulated preview — display only. No session control, no approval
            actions, no live data.
          </figcaption>
        </figure>
      </Reveal>
    </section>
  )
}
