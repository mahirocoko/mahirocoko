export interface ExperimentStep {
  id: string
  title: string
  ruleNum: string
  instruction: string
  actionHint: string
}

export const EXPERIMENT_STEPS: ExperimentStep[] = [
  {
    id: 'grab-offset',
    ruleNum: '§2',
    title: 'Zero-Jump Grab Offset',
    instruction:
      'Touch and content must move together. Grab the tile from its very edge or corner rather than the center.',
    actionHint: 'Notice the tile stays locked to the exact pointer offset without jumping its center to your cursor.',
  },
  {
    id: 'momentum-projection',
    ruleNum: '§6',
    title: 'Momentum Projection',
    instruction:
      'Flick the tile towards another dock. Release with swift velocity rather than dragging it all the way.',
    actionHint:
      'Apple exponential decay projects the resting coordinate ahead of time to lock onto the intended snap station.',
  },
  {
    id: 'midflight-interrupt',
    ruleNum: '§3',
    title: 'Mid-Flight Interruption',
    instruction:
      'Flick the tile across the stage, then catch/grab it while it is flying mid-air before it settles.',
    actionHint:
      'The physics engine reads live presentation coordinates instantly and reverses without a brick-wall discontinuity.',
  },
  {
    id: 'boundary-rubberband',
    ruleNum: '§9',
    title: 'Boundary Rubber-Banding',
    instruction:
      'Drag the tile past the stage perimeter walls into the border margin.',
    actionHint:
      'Rather than freezing abruptly, Apple logarithmic resistance progressively increases the further you pull.',
  },
  {
    id: 'independent-xy',
    ruleNum: '§4',
    title: 'Independent 2D Springs',
    instruction:
      'Flick diagonally with asymmetric horizontal and vertical force.',
    actionHint:
      'X and Y axes solve independent differential equations, producing an organic physical trajectory.',
  },
]
