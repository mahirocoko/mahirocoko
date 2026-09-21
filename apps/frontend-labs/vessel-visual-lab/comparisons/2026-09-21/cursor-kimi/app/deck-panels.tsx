import type { IRecipeSelection, ISourceFacts } from '../src/shared/facts'
import { sourceFactsLine } from '../src/shared/facts'
import type { DeckStatus, ITelemetry } from './study-model'

/* ---------- derivative recipe column ---------- */

interface IRecipeStepDef {
  key: keyof IRecipeSelection
  title: string
  description: string
  pill: string
}

const RECIPE_STEPS: IRecipeStepDef[] = [
  {
    key: 'removeMetadata',
    title: 'Remove metadata & location',
    description: 'Strip EXIF, XMP, and GPS tags from the copy.',
    pill: '12 tags',
  },
  {
    key: 'convertSrgb',
    title: 'Convert to sRGB',
    description: 'Preview how the copy maps to the sRGB gamut.',
    pill: 'Display-P3',
  },
  {
    key: 'optimize',
    title: 'Optimize delivery copy',
    description: 'Recompress the copy for smaller handoff.',
    pill: '−38%',
  },
]

export interface IRecipePanelProps {
  recipe: IRecipeSelection
  disabled: boolean
  onToggle: (key: keyof IRecipeSelection) => void
}

export const RecipePanel = ({ recipe, disabled, onToggle }: IRecipePanelProps) => {
  return (
    <section className="deck-col" aria-labelledby="recipe-label">
      <h2 className="deck-col__label" id="recipe-label">
        Derivative recipe
      </h2>
      <div className="recipe-rows">
        {RECIPE_STEPS.map((step) => {
          const inputId = `recipe-${step.key}`
          return (
            <div className="recipe-row" key={step.key}>
              <input
                className="recipe-row__check"
                type="checkbox"
                id={inputId}
                checked={recipe[step.key]}
                disabled={disabled}
                onChange={() => onToggle(step.key)}
              />
              <label className="recipe-row__text" htmlFor={inputId}>
                <span className="recipe-row__title">{step.title}</span>
                <span className="recipe-row__desc">{step.description}</span>
              </label>
              <span className="recipe-row__pill">{step.pill}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ---------- source column ---------- */

export interface ISourcePanelProps {
  status: DeckStatus
  facts: ISourceFacts | null
  unsupportedFacts: ISourceFacts | null
  onLoadSample: () => void
  onClear: () => void
  onReinspect: () => void
}

export const SourcePanel = ({
  status,
  facts,
  unsupportedFacts,
  onLoadSample,
  onClear,
  onReinspect,
}: ISourcePanelProps) => {
  return (
    <section className="deck-col" aria-labelledby="source-label">
      <h2 className="deck-col__label" id="source-label">
        Source
      </h2>

      {status === 'empty' ? (
        <div className="source-panel__empty">
          <p className="source-panel__none">No source staged</p>
          <p className="source-panel__hint">PNG · JPEG · single-page PDF</p>
          <button type="button" className="deck-btn" onClick={onLoadSample}>
            Load Sample Asset
          </button>
        </div>
      ) : null}

      {facts ? (
        <div className="source-panel__facts">
          <p className="source-panel__name">{facts.fileName}</p>
          <p className="source-panel__line">{sourceFactsLine(facts)}</p>
          <div className="source-panel__actions">
            <button type="button" className="deck-btn" onClick={onClear}>
              Clear Deck
            </button>
            {status === 'source-changed' ? (
              <button type="button" className="deck-btn deck-btn--accent" onClick={onReinspect}>
                Re-inspect
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {unsupportedFacts ? (
        <div className="source-panel__facts">
          <p className="source-panel__name">{unsupportedFacts.fileName}</p>
          <p className="source-panel__line">
            {unsupportedFacts.format} · outside the intended scope
          </p>
          <div className="source-panel__actions">
            <button type="button" className="deck-btn" onClick={onClear}>
              Clear Deck
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}

/* ---------- derivative telemetry column ---------- */

export interface ITelemetryPanelProps {
  telemetry: ITelemetry | null
}

export const TelemetryPanel = ({ telemetry }: ITelemetryPanelProps) => {
  const rows: Array<{ label: string; value: string }> = telemetry
    ? [
        { label: 'Projected size', value: telemetry.projectedSize },
        { label: 'Metadata in copy', value: telemetry.metadata },
        { label: 'Color target', value: telemetry.colorTarget },
      ]
    : [
        { label: 'Projected size', value: '—' },
        { label: 'Metadata in copy', value: '—' },
        { label: 'Color target', value: '—' },
      ]

  return (
    <section className="deck-col" aria-labelledby="telemetry-label">
      <h2 className="deck-col__label" id="telemetry-label">
        Derivative telemetry
      </h2>
      <dl className="telemetry-rows">
        {rows.map((row) => (
          <div className="telemetry-row" key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/* ---------- non-blocking study notice ---------- */

export interface IStudyNoticeProps {
  message: string
  onDismiss: () => void
}

export const StudyNotice = ({ message, onDismiss }: IStudyNoticeProps) => {
  return (
    <div className="study-notice" role="status">
      <p className="study-notice__text">{message}</p>
      <button type="button" className="study-notice__dismiss" onClick={onDismiss} aria-label="Dismiss notice">
        ×
      </button>
    </div>
  )
}
