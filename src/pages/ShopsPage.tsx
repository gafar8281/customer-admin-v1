import { useMemo, useState } from "react"
import { AlertTriangleIcon, PlusIcon, StoreIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
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
  const { t } = useTranslation()
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
      toast.success(t("shops.updated"))
    } else {
      await create(values)
      toast.success(t("shops.added"))
    }
  }

  async function handleConfirmDelete() {
    if (!deletingShop) return
    setIsDeleting(true)
    try {
      await remove(deletingShop.id)
      toast.success(t("shops.deleted"))
      setDeletingShop(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title={t("shops.title")}
        description={t("shops.description")}
        action={
          <Button onClick={openAddDialog}>
            <PlusIcon />
            {t("shops.add")}
          </Button>
        }
      />

      {!loading && atRiskCount > 0 && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangleIcon />
          <AlertTitle>
            {t("shops.leasesAtRisk", { count: atRiskCount })}
          </AlertTitle>
          <AlertDescription>
            {t("shops.leasesAtRiskDescription")}
          </AlertDescription>
        </Alert>
      )}

      <DataToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("shops.searchPlaceholder")}
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
          title={
            items.length === 0
              ? t("shops.emptyTitle")
              : t("shops.noMatchesTitle")
          }
          description={
            items.length === 0
              ? t("shops.emptyDescription")
              : t("shops.noMatchesDescription")
          }
          action={
            items.length === 0 ? (
              <Button onClick={openAddDialog}>
                <PlusIcon />
                {t("shops.add")}
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
        title={t("shops.deleteTitle")}
        description={
          deletingShop
            ? t("shops.deleteDescription", { name: deletingShop.shopName })
            : ""
        }
        onConfirm={handleConfirmDelete}
        isPending={isDeleting}
      />
    </div>
  )
}
