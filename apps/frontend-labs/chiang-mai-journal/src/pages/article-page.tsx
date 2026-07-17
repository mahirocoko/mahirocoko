import { Link } from 'react-router'
import { EditorialFigure, IssueMarker, MobileIssueStrip, SiteHeader } from '../components'
import { article } from '../content'

const ArticlePage = () => (
  <div className="journal-shell article-shell">
    <a className="skip-link" href="#article-content">ข้ามไปอ่านบทความ</a>
    <SiteHeader />
    <IssueMarker current="01" />
    <MobileIssueStrip current="01" />

    <main id="article-content" className="article-page">
      <article>
        <header className="article-masthead">
          <Link className="back-link" to="/">← กลับไปหน้าฉบับ</Link>
          <p className="kicker">{article.kicker}</p>
          <h1>{article.title}</h1>
          <p>{article.deck}</p>
        </header>

        <EditorialFigure
          className="article-lead"
          marker="01"
          alt="ภาพ collage เชิงแนวคิดของโต๊ะทำป้ายเปล่า พู่กัน และรอยสี"
          src="/assets/editorial/issue-01/chapter-lettering-collage.webp"
          caption={(
            <>
              <strong>ภาพเปิดบท · ตัวอักษรของเมือง</strong>
              <span>ภาพประกอบเชิงแนวคิด ไม่ใช่ป้ายหรือร้านจริงในเชียงใหม่</span>
            </>
          )}
        />

        <div className="article-body">
          <section aria-labelledby="section-one">
            <h2 id="section-one">{article.sections[0].title}</h2>
            <p>{article.sections[0].body}</p>
          </section>

          <section aria-labelledby="section-two">
            <h2 id="section-two">{article.sections[1].title}</h2>
            <p>{article.sections[1].body}</p>
          </section>

          <blockquote>{article.quote}</blockquote>

          <EditorialFigure
            className="material-study"
            marker="02"
            alt="ภาพวัตถุศึกษาเชิงแนวคิดของพู่กัน สี กระดาษ ไม้ และโลหะ"
            mobileSrc="/assets/editorial/issue-01/article-lettering-detail-portrait.webp"
            src="/assets/editorial/issue-01/article-lettering-detail-wide.webp"
            caption={(
              <>
                <strong>ภาพวัตถุศึกษา · พู่กัน สี และพื้นผิวป้าย</strong>
                <span>ภาพประกอบเชิงแนวคิด ไม่ใช่วัตถุจากร้านหรือช่างรายใดจริง</span>
              </>
            )}
          />

          <section aria-labelledby="section-three">
            <h2 id="section-three">{article.sections[2].title}</h2>
            <p>{article.sections[2].body}</p>
          </section>
        </div>

        <nav className="chapter-nav" aria-label="นำทางบทความ">
          <Link to="/">กลับหน้าฉบับ เมืองที่ทำด้วยมือ</Link>
          <span>บทที่ 02 กำลังจัดทำ</span>
        </nav>

        <footer className="article-disclosure" aria-labelledby="article-disclosure-title">
          <h2 id="article-disclosure-title">ที่มาของเนื้อหา</h2>
          <p>{article.disclosure}</p>
          <p>ภาพเปิดฉบับ ภาพเปิดบท และภาพวัตถุศึกษาเป็นภาพประกอบเชิงแนวคิด ไม่ใช่บันทึกสถานที่หรือวัตถุจริง</p>
        </footer>
      </article>
    </main>
  </div>
)

export { ArticlePage }
