import { useId, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { getTodayInputValue } from '@/lib/format'
import type { CreateExpenseInput } from '@/shared/expense'

interface ExpenseFormProps {
  categorySuggestions: string[]
  onSubmitExpense: (input: CreateExpenseInput) => Promise<void>
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

export function ExpenseForm({ categorySuggestions, disabled, onSubmitExpense }: ExpenseFormProps) {
  const categoryListId = useId()
  const [form, setForm] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const handleChange =
    (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const next = event.target.value
      setForm((s) => ({ ...s, [field]: next }))
      setErrors((e) => ({ ...e, [field]: undefined }))
      setSubmitError(null)
    }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: FormErrors = {}
    const parsedAmount = Number(form.amount)

    if (!form.title.trim()) {
      nextErrors.title = 'กรอกชื่อรายการ'
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      nextErrors.amount = 'กรอกจำนวนเงินที่มากกว่า 0'
    }
    if (!form.category.trim()) {
      nextErrors.category = 'กรอกหมวดหมู่'
    }
    if (!form.date) {
      nextErrors.date = 'เลือกวันที่'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setPending(true)
    setSubmitError(null)
    try {
      await onSubmitExpense({
        title: form.title.trim(),
        amount: parsedAmount,
        category: form.category.trim(),
        date: form.date,
        note: form.note.trim(),
      })
      setErrors({})
      setForm(() => ({
        ...initialState(),
        date: getTodayInputValue(),
      }))
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'บันทึกไม่สำเร็จ')
    } finally {
      setPending(false)
    }
  }

  return (
    <Card className="scroll-mt-28 border-slate-200 shadow-sm" id="add-expense">
      <CardHeader>
        <CardTitle>เพิ่มรายจ่าย</CardTitle>
        <CardDescription>บันทึกค่าใช้จ่ายครั้งเดียว ข้อมูลเก็บในหน่วยความจำของเซิร์ฟเวอร์ชั่วคราว</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {submitError ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
              {submitError}
            </p>
          ) : null}
          <div className="grid gap-2">
            <Label htmlFor="expense-title">ชื่อรายการ</Label>
            <Input
              id="expense-title"
              name="title"
              placeholder="เช่น ค่ารถไฟฟ้า"
              value={form.title}
              disabled={disabled || pending}
              onChange={handleChange('title')}
            />
            {errors.title ? <p className="text-sm text-red-600">{errors.title}</p> : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="expense-amount">จำนวนเงิน (THB)</Label>
              <Input
                id="expense-amount"
                inputMode="decimal"
                min={0}
                name="amount"
                placeholder="0.00"
                step="0.01"
                type="number"
                value={form.amount}
                disabled={disabled || pending}
                onChange={handleChange('amount')}
              />
              {errors.amount ? <p className="text-sm text-red-600">{errors.amount}</p> : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expense-date">วันที่</Label>
              <Input
                id="expense-date"
                name="date"
                type="date"
                value={form.date}
                disabled={disabled || pending}
                onChange={handleChange('date')}
              />
              {errors.date ? <p className="text-sm text-red-600">{errors.date}</p> : null}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="expense-category">หมวดหมู่</Label>
            <Input
              id="expense-category"
              list={categoryListId}
              name="category"
              placeholder="เช่น อาหาร · การเดินทาง"
              value={form.category}
              disabled={disabled || pending}
              onChange={handleChange('category')}
            />
            <datalist id={categoryListId}>
              {categorySuggestions.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            {errors.category ? <p className="text-sm text-red-600">{errors.category}</p> : null}
          </div>

          {categorySuggestions.length > 0 ? (
            <div className="flex flex-wrap gap-2" aria-label="หมวดที่เคยใช้">
              {categorySuggestions.slice(0, 8).map((c) => (
                <Button
                  key={c}
                  className="h-8 rounded-full px-3 text-xs font-medium"
                  type="button"
                  variant="outline"
                  disabled={disabled || pending}
                  onClick={() => {
                    setForm((s) => ({ ...s, category: c }))
                    setErrors((e) => ({ ...e, category: undefined }))
                    setSubmitError(null)
                  }}
                >
                  {c}
                </Button>
              ))}
            </div>
          ) : null}

          <div className="grid gap-2">
            <Label htmlFor="expense-note">โน้ต (ไม่บังคับ)</Label>
            <Textarea
              id="expense-note"
              name="note"
              placeholder="รายละเอียดเพิ่มเติม"
              value={form.note}
              disabled={disabled || pending}
              onChange={handleChange('note')}
            />
          </div>

          <Button disabled={disabled || pending} type="submit">
            {pending ? 'กำลังบันทึก…' : 'บันทึกรายจ่าย'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
