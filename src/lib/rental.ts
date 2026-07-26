export function getRemainingBalance(totalAmount: number, paidAmount: number) {
  return Math.max(totalAmount - paidAmount, 0)
}
