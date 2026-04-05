export interface Expense {
  id: string
  title: string
  amount: number
  category: string
  date: string
  note: string
  createdAt: string
}

export interface CreateExpenseInput {
  title: string
  amount: number
  category: string
  date: string
  note?: string
}

export interface ExpenseSummary {
  totalSpending: number
  entryCount: number
  recentCount: number
  byCategory: Record<string, number>
}

export interface ExpensesResponse {
  expenses: Expense[]
  summary: ExpenseSummary
}
