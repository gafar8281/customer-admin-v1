import { useMemo, useState } from "react"
import { AlertTriangleIcon, PlusIcon, ScrollTextIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog"
import { DataToolbar } from "@/components/common/DataToolbar"
import { EmptyState } from "@/components/common/EmptyState"
import { PageHeader } from "@/components/common/PageHeader"
import { LicenseFormDialog } from "@/components/licenses/LicenseFormDialog"
import { LicenseTable } from "@/components/licenses/LicenseTable"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  createLicense,
  deleteLicense,
  subscribeLicenses,
  updateLicense,
} from "@/data/licenses"
import { useCollection } from "@/hooks/useCollection"
import { getLeaseStatus } from "@/lib/lease"
import type { License, LicenseFormValues } from "@/schemas/license"

export function LicensesPage() {
  const { t } = useTranslation()
  const { items, loading, error, create, update, remove } = useCollection<
    License,
    LicenseFormValues
  >({
    subscribe: subscribeLicenses,
    create: createLicense,
    update: updateLicense,
    remove: deleteLicense,
  })

  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingLicense, setEditingLicense] = useState<License | undefined>()
  const [deletingLicense, setDeletingLicense] = useState<License | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return items
    return items.filter((license) =>
      [license.facilities, license.unifiedNumber].join(" ").toLowerCase().includes(query)
    )
  }, [items, search])

  const atRiskCount = useMemo(
    () =>
      items.filter((license) => {
        const status = getLeaseStatus(license.expiryDate)
        return status === "expired" || status === "expiring-soon"
      }).length,
    [items]
  )

  function openAddDialog() {
    setEditingLicense(undefined)
    setFormOpen(true)
  }

  function openEditDialog(license: License) {
    setEditingLicense(license)
    setFormOpen(true)
  }

  async function handleSubmit(values: LicenseFormValues) {
    try {
      if (editingLicense) {
        await update(editingLicense.id, values)
        toast.success(t("licenses.updated"))
      } else {
        await create(values)
        toast.success(t("licenses.added"))
      }
    } catch {
      toast.error(t("common.saveFailed"))
    }
  }

  async function handleConfirmDelete() {
    if (!deletingLicense) return
    setIsDeleting(true)
    try {
      await remove(deletingLicense.id)
      toast.success(t("licenses.deleted"))
      setDeletingLicense(null)
    } catch {
      toast.error(t("common.deleteFailed"))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title={t("licenses.title")}
        description={t("licenses.description")}
        action={
          <Button onClick={openAddDialog}>
            <PlusIcon />
            {t("licenses.add")}
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
            {t("licenses.licensesAtRisk", { count: atRiskCount })}
          </AlertTitle>
          <AlertDescription>
            {t("licenses.licensesAtRiskDescription")}
          </AlertDescription>
        </Alert>
      )}

      <DataToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("licenses.searchPlaceholder")}
      />

      {loading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ScrollTextIcon}
          title={
            items.length === 0
              ? t("licenses.emptyTitle")
              : t("licenses.noMatchesTitle")
          }
          description={
            items.length === 0
              ? t("licenses.emptyDescription")
              : t("licenses.noMatchesDescription")
          }
          action={
            items.length === 0 ? (
              <Button onClick={openAddDialog}>
                <PlusIcon />
                {t("licenses.add")}
              </Button>
            ) : undefined
          }
        />
      ) : (
        <LicenseTable
          licenses={filtered}
          onEdit={openEditDialog}
          onDelete={setDeletingLicense}
        />
      )}

      <LicenseFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        license={editingLicense}
        onSubmit={handleSubmit}
      />

      <ConfirmDeleteDialog
        open={!!deletingLicense}
        onOpenChange={(open) => !open && setDeletingLicense(null)}
        title={t("licenses.deleteTitle")}
        description={
          deletingLicense
            ? t("licenses.deleteDescription", { name: deletingLicense.facilities })
            : ""
        }
        onConfirm={handleConfirmDelete}
        isPending={isDeleting}
      />
    </div>
  )
}
