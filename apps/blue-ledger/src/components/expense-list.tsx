import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatExpenseDate } from '@/lib/format'
import type { Expense } from '@/shared/expense'

interface ExpenseListProps {
  expenses: Expense[]
}

export function ExpenseList({ expenses }: ExpenseListProps) {
  return (
    <Card className="flex min-h-[320px] flex-col">
      <CardHeader>
        <CardTitle>รายการล่าสุด</CardTitle>
        <CardDescription>เรียงจากวันที่ล่าสุดก่อน</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 p-0 px-6 pb-6">
        {expenses.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-500">
            ยังไม่มีรายการ — เพิ่มรายจ่ายแรกได้จากฟอร์มด้านบน
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {expenses.map((expense) => (
              <li
                key={expense.id}
                className="rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 transition-colors hover:bg-slate-50"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold text-slate-900">{expense.title}</p>
                  <p className="font-mono text-sm font-semibold text-red-700 tabular-nums">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  <span className="rounded-full bg-white px-2 py-0.5 font-medium text-slate-600 ring-1 ring-slate-200/80">
                    {expense.category}
                  </span>
                  <span>{formatExpenseDate(expense.date)}</span>
                </div>
                {expense.note ? (
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{expense.note}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
