import { formatCurrency } from '../format'

interface SummaryCardsProps {
  balance: number
  totalIncome: number
  totalExpense: number
  showRecoveryNotice: boolean
  recoveryMessage: string
}

export const SummaryCards = ({
  balance,
  totalIncome,
  totalExpense,
  showRecoveryNotice,
  recoveryMessage,
}: SummaryCardsProps) => (
  <section className="summary-grid" aria-label="Ledger overview">
    <article className="summary-card summary-card--balance">
      <div className="summary-card__header">
        <h2 className="summary-card__heading">ยอดคงเหลือ Balance</h2>
      </div>

      <p
        className={[
          'summary-card__amount',
          balance >= 0 ? 'summary-card__amount--positive' : 'summary-card__amount--negative',
        ].join(' ')}
      >
        {formatCurrency(balance)}
      </p>

      <div className="summary-card__footer">
        <p className="summary-card__context">คำนวณจากรายการทั้งหมดที่บันทึกไว้ในเบราว์เซอร์นี้</p>
      </div>
    </article>

    <div className="summary-stack">
      <article className="summary-card summary-mini">
        <div className="summary-mini__eyeline">
          <p className="summary-mini__label">รายรับ Income</p>
        </div>
        <p className="summary-mini__value">{formatCurrency(totalIncome)}</p>
        <p className="summary-mini__hint">รวมรายการรายรับทั้งหมด</p>
      </article>

      <article className="summary-card summary-mini">
        <div className="summary-mini__eyeline">
          <p className="summary-mini__label">รายจ่าย Expense</p>
        </div>
        <p className="summary-mini__value">{formatCurrency(totalExpense)}</p>
        <p className="summary-mini__hint">รวมรายการรายจ่ายทั้งหมด</p>
      </article>

      {showRecoveryNotice ? <p className="recovery-note">{recoveryMessage}</p> : null}
    </div>
  </section>
)
