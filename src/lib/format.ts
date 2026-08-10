export function maskNationalId(nationalId: string) {
  const visible = nationalId.slice(-4)
  return `${"•".repeat(Math.max(nationalId.length - 4, 0))}${visible}`
}
