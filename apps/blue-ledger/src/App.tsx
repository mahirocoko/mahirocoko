import { useEffect, useState } from 'react'
import './App.css'
import {
  MAX_RECENT_ENTRIES,
  STORAGE_RECOVERY_MESSAGE,
} from './features/ledger/constants'
import { QuickAddForm } from './features/ledger/components/QuickAddForm'
import { RecentActivity } from './features/ledger/components/RecentActivity'
import { SummaryCards } from './features/ledger/components/SummaryCards'
import { TopBar } from './features/ledger/components/TopBar'
import { formatTodayLabel } from './features/ledger/format'
import { getCategorySuggestions, getLedgerSummary, getRecentEntries } from './features/ledger/selectors'
import { loadLedgerState, saveLedgerEntries } from './features/ledger/storage'
import type { CreateLedgerEntryInput, LedgerEntry } from './features/ledger/types'

const createLedgerEntryId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `entry-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

const createLedgerEntry = (input: CreateLedgerEntryInput): LedgerEntry => ({
  id: createLedgerEntryId(),
  type: input.type,
  amount: input.amount,
  category: input.category.trim(),
  note: input.note.trim(),
  date: input.date,
  createdAt: new Date().toISOString(),
})

function App() {
  const [storageSnapshot] = useState(loadLedgerState)
  const [entries, setEntries] = useState<LedgerEntry[]>(storageSnapshot.entries)
  const didRecoverFromCorruption = storageSnapshot.didRecoverFromCorruption

  useEffect(() => {
    saveLedgerEntries(entries)
  }, [entries])

  const summary = getLedgerSummary(entries)
  const recentEntries = getRecentEntries(entries, MAX_RECENT_ENTRIES)
  const incomeSuggestions = getCategorySuggestions(entries, 'income')
  const expenseSuggestions = getCategorySuggestions(entries, 'expense')

  const handleCreateEntry = (input: CreateLedgerEntryInput) => {
    const nextEntry = createLedgerEntry(input)

    setEntries((currentEntries) => [nextEntry, ...currentEntries])
  }

  return (
    <div className="app-shell">
      <TopBar
        currentDateLabel={formatTodayLabel(new Date())}
        entryCount={entries.length}
      />

      <main className="app-content">
        <SummaryCards
          balance={summary.balance}
          totalExpense={summary.totalExpense}
          totalIncome={summary.totalIncome}
          showRecoveryNotice={didRecoverFromCorruption}
          recoveryMessage={STORAGE_RECOVERY_MESSAGE}
        />

        <div className="workspace-grid">
          <QuickAddForm
            expenseSuggestions={expenseSuggestions}
            incomeSuggestions={incomeSuggestions}
            onCreateEntry={handleCreateEntry}
          />
          <RecentActivity entries={recentEntries} />
        </div>
      </main>
    </div>
  )
}

export default App
