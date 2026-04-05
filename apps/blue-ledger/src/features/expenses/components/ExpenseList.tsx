import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Expense } from '@/shared/expense'
import { formatCurrency, formatEntryDate } from '../format'

interface ExpenseListProps {
  expenses: Expense[]
}

export const ExpenseList = ({ expenses }: ExpenseListProps) => (
  <Card className="border-slate-200">
    <CardHeader>
      <CardTitle>รายการที่บันทึกไว้</CardTitle>
      <CardDescription>เรียงจากวันล่าสุดก่อน</CardDescription>
    </CardHeader>
    <CardContent>
      {expenses.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
          <p className="text-sm font-semibold text-ledger-ink">ยังไม่มีรายจ่าย</p>
          <p className="mt-2 text-sm text-ledger-muted">เริ่มจากฟอร์มด้านข้างเพื่อเพิ่มรายการแรก</p>
        </div>
      ) : (
        <ol className="max-h-[560px] space-y-3 overflow-y-auto pr-1">
          {expenses.map((expense) => (
            <li
              key={expense.id}
              className="rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-semibold text-ledger-ink">{expense.title}</p>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-ledger-muted">
                      {expense.category}
                    </span>
                  </div>
                  <p className="text-xs text-ledger-muted">{formatEntryDate(expense.date)}</p>
                  {expense.note ? <p className="text-sm text-ledger-muted">{expense.note}</p> : null}
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-lg font-semibold text-ledger-expense">{formatCurrency(expense.amount)}</p>
                  <p className="text-xs text-ledger-muted">บันทึก {formatEntryDate(expense.createdAt.slice(0, 10))}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </CardContent>
  </Card>
)
