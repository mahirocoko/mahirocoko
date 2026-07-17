interface MotionHeadingProps {
  id: string
  lines: string[]
  className?: string
  as?: 'h1' | 'h2'
}

export const MotionHeading = ({ id, lines, className, as: Heading = 'h2' }: MotionHeadingProps) => (
  <Heading id={id} className={className} aria-label={lines.join(' ')}>
    {lines.map((line) => (
      <span className="motion-line-mask" aria-hidden="true" key={line}>
        <span className="motion-line" data-motion-line>{line}</span>
      </span>
    ))}
  </Heading>
)
