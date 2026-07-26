const sarFormatter = new Intl.NumberFormat("en-SA", {
  style: "currency",
  currency: "SAR",
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})

export function formatSAR(amount: number) {
  return sarFormatter.format(amount)
}

export function formatDate(iso: string) {
  return dateFormatter.format(new Date(iso))
}

export function maskNationalId(nationalId: string) {
  const visible = nationalId.slice(-4)
  return `${"•".repeat(Math.max(nationalId.length - 4, 0))}${visible}`
}
