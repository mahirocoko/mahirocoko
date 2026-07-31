import { REPO_URL, SETUP_URL } from '@/content'
import { ArrowUpRightIcon } from '@/components/icons'
import { Reveal } from '@/components/Reveal'

export function FinalCta() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative overflow-x-clip py-24 md:py-32"
    >
      <div
        className="halo-glow pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(234,88,12,0.12),rgba(22,163,74,0.07),transparent)]"
        aria-hidden
      />
      <div className="mx-auto flex w-full max-w-[800px] flex-col items-center px-5 text-center md:px-8">
        <Reveal>
          <img
            src="/assets/agent-halo-app-icon-256.png"
            alt=""
            width={96}
            height={96}
            className="size-20 rounded-[22%] shadow-lg ring-1 ring-neutral-900/10 md:size-24"
          />
        </Reveal>
        <Reveal delay={80}>
          <h2
            id="cta-heading"
            className="mt-8 text-balance text-3xl font-semibold leading-[1.12] tracking-tight text-neutral-900 sm:text-4xl md:text-5xl"
          >
            See every agent. Stay in flow.
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-5 max-w-xl text-pretty leading-relaxed text-neutral-600 md:text-lg">
            Agent Halo is a personal, actively used project — build it from
            source on your own Mac. No packaged download, no account, no
            hosted service.
          </p>
        </Reveal>
        <Reveal delay={200}>
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
      </div>
    </section>
  )
}
