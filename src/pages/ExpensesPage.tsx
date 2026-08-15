import { useEffect, useMemo, useState } from "react"
import { AlertTriangleIcon, PlusIcon, ReceiptIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { EmptyState } from "@/components/common/EmptyState"
import { PageHeader } from "@/components/common/PageHeader"
import { MonthFormDialog } from "@/components/expenses/MonthFormDialog"
import { MonthList } from "@/components/expenses/MonthList"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  MonthExistsError,
  createExpenseMonth,
  subscribeExpenseMonths,
  subscribeMonthTotals,
} from "@/data/expenses"
import { useFormat } from "@/i18n/useFormat"
import type { ExpenseMonth, ExpenseMonthFormValues } from "@/schemas/expense"

export function ExpensesPage() {
  const { t } = useTranslation()
  const { formatSAR, formatMonth } = useFormat()

  const [months, setMonths] = useState<ExpenseMonth[]>([])
  const [totals, setTotals] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeExpenseMonths(
      (data) => {
        setMonths(data)
        setLoading(false)
      },
      () => {
        setError("load_failed")
        setLoading(false)
      }
    )
    return unsubscribe
  }, [])

  useEffect(() => {
    return subscribeMonthTotals(setTotals, () => {})
  }, [])

  const summary = useMemo(() => {
    const totalDisbursed = Object.values(totals).reduce(
      (sum, amount) => sum + amount,
      0
    )
    const latest = months[0]

    return { count: months.length, totalDisbursed, latest }
  }, [months, totals])

  async function handleAddMonth(values: ExpenseMonthFormValues) {
    try {
      await createExpenseMonth(values)
      toast.success(t("expenses.added"))
    } catch (err) {
      if (err instanceof MonthExistsError) {
        throw err
      }
      toast.error(t("common.saveFailed"))
    }
  }

  return (
    <div>
      <PageHeader
        title={t("expenses.title")}
        description={t("expenses.description")}
        action={
          <Button onClick={() => setFormOpen(true)}>
            <PlusIcon />
            {t("expenses.addMonth")}
          </Button>
        }
      />

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangleIcon />
          <AlertTitle>{t("common.loadFailed")}</AlertTitle>
          <AlertDescription>
            {t("common.loadFailedDescription")}
          </AlertDescription>
        </Alert>
      )}

      {!loading && months.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-3 sm:max-w-2xl sm:grid-cols-3">
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">
              {t("expenses.months")}
            </p>
            <p className="text-lg font-semibold">{summary.count}</p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">
              {t("expenses.totalDisbursed")}
            </p>
            <p className="text-lg font-semibold">
              {formatSAR(summary.totalDisbursed)}
            </p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">
              {t("expenses.latestMonth")}
            </p>
            <p className="text-lg font-semibold">
              {summary.latest
                ? formatMonth(summary.latest.year, summary.latest.month)
                : "—"}
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : months.length === 0 ? (
        <EmptyState
          icon={ReceiptIcon}
          title={t("expenses.emptyTitle")}
          description={t("expenses.emptyDescription")}
          action={
            <Button onClick={() => setFormOpen(true)}>
              <PlusIcon />
              {t("expenses.addMonth")}
            </Button>
          }
        />
      ) : (
        <MonthList months={months} totals={totals} />
      )}

      <MonthFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleAddMonth}
      />
    </div>
  )
}
