export interface RasterAsset {
  src: string
  width: number
  height: number
}

export const rasterAssets = {
  attentionOpen: {
    src: '/assets/screenshot-attention-open.png',
    width: 1240,
    height: 1000,
  },
  sessionsWorking: {
    src: '/assets/screenshot-sessions-working.png',
    width: 1240,
    height: 1000,
  },
  errorOpen: {
    src: '/assets/screenshot-error-open.png',
    width: 1240,
    height: 1000,
  },
  doneOpen: {
    src: '/assets/screenshot-done-open.png',
    width: 1240,
    height: 1000,
  },
  runtime: {
    src: '/assets/screenshot-runtime.png',
    width: 1280,
    height: 720,
  },
  services: {
    src: '/assets/screenshot-services.png',
    width: 1280,
    height: 720,
  },
} as const satisfies Record<string, RasterAsset>
