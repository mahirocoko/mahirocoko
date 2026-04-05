import type { Expense } from '@/shared/expense'
import { STARTER_CATEGORIES } from './constants'

const normalizeCategory = (value: string) => value.trim().toLocaleLowerCase()

export const buildCategorySuggestions = (expenses: Expense[], limit = 8) => {
  const suggestions: string[] = []
  const seen = new Set<string>()

  for (const expense of expenses) {
    const normalized = normalizeCategory(expense.category)
    if (!normalized || seen.has(normalized)) continue
    seen.add(normalized)
    suggestions.push(expense.category.trim())
  }

  for (const category of STARTER_CATEGORIES) {
    const normalized = normalizeCategory(category)
    if (seen.has(normalized)) continue
    seen.add(normalized)
    suggestions.push(category)
  }

  return suggestions.slice(0, limit)
}
