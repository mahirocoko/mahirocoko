import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format'
import type { ExpenseSummary } from '@/shared/expense'

interface SummaryStripProps {
  summary: ExpenseSummary
}

const topCategories = (byCategory: Record<string, number>, limit: number) =>
  Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)

export function SummaryStrip({ summary }: SummaryStripProps) {
  const tops = topCategories(summary.byCategory, 3)

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border-ledger-primary/15 bg-gradient-to-br from-blue-50/90 to-white">
        <CardContent className="flex flex-col gap-1 p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-ledger-primary-deep/90">ยอดใช้จ่ายรวม</p>
          <p className="font-mono text-2xl font-bold tabular-nums text-ledger-ink">
            {formatCurrency(summary.totalSpending)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col gap-1 p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">จำนวนรายการ</p>
          <p className="text-2xl font-bold tabular-nums text-slate-900">{summary.entryCount}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col gap-1 p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">ย้อนหลัง 30 วัน</p>
          <p className="text-2xl font-bold tabular-nums text-slate-900">{summary.recentCount}</p>
          <p className="text-xs text-slate-500">รายการในช่วงนี้</p>
        </CardContent>
      </Card>
      <Card className="sm:col-span-2 lg:col-span-1">
        <CardContent className="flex flex-col gap-2 p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">หมวดที่ใช้เงินมาก</p>
          {tops.length === 0 ? (
            <p className="text-sm text-slate-500">ยังไม่มีข้อมูลหมวด</p>
          ) : (
            <ul className="flex flex-col gap-1.5 text-sm">
              {tops.map(([name, amount]) => (
                <li key={name} className="flex justify-between gap-2">
                  <span className="truncate text-slate-700">{name}</span>
                  <span className="shrink-0 font-mono text-xs font-semibold tabular-nums text-slate-900">
                    {formatCurrency(amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
