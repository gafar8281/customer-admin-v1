import { useMemo, useState } from "react"
import { AlertTriangleIcon, PlusIcon, StoreIcon } from "lucide-react"
import { toast } from "sonner"

import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog"
import { DataToolbar } from "@/components/common/DataToolbar"
import { EmptyState } from "@/components/common/EmptyState"
import { PageHeader } from "@/components/common/PageHeader"
import { ShopFormDialog } from "@/components/shops/ShopFormDialog"
import { ShopTable } from "@/components/shops/ShopTable"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  createShop,
  deleteShop,
  getShops,
  resetShops,
  updateShop,
} from "@/data/shops"
import { useCollection } from "@/hooks/useCollection"
import { getLeaseStatus } from "@/lib/lease"
import type { Shop, ShopFormValues } from "@/schemas/shop"

export function ShopsPage() {
  const { items, loading, create, update, remove } = useCollection<
    Shop,
    ShopFormValues
  >({
    list: getShops,
    create: createShop,
    update: updateShop,
    remove: deleteShop,
    reset: resetShops,
  })

  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingShop, setEditingShop] = useState<Shop | undefined>()
  const [deletingShop, setDeletingShop] = useState<Shop | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return items
    return items.filter((shop) => shop.shopName.toLowerCase().includes(query))
  }, [items, search])

  const atRiskCount = useMemo(
    () =>
      items.filter((shop) => {
        const status = getLeaseStatus(shop.shopLeaseExpiryDate)
        return status === "expired" || status === "expiring-soon"
      }).length,
    [items]
  )

  function openAddDialog() {
    setEditingShop(undefined)
    setFormOpen(true)
  }

  function openEditDialog(shop: Shop) {
    setEditingShop(shop)
    setFormOpen(true)
  }

  async function handleSubmit(values: ShopFormValues) {
    if (editingShop) {
      await update(editingShop.id, values)
      toast.success("Shop updated")
    } else {
      await create(values)
      toast.success("Shop added")
    }
  }

  async function handleConfirmDelete() {
    if (!deletingShop) return
    setIsDeleting(true)
    try {
      await remove(deletingShop.id)
      toast.success("Shop deleted")
      setDeletingShop(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Shops"
        description="Manage leased retail and office units, rent, and lease renewals."
        action={
          <Button onClick={openAddDialog}>
            <PlusIcon />
            Add Shop
          </Button>
        }
      />

      {!loading && atRiskCount > 0 && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangleIcon />
          <AlertTitle>
            {atRiskCount} lease{atRiskCount === 1 ? "" : "s"} need
            {atRiskCount === 1 ? "s" : ""} attention
          </AlertTitle>
          <AlertDescription>
            Expired or expiring within the next 30 days.
          </AlertDescription>
        </Alert>
      )}

      <DataToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by shop name…"
      />

      {loading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={StoreIcon}
          title={items.length === 0 ? "No shops yet" : "No matches found"}
          description={
            items.length === 0
              ? "Add your first shop to get started."
              : "Try a different search term."
          }
          action={
            items.length === 0 ? (
              <Button onClick={openAddDialog}>
                <PlusIcon />
                Add Shop
              </Button>
            ) : undefined
          }
        />
      ) : (
        <ShopTable
          shops={filtered}
          onEdit={openEditDialog}
          onDelete={setDeletingShop}
        />
      )}

      <ShopFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        shop={editingShop}
        onSubmit={handleSubmit}
      />

      <ConfirmDeleteDialog
        open={!!deletingShop}
        onOpenChange={(open) => !open && setDeletingShop(null)}
        title="Delete shop?"
        description={
          deletingShop
            ? `This will permanently remove ${deletingShop.shopName} from your records.`
            : ""
        }
        onConfirm={handleConfirmDelete}
        isPending={isDeleting}
      />
    </div>
  )
}
