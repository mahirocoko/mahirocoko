export interface ToneStudy {
  id: string
  index: string
  name: string
  note: string
  frequency: number
  description: string
  color: string
}

export const TONE_STUDIES: ToneStudy[] = [
  {
    id: 'fold',
    index: '01',
    name: 'Fold',
    note: 'G3',
    frequency: 196,
    description: 'A low pulse pressed into a narrow, patient wave.',
    color: '#ff5b3d',
  },
  {
    id: 'veer',
    index: '02',
    name: 'Veer',
    note: 'D4',
    frequency: 293.66,
    description: 'A bright interval that shifts as the field opens.',
    color: '#2947ff',
  },
  {
    id: 'halo',
    index: '03',
    name: 'Halo',
    note: 'A4',
    frequency: 440,
    description: 'A clear upper ring with a slow mineral afterimage.',
    color: '#d8ff5f',
  },
]

export const SCORE_CHAPTERS = [
  {
    index: 'I',
    title: 'Contact',
    body: 'A gesture enters the field. Pointer, keyboard, and touch all resolve to the same intent instead of separate effects.',
  },
  {
    index: 'II',
    title: 'Resonance',
    body: 'One normalized signal coordinates geometry, typography, and tone. Each layer keeps its own rendering responsibility.',
  },
  {
    index: 'III',
    title: 'Release',
    body: 'The system settles, clears temporary GPU hints, and stops drawing when it leaves the viewport.',
  },
] as const

export const SYSTEM_LAYERS = [
  {
    label: 'Readable layer',
    owner: 'DOM + CSS',
    detail: 'Meaning, controls, focus, and the complete low-motion experience.',
  },
  {
    label: 'Spatial layer',
    owner: 'Three.js',
    detail: 'One bounded scene with capped DPR, visibility-aware rendering, and disposal.',
  },
  {
    label: 'Temporal layer',
    owner: 'GSAP + Lenis',
    detail: 'A shared clock for section progress; native scrolling remains the fallback.',
  },
  {
    label: 'Acoustic layer',
    owner: 'Web Audio',
    detail: 'Synthesized only after explicit consent—no recorded assets and no autoplay.',
  },
] as const
