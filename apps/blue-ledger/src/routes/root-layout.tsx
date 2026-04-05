import type { ReactNode } from 'react'
import { Link } from 'react-router'

type RootLayoutProps = {
  children: ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100/80 via-slate-50 to-slate-100">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ledger-primary">Blue Ledger</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">บันทึกค่าใช้จ่าย</h1>
            <p className="max-w-2xl text-sm text-slate-600">
              แอปเล็ก ๆ สำหรับจดรายจ่าย — ข้อมูลเก็บในหน่วยความจำของเซิร์ฟเวอร์ (รีสตาร์ทแล้วหาย)
            </p>
          </div>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-lg bg-ledger-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-ledger-primary-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ledger-primary/40"
            to="/#add-expense"
          >
            เพิ่มรายจ่าย
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  )
}
