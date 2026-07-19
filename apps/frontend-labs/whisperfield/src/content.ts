interface ActionScenario {
  id: string
  label: string
  instruction: string
  app: string
  heading: string
  description: string
  rows: string[]
  accent: string
}

interface WritingScenario {
  id: string
  label: string
  channel: string
  title: string
  draft: string
  shapedLabel: string
  shapedText: string
}

interface PrivacyPanel {
  id: string
  label: string
  title: string
  description: string
  settings: Array<{ label: string; detail: string; enabled: boolean }>
}

interface FieldNote {
  name: string
  role: string
  initials: string
  quote: string
  tone: string
}

const NAV_ITEMS = [
  { label: 'Proof', href: '#proof' },
  { label: 'Modes', href: '#modes' },
  { label: 'Privacy', href: '#privacy' },
  { label: 'Access', href: '#access' },
]

const ACTION_SCENARIOS: ActionScenario[] = [
  {
    id: 'calendar',
    label: 'Calendar',
    instruction: 'Block forty minutes tomorrow morning to review the launch notes.',
    app: 'Daybook',
    heading: 'Launch notes review',
    description: 'Tomorrow · 09:20–10:00',
    rows: ['Focus block', 'Launch workspace', 'Reminder: 10 minutes before'],
    accent: '#8b73dc',
  },
  {
    id: 'inbox',
    label: 'Inbox',
    instruction: 'Reply to Mina and say the revised field study is ready to review.',
    app: 'Postbox',
    heading: 'Re: field study',
    description: 'To Mina · Draft ready',
    rows: ['Warm opening', 'Review link included', 'Concise sign-off'],
    accent: '#eb8067',
  },
  {
    id: 'notes',
    label: 'Notes',
    instruction: 'Create a note with the three ideas from our walk and tag it research.',
    app: 'Field Notes',
    heading: 'Ideas from the walk',
    description: 'Research · Today',
    rows: ['Sound as navigation', 'Quiet states as proof', 'A softer command surface'],
    accent: '#4f87a5',
  },
  {
    id: 'search',
    label: 'Search',
    instruction: 'Find the latest accessibility checklist and open the focus section.',
    app: 'Archive',
    heading: 'Accessibility checklist',
    description: 'Updated two days ago',
    rows: ['Keyboard order', 'Visible focus', 'Reduced motion'],
    accent: '#aa6f91',
  },
]

const WRITING_SCENARIOS: WritingScenario[] = [
  {
    id: 'message',
    label: 'Message',
    channel: 'Studio chat · #launch',
    title: 'A clear project update',
    draft: 'Quick update — the responsive pass is done. I kept the proof cards calm and moved the open questions into the review note.',
    shapedLabel: 'Tone: concise and warm',
    shapedText: 'Three sentences · decision first · no filler',
  },
  {
    id: 'brief',
    label: 'Brief',
    channel: 'Project note · Draft',
    title: 'Turn a thought into structure',
    draft: 'Objective: make the first minute obvious. Evidence: live product surfaces, not abstract promises. Boundary: no invented customer claims.',
    shapedLabel: 'Format: working brief',
    shapedText: 'Objective · evidence · boundary',
  },
  {
    id: 'email',
    label: 'Email',
    channel: 'Mail · New message',
    title: 'Write it like you speak',
    draft: 'Hi Dara — Tuesday works well. Could we use the first twenty minutes for the interaction review and keep the rest for decisions?',
    shapedLabel: 'Voice: natural',
    shapedText: 'Greeting · request · next step',
  },
]

const PRIVACY_PANELS: PrivacyPanel[] = [
  {
    id: 'general',
    label: 'General',
    title: 'On this device',
    description: 'Choose what Whisperfield remembers between sessions.',
    settings: [
      { label: 'Keep recent transcripts', detail: 'Stored locally for seven days', enabled: true },
      { label: 'Save raw audio', detail: 'Off unless a session is pinned', enabled: false },
      { label: 'Open review after long notes', detail: 'For recordings over two minutes', enabled: true },
    ],
  },
  {
    id: 'privacy',
    label: 'Privacy',
    title: 'Private by default',
    description: 'The fictional interface keeps capture controls explicit.',
    settings: [
      { label: 'Local transcription', detail: 'Process audio on this device', enabled: true },
      { label: 'Anonymous diagnostics', detail: 'Never includes audio or full text', enabled: false },
      { label: 'Clear after paste', detail: 'Remove successful quick captures', enabled: true },
    ],
  },
  {
    id: 'profiles',
    label: 'Profiles',
    title: 'Match the moment',
    description: 'Profiles change formatting without changing ownership.',
    settings: [
      { label: 'Work messages', detail: 'Concise, direct, lightly polished', enabled: true },
      { label: 'Field notes', detail: 'Keep pauses and rough structure', enabled: true },
      { label: 'Client review', detail: 'Ask before every transform', enabled: false },
    ],
  },
  {
    id: 'advanced',
    label: 'Advanced',
    title: 'Visible boundaries',
    description: 'Technical choices stay inspectable and reversible.',
    settings: [
      { label: 'Show processing stages', detail: 'Capture → transcribe → shape', enabled: true },
      { label: 'Keep recovery audio', detail: 'Only after interrupted sessions', enabled: true },
      { label: 'Automatic cloud fallback', detail: 'Unavailable in this lab', enabled: false },
    ],
  },
]

const FIELD_NOTES: FieldNote[] = [
  { name: 'Mina K.', role: 'Product designer', initials: 'MK', quote: 'The useful part is not speed alone. I can keep looking at the work while the thought becomes an action.', tone: 'violet' },
  { name: 'Ren A.', role: 'Independent maker', initials: 'RA', quote: 'Long notes finally feel like notes instead of a cleanup task waiting for me later.', tone: 'coral' },
  { name: 'Jules P.', role: 'Research lead', initials: 'JP', quote: 'I like seeing the boundary between what I said and what the interface shaped.', tone: 'blue' },
  { name: 'Tara S.', role: 'Studio founder', initials: 'TS', quote: 'The quiet interface matters. It appears, does the work, and gets out of the way.', tone: 'rose' },
  { name: 'Noah V.', role: 'Developer', initials: 'NV', quote: 'Voice is most useful when the result lands in the right place with no context switch.', tone: 'amber' },
  { name: 'Aya M.', role: 'Writer', initials: 'AM', quote: 'It keeps my wording recognizable. The structure improves without flattening the voice.', tone: 'mint' },
]

export {
  ACTION_SCENARIOS,
  FIELD_NOTES,
  NAV_ITEMS,
  PRIVACY_PANELS,
  WRITING_SCENARIOS,
}
export type { ActionScenario, PrivacyPanel, WritingScenario }

