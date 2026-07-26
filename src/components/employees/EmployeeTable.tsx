import { PencilIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatSAR, maskNationalId } from "@/lib/format"
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
  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>National ID</TableHead>
            <TableHead>Nationality</TableHead>
            <TableHead className="text-right">Labor Expense</TableHead>
            <TableHead className="text-right">Saudization</TableHead>
            <TableHead className="w-0">
              <span className="sr-only">Actions</span>
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
                {maskNationalId(employee.nationalId)}
              </TableCell>
              <TableCell>{employee.nationality}</TableCell>
              <TableCell className="text-right tabular-nums">
                {formatSAR(employee.laborExpense)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatSAR(employee.saudization)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEdit(employee)}
                  >
                    <PencilIcon />
                    <span className="sr-only">Edit {employee.employeeName}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onDelete(employee)}
                  >
                    <Trash2Icon />
                    <span className="sr-only">
                      Delete {employee.employeeName}
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
