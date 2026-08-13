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
import type { Receivable } from "@/schemas/receivable"

export function ReceivableTable({
  receivables,
  onEdit,
  onDelete,
}: {
  receivables: Receivable[]
  onEdit: (receivable: Receivable) => void
  onDelete: (receivable: Receivable) => void
}) {
  const { t } = useTranslation()
  const { formatSAR } = useFormat()

  const sorted = [...receivables].sort(
    (a, b) => b.debtOwedToUs - a.debtOwedToUs
  )

  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("receivables.columns.customer")}</TableHead>
            <TableHead>{t("receivables.columns.note")}</TableHead>
            <TableHead className="text-end">
              {t("receivables.columns.debtOwedToUs")}
            </TableHead>
            <TableHead className="w-0">
              <span className="sr-only">{t("common.actions")}</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((receivable) => (
            <TableRow key={receivable.id}>
              <TableCell className="font-medium">
                {receivable.customer}
              </TableCell>
              <TableCell className="max-w-xs truncate text-muted-foreground">
                {receivable.note || "—"}
              </TableCell>
              <TableCell className="text-end font-medium tabular-nums">
                {formatSAR(receivable.debtOwedToUs)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEdit(receivable)}
                  >
                    <PencilIcon />
                    <span className="sr-only">
                      {t("common.editItem", { name: receivable.customer })}
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onDelete(receivable)}
                  >
                    <Trash2Icon />
                    <span className="sr-only">
                      {t("common.deleteItem", { name: receivable.customer })}
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
