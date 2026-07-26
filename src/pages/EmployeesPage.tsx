import { useMemo, useState } from "react"
import { PlusIcon, UsersIcon } from "lucide-react"
import { toast } from "sonner"

import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog"
import { DataToolbar } from "@/components/common/DataToolbar"
import { EmptyState } from "@/components/common/EmptyState"
import { PageHeader } from "@/components/common/PageHeader"
import { EmployeeFormDialog } from "@/components/employees/EmployeeFormDialog"
import { EmployeeTable } from "@/components/employees/EmployeeTable"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  resetEmployees,
  updateEmployee,
} from "@/data/employees"
import { useCollection } from "@/hooks/useCollection"
import { formatSAR } from "@/lib/format"
import type { Employee, EmployeeFormValues } from "@/schemas/employee"

export function EmployeesPage() {
  const { items, loading, create, update, remove } = useCollection<
    Employee,
    EmployeeFormValues
  >({
    list: getEmployees,
    create: createEmployee,
    update: updateEmployee,
    remove: deleteEmployee,
    reset: resetEmployees,
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
      [employee.employeeName, employee.nationality, employee.nationalId]
        .join(" ")
        .toLowerCase()
        .includes(query)
    )
  }, [items, search])

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
    if (editingEmployee) {
      await update(editingEmployee.id, values)
      toast.success("Employee updated")
    } else {
      await create(values)
      toast.success("Employee added")
    }
  }

  async function handleConfirmDelete() {
    if (!deletingEmployee) return
    setIsDeleting(true)
    try {
      await remove(deletingEmployee.id)
      toast.success("Employee deleted")
      setDeletingEmployee(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Employees"
        description="Manage internal employee records, labor expenses, and Saudization contributions."
        action={
          <Button onClick={openAddDialog}>
            <PlusIcon />
            Add Employee
          </Button>
        }
      />

      {!loading && items.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-3 sm:max-w-md">
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">Headcount</p>
            <p className="text-lg font-semibold">{totals.count}</p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">
              Total Labor Expense
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
        searchPlaceholder="Search by name, nationality, or ID…"
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
          title={items.length === 0 ? "No employees yet" : "No matches found"}
          description={
            items.length === 0
              ? "Add your first employee to get started."
              : "Try a different search term."
          }
          action={
            items.length === 0 ? (
              <Button onClick={openAddDialog}>
                <PlusIcon />
                Add Employee
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
        title="Delete employee?"
        description={
          deletingEmployee
            ? `This will permanently remove ${deletingEmployee.employeeName} from your records.`
            : ""
        }
        onConfirm={handleConfirmDelete}
        isPending={isDeleting}
      />
    </div>
  )
}
