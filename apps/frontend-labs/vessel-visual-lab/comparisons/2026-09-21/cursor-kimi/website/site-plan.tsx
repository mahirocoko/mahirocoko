interface IRecipeStep {
  title: string
  description: string
  pill: string
}

const RECIPE_STEPS: IRecipeStep[] = [
  {
    title: 'Remove metadata & location',
    description: 'Strip EXIF, XMP, and GPS tags from the copy.',
    pill: '12 tags',
  },
  {
    title: 'Convert to sRGB',
    description: 'Preview how the copy maps to the sRGB gamut.',
    pill: 'Display-P3',
  },
  {
    title: 'Optimize delivery copy',
    description: 'Recompress the copy for smaller handoff.',
    pill: '−38%',
  },
]

interface ILifecycleStep {
  index: string
  title: string
  description: string
}

const LIFECYCLE_STEPS: ILifecycleStep[] = [
  {
    index: '01',
    title: 'Stage',
    description: 'Drop one PNG, JPEG, or single-page PDF onto the deck. Nothing changes on disk.',
  },
  {
    index: '02',
    title: 'Inspect',
    description: 'Expose metadata, dimensions, color profile, and byte size before anything changes.',
  },
  {
    index: '03',
    title: 'Choose',
    description: 'Select explicit derivative steps. Nothing is applied by default.',
  },
  {
    index: '04',
    title: 'Drag out',
    description: 'Preview source vs derivative, then drag the copy out. The original stays put.',
  },
]

interface IFaqItem {
  question: string
  answer: string
}

const FAQ_ITEMS: IFaqItem[] = [
  {
    question: 'Is Vessel a finished product?',
    answer:
      'No. What you are viewing is a frontend visual and interaction study. There is no production build, no download, and no release channel.',
  },
  {
    question: 'Does the app study export real files?',
    answer:
      'No. The app study creates and exports nothing. Its file facts, sizes, and savings are fictional samples that demonstrate the intended interface.',
  },
  {
    question: 'Which formats are in scope?',
    answer:
      'The intended input scope is deliberately narrow: PNG, JPEG, and single-page PDF. Anything else is treated as unsupported rather than guessed at.',
  },
  {
    question: 'Does the color preview prove conversion?',
    answer:
      'No. The sRGB comparison is a CSS approximation for orientation only. Native conversion proof is a claim this study explicitly does not make.',
  },
  {
    question: 'What happens to my original file?',
    answer:
      'In the target design, the source is a protected invariant: it is never mutated, and every derivative is a new copy you drag out yourself.',
  },
]

export const RecipeSection = () => {
  return (
    <section className="section recipe" aria-labelledby="recipe-title">
      <div className="section__head">
        <p className="section__eyebrow">Derivative recipe</p>
        <h2 className="section__title" id="recipe-title">
          Choose explicit derivative steps
        </h2>
        <p className="section__lede">
          A derivative is a recipe you can read at a glance. Each step is opt-in, each effect is
          previewed, and the combination is projected before anything is written.
        </p>
      </div>

      <ul className="recipe__list">
        {RECIPE_STEPS.map((step) => (
          <li className="recipe__item" key={step.title}>
            <div className="recipe__text">
              <h3 className="recipe__name">{step.title}</h3>
              <p className="recipe__desc">{step.description}</p>
            </div>
            <span className="recipe__pill">{step.pill}</span>
          </li>
        ))}
      </ul>

      <div className="recipe__invariant">
        <p className="recipe__invariant-label">Protected-source invariant</p>
        <p className="recipe__invariant-text">
          The original is never mutated. Every derivative is a new copy, created only when you drag
          it out — and in this study, not even then.
        </p>
      </div>
    </section>
  )
}

export const LifecycleSection = () => {
  return (
    <section className="section lifecycle" id="workflow" aria-labelledby="lifecycle-title">
      <div className="section__head">
        <p className="section__eyebrow">Workflow</p>
        <h2 className="section__title" id="lifecycle-title">
          Stage, inspect, choose, drag out
        </h2>
      </div>

      <ol className="lifecycle__list">
        {LIFECYCLE_STEPS.map((step) => (
          <li className="lifecycle__item" key={step.index}>
            <p className="lifecycle__head">
              <span className="lifecycle__index">{step.index}</span>
              <span className="lifecycle__name">{step.title}</span>
            </p>
            <p className="lifecycle__desc">{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export const BoundarySection = () => {
  return (
    <section className="section boundary" aria-labelledby="boundary-title">
      <div className="section__head">
        <p className="section__eyebrow">Boundaries</p>
        <h2 className="section__title" id="boundary-title">
          Local-first, narrow on purpose
        </h2>
        <p className="section__lede">
          Vessel&rsquo;s target boundary is a single-asset, on-device preflight step. No account, no
          upload, no background sync — a tool that runs where the file already is.
        </p>
      </div>

      <div className="boundary__grid">
        <div className="boundary__cell">
          <h3 className="boundary__name">Intended input scope</h3>
          <p className="boundary__text">
            PNG, JPEG, and single-page PDF. One asset at a time. Unsupported types are refused
            explicitly instead of being half-handled.
          </p>
        </div>
        <div className="boundary__cell">
          <h3 className="boundary__name">Local-first target</h3>
          <p className="boundary__text">
            The native design calls for no network dependency at all. This frontend study makes no
            network claims and verifies nothing about a runtime.
          </p>
        </div>
        <div className="boundary__cell">
          <h3 className="boundary__name">Honest limitations</h3>
          <p className="boundary__text">
            No real parsing, no real export, no universal format support, no guaranteed PII
            detection. Samples are fictional; the study demonstrates surfaces and states.
          </p>
        </div>
      </div>
    </section>
  )
}

export const FaqSection = () => {
  return (
    <section className="section faq" id="faq" aria-labelledby="faq-title">
      <div className="section__head">
        <p className="section__eyebrow">FAQ</p>
        <h2 className="section__title" id="faq-title">
          Asked plainly, answered plainly
        </h2>
      </div>

      <div className="faq__list">
        {FAQ_ITEMS.map((item) => (
          <details className="faq__item" key={item.question}>
            <summary className="faq__question">{item.question}</summary>
            <p className="faq__answer">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export const FinalCta = () => {
  return (
    <section className="section final-cta" aria-labelledby="final-cta-title">
      <h2 className="final-cta__title" id="final-cta-title">
        Try the instrument study
      </h2>
      <p className="final-cta__lede">
        The companion surface is a compact desktop window: stage the fictional sample, tune the
        recipe, work the Optic Blade. It creates and exports no file.
      </p>
      <a className="btn btn--primary" href="/app/">
        Open the app study
      </a>
    </section>
  )
}
