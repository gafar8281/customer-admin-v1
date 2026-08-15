export const MONTH_NUMBERS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
] as const

export function monthKey(year: number, month: number) {
  return `${year}-${String(month).padStart(2, "0")}`
}

export function parseMonthKey(
  key: string | undefined
): { year: number; month: number } | null {
  if (!key) return null
  const match = /^(\d{4})-(\d{2})$/.exec(key)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  if (month < 1 || month > 12) return null

  return { year, month }
}

export function monthDateBounds(key: string) {
  const parsed = parseMonthKey(key)
  if (!parsed) return null

  const { year, month } = parsed
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate()

  return {
    min: `${key}-01`,
    max: `${key}-${String(lastDay).padStart(2, "0")}`,
  }
}
