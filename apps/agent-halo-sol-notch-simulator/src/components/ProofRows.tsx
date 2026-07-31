import { proofRows, type ProofRow } from '@/content'
import { CheckIcon } from '@/components/icons'
import { Reveal } from '@/components/Reveal'
import { ShotFrame } from '@/components/ShotFrame'

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-medium text-neutral-700 ring-1 ring-neutral-900/10">
      <span className="size-1.5 rounded-full bg-halo-orange" aria-hidden />
      {label}
    </span>
  )
}

function RowCopy({ row }: { row: ProofRow }) {
  return (
    <div className="max-w-[528px]">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-halo-orange">
        {row.eyebrow}
      </p>
      <h2
        id={`${row.id}-heading`}
        className="mt-3 text-balance text-3xl font-semibold leading-[1.15] tracking-tight text-neutral-900 md:text-4xl"
      >
        {row.title}
      </h2>
      <p className="mt-5 text-pretty leading-relaxed text-neutral-600 md:text-[17px]">
        {row.body}
      </p>

      {row.chips ? (
        <ul className="mt-7 flex flex-wrap gap-2.5" aria-label="Highlights">
          {row.chips.map((chip) => (
            <li key={chip}>
              <Chip label={chip} />
            </li>
          ))}
        </ul>
      ) : null}

      {row.subHeading && row.subChips ? (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-neutral-900">
            {row.subHeading}
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {row.subChips.map((chip) => (
              <li key={chip}>
                <Chip label={chip} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {row.checks ? (
        <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {row.checks.map((check) => (
            <li
              key={check}
              className="flex items-center gap-3 text-[15px] font-medium text-neutral-800"
            >
              <span
                className="flex size-5 shrink-0 items-center justify-center rounded-full bg-halo-green-soft text-halo-green"
                aria-hidden
              >
                <CheckIcon className="size-3" />
              </span>
              {check}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export function ProofRows() {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-20 px-5 pb-8 md:gap-28 md:px-8 lg:gap-32">
      {proofRows.map((row, index) => {
        const flip = index % 2 === 1
        return (
          <section
            key={row.id}
            id={row.id}
            aria-labelledby={`${row.id}-heading`}
            className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
          >
            <Reveal className={flip ? 'lg:order-2 lg:justify-self-end' : ''}>
              <RowCopy row={row} />
            </Reveal>
            <Reveal
              delay={120}
              className={flip ? 'lg:order-1' : 'lg:justify-self-end'}
            >
              <ShotFrame
                {...row.image}
                alt={row.imageAlt}
                title={`Agent Halo — ${row.eyebrow}`}
              />
            </Reveal>
          </section>
        )
      })}
    </div>
  )
}
