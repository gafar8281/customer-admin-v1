import { useMemo, useState } from "react"
import { AlertTriangleIcon, PlusIcon, StampIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog"
import { DataToolbar } from "@/components/common/DataToolbar"
import { EmptyState } from "@/components/common/EmptyState"
import { PageHeader } from "@/components/common/PageHeader"
import { ShopLicenseFormDialog } from "@/components/shop-licenses/ShopLicenseFormDialog"
import { ShopLicenseTable } from "@/components/shop-licenses/ShopLicenseTable"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  createShopLicense,
  deleteShopLicense,
  subscribeShopLicenses,
  updateShopLicense,
} from "@/data/shop-licenses"
import { useCollection } from "@/hooks/useCollection"
import { getLeaseStatus } from "@/lib/lease"
import type { ShopLicense, ShopLicenseFormValues } from "@/schemas/shop-license"

export function ShopLicensesPage() {
  const { t } = useTranslation()
  const { items, loading, error, create, update, remove } = useCollection<
    ShopLicense,
    ShopLicenseFormValues
  >({
    subscribe: subscribeShopLicenses,
    create: createShopLicense,
    update: updateShopLicense,
    remove: deleteShopLicense,
  })

  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingShopLicense, setEditingShopLicense] = useState<ShopLicense | undefined>()
  const [deletingShopLicense, setDeletingShopLicense] = useState<ShopLicense | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return items
    return items.filter((shopLicense) =>
      [shopLicense.shop, shopLicense.municipalLicense, shopLicense.supplierName]
        .join(" ")
        .toLowerCase()
        .includes(query)
    )
  }, [items, search])

  const atRiskCount = useMemo(
    () =>
      items.filter((shopLicense) => {
        const status = getLeaseStatus(shopLicense.licenseExpiryDate)
        return status === "expired" || status === "expiring-soon"
      }).length,
    [items]
  )

  function openAddDialog() {
    setEditingShopLicense(undefined)
    setFormOpen(true)
  }

  function openEditDialog(shopLicense: ShopLicense) {
    setEditingShopLicense(shopLicense)
    setFormOpen(true)
  }

  async function handleSubmit(values: ShopLicenseFormValues) {
    try {
      if (editingShopLicense) {
        await update(editingShopLicense.id, values)
        toast.success(t("shopLicenses.updated"))
      } else {
        await create(values)
        toast.success(t("shopLicenses.added"))
      }
    } catch {
      toast.error(t("common.saveFailed"))
    }
  }

  async function handleConfirmDelete() {
    if (!deletingShopLicense) return
    setIsDeleting(true)
    try {
      await remove(deletingShopLicense.id)
      toast.success(t("shopLicenses.deleted"))
      setDeletingShopLicense(null)
    } catch {
      toast.error(t("common.deleteFailed"))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title={t("shopLicenses.title")}
        description={t("shopLicenses.description")}
        action={
          <Button onClick={openAddDialog}>
            <PlusIcon />
            {t("shopLicenses.add")}
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

      {!loading && atRiskCount > 0 && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangleIcon />
          <AlertTitle>
            {t("shopLicenses.shopLicensesAtRisk", { count: atRiskCount })}
          </AlertTitle>
          <AlertDescription>
            {t("shopLicenses.shopLicensesAtRiskDescription")}
          </AlertDescription>
        </Alert>
      )}

      <DataToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("shopLicenses.searchPlaceholder")}
      />

      {loading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={StampIcon}
          title={
            items.length === 0
              ? t("shopLicenses.emptyTitle")
              : t("shopLicenses.noMatchesTitle")
          }
          description={
            items.length === 0
              ? t("shopLicenses.emptyDescription")
              : t("shopLicenses.noMatchesDescription")
          }
          action={
            items.length === 0 ? (
              <Button onClick={openAddDialog}>
                <PlusIcon />
                {t("shopLicenses.add")}
              </Button>
            ) : undefined
          }
        />
      ) : (
        <ShopLicenseTable
          shopLicenses={filtered}
          onEdit={openEditDialog}
          onDelete={setDeletingShopLicense}
        />
      )}

      <ShopLicenseFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        shopLicense={editingShopLicense}
        onSubmit={handleSubmit}
      />

      <ConfirmDeleteDialog
        open={!!deletingShopLicense}
        onOpenChange={(open) => !open && setDeletingShopLicense(null)}
        title={t("shopLicenses.deleteTitle")}
        description={
          deletingShopLicense
            ? t("shopLicenses.deleteDescription", { name: deletingShopLicense.shop })
            : ""
        }
        onConfirm={handleConfirmDelete}
        isPending={isDeleting}
      />
    </div>
  )
}
