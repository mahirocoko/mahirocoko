import type { CreateExpenseInput, Expense } from '../shared/expense'

const RECENT_WINDOW_DAYS = 30

const createId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `exp-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

const sortByNewest = (left: Expense, right: Expense) => {
  const byDate = right.date.localeCompare(left.date)
  if (byDate !== 0) return byDate
  return right.createdAt.localeCompare(left.createdAt)
}

export class ExpenseMemoryStore {
  private expenses: Expense[] = []

  list(): Expense[] {
    return [...this.expenses].sort(sortByNewest)
  }

  add(input: CreateExpenseInput): Expense {
    const expense: Expense = {
      id: createId(),
      title: input.title.trim(),
      amount: input.amount,
      category: input.category.trim(),
      date: input.date,
      note: (input.note ?? '').trim(),
      createdAt: new Date().toISOString(),
    }
    this.expenses = [expense, ...this.expenses]
    return expense
  }

  summary(now = new Date()) {
    const expenses = this.list()
    const totalSpending = expenses.reduce((sum, e) => sum + e.amount, 0)
    const entryCount = expenses.length

    const recentCutoff = new Date(now)
    recentCutoff.setDate(recentCutoff.getDate() - RECENT_WINDOW_DAYS)
    const recentCount = expenses.filter((e) => new Date(e.date) >= recentCutoff).length

    const byCategory: Record<string, number> = {}
    for (const e of expenses) {
      const key = e.category || 'ไม่ระบุหมวด'
      byCategory[key] = (byCategory[key] ?? 0) + e.amount
    }

    return {
      totalSpending,
      entryCount,
      recentCount,
      byCategory,
    }
  }
}

export const expenseStore = new ExpenseMemoryStore()
