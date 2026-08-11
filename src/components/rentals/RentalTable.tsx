import { PencilIcon, Trash2Icon } from "lucide-react"
import { useTranslation } from "react-i18next"

import { LeaseStatusBadge } from "@/components/common/LeaseStatusBadge"
import { Badge } from "@/components/ui/badge"
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
import { getRemainingBalance } from "@/lib/rental"
import { cn } from "@/lib/utils"
import type { Rental } from "@/schemas/rental"

export function RentalTable({
  rentals,
  onEdit,
  onDelete,
}: {
  rentals: Rental[]
  onEdit: (rental: Rental) => void
  onDelete: (rental: Rental) => void
}) {
  const { t } = useTranslation()
  const { formatSAR, formatDate } = useFormat()

  const sorted = [...rentals].sort(
    (a, b) =>
      new Date(a.leaseExpiryDate).getTime() -
      new Date(b.leaseExpiryDate).getTime()
  )

  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("rentals.columns.apartment")}</TableHead>
            <TableHead>{t("rentals.columns.tenant")}</TableHead>
            <TableHead className="text-end">
              {t("rentals.columns.totalAmount")}
            </TableHead>
            <TableHead className="text-end">{t("rentals.columns.paid")}</TableHead>
            <TableHead className="text-end">
              {t("rentals.columns.remaining")}
            </TableHead>
            <TableHead>{t("rentals.columns.payment")}</TableHead>
            <TableHead>{t("rentals.columns.leaseExpiry")}</TableHead>
            <TableHead className="w-0">
              <span className="sr-only">{t("common.actions")}</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((rental) => {
            const remaining = getRemainingBalance(
              rental.totalAmount,
              rental.paidAmount
            )

            return (
              <TableRow key={rental.id}>
                <TableCell className="font-medium">
                  {rental.apartmentNumber}
                </TableCell>
                <TableCell>{rental.tenantName}</TableCell>
                <TableCell className="text-end tabular-nums">
                  {formatSAR(rental.totalAmount)}
                </TableCell>
                <TableCell className="text-end tabular-nums">
                  {formatSAR(rental.paidAmount)}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-end font-medium tabular-nums",
                    remaining > 0 && "text-destructive"
                  )}
                >
                  {formatSAR(remaining)}
                </TableCell>
                <TableCell>
                  {rental.payment ? (
                    <Badge variant="secondary">
                      {t(`payment.${rental.payment}`)}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{formatDate(rental.leaseExpiryDate)}</span>
                    <LeaseStatusBadge expiryDate={rental.leaseExpiryDate} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onEdit(rental)}
                    >
                      <PencilIcon />
                      <span className="sr-only">
                        {t("common.editItem", {
                          name: rental.apartmentNumber,
                        })}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onDelete(rental)}
                    >
                      <Trash2Icon />
                      <span className="sr-only">
                        {t("common.deleteItem", {
                          name: rental.apartmentNumber,
                        })}
                      </span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
