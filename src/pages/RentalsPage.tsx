import { useMemo, useState } from "react"
import { AlertTriangleIcon, BuildingIcon, PlusIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog"
import { DataToolbar } from "@/components/common/DataToolbar"
import { EmptyState } from "@/components/common/EmptyState"
import { PageHeader } from "@/components/common/PageHeader"
import { RentalFormDialog } from "@/components/rentals/RentalFormDialog"
import { RentalTable } from "@/components/rentals/RentalTable"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  createRental,
  deleteRental,
  subscribeRentals,
  updateRental,
} from "@/data/rentals"
import { useCollection } from "@/hooks/useCollection"
import { useFormat } from "@/i18n/useFormat"
import { getRemainingBalance } from "@/lib/rental"
import type { Rental, RentalFormValues } from "@/schemas/rental"

export function RentalsPage() {
  const { t } = useTranslation()
  const { formatSAR } = useFormat()
  const { items, loading, error, create, update, remove } = useCollection<
    Rental,
    RentalFormValues
  >({
    subscribe: subscribeRentals,
    create: createRental,
    update: updateRental,
    remove: deleteRental,
  })

  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingRental, setEditingRental] = useState<Rental | undefined>()
  const [deletingRental, setDeletingRental] = useState<Rental | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return items
    return items.filter((rental) =>
      [rental.tenantName, rental.apartmentNumber]
        .join(" ")
        .toLowerCase()
        .includes(query)
    )
  }, [items, search])

  const totals = useMemo(() => {
    const outstanding = items.reduce(
      (sum, rental) =>
        sum + getRemainingBalance(rental.totalAmount, rental.paidAmount),
      0
    )
    const fullyPaid = items.filter(
      (rental) =>
        getRemainingBalance(rental.totalAmount, rental.paidAmount) === 0
    ).length

    return { count: items.length, outstanding, fullyPaid }
  }, [items])

  function openAddDialog() {
    setEditingRental(undefined)
    setFormOpen(true)
  }

  function openEditDialog(rental: Rental) {
    setEditingRental(rental)
    setFormOpen(true)
  }

  async function handleSubmit(values: RentalFormValues) {
    try {
      if (editingRental) {
        await update(editingRental.id, values)
        toast.success(t("rentals.updated"))
      } else {
        await create(values)
        toast.success(t("rentals.added"))
      }
    } catch {
      toast.error(t("common.saveFailed"))
    }
  }

  async function handleConfirmDelete() {
    if (!deletingRental) return
    setIsDeleting(true)
    try {
      await remove(deletingRental.id)
      toast.success(t("rentals.deleted"))
      setDeletingRental(null)
    } catch {
      toast.error(t("common.deleteFailed"))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title={t("rentals.title")}
        description={t("rentals.description")}
        action={
          <Button onClick={openAddDialog}>
            <PlusIcon />
            {t("rentals.add")}
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
              {t("rentals.units")}
            </p>
            <p className="text-lg font-semibold">{totals.count}</p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">
              {t("rentals.totalOutstanding")}
            </p>
            <p className="text-lg font-semibold">
              {formatSAR(totals.outstanding)}
            </p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">
              {t("rentals.fullyPaid")}
            </p>
            <p className="text-lg font-semibold">
              {totals.fullyPaid} / {totals.count}
            </p>
          </div>
        </div>
      )}

      <DataToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("rentals.searchPlaceholder")}
      />

      {loading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={BuildingIcon}
          title={
            items.length === 0
              ? t("rentals.emptyTitle")
              : t("rentals.noMatchesTitle")
          }
          description={
            items.length === 0
              ? t("rentals.emptyDescription")
              : t("rentals.noMatchesDescription")
          }
          action={
            items.length === 0 ? (
              <Button onClick={openAddDialog}>
                <PlusIcon />
                {t("rentals.add")}
              </Button>
            ) : undefined
          }
        />
      ) : (
        <RentalTable
          rentals={filtered}
          onEdit={openEditDialog}
          onDelete={setDeletingRental}
        />
      )}

      <RentalFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        rental={editingRental}
        onSubmit={handleSubmit}
      />

      <ConfirmDeleteDialog
        open={!!deletingRental}
        onOpenChange={(open) => !open && setDeletingRental(null)}
        title={t("rentals.deleteTitle")}
        description={
          deletingRental
            ? t("rentals.deleteDescription", {
                apartment: deletingRental.apartmentNumber,
                tenant: deletingRental.tenantName,
              })
            : ""
        }
        onConfirm={handleConfirmDelete}
        isPending={isDeleting}
      />
    </div>
  )
}
