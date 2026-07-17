import { useState } from 'react'
import type { ModuleId } from '../types'

interface ProductImageProps {
  src: string
  alt: string
  kind: ModuleId | 'system'
  className?: string
  viewTransitionName?: string
}

const ProductFallback = ({ kind, status }: { kind: ProductImageProps['kind']; status: 'loading' | 'error' }) => (
  <div className={`product-fallback product-fallback--${kind}`} aria-hidden="true">
    <div className="fallback-rail" />
    {kind === 'system' ? (
      <>
        <i className="fallback-module fallback-module--dock" />
        <i className="fallback-module fallback-module--light" />
        <i className="fallback-module fallback-module--tray" />
      </>
    ) : <i className="fallback-object" />}
    <span>{kind === 'system' ? 'Configured system' : status === 'loading' ? 'Preparing image' : 'Image unavailable'}</span>
  </div>
)

export const ProductImage = ({ src, alt, kind, className = '', viewTransitionName }: ProductImageProps) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(src ? 'loading' : 'error')

  return (
    <div className={`product-image ${className}`} data-status={status} style={{ viewTransitionName }}>
      {status !== 'loaded' ? <ProductFallback kind={kind} status={status} /> : null}
      {src ? (
        <img
          src={src}
          alt={alt}
          className={status === 'loaded' ? 'is-loaded' : ''}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />
      ) : null}
    </div>
  )
}
