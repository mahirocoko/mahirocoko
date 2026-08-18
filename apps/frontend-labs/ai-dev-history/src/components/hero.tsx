const Hero = () => (
  <section className="hero" id="top" aria-labelledby="hero-title">
    <div className="hero__copy">
      <p className="status-pill"><span aria-hidden="true" /> เรียบเรียงจากประวัติจริง · ม.ค.–ส.ค. 2026</p>
      <h1 id="hero-title">ประวัติการทำงานกับ AI<br /><em>ของ Mahiro</em></h1>
      <p className="hero__lead">
        ตั้งแต่วันที่ต้องก๊อป error ไปถามในแชท ผ่าน Claude Code, OpenCode และ Soul Vibe
        จนมาถึง Mahiro Code, Agent Halo, Herdr และวิธีเก็บบทเรียนจากสิ่งที่เคยทำพลาด
      </p>
      <div className="hero__actions">
        <a className="primary-action" href="#history">เริ่มอ่านตามลำดับ <span aria-hidden="true">↓</span></a>
      </div>
      <dl className="hero__stats">
        <div><dt>8 เดือน</dt><dd>ช่วงเวลาที่ค้นย้อนหลัง</dd></div>
        <div><dt>12 ช่วง</dt><dd>เหตุการณ์สำคัญตามลำดับ</dd></div>
        <div><dt>8 ข้อความ</dt><dd>คำพูดจริงที่นำมาแสดงในหน้า</dd></div>
      </dl>
    </div>

    <div className="hero__portrait">
      <img src="/mahiro-cat.png" alt="มาสคอตแมวซามูไรของ Mahiro" width="240" height="240" />
      <div>
        <span>ตอนนี้</span>
        <strong>Mahiro Code</strong>
        <p>agent หลักตัวเดียวที่คุยกันต่อเนื่อง แล้วค่อยเรียกเครื่องมือหรือตัวช่วยอื่นตามงาน</p>
      </div>
    </div>
  </section>
)

export { Hero }
