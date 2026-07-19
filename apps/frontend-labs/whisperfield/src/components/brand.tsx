const HeaderBrand = ({ compact }: { compact: boolean }) => (
  <span className={`wf-header-brand ${compact ? 'is-compact' : ''}`}>
    <img className="wf-header-brand-compact" src="/assets/generated/whisperfield-mark.svg" alt="" />
    <img className="wf-header-brand-full" src="/assets/generated/whisperfield-lockup-dark.png" alt="" />
  </span>
)

const BrandLockup = ({ light = false }: { light?: boolean }) => (
  <img
    className="wf-brand-lockup"
    src={`/assets/generated/whisperfield-lockup-${light ? 'light' : 'dark'}.png`}
    alt="Whisperfield"
  />
)

export { BrandLockup, HeaderBrand }
