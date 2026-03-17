import { MAX_RECENT_ENTRIES, STARTER_CATEGORIES } from './constants'
import type { LedgerEntry, LedgerEntryType, LedgerSummary } from './types'

const normalizeCategory = (value: string) => value.trim().toLocaleLowerCase()

export const sortEntriesByMostRecent = (entries: LedgerEntry[]) =>
  [...entries].sort((left, right) => {
    const dateOrder = right.date.localeCompare(left.date)

    if (dateOrder !== 0) {
      return dateOrder
    }

    return right.createdAt.localeCompare(left.createdAt)
  })

export const getLedgerSummary = (entries: LedgerEntry[]): LedgerSummary => {
  let totalIncome = 0
  let totalExpense = 0

  for (const entry of entries) {
    if (entry.type === 'income') {
      totalIncome += entry.amount
      continue
    }

    totalExpense += entry.amount
  }

  return {
    balance: totalIncome - totalExpense,
    totalIncome,
    totalExpense,
  }
}

export const getRecentEntries = (
  entries: LedgerEntry[],
  limit = MAX_RECENT_ENTRIES,
) => sortEntriesByMostRecent(entries).slice(0, limit)

export const getCategorySuggestions = (
  entries: LedgerEntry[],
  type: LedgerEntryType,
) => {
  const suggestions: string[] = []
  const seenCategories = new Set<string>()

  for (const entry of sortEntriesByMostRecent(entries)) {
    if (entry.type !== type) {
      continue
    }

    const normalizedCategory = normalizeCategory(entry.category)

    if (!normalizedCategory || seenCategories.has(normalizedCategory)) {
      continue
    }

    seenCategories.add(normalizedCategory)
    suggestions.push(entry.category.trim())
  }

  for (const category of STARTER_CATEGORIES[type]) {
    const normalizedCategory = normalizeCategory(category)

    if (seenCategories.has(normalizedCategory)) {
      continue
    }

    seenCategories.add(normalizedCategory)
    suggestions.push(category)
  }

  return suggestions.slice(0, 8)
}
