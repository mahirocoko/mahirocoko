import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'

export const useHeroIntro = () => {
  const heroRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const hero = heroRef.current
    if (!hero || import.meta.env.MODE === 'test') return

    const media = gsap.matchMedia()

    media.add(
      {
        reduce: '(prefers-reduced-motion: reduce)',
        motion: '(prefers-reduced-motion: no-preference)',
      },
      (context) => {
        const conditions = context.conditions as { reduce: boolean; motion: boolean }
        const overline = hero.querySelector<HTMLElement>('.overline')
        const lines = gsap.utils.toArray<HTMLElement>('[data-motion-line]', hero)
        const lede = hero.querySelector<HTMLElement>('.hero-lede')
        const actions = hero.querySelector<HTMLElement>('.hero-actions')
        const spec = hero.querySelector<HTMLElement>('.hero-spec')
        const products = gsap.utils.toArray<HTMLElement>('.system-hero__product', hero)
        const productLabels = gsap.utils.toArray<HTMLElement>('.system-hero__product > span', hero)
        const rail = hero.querySelector<HTMLElement>('.system-hero__rail')
        const latches = gsap.utils.toArray<HTMLElement>('.system-hero__rail i', hero)
        const mediaCaption = hero.querySelector<HTMLElement>('.system-hero > p')
        const note = hero.querySelector<HTMLElement>('.hero-media__note')
        const targets = [overline, ...lines, lede, actions, spec, ...products, ...productLabels, rail, ...latches, mediaCaption, note]
          .filter((target): target is HTMLElement => target !== null)

        if (conditions.reduce) {
          gsap.set(targets, { clearProps: 'all' })
          return
        }

        gsap.set(targets, { willChange: 'transform, opacity, clip-path' })

        const timeline = gsap.timeline({
          paused: true,
          defaults: { ease: 'power3.out' },
          onComplete: () => gsap.set(targets, { clearProps: 'clipPath,transform,transformOrigin,opacity,visibility,willChange' }),
        })

        if (rail) timeline.from(rail, { autoAlpha: 0, scaleX: 0.62, transformOrigin: 'center center', duration: 0.5 }, 0)
        if (overline) timeline.from(overline, { autoAlpha: 0, x: -8, duration: 0.3 }, 0)
        if (lines.length) timeline.from(lines, { autoAlpha: 0, yPercent: 105, duration: 0.68, stagger: 0.085 }, 0.04)
        if (products.length) timeline.from(products, { autoAlpha: 0, y: 24, clipPath: 'inset(6% 0 0 0)', duration: 0.66, stagger: 0.09 }, 0.06)
        if (latches.length) timeline.from(latches, { autoAlpha: 0, scaleY: 0.25, transformOrigin: 'bottom center', duration: 0.3, stagger: 0.06 }, 0.16)
        if (productLabels.length) timeline.from(productLabels, { autoAlpha: 0, x: -6, duration: 0.26, stagger: 0.06 }, 0.4)
        if (lede) timeline.from(lede, { autoAlpha: 0, y: 10, duration: 0.42 }, 0.38)
        if (actions) timeline.from(actions, { autoAlpha: 0, y: 10, duration: 0.42 }, 0.52)
        if (mediaCaption) timeline.from(mediaCaption, { autoAlpha: 0, y: 5, duration: 0.3 }, 0.52)
        if (note) timeline.from(note, { autoAlpha: 0, x: 10, duration: 0.36 }, 0.6)
        if (spec) timeline.from(spec, { autoAlpha: 0, y: 10, duration: 0.44 }, 0.68)

        const animationFrame = requestAnimationFrame(() => timeline.play(0))

        return () => {
          cancelAnimationFrame(animationFrame)
          timeline.kill()
        }
      },
    )

    return () => media.revert()
  }, [])

  return heroRef
}
