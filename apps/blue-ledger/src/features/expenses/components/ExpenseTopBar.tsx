import { Link } from 'react-router'
import { formatTodayLabel } from '../format'

interface ExpenseTopBarProps {
  entryCount: number
}

export const ExpenseTopBar = ({ entryCount }: ExpenseTopBarProps) => (
  <header className="flex flex-col gap-6 border-b border-slate-200 pb-6 md:flex-row md:items-start md:justify-between">
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-ledger-muted">Blue Ledger</p>
      <h1 className="text-2xl font-bold tracking-tight text-ledger-ink md:text-3xl">บันทึกรายจ่าย</h1>
      <p className="max-w-xl text-sm text-ledger-muted">
        จดยอดใช้จ่ายประจำวันแบบเรียบง่าย พร้อมสรุปยอดรวมและหมวดยอดนิยม
      </p>
    </div>

    <div className="flex flex-wrap items-center gap-3 text-sm text-ledger-muted">
      <span>{formatTodayLabel(new Date())}</span>
      <span aria-hidden="true">/</span>
      <span>{entryCount} รายการ</span>
      <Link
        to="/#add-expense"
        className="inline-flex h-10 items-center justify-center rounded-lg bg-ledger-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-ledger-primary-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ledger-primary/40"
      >
        เพิ่มรายจ่าย
      </Link>
    </div>
  </header>
)
