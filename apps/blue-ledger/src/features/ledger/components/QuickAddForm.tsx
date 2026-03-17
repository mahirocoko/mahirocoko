import { useId, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { getTodayInputValue } from '../format'
import type { CreateLedgerEntryInput, LedgerEntryType } from '../types'

interface QuickAddFormProps {
  expenseSuggestions: string[]
  incomeSuggestions: string[]
  onCreateEntry: (input: CreateLedgerEntryInput) => void
}

interface QuickAddFormState {
  type: LedgerEntryType
  amount: string
  category: string
  note: string
  date: string
}

type QuickAddFormErrors = Partial<Record<keyof QuickAddFormState, string>>

const initialFormState = (): QuickAddFormState => ({
  type: 'expense',
  amount: '',
  category: '',
  note: '',
  date: getTodayInputValue(),
})

export const QuickAddForm = ({
  expenseSuggestions,
  incomeSuggestions,
  onCreateEntry,
}: QuickAddFormProps) => {
  const categoryListId = useId()

  const [formState, setFormState] = useState<QuickAddFormState>(initialFormState)
  const [errors, setErrors] = useState<QuickAddFormErrors>({})

  const activeSuggestions =
    formState.type === 'income' ? incomeSuggestions : expenseSuggestions

  const handleChange =
    (field: keyof QuickAddFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const nextValue = event.target.value

      setFormState((currentState) => ({
        ...currentState,
        [field]: nextValue,
      }))
      setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }))
    }

  const handleTypeChange = (nextType: LedgerEntryType) => {
    setFormState((currentState) => ({
      ...currentState,
      type: nextType,
    }))
    setErrors((currentErrors) => ({ ...currentErrors, type: undefined }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: QuickAddFormErrors = {}
    const parsedAmount = Number(formState.amount)

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      nextErrors.amount = 'กรอกจำนวนเงินที่มากกว่า 0'
    }

    if (!formState.category.trim()) {
      nextErrors.category = 'กรอกหมวดหมู่ก่อนบันทึก'
    }

    if (!formState.date) {
      nextErrors.date = 'เลือกวันที่ของรายการ'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    onCreateEntry({
      type: formState.type,
      amount: parsedAmount,
      category: formState.category.trim(),
      note: formState.note.trim(),
      date: formState.date,
    })

    setErrors({})
    setFormState((currentState) => ({
      ...initialFormState(),
      type: currentState.type,
      date: getTodayInputValue(),
    }))
  }

  return (
    <section className="panel" id="quick-add">
      <div className="panel__header">
        <div>
          <h2 className="panel__title">เพิ่มรายการใหม่</h2>
          <p className="panel__description">หมวดใหม่จะถูกจำไว้ให้เลือกครั้งถัดไป</p>
        </div>
      </div>

      <form className="ledger-form" onSubmit={handleSubmit}>
        <div className="field">
          <span className="field__label">ประเภทรายการ</span>
          <div className="type-switch" role="radiogroup" aria-label="เลือกประเภทรายการ">
            <button
              className={[
                'type-switch__button',
                formState.type === 'expense' ? 'type-switch__button--active' : '',
              ].join(' ')}
              type="button"
              role="radio"
              aria-checked={formState.type === 'expense'}
              onClick={() => handleTypeChange('expense')}
            >
              รายจ่าย Expense
            </button>
            <button
              className={[
                'type-switch__button',
                formState.type === 'income' ? 'type-switch__button--active' : '',
              ].join(' ')}
              type="button"
              role="radio"
              aria-checked={formState.type === 'income'}
              onClick={() => handleTypeChange('income')}
            >
              รายรับ Income
            </button>
          </div>
        </div>

        <div className="form-grid form-grid--two-columns">
          <label className="field">
            <span className="field__label">จำนวนเงิน</span>
            <input
              className="field__input"
              inputMode="decimal"
              min="0"
              name="amount"
              placeholder="0.00"
              step="0.01"
              type="number"
              value={formState.amount}
              onChange={handleChange('amount')}
            />
            {errors.amount ? <span className="field__error">{errors.amount}</span> : null}
          </label>

          <label className="field">
            <span className="field__label">วันที่</span>
            <input
              className="field__input"
              name="date"
              type="date"
              value={formState.date}
              onChange={handleChange('date')}
            />
            {errors.date ? <span className="field__error">{errors.date}</span> : null}
          </label>
        </div>

        <label className="field">
          <span className="field__label">หมวดหมู่</span>
          <input
            className="field__input"
            list={categoryListId}
            name="category"
            placeholder={
              formState.type === 'income' ? 'เช่น เงินเดือน' : 'เช่น อาหาร'
            }
            value={formState.category}
            onChange={handleChange('category')}
          />
          <datalist id={categoryListId}>
            {activeSuggestions.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
          {errors.category ? <span className="field__error">{errors.category}</span> : null}
        </label>

        <div className="suggestions" aria-label="Category suggestions">
          {activeSuggestions.slice(0, 6).map((suggestion) => (
            <button
              key={suggestion}
              className="suggestion-chip"
              type="button"
              onClick={() =>
                {
                  setFormState((currentState) => ({
                    ...currentState,
                    category: suggestion,
                  }))
                  setErrors((currentErrors) => ({
                    ...currentErrors,
                    category: undefined,
                  }))
                }
              }
            >
              {suggestion}
            </button>
          ))}
        </div>

        <label className="field">
          <span className="field__label">โน้ต</span>
          <textarea
            className="field__textarea"
            name="note"
            placeholder="ใส่รายละเอียดเพิ่มได้ถ้าต้องการ"
            value={formState.note}
            onChange={handleChange('note')}
          />
          <span className="field__help">เว้นว่างได้</span>
        </label>

        <button className="ledger-form__submit" type="submit">
          บันทึกรายการ
        </button>
      </form>
    </section>
  )
}
