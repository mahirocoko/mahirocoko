import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const useReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = () => setReducedMotion(media.matches)

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  return reducedMotion
}

export const useExperience = (reducedMotion: boolean) => {
  useEffect(() => {
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    const context = gsap.context(() => {
      if (reducedMotion) {
        gsap.set('[data-reveal]', { clearProps: 'all' })
        return
      }

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.fromTo(
          element,
          { y: 34 },
          {
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            clearProps: 'transform',
            scrollTrigger: {
              trigger: element,
              start: 'top 88%',
              once: true,
            },
          },
        )
      })

      const score = document.querySelector<HTMLElement>('[data-score]')
      const field = document.querySelector<HTMLElement>('[data-score-field]')
      const chapters = gsap.utils.toArray<HTMLElement>('[data-score-chapter]')

      if (score && field && chapters.length) {
        ScrollTrigger.create({
          trigger: score,
          start: 'top 60%',
          end: 'bottom 40%',
          onUpdate: ({ progress }) => {
            const active = Math.min(chapters.length - 1, Math.floor(progress * chapters.length))
            field.style.setProperty('--score-progress', progress.toFixed(4))
            field.dataset.active = String(active)
            chapters.forEach((chapter, index) => {
              chapter.dataset.active = String(index === active)
            })
          },
        })
      }
    })

    if (reducedMotion || coarsePointer) {
      ScrollTrigger.refresh()
      return () => context.revert()
    }

    const lenis = new Lenis({
      lerp: 0.095,
      smoothWheel: true,
      syncTouch: false,
    })
    const update = (time: number) => lenis.raf(time * 1000)
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(update)
      lenis.destroy()
      context.revert()
    }
  }, [reducedMotion])
}
