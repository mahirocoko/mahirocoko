import { useCallback, useEffect, useMemo, useState } from 'react'
import { ExpenseForm } from '@/components/expense-form'
import { ExpenseList } from '@/components/expense-list'
import { SummaryStrip } from '@/components/summary-strip'
import { Button } from '@/components/ui/button'
import { STARTER_CATEGORIES } from '@/lib/expense-categories'
import { createExpense, fetchExpenses } from '@/lib/api/expenses'
import { formatTodayHeading } from '@/lib/format'
import type { CreateExpenseInput, Expense, ExpenseSummary } from '@/shared/expense'

const emptySummary: ExpenseSummary = {
  totalSpending: 0,
  entryCount: 0,
  recentCount: 0,
  byCategory: {},
}

const uniqueCategories = (expenses: Expense[]) =>
  Array.from(new Set(expenses.map((e) => e.category).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, 'th'),
  )

const mergeCategorySuggestions = (expenses: Expense[]) => {
  const fromData = uniqueCategories(expenses)
  const merged: string[] = [...fromData]
  const seen = new Set(fromData.map((c) => c.toLocaleLowerCase()))
  for (const category of STARTER_CATEGORIES) {
    const key = category.toLocaleLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    merged.push(category)
  }
  return merged.slice(0, 12)
}

export default function HomePage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [summary, setSummary] = useState<ExpenseSummary>(emptySummary)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchExpenses()
      setExpenses(data.expenses)
      setSummary(data.summary)
      setLoadError(null)
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'โหลดข้อมูลไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const categorySuggestions = useMemo(() => mergeCategorySuggestions(expenses), [expenses])

  const handleSubmitExpense = async (input: CreateExpenseInput) => {
    await createExpense(input)
    await refresh()
  }

  const todayLabel = formatTodayHeading(new Date())

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-slate-500">วันนี้</p>
        <p className="text-lg font-semibold text-slate-800">{todayLabel}</p>
      </div>

      {loadError ? (
        <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">เชื่อมต่อ API ไม่ได้</p>
            <p className="mt-1 text-amber-900/90">{loadError}</p>
            <p className="mt-2 text-xs text-amber-800/80">
              รัน{' '}
              <code className="rounded bg-white/80 px-1 py-0.5 font-mono text-[11px]">pnpm run dev</code>{' '}
              ให้ครบทั้ง Vite และ Hono แล้วลองใหม่
            </p>
          </div>
          <Button
            className="h-9 shrink-0 border border-amber-300 bg-white text-amber-950 hover:bg-amber-100"
            type="button"
            variant="outline"
            onClick={() => void refresh()}
          >
            ลองอีกครั้ง
          </Button>
        </div>
      ) : null}

      <SummaryStrip summary={summary} />

      {loading && expenses.length === 0 && !loadError ? (
        <p className="text-center text-sm text-slate-500">กำลังโหลด…</p>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <ExpenseForm
          categorySuggestions={categorySuggestions}
          disabled={Boolean(loadError)}
          onSubmitExpense={handleSubmitExpense}
        />
        <ExpenseList expenses={expenses} />
      </div>
    </div>
  )
}
