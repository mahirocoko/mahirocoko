import { REPO_URL, SETUP_URL } from '@/content'
import { ArrowUpRightIcon } from '@/components/icons'
import { Reveal } from '@/components/Reveal'
import { ShotFrame } from '@/components/ShotFrame'
import { rasterAssets } from '@/assets'

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-x-clip pt-32 md:pt-40 lg:pt-44"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-5 text-center md:px-8">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full bg-neutral-50 px-4 py-1.5 text-[13px] font-medium text-neutral-600 ring-1 ring-neutral-900/10">
            <span className="size-1.5 rounded-full bg-halo-green" aria-hidden />
            Local-first · Notch-native · Read-only
          </p>
        </Reveal>

        <Reveal delay={80}>
          <img
            src="/assets/agent-halo-app-icon-256.png"
            alt="Agent Halo app icon"
            width={96}
            height={96}
            className="mt-8 size-20 rounded-[22%] shadow-lg ring-1 ring-neutral-900/10 md:size-24"
          />
        </Reveal>

        <Reveal delay={140}>
          <h1
            id="hero-heading"
            className="mt-8 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-neutral-900 sm:text-5xl md:text-6xl lg:text-[68px]"
          >
            Live presence for{' '}
            <span className="text-halo-orange">Letta Code</span>, around the
            macOS notch
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-neutral-600 md:text-lg">
            Agent Halo is a quiet local companion that turns trusted Letta Code
            mod events into a compact presence surface — sessions, needs-input
            attention, focus rituals, and private local tooling. No hosted
            dashboard, no telemetry.
          </p>
        </Reveal>

        <Reveal delay={260}>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full bg-neutral-900 px-7 py-3.5 text-base font-medium text-white transition-colors hover:bg-neutral-700 outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            >
              View source
              <ArrowUpRightIcon className="size-5" />
            </a>
            <a
              href={SETUP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-base font-medium text-neutral-900 ring-1 ring-neutral-900/15 transition-colors hover:bg-neutral-50 outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            >
              Read setup guide
            </a>
          </div>
        </Reveal>

        <Reveal delay={200} className="relative mt-16 w-full md:mt-20">
          <div
            className="halo-glow pointer-events-none absolute -inset-x-16 -top-10 bottom-8 -z-10 mx-auto max-w-4xl rounded-full bg-[radial-gradient(closest-side,rgba(234,88,12,0.14),rgba(22,163,74,0.08),transparent)] blur-2xl"
            aria-hidden
          />
          <ShotFrame
            {...rasterAssets.attentionOpen}
            alt="Agent Halo notch panel open on macOS, showing a Letta Code session waiting for input"
            title="Agent Halo — notch panel"
            priority
          />
        </Reveal>
      </div>
    </section>
  )
}
