const Header = () => (
  <header className="site-header">
    <div className="site-header__inner">
      <a className="wordmark" href="#top" aria-label="Mahiro AI history — กลับไปด้านบน">
        <span className="wordmark__signal" aria-hidden="true" />
        <span>Mahiro</span>
        <span className="wordmark__sub">บันทึกการทำงานกับ AI</span>
      </a>
      <nav aria-label="สารบัญหลัก">
        <a href="#history">เรื่องราว</a>
        <a href="#looking-back">มองย้อนกลับไป</a>
      </nav>
    </div>
  </header>
)

export { Header }
