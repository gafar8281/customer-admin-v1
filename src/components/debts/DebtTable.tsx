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
import { cn } from "@/lib/utils"
import type { Debt } from "@/schemas/debt"

export function DebtTable({
  debts,
  onEdit,
  onDelete,
}: {
  debts: Debt[]
  onEdit: (debt: Debt) => void
  onDelete: (debt: Debt) => void
}) {
  const { t } = useTranslation()
  const { formatSAR } = useFormat()

  const sorted = [...debts].sort((a, b) => b.debtWeOwe - a.debtWeOwe)

  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("debts.columns.customer")}</TableHead>
            <TableHead>{t("debts.columns.note")}</TableHead>
            <TableHead className="text-end">
              {t("debts.columns.debtWeOwe")}
            </TableHead>
            <TableHead className="w-0">
              <span className="sr-only">{t("common.actions")}</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((debt) => (
            <TableRow key={debt.id}>
              <TableCell className="font-medium">{debt.customer}</TableCell>
              <TableCell className="max-w-xs truncate text-muted-foreground">
                {debt.note || "—"}
              </TableCell>
              <TableCell
                className={cn(
                  "text-end font-medium tabular-nums",
                  debt.debtWeOwe > 0 && "text-destructive"
                )}
              >
                {formatSAR(debt.debtWeOwe)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEdit(debt)}
                  >
                    <PencilIcon />
                    <span className="sr-only">
                      {t("common.editItem", { name: debt.customer })}
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onDelete(debt)}
                  >
                    <Trash2Icon />
                    <span className="sr-only">
                      {t("common.deleteItem", { name: debt.customer })}
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
