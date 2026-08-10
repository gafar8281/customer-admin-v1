import { useMemo, useState } from "react"
import { HandCoinsIcon, PlusIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog"
import { DataToolbar } from "@/components/common/DataToolbar"
import { EmptyState } from "@/components/common/EmptyState"
import { PageHeader } from "@/components/common/PageHeader"
import { DebtFormDialog } from "@/components/debts/DebtFormDialog"
import { DebtTable } from "@/components/debts/DebtTable"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  createDebt,
  deleteDebt,
  getDebts,
  resetDebts,
  updateDebt,
} from "@/data/debts"
import { useCollection } from "@/hooks/useCollection"
import { useFormat } from "@/i18n/useFormat"
import type { Debt, DebtFormValues } from "@/schemas/debt"

export function DebtsPage() {
  const { t } = useTranslation()
  const { formatSAR } = useFormat()
  const { items, loading, create, update, remove } = useCollection<
    Debt,
    DebtFormValues
  >({
    list: getDebts,
    create: createDebt,
    update: updateDebt,
    remove: deleteDebt,
    reset: resetDebts,
  })

  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingDebt, setEditingDebt] = useState<Debt | undefined>()
  const [deletingDebt, setDeletingDebt] = useState<Debt | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return items
    return items.filter((debt) =>
      [debt.customer, debt.note ?? ""].join(" ").toLowerCase().includes(query)
    )
  }, [items, search])

  const totals = useMemo(() => {
    const totalOwed = items.reduce((sum, debt) => sum + debt.debtWeOwe, 0)
    const largest = items.reduce(
      (max, debt) => Math.max(max, debt.debtWeOwe),
      0
    )

    return { count: items.length, totalOwed, largest }
  }, [items])

  function openAddDialog() {
    setEditingDebt(undefined)
    setFormOpen(true)
  }

  function openEditDialog(debt: Debt) {
    setEditingDebt(debt)
    setFormOpen(true)
  }

  async function handleSubmit(values: DebtFormValues) {
    if (editingDebt) {
      await update(editingDebt.id, values)
      toast.success(t("debts.updated"))
    } else {
      await create(values)
      toast.success(t("debts.added"))
    }
  }

  async function handleConfirmDelete() {
    if (!deletingDebt) return
    setIsDeleting(true)
    try {
      await remove(deletingDebt.id)
      toast.success(t("debts.deleted"))
      setDeletingDebt(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title={t("debts.title")}
        description={t("debts.description")}
        action={
          <Button onClick={openAddDialog}>
            <PlusIcon />
            {t("debts.add")}
          </Button>
        }
      />

      {!loading && items.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-3 sm:max-w-2xl sm:grid-cols-3">
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">
              {t("debts.customers")}
            </p>
            <p className="text-lg font-semibold">{totals.count}</p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">
              {t("debts.totalOwed")}
            </p>
            <p className="text-lg font-semibold">
              {formatSAR(totals.totalOwed)}
            </p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">
              {t("debts.largestDebt")}
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
        searchPlaceholder={t("debts.searchPlaceholder")}
      />

      {loading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={HandCoinsIcon}
          title={
            items.length === 0
              ? t("debts.emptyTitle")
              : t("debts.noMatchesTitle")
          }
          description={
            items.length === 0
              ? t("debts.emptyDescription")
              : t("debts.noMatchesDescription")
          }
          action={
            items.length === 0 ? (
              <Button onClick={openAddDialog}>
                <PlusIcon />
                {t("debts.add")}
              </Button>
            ) : undefined
          }
        />
      ) : (
        <DebtTable
          debts={filtered}
          onEdit={openEditDialog}
          onDelete={setDeletingDebt}
        />
      )}

      <DebtFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        debt={editingDebt}
        onSubmit={handleSubmit}
      />

      <ConfirmDeleteDialog
        open={!!deletingDebt}
        onOpenChange={(open) => !open && setDeletingDebt(null)}
        title={t("debts.deleteTitle")}
        description={
          deletingDebt
            ? t("debts.deleteDescription", {
                amount: formatSAR(deletingDebt.debtWeOwe),
                customer: deletingDebt.customer,
              })
            : ""
        }
        onConfirm={handleConfirmDelete}
        isPending={isDeleting}
      />
    </div>
  )
}
