export type SessionStateId =
  | 'idle'
  | 'working'
  | 'attention'
  | 'done'
  | 'error'

export type TimerStateId = 'pomodoro'
export type NotchStateId = SessionStateId | TimerStateId

interface StatePresentation {
  label: string
  dotClass: string
  notchRingClass: string
  titleClass: string
  title: string
  subtitle: string
  captionTitle: string
  caption: string
}

export interface SessionNotchState extends StatePresentation {
  id: SessionStateId
  truth: {
    kind: 'session'
    status: SessionStateId
  }
}

export interface TimerNotchState extends StatePresentation {
  id: TimerStateId
  truth: {
    kind: 'timer'
    timer: 'pomodoro'
    independentOfSessions: true
  }
}

export type NotchState = SessionNotchState | TimerNotchState

// The five session states mirror Agent Halo's real session status union.
// Pomodoro is deliberately modeled as independent local-timer truth.
export const notchStates = [
  {
    id: 'idle',
    truth: { kind: 'session', status: 'idle' },
    label: 'Idle',
    dotClass: 'bg-neutral-400',
    notchRingClass: '',
    titleClass: 'text-white',
    title: 'Idle',
    subtitle: 'No active sessions',
    captionTitle: 'Idle — the notch stays quiet',
    caption:
      'With no live sessions or timers, Agent Halo collapses back into the notch. Nothing pulses, nothing distracts.',
  },
  {
    id: 'working',
    truth: { kind: 'session', status: 'working' },
    label: 'Working',
    dotClass: 'bg-neutral-200',
    notchRingClass: '',
    titleClass: 'text-white',
    title: 'Working',
    subtitle: 'Letta Code session · LLM inference',
    captionTitle: 'Working — calm presence',
    caption:
      'A Letta Code session is running. The notch shows a calm working label projected from trusted mod events — never terminal scraping.',
  },
  {
    id: 'attention',
    truth: { kind: 'session', status: 'attention' },
    label: 'Needs attention',
    dotClass: 'bg-halo-orange',
    notchRingClass: 'ring-1 ring-halo-orange/70',
    titleClass: 'text-halo-orange',
    title: 'Needs attention',
    subtitle: 'Permission request waiting',
    captionTitle: 'Needs attention — one jump to the pane',
    caption:
      'In the real app, clicking the notch focuses the exact Herdr pane, with Ghostty cwd/title matching as a fallback. This preview is display-only.',
  },
  {
    id: 'done',
    truth: { kind: 'session', status: 'done' },
    label: 'Done',
    dotClass: 'bg-halo-green',
    notchRingClass: '',
    titleClass: 'text-halo-green',
    title: 'Done',
    subtitle: 'Turn complete · sticky until cleared',
    captionTitle: 'Done — sticky until cleared',
    caption:
      'Completed turns stay visible so you can confirm results at a glance, then slide away when you clear them.',
  },
  {
    id: 'error',
    truth: { kind: 'session', status: 'error' },
    label: 'Error',
    dotClass: 'bg-halo-red',
    notchRingClass: 'ring-1 ring-halo-red/70',
    titleClass: 'text-halo-red',
    title: 'Error',
    subtitle: 'Session error · needs review',
    captionTitle: 'Error — restrained, not alarming',
    caption:
      'Session errors surface in red so failures are never silent — a quiet signal, not a modal that blocks your flow.',
  },
  {
    id: 'pomodoro',
    truth: {
      kind: 'timer',
      timer: 'pomodoro',
      independentOfSessions: true,
    },
    label: 'Pomodoro',
    dotClass: 'bg-white',
    notchRingClass: '',
    titleClass: 'text-white',
    title: 'Pomodoro · Focus',
    subtitle: 'Local timer · 25:00 remaining',
    captionTitle: 'Pomodoro — independent of sessions',
    caption:
      'Focus phases run on a local persisted deadline that survives system sleep. The timer is yours alone — it says nothing about any Letta session.',
  },
] as const satisfies readonly NotchState[]

export function getNotchState(id: NotchStateId): NotchState {
  return notchStates.find((state) => state.id === id) ?? notchStates[0]
}

export function getStateAnnouncement(state: NotchState): string {
  return `${state.label}. ${state.captionTitle}. ${state.caption}`
}
