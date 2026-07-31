interface ShotFrameProps {
  src: string
  width: number
  height: number
  alt: string
  title: string
  priority?: boolean
}

export function ShotFrame({
  src,
  width,
  height,
  alt,
  title,
  priority = false,
}: ShotFrameProps) {
  return (
    <figure className="overflow-hidden rounded-2xl bg-white shadow-[0_24px_64px_-24px_rgba(17,24,39,0.25)] ring-1 ring-neutral-900/10">
      <div className="flex items-center gap-2 border-b border-neutral-900/5 bg-neutral-50 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" aria-hidden />
        <span className="size-2.5 rounded-full bg-[#febc2e]" aria-hidden />
        <span className="size-2.5 rounded-full bg-[#28c840]" aria-hidden />
        <span className="ml-2 truncate text-xs font-medium text-neutral-400">
          {title}
        </span>
      </div>
      <img
        src={src}
        width={width}
        height={height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className="block h-auto w-full"
      />
    </figure>
  )
}
