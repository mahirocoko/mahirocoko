import { useEffect, type RefObject } from 'react'

export const useModalFocus = (
  open: boolean,
  panelRef: RefObject<HTMLElement | null>,
  onClose: () => void,
) => {
  useEffect(() => {
    if (!open) return
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const panel = panelRef.current
    const autofocus = panel?.querySelector<HTMLElement>('[data-autofocus]')
    const firstFocusable = panel?.querySelector<HTMLElement>('button, [href], input')
    const first = autofocus ?? firstFocusable
    first?.focus()
    document.body.dataset.modalOpen = 'true'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panel) return
      const focusable = [...panel.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled])')]
        .filter((element) => element.offsetParent !== null || element === document.activeElement)
      if (focusable.length === 0) return
      const firstFocusable = focusable[0]
      const lastFocusable = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault()
        lastFocusable.focus()
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault()
        firstFocusable.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      delete document.body.dataset.modalOpen
      previousFocus?.focus()
    }
  }, [open, onClose, panelRef])
}
