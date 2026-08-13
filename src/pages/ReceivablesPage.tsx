import { useMemo, useState } from "react"
import { AlertTriangleIcon, CoinsIcon, PlusIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog"
import { DataToolbar } from "@/components/common/DataToolbar"
import { EmptyState } from "@/components/common/EmptyState"
import { PageHeader } from "@/components/common/PageHeader"
import { ReceivableFormDialog } from "@/components/receivables/ReceivableFormDialog"
import { ReceivableTable } from "@/components/receivables/ReceivableTable"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  createReceivable,
  deleteReceivable,
  subscribeReceivables,
  updateReceivable,
} from "@/data/receivables"
import { useCollection } from "@/hooks/useCollection"
import { useFormat } from "@/i18n/useFormat"
import type { Receivable, ReceivableFormValues } from "@/schemas/receivable"

export function ReceivablesPage() {
  const { t } = useTranslation()
  const { formatSAR } = useFormat()
  const { items, loading, error, create, update, remove } = useCollection<
    Receivable,
    ReceivableFormValues
  >({
    subscribe: subscribeReceivables,
    create: createReceivable,
    update: updateReceivable,
    remove: deleteReceivable,
  })

  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingReceivable, setEditingReceivable] = useState<
    Receivable | undefined
  >()
  const [deletingReceivable, setDeletingReceivable] =
    useState<Receivable | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return items
    return items.filter((receivable) =>
      [receivable.customer, receivable.note ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(query)
    )
  }, [items, search])

  const totals = useMemo(() => {
    const totalOwed = items.reduce((sum, item) => sum + item.debtOwedToUs, 0)
    const largest = items.reduce(
      (max, item) => Math.max(max, item.debtOwedToUs),
      0
    )

    return { count: items.length, totalOwed, largest }
  }, [items])

  function openAddDialog() {
    setEditingReceivable(undefined)
    setFormOpen(true)
  }

  function openEditDialog(receivable: Receivable) {
    setEditingReceivable(receivable)
    setFormOpen(true)
  }

  async function handleSubmit(values: ReceivableFormValues) {
    try {
      if (editingReceivable) {
        await update(editingReceivable.id, values)
        toast.success(t("receivables.updated"))
      } else {
        await create(values)
        toast.success(t("receivables.added"))
      }
    } catch {
      toast.error(t("common.saveFailed"))
    }
  }

  async function handleConfirmDelete() {
    if (!deletingReceivable) return
    setIsDeleting(true)
    try {
      await remove(deletingReceivable.id)
      toast.success(t("receivables.deleted"))
      setDeletingReceivable(null)
    } catch {
      toast.error(t("common.deleteFailed"))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title={t("receivables.title")}
        description={t("receivables.description")}
        action={
          <Button onClick={openAddDialog}>
            <PlusIcon />
            {t("receivables.add")}
          </Button>
        }
      />

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangleIcon />
          <AlertTitle>{t("common.loadFailed")}</AlertTitle>
          <AlertDescription>{t("common.loadFailedDescription")}</AlertDescription>
        </Alert>
      )}

      {!loading && items.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-3 sm:max-w-2xl sm:grid-cols-3">
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">
              {t("receivables.customers")}
            </p>
            <p className="text-lg font-semibold">{totals.count}</p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">
              {t("receivables.totalReceivable")}
            </p>
            <p className="text-lg font-semibold">
              {formatSAR(totals.totalOwed)}
            </p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">
              {t("receivables.largestReceivable")}
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
        searchPlaceholder={t("receivables.searchPlaceholder")}
      />

      {loading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CoinsIcon}
          title={
            items.length === 0
              ? t("receivables.emptyTitle")
              : t("receivables.noMatchesTitle")
          }
          description={
            items.length === 0
              ? t("receivables.emptyDescription")
              : t("receivables.noMatchesDescription")
          }
          action={
            items.length === 0 ? (
              <Button onClick={openAddDialog}>
                <PlusIcon />
                {t("receivables.add")}
              </Button>
            ) : undefined
          }
        />
      ) : (
        <ReceivableTable
          receivables={filtered}
          onEdit={openEditDialog}
          onDelete={setDeletingReceivable}
        />
      )}

      <ReceivableFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        receivable={editingReceivable}
        onSubmit={handleSubmit}
      />

      <ConfirmDeleteDialog
        open={!!deletingReceivable}
        onOpenChange={(open) => !open && setDeletingReceivable(null)}
        title={t("receivables.deleteTitle")}
        description={
          deletingReceivable
            ? t("receivables.deleteDescription", {
                amount: formatSAR(deletingReceivable.debtOwedToUs),
                customer: deletingReceivable.customer,
              })
            : ""
        }
        onConfirm={handleConfirmDelete}
        isPending={isDeleting}
      />
    </div>
  )
}
