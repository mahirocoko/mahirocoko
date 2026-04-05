export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 2,
  }).format(amount)

export const formatEntryDate = (value: string) =>
  new Intl.DateTimeFormat('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))

export const formatTodayLabel = (value: Date) =>
  new Intl.DateTimeFormat('th-TH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(value)

export const getTodayInputValue = () => new Date().toISOString().slice(0, 10)
