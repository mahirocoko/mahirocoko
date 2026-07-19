const GlassDownloadButton = ({ className = '' }: { className?: string }) => (
  <span className={`wf-glass-button-wrap ${className}`.trim()}>
    <a className="wf-glass-button" href="/downloads/whisperfield-preview-pack.zip" download>
      <span><img src="/assets/generated/whisperfield-mark.svg" alt="" />Download preview</span>
    </a>
    <span className="wf-glass-button-shadow" aria-hidden="true" />
  </span>
)

export { GlassDownloadButton }
