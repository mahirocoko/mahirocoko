import { useId, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { CreateExpenseInput, Expense } from '@/shared/expense'
import { STARTER_CATEGORIES } from '../constants'
import { getTodayInputValue } from '../format'
import { buildCategorySuggestions } from '../suggestions'

interface ExpenseFormProps {
  expenses: Expense[]
  onCreate: (input: CreateExpenseInput) => Promise<void>
  disabled?: boolean
}

interface FormState {
  title: string
  amount: string
  category: string
  note: string
  date: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const initialState = (): FormState => ({
  title: '',
  amount: '',
  category: '',
  note: '',
  date: getTodayInputValue(),
})

export const ExpenseForm = ({ expenses, onCreate, disabled }: ExpenseFormProps) => {
  const categoryListId = useId()
  const [formState, setFormState] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const suggestions = buildCategorySuggestions(expenses)

  const handleChange =
    (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const nextValue = event.target.value
      setFormState((current) => ({ ...current, [field]: nextValue }))
      setErrors((current) => ({ ...current, [field]: undefined }))
      setSubmitError(null)
    }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: FormErrors = {}
    const parsedAmount = Number(formState.amount)

    if (!formState.title.trim()) {
      nextErrors.title = 'กรอกชื่อรายการ'
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      nextErrors.amount = 'กรอกจำนวนเงินที่มากกว่า 0'
    }

    if (!formState.category.trim()) {
      nextErrors.category = 'เลือกหรือกรอกหมวดหมู่'
    }

    if (!formState.date) {
      nextErrors.date = 'เลือกวันที่ของรายการ'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await onCreate({
        title: formState.title.trim(),
        amount: parsedAmount,
        category: formState.category.trim(),
        date: formState.date,
        note: formState.note.trim(),
      })
      setErrors({})
      setFormState(() => ({
        ...initialState(),
        date: getTodayInputValue(),
      }))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'บันทึกไม่สำเร็จ'
      setSubmitError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card id="add-expense" className="border-slate-200 scroll-mt-28">
      <CardHeader>
        <CardTitle>เพิ่มรายจ่าย</CardTitle>
        <CardDescription>กรอกชื่อ จำนวนเงิน หมวด และวันที่ — โน้ตใส่หรือไม่ก็ได้</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {submitError ? <p className="text-sm text-ledger-expense">{submitError}</p> : null}
          <div className="space-y-2">
            <Label htmlFor="expense-title">ชื่อรายการ</Label>
            <Input
              id="expense-title"
              name="title"
              placeholder="เช่น ค่าอาหารกลางวัน"
              value={formState.title}
              onChange={handleChange('title')}
              disabled={disabled || isSubmitting}
            />
            {errors.title ? <p className="text-xs text-ledger-expense">{errors.title}</p> : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="expense-amount">จำนวนเงิน (THB)</Label>
              <Input
                id="expense-amount"
                inputMode="decimal"
                min={0}
                name="amount"
                placeholder="0.00"
                step="0.01"
                type="number"
                value={formState.amount}
                onChange={handleChange('amount')}
                disabled={disabled || isSubmitting}
              />
              {errors.amount ? <p className="text-xs text-ledger-expense">{errors.amount}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense-date">วันที่</Label>
              <Input
                id="expense-date"
                name="date"
                type="date"
                value={formState.date}
                onChange={handleChange('date')}
                disabled={disabled || isSubmitting}
              />
              {errors.date ? <p className="text-xs text-ledger-expense">{errors.date}</p> : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense-category">หมวดหมู่</Label>
            <Input
              id="expense-category"
              list={categoryListId}
              name="category"
              placeholder="เลือกจากรายการหรือพิมพ์ใหม่"
              value={formState.category}
              onChange={handleChange('category')}
              disabled={disabled || isSubmitting}
            />
            <datalist id={categoryListId}>
              {suggestions.map((suggestion) => (
                <option key={suggestion} value={suggestion} />
              ))}
            </datalist>
            {errors.category ? <p className="text-xs text-ledger-expense">{errors.category}</p> : null}
            <div className="flex flex-wrap gap-2 pt-1">
              {STARTER_CATEGORIES.map((category) => (
                <Button
                  key={category}
                  type="button"
                  variant="outline"
                  className="h-8 rounded-full px-3 text-xs"
                  disabled={disabled || isSubmitting}
                  onClick={() => {
                    setFormState((current) => ({ ...current, category }))
                    setErrors((current) => ({ ...current, category: undefined }))
                    setSubmitError(null)
                  }}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense-note">โน้ต (ไม่บังคับ)</Label>
            <Textarea
              id="expense-note"
              name="note"
              placeholder="รายละเอียดเพิ่มเติม"
              value={formState.note}
              onChange={handleChange('note')}
              disabled={disabled || isSubmitting}
            />
            <p className="text-xs text-ledger-muted">เว้นว่างได้</p>
          </div>

          <Button className="w-full md:w-auto" disabled={disabled || isSubmitting} type="submit">
            {isSubmitting ? 'กำลังบันทึก…' : 'บันทึกรายจ่าย'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
