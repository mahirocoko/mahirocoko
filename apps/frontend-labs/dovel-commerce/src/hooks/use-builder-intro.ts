import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export const useBuilderIntro = () => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef<HTMLFormElement>(null)

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    const controls = controlsRef.current
    if (!canvas || !controls || import.meta.env.MODE === 'test') return

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
        const toolbar = canvas.querySelector<HTMLElement>('.canvas-toolbar')
        const preview = canvas.querySelector<HTMLElement>('.builder-preview-stage')
        const note = canvas.querySelector<HTMLElement>('.canvas-note')
        const canvasTargets = [canvas, toolbar, preview, note].filter((target): target is HTMLElement => target !== null)
        const controlTargets = [
          ...gsap.utils.toArray<HTMLElement>('fieldset', controls),
          ...gsap.utils.toArray<HTMLElement>('.builder-total', controls),
        ]

        if (conditions.reduce) {
          gsap.set([...canvasTargets, ...controlTargets], { clearProps: 'all' })
          return
        }

        gsap.set([...canvasTargets, ...controlTargets], { willChange: 'transform, opacity' })

        const canvasTimeline = gsap.timeline({
          paused: true,
          defaults: { ease: 'power3.out' },
          onComplete: () => gsap.set(canvasTargets, { clearProps: 'clipPath,transform,transformOrigin,opacity,visibility,willChange' }),
        })
          .from(canvas, { autoAlpha: 0, clipPath: 'inset(0 0 16% 0)', duration: 0.38 })
          .from(toolbar, { autoAlpha: 0, y: -5, duration: 0.24 }, '-=0.18')
          .from(preview, { autoAlpha: 0, y: conditions.mobile ? 9 : 14, scale: 0.985, duration: 0.46 }, '-=0.18')
          .from(note, { autoAlpha: 0, duration: 0.24 }, '-=0.12')

        const controlsTimeline = gsap.timeline({
          paused: true,
          defaults: { ease: 'power3.out' },
          onComplete: () => gsap.set(controlTargets, { clearProps: 'transform,opacity,visibility,willChange' }),
        }).from(controlTargets, {
          autoAlpha: 0,
          x: conditions.mobile ? 0 : 12,
          y: conditions.mobile ? 10 : 0,
          duration: 0.42,
          stagger: 0.065,
        })

        const canvasTrigger = ScrollTrigger.create({
          trigger: canvas,
          start: conditions.mobile ? 'top 86%' : 'top 82%',
          once: true,
          onEnter: () => canvasTimeline.play(),
        })
        const controlsTrigger = ScrollTrigger.create({
          trigger: controls,
          start: conditions.mobile ? 'top 86%' : 'top 82%',
          once: true,
          onEnter: () => controlsTimeline.play(),
        })

        return () => {
          canvasTrigger.kill()
          controlsTrigger.kill()
          canvasTimeline.kill()
          controlsTimeline.kill()
        }
      },
    )

    return () => media.revert()
  }, [])

  return { canvasRef, controlsRef }
}
