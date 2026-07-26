import { useMemo, useState } from "react"
import { BuildingIcon, PlusIcon } from "lucide-react"
import { toast } from "sonner"

import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog"
import { DataToolbar } from "@/components/common/DataToolbar"
import { EmptyState } from "@/components/common/EmptyState"
import { PageHeader } from "@/components/common/PageHeader"
import { RentalFormDialog } from "@/components/rentals/RentalFormDialog"
import { RentalTable } from "@/components/rentals/RentalTable"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  createRental,
  deleteRental,
  getRentals,
  resetRentals,
  updateRental,
} from "@/data/rentals"
import { useCollection } from "@/hooks/useCollection"
import { formatSAR } from "@/lib/format"
import { getRemainingBalance } from "@/lib/rental"
import type { Rental, RentalFormValues } from "@/schemas/rental"

export function RentalsPage() {
  const { items, loading, create, update, remove } = useCollection<
    Rental,
    RentalFormValues
  >({
    list: getRentals,
    create: createRental,
    update: updateRental,
    remove: deleteRental,
    reset: resetRentals,
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
    if (editingRental) {
      await update(editingRental.id, values)
      toast.success("Rental updated")
    } else {
      await create(values)
      toast.success("Rental added")
    }
  }

  async function handleConfirmDelete() {
    if (!deletingRental) return
    setIsDeleting(true)
    try {
      await remove(deletingRental.id)
      toast.success("Rental deleted")
      setDeletingRental(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Rentals"
        description="Manage apartment rentals, tenants, lease renewals, and outstanding balances."
        action={
          <Button onClick={openAddDialog}>
            <PlusIcon />
            Add Rental
          </Button>
        }
      />

      {!loading && items.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-3 sm:max-w-2xl sm:grid-cols-3">
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">Units</p>
            <p className="text-lg font-semibold">{totals.count}</p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">Total Outstanding</p>
            <p className="text-lg font-semibold">
              {formatSAR(totals.outstanding)}
            </p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">Fully Paid</p>
            <p className="text-lg font-semibold">
              {totals.fullyPaid} / {totals.count}
            </p>
          </div>
        </div>
      )}

      <DataToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by tenant or apartment…"
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
          title={items.length === 0 ? "No rentals yet" : "No matches found"}
          description={
            items.length === 0
              ? "Add your first rental to get started."
              : "Try a different search term."
          }
          action={
            items.length === 0 ? (
              <Button onClick={openAddDialog}>
                <PlusIcon />
                Add Rental
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
        title="Delete rental?"
        description={
          deletingRental
            ? `This will permanently remove apartment ${deletingRental.apartmentNumber} (${deletingRental.tenantName}) from your records.`
            : ""
        }
        onConfirm={handleConfirmDelete}
        isPending={isDeleting}
      />
    </div>
  )
}
