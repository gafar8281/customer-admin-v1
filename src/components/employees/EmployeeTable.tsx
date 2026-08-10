import { PencilIcon, Trash2Icon } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useFormat } from "@/i18n/useFormat"
import { maskNationalId } from "@/lib/format"
import type { Employee } from "@/schemas/employee"

export function EmployeeTable({
  employees,
  onEdit,
  onDelete,
}: {
  employees: Employee[]
  onEdit: (employee: Employee) => void
  onDelete: (employee: Employee) => void
}) {
  const { t } = useTranslation()
  const { formatSAR } = useFormat()

  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("employees.columns.name")}</TableHead>
            <TableHead>{t("employees.columns.nationalId")}</TableHead>
            <TableHead>{t("employees.columns.nationality")}</TableHead>
            <TableHead className="text-end">
              {t("employees.columns.laborExpense")}
            </TableHead>
            <TableHead className="text-end">
              {t("employees.columns.saudization")}
            </TableHead>
            <TableHead className="text-end">
              {t("employees.columns.occupationalHazards")}
            </TableHead>
            <TableHead className="text-end">
              {t("employees.columns.saudiSalaries")}
            </TableHead>
            <TableHead className="w-0">
              <span className="sr-only">{t("common.actions")}</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="font-medium">
                {employee.employeeName}
              </TableCell>
              <TableCell className="font-mono text-muted-foreground">
                <bdi>{maskNationalId(employee.nationalId)}</bdi>
              </TableCell>
              <TableCell>{t(`nationality.${employee.nationality}`)}</TableCell>
              <TableCell className="text-end tabular-nums">
                {formatSAR(employee.laborExpense)}
              </TableCell>
              <TableCell className="text-end tabular-nums">
                {formatSAR(employee.saudization)}
              </TableCell>
              <TableCell className="text-end tabular-nums">
                {employee.occupationalHazards.toLocaleString()}
              </TableCell>
              <TableCell className="text-end tabular-nums">
                {employee.saudiSalaries.toLocaleString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEdit(employee)}
                  >
                    <PencilIcon />
                    <span className="sr-only">
                      {t("common.editItem", { name: employee.employeeName })}
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onDelete(employee)}
                  >
                    <Trash2Icon />
                    <span className="sr-only">
                      {t("common.deleteItem", { name: employee.employeeName })}
                    </span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
