import { useEffect, useRef, useState } from 'react'

const useSectionVisibility = <ElementType extends HTMLElement>(threshold = 0.2) => {
  const ref = useRef<ElementType>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (typeof IntersectionObserver !== 'function') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold })
    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, visible }
}

export { useSectionVisibility }
