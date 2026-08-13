import { createCollection } from "@/data/store"
import type { Receivable, ReceivableFormValues } from "@/schemas/receivable"

const receivables = createCollection<Receivable, ReceivableFormValues>(
  "debts_receivable"
)

export function subscribeReceivables(
  onData: (items: Receivable[]) => void,
  onError: (error: Error) => void
) {
  return receivables.subscribe(onData, onError)
}

export function createReceivable(input: ReceivableFormValues) {
  return receivables.create(input)
}

export function updateReceivable(id: string, input: ReceivableFormValues) {
  return receivables.update(id, input)
}

export function deleteReceivable(id: string) {
  return receivables.remove(id)
}
