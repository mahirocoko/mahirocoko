import { formatCurrency, formatEntryDate } from '../format'
import type { LedgerEntry } from '../types'

interface RecentActivityProps {
  entries: LedgerEntry[]
}

export const RecentActivity = ({ entries }: RecentActivityProps) => (
  <section className="panel">
    <div className="panel__header">
      <div>
        <h2 className="panel__title">รายการล่าสุด</h2>
        <p className="panel__description">แสดงล่าสุด 8 รายการ</p>
      </div>
    </div>

    {entries.length === 0 ? (
      <div className="empty-state">
        <h3 className="empty-state__title">ยังไม่มีรายการ</h3>
        <p className="empty-state__description">
          เริ่มจากบันทึกรายรับหรือรายจ่ายรายการแรกในส่วน Quick add ด้านซ้ายหรือด้านบนของหน้านี้
        </p>
      </div>
    ) : (
      <ol className="activity-list">
        {entries.map((entry) => (
          <li key={entry.id} className="activity-item">
            <div className="activity-item__main">
              <div className="activity-item__header">
                <h3 className="activity-item__category">{entry.category}</h3>
              </div>
              <p className="activity-item__meta">
                {entry.type === 'income' ? 'รายรับ' : 'รายจ่าย'} / {formatEntryDate(entry.date)}
              </p>
              {entry.note ? <p className="activity-item__note">{entry.note}</p> : null}
            </div>

            <div className="activity-item__amount">
              <p
                className={[
                  'activity-item__amount-value',
                  entry.type === 'income'
                    ? 'activity-item__amount-value--income'
                    : 'activity-item__amount-value--expense',
                ].join(' ')}
              >
                {entry.type === 'income' ? '+' : '-'}
                {formatCurrency(entry.amount)}
              </p>
              <p className="activity-item__amount-date">{formatEntryDate(entry.date)}</p>
            </div>
          </li>
        ))}
      </ol>
    )}
  </section>
)
