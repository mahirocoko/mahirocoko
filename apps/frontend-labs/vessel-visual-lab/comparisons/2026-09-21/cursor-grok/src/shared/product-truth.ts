export const PRODUCT_TRUTH = {
  studyNotice: 'This frontend study creates and exports no file.',
  cssPreviewDisclaimer:
    'The split preview is a CSS filter on the same PNG. It is not native color-conversion proof.',
  sourceInvariant:
    'The original source remains a required future native invariant. This study does not write, replace, or hide a mutation of the source.',
  localFirst:
    'Vessel is intended as a local, single-asset preflight. This static site and browser study do not prove native offline or local-disk behavior.',
  inputScope: 'Intended input scope: PNG, JPEG, and single-page PDF.',
  noDownload: 'There is no production download here. Open the Mac interface study instead.',
} as const

export const FORBIDDEN_PRODUCT_CLAIMS = [
  /CoreGraphics/i,
  /Oxipng/i,
  /implemented parser/i,
  /working download/i,
  /\bSwift\b/,
  /\bRust\b/,
  /guaranteed safety/i,
  /universal PII/i,
  /verified zero-network/i,
] as const
