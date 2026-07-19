type IntegrationName =
  | 'Calendar'
  | 'Figma'
  | 'GitHub'
  | 'Gmail'
  | 'Linear'
  | 'Mail'
  | 'Messages'
  | 'Notion'
  | 'Notes'
  | 'Search'
  | 'Whisperfield'

const INTEGRATION_NAMES: IntegrationName[] = [
  'Whisperfield',
  'Calendar',
  'Messages',
  'Notion',
  'Linear',
  'Gmail',
  'GitHub',
  'Figma',
]

export { INTEGRATION_NAMES }
export type { IntegrationName }

