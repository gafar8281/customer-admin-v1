import { createCollection } from "@/data/store"
import { createDebtSeed } from "@/mock/debts"
import type { Debt, DebtFormValues } from "@/schemas/debt"

const debts = createCollection<Debt, DebtFormValues>("cas.debts", createDebtSeed)

export function getDebts() {
  return debts.list()
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

export function resetDebts() {
  return debts.reset()
}
