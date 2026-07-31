import { rasterAssets, type RasterAsset } from '@/assets'

export const REPO_URL = 'https://github.com/mahirocoko/agent-halo'
export const SETUP_URL = 'https://github.com/mahirocoko/agent-halo#installation'
export const ARCHITECTURE_URL =
  'https://github.com/mahirocoko/agent-halo/blob/main/docs/architecture.md'

export type IconKey =
  | 'sessions'
  | 'attention'
  | 'focus'
  | 'timer'
  | 'pet'
  | 'gauge'
  | 'lock'

export interface FeatureIndexItem {
  icon: IconKey
  title: string
}

export const featureIndex: FeatureIndexItem[] = [
  { icon: 'sessions', title: 'Live Sessions & presence' },
  { icon: 'attention', title: 'Needs-input attention' },
  { icon: 'focus', title: 'Exact pane focus' },
  { icon: 'timer', title: 'Local Pomodoro' },
  { icon: 'pet', title: 'Completion Pet' },
  { icon: 'gauge', title: 'Usage & Runtime' },
  { icon: 'lock', title: 'Local-first & private' },
]

export interface ProofRow {
  id: string
  eyebrow: string
  title: string
  body: string
  chips?: string[]
  subHeading?: string
  subChips?: string[]
  checks?: string[]
  image: RasterAsset
  imageAlt: string
}

export const proofRows: ProofRow[] = [
  {
    id: 'sessions',
    eyebrow: 'Live Sessions',
    title: 'Every conversation, truthful and grouped',
    body: 'Recent Letta Code conversations stay visible in workspace groups — distinct subagent and default lanes, sticky completed rows, and per-session context, projected from trusted mod events instead of terminal scraping.',
    chips: ['Working', 'Needs input', 'Done', 'Idle'],
    image: rasterAssets.sessionsWorking,
    imageAlt:
      'Agent Halo notch panel open, showing a live Letta Code session in the Working state',
  },
  {
    id: 'attention',
    eyebrow: 'Needs-input attention',
    title: 'Jump straight to the pane that needs you',
    body: 'Permission requests surface as needs-input activity in the notch. When trusted runtime identity is present, Agent Halo focuses the exact Herdr pane — with native Ghostty cwd, title, and session matching as a fallback.',
    chips: ['Exact Herdr pane', 'Ghostty fallback', 'cwd + title matching'],
    image: rasterAssets.errorOpen,
    imageAlt:
      'Agent Halo notch panel open, showing a session asking for attention',
  },
  {
    id: 'rituals',
    eyebrow: 'Focus rituals',
    title: 'A Pomodoro with a Pet that respects your flow',
    body: 'Run local Focus, Short, and Long phases with custom durations, persisted deadlines, and silent macOS alerts. A naturally completed Focus can summon a floating Completion Pet that never steals focus.',
    subHeading: 'Phases & Pet actions',
    subChips: [
      'Focus 25m',
      'Short 5m',
      'Long 15m',
      'Start break',
      'Later',
      '10 Squats (opt-in)',
    ],
    image: rasterAssets.doneOpen,
    imageAlt:
      'Agent Halo notch panel open, showing a completed session in the Done state',
  },
  {
    id: 'runtime',
    eyebrow: 'Usage & Runtime',
    title: 'Local quota and pressure, read-only',
    body: 'See local quota and token views for known providers — with truthful unavailable and offline diagnostics — plus read-only CPU and memory pressure for Letta hosts and their subprocesses. Agent Halo never kills, suspends, or controls a process.',
    chips: ['Codex', 'Antigravity', 'Claude Code', 'Cursor'],
    image: rasterAssets.runtime,
    imageAlt:
      'Agent Halo Runtime tab listing read-only CPU and memory pressure for local Letta processes',
  },
  {
    id: 'privacy',
    eyebrow: 'Local services',
    title: 'Local listeners, observed — never controlled',
    body: 'The Services tab groups detected web frontends, Letta-started services, and other listeners from bounded local probes, with safe response titles and an open-in-browser action. The inventory stays in memory and is never written to disk.',
    checks: [
      'Bridge stays on 127.0.0.1',
      'No raw tool output stored',
      'Text previews off by default',
      'No remote telemetry',
    ],
    image: rasterAssets.services,
    imageAlt:
      'Agent Halo Services tab grouping detected local web frontends and other listeners',
  },
]
