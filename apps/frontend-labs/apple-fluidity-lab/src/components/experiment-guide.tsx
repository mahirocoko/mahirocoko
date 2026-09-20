import type { ExperimentStep } from '../data/experiments.ts'

interface ExperimentGuideProps {
  steps: readonly ExperimentStep[]
  activeExperimentId: string
  onSelectExperiment: (id: string) => void
}

const ExperimentGuide = ({
  steps,
  activeExperimentId,
  onSelectExperiment,
}: ExperimentGuideProps) => {
  return (
    <div className="sidebar-section" aria-label="Guided Interaction Trials">
      <div className="sidebar-heading">
        <span>Guided Interaction Trials</span>
        <span className="badge-tag">5 EXERCISES</span>
      </div>

      <div className="experiment-list">
        {steps.map((step) => {
          const isSelected = activeExperimentId === step.id
          return (
            <button
              type="button"
              key={step.id}
              className={`experiment-item ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectExperiment(step.id)}
              aria-pressed={isSelected}
            >
              <div className="exp-header">
                <span className="exp-title">{step.title}</span>
                <span className="exp-badge">{step.ruleNum}</span>
              </div>
              <p className="exp-instruction">{step.instruction}</p>
              {isSelected && (
                <div
                  style={{
                    marginTop: '8px',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    background: 'rgba(10, 132, 255, 0.12)',
                    fontSize: '0.72rem',
                    color: '#9cc7ff',
                  }}
                >
                  <strong>Try it now: </strong>
                  {step.actionHint}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ExperimentGuide
