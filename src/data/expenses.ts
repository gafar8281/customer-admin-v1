import {
  collection,
  collectionGroup,
  doc,
  onSnapshot,
  runTransaction,
} from "firebase/firestore"

import { createCollection } from "@/data/store"
import { db } from "@/lib/firebase"
import { monthKey } from "@/lib/expense"
import type {
  ExpenseEntry,
  ExpenseEntryFormValues,
  ExpenseMonth,
  ExpenseMonthFormValues,
} from "@/schemas/expense"

const EXPENSES_COLLECTION = "customer_expenses"
const ENTRIES_SUBCOLLECTION = "expense_entries"

export class MonthExistsError extends Error {
  constructor() {
    super("Expense month already exists")
    this.name = "MonthExistsError"
  }
}

export function subscribeExpenseMonths(
  onData: (items: ExpenseMonth[]) => void,
  onError: (error: Error) => void
) {
  const ref = collection(db, EXPENSES_COLLECTION)
  return onSnapshot(
    ref,
    (snapshot) => {
      const items = snapshot.docs
        .map(
          (docSnapshot) =>
            ({ id: docSnapshot.id, ...docSnapshot.data() }) as ExpenseMonth
        )
        .sort((a, b) => b.id.localeCompare(a.id))
      onData(items)
    },
    onError
  )
}

export function subscribeExpenseMonth(
  monthId: string,
  onData: (item: ExpenseMonth | null) => void,
  onError: (error: Error) => void
) {
  const ref = doc(db, EXPENSES_COLLECTION, monthId)
  return onSnapshot(
    ref,
    (snapshot) => {
      onData(
        snapshot.exists()
          ? ({ id: snapshot.id, ...snapshot.data() } as ExpenseMonth)
          : null
      )
    },
    onError
  )
}

export async function createExpenseMonth(input: ExpenseMonthFormValues) {
  const id = monthKey(input.year, input.month)
  const ref = doc(db, EXPENSES_COLLECTION, id)

  await runTransaction(db, async (transaction) => {
    const existing = await transaction.get(ref)
    if (existing.exists()) {
      throw new MonthExistsError()
    }

    const now = new Date().toISOString()
    transaction.set(ref, { ...input, createdAt: now, updatedAt: now })
  })

  return id
}

export function subscribeMonthTotals(
  onData: (totals: Record<string, number>) => void,
  onError: (error: Error) => void
) {
  const ref = collectionGroup(db, ENTRIES_SUBCOLLECTION)
  return onSnapshot(
    ref,
    (snapshot) => {
      const totals: Record<string, number> = {}
      for (const docSnapshot of snapshot.docs) {
        const monthId = docSnapshot.ref.parent.parent?.id
        if (!monthId) continue
        const amount = docSnapshot.data().amountDisbursed
        if (typeof amount !== "number") continue
        totals[monthId] = (totals[monthId] ?? 0) + amount
      }
      onData(totals)
    },
    onError
  )
}

export function expenseEntriesApi(monthId: string) {
  return createCollection<ExpenseEntry, ExpenseEntryFormValues>(
    `${EXPENSES_COLLECTION}/${monthId}/${ENTRIES_SUBCOLLECTION}`
  )
}
