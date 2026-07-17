import { type ReactNode, useState } from 'react'
import { Link } from 'react-router'
import { chapters, issue } from './content'

type EditorialFigureProps = {
  alt: string
  caption: ReactNode
  className?: string
  marker: string
  mobileSrc?: string
  src?: string
}

const SiteHeader = () => (
  <header className="site-header" aria-label="หัวเว็บ">
    <Link className="brand" to="/" aria-label="กลับหน้าแรก รอยเมือง">
      รอยเมือง
    </Link>
    <p>ฉบับ {issue.number} · {issue.place}</p>
  </header>
)

const IssueMarker = ({ current }: { current?: string }) => (
  <aside className="issue-marker" aria-label="สารบัญฉบับ 01">
    <Link to="/" className="issue-marker__brand">รอยเมือง</Link>
    <ol>
      {chapters.map((chapter) => (
        <li key={chapter.number} data-current={chapter.number === current ? 'true' : undefined}>
          {chapter.href ? (
            <Link aria-current={chapter.number === current ? 'page' : undefined} to={chapter.href}>{chapter.number}</Link>
          ) : (
            <span aria-disabled="true">{chapter.number}</span>
          )}
        </li>
      ))}
    </ol>
    <span>{issue.place}</span>
  </aside>
)

const MobileIssueStrip = ({ current }: { current?: string }) => (
  <nav className="issue-strip" aria-label="บทในฉบับ 01">
    <span>ฉบับ 01</span>
    {chapters.map((chapter) => (
      chapter.href ? (
        <Link
          key={chapter.number}
          aria-current={chapter.number === current ? 'page' : undefined}
          data-current={chapter.number === current ? 'true' : undefined}
          to={chapter.href}
        >
          {chapter.number}
        </Link>
      ) : (
        <span key={chapter.number} aria-disabled="true">{chapter.number}</span>
      )
    ))}
  </nav>
)

const EditorialFigure = ({ alt, caption, className = '', marker, mobileSrc, src }: EditorialFigureProps) => {
  const [failed, setFailed] = useState(!src)

  return (
    <figure className={`editorial-figure ${className}`} data-missing={failed ? 'true' : undefined}>
      {!failed && src ? (
        <picture>
          {mobileSrc && <source media="(max-width: 860px)" srcSet={mobileSrc} />}
          <img src={src} alt={alt} onError={() => setFailed(true)} />
        </picture>
      ) : (
        <div className="editorial-figure__fallback" role="img" aria-label={`${alt} — ภาพยังไม่พร้อมใช้งาน`}>
          <span>{marker}</span>
          <p>ภาพประกอบบทนี้กำลังจัดทำ</p>
        </div>
      )}
      {!failed && <div className="editorial-figure__mark" aria-hidden="true">{marker}</div>}
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

export { EditorialFigure, IssueMarker, MobileIssueStrip, SiteHeader }
