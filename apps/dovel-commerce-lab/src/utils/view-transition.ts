import { flushSync } from 'react-dom'

interface ViewTransitionOptions {
  prepare?: () => void
  complete?: () => void
}

export const runViewTransition = (update: () => void, options: ViewTransitionOptions = {}) => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reducedMotion || !document.startViewTransition) {
    update()
    options.complete?.()
    return
  }

  if (options.prepare) flushSync(options.prepare)

  const transition = document.startViewTransition(() => {
    flushSync(update)
  })

  transition.finished.finally(() => options.complete?.())
}
