import { useEffect, useMemo, useState } from "react"
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  PlusIcon,
  ReceiptIcon,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link, useParams } from "react-router-dom"
import { toast } from "sonner"

import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog"
import { DataToolbar } from "@/components/common/DataToolbar"
import { EmptyState } from "@/components/common/EmptyState"
import { PageHeader } from "@/components/common/PageHeader"
import { ExpenseEntryFormDialog } from "@/components/expenses/ExpenseEntryFormDialog"
import { ExpenseEntryTable } from "@/components/expenses/ExpenseEntryTable"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { expenseEntriesApi, subscribeExpenseMonth } from "@/data/expenses"
import { useCollection } from "@/hooks/useCollection"
import { useFormat } from "@/i18n/useFormat"
import { parseMonthKey } from "@/lib/expense"
import type { ExpenseEntry, ExpenseEntryFormValues, ExpenseMonth } from "@/schemas/expense"

export function ExpenseMonthPage() {
  const { t } = useTranslation()
  const { formatSAR, formatMonth } = useFormat()
  const { monthId = "" } = useParams()
  const parsed = parseMonthKey(monthId)

  const [month, setMonth] = useState<ExpenseMonth | null | undefined>(
    undefined
  )

  // Resets to the loading state synchronously during render when monthId changes,
  // rather than in the effect body — avoids an extra cascading render.
  const [prevMonthId, setPrevMonthId] = useState(monthId)
  if (monthId !== prevMonthId) {
    setPrevMonthId(monthId)
    setMonth(undefined)
  }

  useEffect(() => {
    if (!parsed) return
    return subscribeExpenseMonth(
      monthId,
      (data) => setMonth(data),
      () => setMonth(null)
    )
  }, [monthId, parsed])

  const api = useMemo(() => expenseEntriesApi(monthId), [monthId])
  const { items, loading, error, create, update, remove } = useCollection<
    ExpenseEntry,
    ExpenseEntryFormValues
  >({
    subscribe: api.subscribe,
    create: api.create,
    update: api.update,
    remove: api.remove,
  })

  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<ExpenseEntry | undefined>()
  const [deletingEntry, setDeletingEntry] = useState<ExpenseEntry | null>(
    null
  )
  const [isDeleting, setIsDeleting] = useState(false)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return items
    return items.filter((entry) =>
      entry.statement.toLowerCase().includes(query)
    )
  }, [items, search])

  const totals = useMemo(() => {
    const totalDisbursed = items.reduce(
      (sum, entry) => sum + entry.amountDisbursed,
      0
    )
    const largest = items.reduce(
      (max, entry) => Math.max(max, entry.amountDisbursed),
      0
    )

    return { count: items.length, totalDisbursed, largest }
  }, [items])

  function openAddDialog() {
    setEditingEntry(undefined)
    setFormOpen(true)
  }

  function openEditDialog(entry: ExpenseEntry) {
    setEditingEntry(entry)
    setFormOpen(true)
  }

  async function handleSubmit(values: ExpenseEntryFormValues) {
    try {
      if (editingEntry) {
        await update(editingEntry.id, values)
        toast.success(t("expenses.entryUpdated"))
      } else {
        await create(values)
        toast.success(t("expenses.entryAdded"))
      }
    } catch {
      toast.error(t("common.saveFailed"))
    }
  }

  async function handleConfirmDelete() {
    if (!deletingEntry) return
    setIsDeleting(true)
    try {
      await remove(deletingEntry.id)
      toast.success(t("expenses.entryDeleted"))
      setDeletingEntry(null)
    } catch {
      toast.error(t("common.deleteFailed"))
    } finally {
      setIsDeleting(false)
    }
  }

  if (!parsed || month === null) {
    return (
      <div>
        <EmptyState
          icon={ReceiptIcon}
          title={t("expenses.monthNotFound")}
          description={t("expenses.monthNotFoundDescription")}
          action={
            <Button variant="outline" render={<Link to="/expenses" />}>
              <ArrowLeftIcon className="rtl:rotate-180" />
              {t("expenses.backToMonths")}
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        className="mb-3"
        render={<Link to="/expenses" />}
      >
        <ArrowLeftIcon className="rtl:rotate-180" />
        {t("expenses.backToMonths")}
      </Button>

      <PageHeader
        title={
          month
            ? formatMonth(month.year, month.month)
            : formatMonth(parsed.year, parsed.month)
        }
        action={
          <Button onClick={openAddDialog}>
            <PlusIcon />
            {t("expenses.addEntry")}
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

      {!loading && items.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-3 sm:max-w-2xl sm:grid-cols-3">
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">
              {t("expenses.entries")}
            </p>
            <p className="text-lg font-semibold">{totals.count}</p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">
              {t("expenses.totalDisbursed")}
            </p>
            <p className="text-lg font-semibold">
              {formatSAR(totals.totalDisbursed)}
            </p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">
              {t("expenses.largestExpense")}
            </p>
            <p className="text-lg font-semibold">
              {formatSAR(totals.largest)}
            </p>
          </div>
        </div>
      )}

      <DataToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("expenses.searchPlaceholder")}
      />

      {loading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ReceiptIcon}
          title={
            items.length === 0
              ? t("expenses.emptyTitle")
              : t("expenses.noMatchesTitle")
          }
          description={
            items.length === 0
              ? t("expenses.emptyDescription")
              : t("expenses.noMatchesDescription")
          }
          action={
            items.length === 0 ? (
              <Button onClick={openAddDialog}>
                <PlusIcon />
                {t("expenses.addEntry")}
              </Button>
            ) : undefined
          }
        />
      ) : (
        <ExpenseEntryTable
          entries={filtered}
          onEdit={openEditDialog}
          onDelete={setDeletingEntry}
        />
      )}

      <ExpenseEntryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        monthId={monthId}
        entry={editingEntry}
        onSubmit={handleSubmit}
      />

      <ConfirmDeleteDialog
        open={!!deletingEntry}
        onOpenChange={(open) => !open && setDeletingEntry(null)}
        title={t("expenses.deleteTitle")}
        description={
          deletingEntry
            ? t("expenses.deleteDescription", {
                statement: deletingEntry.statement,
                amount: formatSAR(deletingEntry.amountDisbursed),
              })
            : ""
        }
        onConfirm={handleConfirmDelete}
        isPending={isDeleting}
      />
    </div>
  )
}
