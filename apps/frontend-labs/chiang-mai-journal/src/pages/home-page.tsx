import { Link } from 'react-router'
import { EditorialFigure, IssueMarker, MobileIssueStrip, SiteHeader } from '../components'
import { chapters, issue } from '../content'

const HomePage = () => (
  <div className="journal-shell">
    <a className="skip-link" href="#main-content">ข้ามไปอ่านเนื้อหา</a>
    <SiteHeader />
    <IssueMarker />
    <MobileIssueStrip />

    <main id="main-content" className="home-page">
      <section className="issue-spread" aria-labelledby="issue-title">
        <div className="issue-spread__copy">
          <p className="kicker">ฉบับ {issue.number} · {issue.place}</p>
          <h1 id="issue-title">{issue.title}</h1>
          {issue.dek.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <Link className="primary-link" to="/stories/city-lettering">เริ่มอ่านบทที่ 01</Link>
        </div>

        <EditorialFigure
          className="cover-figure"
          mobileSrc="/assets/editorial/issue-01/cover-collage-portrait.webp"
          src="/assets/editorial/issue-01/cover-collage-wide.webp"
          marker="01"
          alt="ภาพ collage เชิงแนวคิดของพื้นที่ทำงาน ป้ายเปล่า พู่กัน และพื้นผิวเมือง"
          caption={(
            <>
              <strong>ภาพเปิดฉบับ · เมืองที่ทำด้วยมือ</strong>
              <span>ภาพประกอบเชิงแนวคิด ไม่ใช่ภาพสารคดีเชียงใหม่จริง</span>
            </>
          )}
        />
      </section>

      <section className="chapter-index" aria-labelledby="chapter-index-title">
        <div>
          <p className="section-label">สารบัญฉบับนี้</p>
          <h2 id="chapter-index-title">สี่บทว่าด้วยร่องรอยจากมือ</h2>
        </div>
        <ol className="chapter-list">
          {chapters.map((chapter) => (
            <li key={chapter.number} className={chapter.href ? 'chapter-card chapter-card--ready' : 'chapter-card'}>
              <p>{chapter.number}</p>
              <h3>{chapter.title}</h3>
              <p>{chapter.summary}</p>
              {chapter.href ? (
                <Link to={chapter.href}>อ่านบทที่ {chapter.number}</Link>
              ) : (
                <span aria-label={`บทที่ ${chapter.number} ยังจัดทำอยู่`}>{chapter.status}</span>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="issue-note" aria-labelledby="issue-note-title">
        <h2 id="issue-note-title">หมายเหตุของฉบับ</h2>
        <p>{issue.note}</p>
      </section>
    </main>

    <footer className="site-footer">
      <p>รอยเมือง · ฉบับทดลอง 01 · เชียงใหม่</p>
      <p>เนื้อหาและภาพประกอบเป็นงานทดลอง ไม่ใช่รายงานข้อเท็จจริง</p>
    </footer>
  </div>
)

export { HomePage }
