import { createCollection } from "@/data/store"
import type { Debt, DebtFormValues } from "@/schemas/debt"

const debts = createCollection<Debt, DebtFormValues>("debts")

export function subscribeDebts(
  onData: (items: Debt[]) => void,
  onError: (error: Error) => void
) {
  return debts.subscribe(onData, onError)
}

export function createDebt(input: DebtFormValues) {
  return debts.create(input)
}

export function updateDebt(id: string, input: DebtFormValues) {
  return debts.update(id, input)
}

export function deleteDebt(id: string) {
  return debts.remove(id)
}
