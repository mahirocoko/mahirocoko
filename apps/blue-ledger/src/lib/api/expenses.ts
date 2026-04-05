import type { CreateExpenseInput, Expense, ExpensesResponse } from '@/shared/expense'

const parseJson = async (response: Response): Promise<unknown> => {
  try {
    return await response.json()
  } catch {
    return null
  }
}

export async function fetchExpenses(): Promise<ExpensesResponse> {
  const response = await fetch('/api/expenses')
  if (!response.ok) {
    throw new Error('โหลดรายการไม่สำเร็จ')
  }
  const payload = (await parseJson(response)) as ExpensesResponse | null
  if (!payload || !Array.isArray(payload.expenses) || !payload.summary) {
    throw new Error('ข้อมูลจากเซิร์ฟเวอร์ไม่ถูกต้อง')
  }
  return payload
}

export async function createExpense(input: CreateExpenseInput): Promise<Expense> {
  const response = await fetch('/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const data = (await parseJson(response)) as { expense?: Expense; error?: string } | null
  if (!response.ok) {
    const message =
      typeof data?.error === 'string' ? data.error : 'บันทึกไม่สำเร็จ'
    throw new Error(message)
  }
  if (!data?.expense || typeof data.expense !== 'object') {
    throw new Error('รูปแบบตอบกลับไม่ถูกต้อง')
  }
  return data.expense
}
