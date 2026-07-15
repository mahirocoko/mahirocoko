import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const SELECTOR = '[data-motion-overline], [data-motion-line], [data-motion-copy], [data-motion-rule], [data-motion-frame], [data-motion-item]'

export const useSectionIntro = <T extends HTMLElement>() => {
  const sectionRef = useRef<T>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section || import.meta.env.MODE === 'test') return

    gsap.registerPlugin(ScrollTrigger)

    const media = gsap.matchMedia()

    media.add(
      {
        mobile: '(max-width: 800px)',
        desktop: '(min-width: 801px)',
        reduce: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const conditions = context.conditions as { mobile: boolean; desktop: boolean; reduce: boolean }
        const targets = gsap.utils.toArray<HTMLElement>(SELECTOR, section)

        if (conditions.reduce) {
          gsap.set(targets, { clearProps: 'all' })
          return
        }

        const overlines = gsap.utils.toArray<HTMLElement>('[data-motion-overline]', section)
        const lines = gsap.utils.toArray<HTMLElement>('[data-motion-line]', section)
        const copy = gsap.utils.toArray<HTMLElement>('[data-motion-copy]', section)
        const rules = gsap.utils.toArray<HTMLElement>('[data-motion-rule]', section)
        const frames = gsap.utils.toArray<HTMLElement>('[data-motion-frame]', section)
        const items = gsap.utils.toArray<HTMLElement>('[data-motion-item]', section)
        const groups = gsap.utils.toArray<HTMLElement>('[data-motion-group]', section)
        const mainTargets = [...overlines, ...lines, ...copy, ...rules, ...frames]
        const travel = conditions.mobile ? 10 : 16

        if (mainTargets.length) gsap.set(mainTargets, { willChange: 'transform, opacity' })
        if (items.length) gsap.set(items, { willChange: 'transform, opacity' })

        const timeline = gsap.timeline({
          paused: true,
          defaults: { ease: 'power3.out' },
          onComplete: () => {
            if (mainTargets.length) gsap.set(mainTargets, { clearProps: 'transform,transformOrigin,opacity,visibility,willChange' })
          },
        })

        if (overlines.length) timeline.from(overlines, { autoAlpha: 0, x: -8, duration: 0.3 })
        if (lines.length) timeline.from(lines, { autoAlpha: 0, yPercent: 105, duration: conditions.mobile ? 0.58 : 0.68, stagger: 0.08 }, overlines.length ? '-=0.12' : 0)
        if (copy.length) timeline.from(copy, { autoAlpha: 0, y: travel * 0.65, duration: 0.42, stagger: 0.05 }, '-=0.32')
        if (rules.length) timeline.from(rules, { autoAlpha: 0, scaleX: 0, transformOrigin: 'left center', duration: 0.48, stagger: 0.06 }, '-=0.28')
        if (frames.length) timeline.from(frames, { autoAlpha: 0, y: travel, duration: 0.56, stagger: 0.06 }, '-=0.3')

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: conditions.mobile ? 'top 74%' : 'top 72%',
          once: true,
          onEnter: () => timeline.play(),
        })

        const groupedItems = new Set(groups.flatMap((group) => gsap.utils.toArray<HTMLElement>('[data-motion-item]', group)))
        const itemSets = groups
          .map((group) => ({
            trigger: group,
            delay: Number(group.dataset.motionGroupDelay ?? 0),
            start: group.dataset.motionGroupStart,
            items: gsap.utils.toArray<HTMLElement>('[data-motion-item]', group),
          }))
          .filter((group) => group.items.length)
        const looseItems = items.filter((item) => !groupedItems.has(item))
        if (looseItems.length) itemSets.push({ trigger: looseItems[0], delay: 0, start: undefined, items: looseItems })

        const itemControllers = itemSets.map((itemSet) => {
          const itemTimeline = gsap.timeline({
            paused: true,
            delay: itemSet.delay,
            defaults: { ease: 'power3.out' },
            onStart: () => { itemSet.trigger.dataset.motionActive = 'true' },
            onComplete: () => {
              gsap.set(itemSet.items, { clearProps: 'transform,transformOrigin,opacity,visibility,willChange' })
              itemSet.trigger.dataset.motionActive = 'false'
            },
          }).from(itemSet.items, { autoAlpha: 0, y: travel * 0.8, duration: 0.46, stagger: conditions.mobile ? 0.045 : 0.065 })

          const itemTrigger = ScrollTrigger.create({
            trigger: itemSet.trigger,
            start: itemSet.start === 'bottom' ? 'top bottom-=8' : conditions.mobile ? 'top 88%' : 'top 84%',
            once: true,
            onEnter: () => itemTimeline.play(),
          })

          return { itemTimeline, itemTrigger, itemElement: itemSet.trigger }
        })

        return () => {
          trigger.kill()
          timeline.kill()
          itemControllers.forEach(({ itemTimeline, itemTrigger, itemElement }) => {
            itemTrigger.kill()
            itemElement.dataset.motionActive = 'false'
            itemTimeline.kill()
          })
        }
      },
    )

    return () => media.revert()
  }, [])

  return sectionRef
}
