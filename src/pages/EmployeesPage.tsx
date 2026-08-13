import { useMemo, useState } from "react"
import { AlertTriangleIcon, PlusIcon, UsersIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog"
import { DataToolbar } from "@/components/common/DataToolbar"
import { EmptyState } from "@/components/common/EmptyState"
import { PageHeader } from "@/components/common/PageHeader"
import { EmployeeFormDialog } from "@/components/employees/EmployeeFormDialog"
import { EmployeeTable } from "@/components/employees/EmployeeTable"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  createEmployee,
  deleteEmployee,
  subscribeEmployees,
  updateEmployee,
} from "@/data/employees"
import { useCollection } from "@/hooks/useCollection"
import { useFormat } from "@/i18n/useFormat"
import type { Employee, EmployeeFormValues } from "@/schemas/employee"

export function EmployeesPage() {
  const { t } = useTranslation()
  const { formatSAR } = useFormat()
  const { items, loading, error, create, update, remove } = useCollection<
    Employee,
    EmployeeFormValues
  >({
    subscribe: subscribeEmployees,
    create: createEmployee,
    update: updateEmployee,
    remove: deleteEmployee,
  })

  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>()
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(
    null
  )
  const [isDeleting, setIsDeleting] = useState(false)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return items
    return items.filter((employee) =>
      [
        employee.employeeName,
        t(`nationality.${employee.nationality}`),
        employee.nationalId,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    )
  }, [items, search, t])

  const totals = useMemo(
    () => ({
      count: items.length,
      laborExpense: items.reduce((sum, employee) => sum + employee.laborExpense, 0),
    }),
    [items]
  )

  function openAddDialog() {
    setEditingEmployee(undefined)
    setFormOpen(true)
  }

  function openEditDialog(employee: Employee) {
    setEditingEmployee(employee)
    setFormOpen(true)
  }

  async function handleSubmit(values: EmployeeFormValues) {
    try {
      if (editingEmployee) {
        await update(editingEmployee.id, values)
        toast.success(t("employees.updated"))
      } else {
        await create(values)
        toast.success(t("employees.added"))
      }
    } catch {
      toast.error(t("common.saveFailed"))
    }
  }

  async function handleConfirmDelete() {
    if (!deletingEmployee) return
    setIsDeleting(true)
    try {
      await remove(deletingEmployee.id)
      toast.success(t("employees.deleted"))
      setDeletingEmployee(null)
    } catch {
      toast.error(t("common.deleteFailed"))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title={t("employees.title")}
        description={t("employees.description")}
        action={
          <Button onClick={openAddDialog}>
            <PlusIcon />
            {t("employees.add")}
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
        <div className="mb-4 grid grid-cols-2 gap-3 sm:max-w-md">
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">
              {t("employees.headcount")}
            </p>
            <p className="text-lg font-semibold">{totals.count}</p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">
              {t("employees.totalLaborExpense")}
            </p>
            <p className="text-lg font-semibold">
              {formatSAR(totals.laborExpense)}
            </p>
          </div>
        </div>
      )}

      <DataToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("employees.searchPlaceholder")}
      />

      {loading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title={
            items.length === 0
              ? t("employees.emptyTitle")
              : t("employees.noMatchesTitle")
          }
          description={
            items.length === 0
              ? t("employees.emptyDescription")
              : t("employees.noMatchesDescription")
          }
          action={
            items.length === 0 ? (
              <Button onClick={openAddDialog}>
                <PlusIcon />
                {t("employees.add")}
              </Button>
            ) : undefined
          }
        />
      ) : (
        <EmployeeTable
          employees={filtered}
          onEdit={openEditDialog}
          onDelete={setDeletingEmployee}
        />
      )}

      <EmployeeFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        employee={editingEmployee}
        onSubmit={handleSubmit}
      />

      <ConfirmDeleteDialog
        open={!!deletingEmployee}
        onOpenChange={(open) => !open && setDeletingEmployee(null)}
        title={t("employees.deleteTitle")}
        description={
          deletingEmployee
            ? t("employees.deleteDescription", {
                name: deletingEmployee.employeeName,
              })
            : ""
        }
        onConfirm={handleConfirmDelete}
        isPending={isDeleting}
      />
    </div>
  )
}
