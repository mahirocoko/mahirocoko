import type { ComponentType, SVGProps } from 'react'
import { featureIndex, type IconKey } from '@/content'
import {
  AttentionIcon,
  FocusIcon,
  GaugeIcon,
  LockIcon,
  PetIcon,
  SessionsIcon,
  TimerIcon,
} from '@/components/icons'
import { Reveal } from '@/components/Reveal'

const featureIcons: Record<IconKey, ComponentType<SVGProps<SVGSVGElement>>> = {
  sessions: SessionsIcon,
  attention: AttentionIcon,
  focus: FocusIcon,
  timer: TimerIcon,
  pet: PetIcon,
  gauge: GaugeIcon,
  lock: LockIcon,
}

export function FeatureIndex() {
  return (
    <section
      id="features"
      aria-label="Feature index"
      className="mx-auto w-full max-w-[1000px] px-5 py-20 md:px-8 md:py-24 lg:py-28"
    >
      <ul className="flex flex-wrap justify-center gap-x-6 gap-y-10 md:gap-x-10">
        {featureIndex.map((feature, index) => {
          const Icon = featureIcons[feature.icon]
          return (
            <li key={feature.title} className="w-[150px] md:w-[200px]">
              <Reveal
                delay={index * 60}
                className="flex flex-col items-center gap-4 text-center"
              >
                <span className="flex size-16 items-center justify-center rounded-2xl bg-neutral-50 text-neutral-800 ring-1 ring-neutral-900/8">
                  <Icon className="size-8" />
                </span>
                <h3 className="text-[15px] font-medium leading-snug text-neutral-800">
                  {feature.title}
                </h3>
              </Reveal>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
