export const FILTERS = ['All', 'Pointer', 'Scroll', 'Type', 'Layout'] as const

export type FilterName = (typeof FILTERS)[number]

export type Section = {
  id: string
  title: string
  category: Exclude<FilterName, 'All'>
  description: string
  cue: string
  preview: 'orbit' | 'queue' | 'ripple' | 'scrub' | 'type' | 'fold'
  imagePath: string
  prompt: string
  notes: Array<{ term: string; detail: string }>
}

export const SECTIONS: Section[] = [
  {
    id: 'tilt-field',
    title: 'Tilt Field',
    category: 'Pointer',
    description: 'Six generated field prints hold a composed archive, then lean toward the print you choose.',
    cue: 'Choose a print',
    preview: 'orbit',
    imagePath: '/assets/gallery/nudge-field-01.png',
    prompt: `Build an original React and CSS interactive section named Tilt Field for a dark editorial collection. Arrange six 4:5 generated media prints across a full-viewport ambient field with calm asymmetry, restrained rotation, and clear breathing room. Every print must be a stable button: click or focus brings that print forward, while fine-pointer movement adds only bounded per-print depth through local CSS variables. Provide a compact card variant that truthfully preserves the same composition, keep all edge prints and focus rings inside the viewport, disable depth under reduced motion, and use /assets/gallery/nudge-field-01.png through /assets/gallery/nudge-field-06.png as the accepted media archive.`,
    notes: [
      { term: 'Archive', detail: 'Six accepted generated prints remain visible as one composed field rather than a carousel.' },
      { term: 'Depth', detail: 'Selection is stable; fine-pointer movement adds only a small bounded depth ratio per print.' },
      { term: 'Fallback', detail: 'Keyboard, touch, and reduced motion keep every print reachable in the settled composition.' },
    ],
  },
  {
    id: 'reading-queue',
    title: 'Reading Queue',
    category: 'Layout',
    description: 'A stacked queue previews reading order before the visitor chooses a deeper card.',
    cue: 'Hover a row',
    preview: 'queue',
    imagePath: '/assets/gallery/nudge-field-02.png',
    prompt: `Build an original React and CSS interactive section named Reading Queue. Pair three layered 4:5 generated prints with four numbered rows inside the same dark ambient field used by Tilt Field. Each row is a stable button; focus or click promotes its related print, while hover adds only a short supplementary shift. Preserve readable row labels on narrow screens, expose the same compact composition on the collection card, and use the accepted /assets/gallery/nudge-field-01.png through /assets/gallery/nudge-field-03.png media without scroll-jacking or an animation library.`,
    notes: [
      { term: 'Order', detail: 'Numbers and row lengths make hierarchy visible without opening a modal.' },
      { term: 'Input', detail: 'Hover is supplementary; focus state carries the same preview cue.' },
      { term: 'Restraint', detail: 'Only one row shifts at a time and the stack never obscures text.' },
    ],
  },
  {
    id: 'soft-radar',
    title: 'Soft Radar',
    category: 'Pointer',
    description: 'A gentle signal makes the latest pointer position visible against a stable blue field.',
    cue: 'Move through the panel',
    preview: 'ripple',
    imagePath: '/assets/gallery/nudge-field-03.png',
    prompt: `Build an original React and CSS interactive section named Soft Radar. Place two generated portrait prints around a stable blue radar field with one green signal and three low-opacity rings. Fine-pointer movement may reposition only the bounded signal and rings; the prints remain calm visual anchors. On touch and reduced motion, center the radar and keep both prints visible. The collection card must be a truthful compact version, using /assets/gallery/nudge-field-03.png and /assets/gallery/nudge-field-05.png without custom cursor mechanics or an animation dependency.`,
    notes: [
      { term: 'Signal', detail: 'The rings reveal attention without becoming a permanent ambient animation.' },
      { term: 'Bounds', detail: 'Position is clamped to the preview and never drives page-level transforms.' },
      { term: 'Calm', detail: 'No looping pulse is required for the idea to read.' },
    ],
  },
  {
    id: 'travel-scrub',
    title: 'Travel Scrub',
    category: 'Scroll',
    description: 'A short rail translates travel into position without taking over the page scroll.',
    cue: 'Move across the rail',
    preview: 'scrub',
    imagePath: '/assets/gallery/nudge-field-04.png',
    prompt: `Build an original React and CSS interactive section named Travel Scrub. Present four distinct 4:5 generated prints as one horizontal local ribbon above a clear progress rail, circular handle, and position labels. Fine-pointer x-position may shift the ribbon and handle only inside the section; never intercept document scrolling. Fit all four prints in the narrow settled state, preserve the same compact preview on the collection card, and use /assets/gallery/nudge-field-02.png through /assets/gallery/nudge-field-05.png with a centered reduced-motion fallback.`,
    notes: [
      { term: 'Locality', detail: 'The rail responds inside its own frame and never controls document scroll.' },
      { term: 'Honesty', detail: 'Labels show that this is a cue, not a real carousel or checkout step.' },
      { term: 'Stability', detail: 'The middle position remains meaningful when motion is reduced.' },
    ],
  },
  {
    id: 'type-signal',
    title: 'Type Signal',
    category: 'Type',
    description: 'Letter weight changes only where the reader chooses to inspect the phrase.',
    cue: 'Hover the letters',
    preview: 'type',
    imagePath: '/assets/gallery/nudge-field-05.png',
    prompt: `Build an original React and CSS interactive section named Type Signal. Place three distinct generated image arches behind the readable phrase “READ THE SIGNAL” inside the shared dark ambient field. Keep words intact when wrapping. In detail mode each letter is a stable focusable control that can lift and gain one restrained accent; in compact mode the same phrase remains fully visible without interactive descendants. Use /assets/gallery/nudge-field-04.png through /assets/gallery/nudge-field-06.png and preserve a settled reduced-motion state.`,
    notes: [
      { term: 'Readability', detail: 'The phrase is understandable before the letter-level response starts.' },
      { term: 'Scope', detail: 'Only the inspected character changes instead of animating the whole sentence.' },
      { term: 'Type', detail: 'The existing system-sans rule stays intact.' },
    ],
  },
  {
    id: 'surface-fold',
    title: 'Surface Fold',
    category: 'Layout',
    description: 'Two surface halves answer each other around a seam without becoming a modal reveal.',
    cue: 'Move across the seam',
    preview: 'fold',
    imagePath: '/assets/gallery/nudge-field-06.png',
    prompt: `Build an original React and CSS interactive section named Surface Fold. Compose two distinct generated image planes meeting at a visible vertical seam inside the same dark ambient field as Tilt Field. Use shallow perspective and a bounded fine-pointer response to tighten the fold without hiding either source image. Keep the full two-plane composition in the compact collection card, settle both planes under reduced motion, and use /assets/gallery/nudge-field-01.png with /assets/gallery/nudge-field-06.png without a modal or copied reference mechanism.`,
    notes: [
      { term: 'Seam', detail: 'The meeting point is visible and never hides the surrounding content.' },
      { term: 'Pairing', detail: 'Both planes respond together so the surface feels connected.' },
      { term: 'Boundary', detail: 'The idea remains a section preview, not a full-screen transition.' },
    ],
  },
]

export const getSectionById = (id: string | undefined) => SECTIONS.find((section) => section.id === id)
