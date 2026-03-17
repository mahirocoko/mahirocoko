interface TopBarProps {
  currentDateLabel: string
  entryCount: number
}

export const TopBar = ({ currentDateLabel, entryCount }: TopBarProps) => (
  <header className="topbar">
    <div className="topbar__brand">
      <h1 className="topbar__title">Blue Ledger</h1>
      <p className="topbar__subtitle">บันทึกรายรับรายจ่ายส่วนตัวในหน้าเดียว</p>
    </div>

    <div className="topbar__meta">
      <p className="topbar__meta-text">{currentDateLabel}</p>
      <p className="topbar__meta-separator" aria-hidden="true">
        /
      </p>
      <p className="topbar__meta-text">{entryCount} รายการ</p>
      <a className="topbar__action" href="#quick-add">
        เพิ่มรายการใหม่
      </a>
    </div>
  </header>
)
