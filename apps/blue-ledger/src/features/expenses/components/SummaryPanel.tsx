import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ExpenseSummary } from '@/shared/expense'
import { formatCurrency } from '../format'

interface SummaryPanelProps {
  summary: ExpenseSummary
}

const topCategories = (byCategory: Record<string, number>, limit = 4) =>
  Object.entries(byCategory)
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)

export const SummaryPanel = ({ summary }: SummaryPanelProps) => {
  const leaders = topCategories(summary.byCategory)

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>ยอดใช้จ่ายรวม</CardTitle>
          <CardDescription>คำนวณจากรายการทั้งหมดในเซสชันเซิร์ฟเวอร์ปัจจุบัน</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-4xl font-semibold tracking-tight text-ledger-primary-deep md:text-5xl">
            {formatCurrency(summary.totalSpending)}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-ledger-muted">จำนวนรายการ</p>
              <p className="mt-1 text-2xl font-semibold text-ledger-ink">{summary.entryCount}</p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-ledger-muted">ช่วง 30 วันล่าสุด</p>
              <p className="mt-1 text-2xl font-semibold text-ledger-ink">{summary.recentCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>หมวดที่ใช้จ่ายมากสุด</CardTitle>
          <CardDescription>เรียงจากยอดรวมในหมวด</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {leaders.length === 0 ? (
            <p className="text-sm text-ledger-muted">ยังไม่มีข้อมูลหมวด</p>
          ) : (
            <ul className="space-y-3">
              {leaders.map(([category, amount]) => (
                <li
                  key={category}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2"
                >
                  <span className="text-sm font-medium text-ledger-ink">{category}</span>
                  <span className="text-sm font-semibold text-ledger-expense">{formatCurrency(amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
