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
import type { ExpenseEntry } from "@/schemas/expense"

export function ExpenseEntryTable({
  entries,
  onEdit,
  onDelete,
}: {
  entries: ExpenseEntry[]
  onEdit: (entry: ExpenseEntry) => void
  onDelete: (entry: ExpenseEntry) => void
}) {
  const { t } = useTranslation()
  const { formatSAR, formatDate } = useFormat()

  const sorted = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("expenses.columns.statement")}</TableHead>
            <TableHead>{t("expenses.columns.date")}</TableHead>
            <TableHead className="text-end">
              {t("expenses.columns.amountDisbursed")}
            </TableHead>
            <TableHead className="w-0">
              <span className="sr-only">{t("common.actions")}</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-medium">{entry.statement}</TableCell>
              <TableCell>{formatDate(entry.date)}</TableCell>
              <TableCell className="text-end font-medium tabular-nums">
                {formatSAR(entry.amountDisbursed)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEdit(entry)}
                  >
                    <PencilIcon />
                    <span className="sr-only">
                      {t("common.editItem", { name: entry.statement })}
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onDelete(entry)}
                  >
                    <Trash2Icon />
                    <span className="sr-only">
                      {t("common.deleteItem", { name: entry.statement })}
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
