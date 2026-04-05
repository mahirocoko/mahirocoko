import { Hono } from 'hono'
import type { CreateExpenseInput, ExpensesResponse } from '../shared/expense'
import { expenseStore } from './store'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const parseCreateBody = (body: unknown): CreateExpenseInput | null => {
  if (!isRecord(body)) return null
  const title = typeof body.title === 'string' ? body.title : ''
  const category = typeof body.category === 'string' ? body.category : ''
  const date = typeof body.date === 'string' ? body.date : ''
  const note = typeof body.note === 'string' ? body.note : ''
  const amount = typeof body.amount === 'number' ? body.amount : Number(body.amount)
  if (!Number.isFinite(amount) || amount <= 0) return null
  if (!title.trim() || !category.trim() || !date) return null
  return { title, category, date, amount, note }
}

export const createApiApp = () => {
  const api = new Hono()

  api.get('/expenses', (c) => {
    const expenses = expenseStore.list()
    const summary = expenseStore.summary()
    const payload: ExpensesResponse = { expenses, summary }
    return c.json(payload)
  })

  api.post('/expenses', async (c) => {
    let body: unknown
    try {
      body = await c.req.json()
    } catch {
      return c.json({ error: 'รูปแบบคำขอไม่ถูกต้อง' }, 400)
    }
    const parsed = parseCreateBody(body)
    if (!parsed) {
      return c.json({ error: 'ข้อมูลไม่ครบหรือจำนวนเงินไม่ถูกต้อง' }, 400)
    }
    const expense = expenseStore.add(parsed)
    return c.json({ expense }, 201)
  })

  return api
}
