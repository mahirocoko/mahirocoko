export type LedgerEntryType = 'income' | 'expense'

export interface LedgerEntry {
  id: string
  type: LedgerEntryType
  amount: number
  category: string
  note: string
  date: string
  createdAt: string
}

export interface CreateLedgerEntryInput {
  type: LedgerEntryType
  amount: number
  category: string
  note: string
  date: string
}

export interface LedgerSummary {
  balance: number
  totalIncome: number
  totalExpense: number
}

export interface LedgerStateSnapshot {
  entries: LedgerEntry[]
  didRecoverFromCorruption: boolean
}
