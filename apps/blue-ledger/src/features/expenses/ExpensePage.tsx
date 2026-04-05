import { useCallback, useEffect, useState } from 'react'
import { createExpense, fetchExpenses } from '@/lib/api'
import type { CreateExpenseInput, Expense, ExpenseSummary } from '@/shared/expense'
import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseList } from './components/ExpenseList'
import { ExpenseTopBar } from './components/ExpenseTopBar'
import { SummaryPanel } from './components/SummaryPanel'

const emptySummary: ExpenseSummary = {
  totalSpending: 0,
  entryCount: 0,
  recentCount: 0,
  byCategory: {},
}

export const ExpensePage = () => {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [summary, setSummary] = useState<ExpenseSummary>(emptySummary)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const payload = await fetchExpenses()
      setExpenses(payload.expenses)
      setSummary(payload.summary)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'โหลดข้อมูลไม่สำเร็จ'
      setLoadError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const handleCreate = async (input: CreateExpenseInput) => {
    await createExpense(input)
    await refresh()
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:px-6">
      <ExpenseTopBar entryCount={summary.entryCount} />

      {loadError ? (
        <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 md:flex-row md:items-center md:justify-between">
          <p>{loadError}</p>
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-red-200 bg-white px-3 text-sm font-semibold text-red-900 transition hover:bg-red-100"
            onClick={() => void refresh()}
          >
            ลองอีกครั้ง
          </button>
        </div>
      ) : null}

      {isLoading ? (
        <p className="text-sm text-ledger-muted">กำลังโหลดข้อมูล…</p>
      ) : (
        <>
          <SummaryPanel summary={summary} />
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
            <ExpenseForm expenses={expenses} disabled={Boolean(loadError)} onCreate={handleCreate} />
            <ExpenseList expenses={expenses} />
          </div>
        </>
      )}
    </div>
  )
}
