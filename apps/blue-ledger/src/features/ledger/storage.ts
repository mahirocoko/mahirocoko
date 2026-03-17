import { LEDGER_STORAGE_KEY } from './constants'
import type { LedgerEntry, LedgerStateSnapshot } from './types'

const isLedgerEntry = (value: unknown): value is LedgerEntry => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const entry = value as Record<string, unknown>

  return (
    typeof entry.id === 'string' &&
    (entry.type === 'income' || entry.type === 'expense') &&
    typeof entry.amount === 'number' &&
    Number.isFinite(entry.amount) &&
    entry.amount > 0 &&
    typeof entry.category === 'string' &&
    typeof entry.note === 'string' &&
    typeof entry.date === 'string' &&
    typeof entry.createdAt === 'string'
  )
}

export const loadLedgerState = (): LedgerStateSnapshot => {
  if (typeof window === 'undefined') {
    return { entries: [], didRecoverFromCorruption: false }
  }

  const rawEntries = window.localStorage.getItem(LEDGER_STORAGE_KEY)

  if (!rawEntries) {
    return { entries: [], didRecoverFromCorruption: false }
  }

  try {
    const parsedEntries = JSON.parse(rawEntries)

    if (!Array.isArray(parsedEntries) || !parsedEntries.every(isLedgerEntry)) {
      window.localStorage.removeItem(LEDGER_STORAGE_KEY)
      return { entries: [], didRecoverFromCorruption: true }
    }

    return { entries: parsedEntries, didRecoverFromCorruption: false }
  } catch {
    window.localStorage.removeItem(LEDGER_STORAGE_KEY)
    return { entries: [], didRecoverFromCorruption: true }
  }
}

export const saveLedgerEntries = (entries: LedgerEntry[]) => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(entries))
  } catch {
    return
  }
}
