import { ChevronRightIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useFormat } from "@/i18n/useFormat"
import type { ExpenseMonth } from "@/schemas/expense"

export function MonthList({
  months,
  totals,
}: {
  months: ExpenseMonth[]
  totals: Record<string, number>
}) {
  const { t } = useTranslation()
  const { formatSAR, formatMonth } = useFormat()

  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("expenses.columns.month")}</TableHead>
            <TableHead className="text-end">
              {t("expenses.columns.totalDisbursed")}
            </TableHead>
            <TableHead className="w-0">
              <span className="sr-only">{t("common.actions")}</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {months.map((month) => (
            <TableRow key={month.id}>
              <TableCell className="font-medium">
                <Link
                  to={`/expenses/${month.id}`}
                  className="hover:underline"
                >
                  {formatMonth(month.year, month.month)}
                </Link>
              </TableCell>
              <TableCell className="text-end tabular-nums">
                {formatSAR(totals[month.id] ?? 0)}
              </TableCell>
              <TableCell>
                <Link
                  to={`/expenses/${month.id}`}
                  className="flex items-center justify-end text-muted-foreground"
                >
                  <ChevronRightIcon className="size-4 rtl:rotate-180" />
                  <span className="sr-only">
                    {formatMonth(month.year, month.month)}
                  </span>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
