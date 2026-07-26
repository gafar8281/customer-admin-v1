import { PencilIcon, Trash2Icon } from "lucide-react"

import { LeaseStatusBadge } from "@/components/common/LeaseStatusBadge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate, formatSAR } from "@/lib/format"
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
            <TableHead>Apartment</TableHead>
            <TableHead>Tenant</TableHead>
            <TableHead className="text-right">Total Amount</TableHead>
            <TableHead className="text-right">Paid</TableHead>
            <TableHead className="text-right">Remaining</TableHead>
            <TableHead>Lease Expiry</TableHead>
            <TableHead className="w-0">
              <span className="sr-only">Actions</span>
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
                <TableCell className="text-right tabular-nums">
                  {formatSAR(rental.totalAmount)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatSAR(rental.paidAmount)}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right font-medium tabular-nums",
                    remaining > 0 && "text-destructive"
                  )}
                >
                  {formatSAR(remaining)}
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
                        Edit {rental.apartmentNumber}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onDelete(rental)}
                    >
                      <Trash2Icon />
                      <span className="sr-only">
                        Delete {rental.apartmentNumber}
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
