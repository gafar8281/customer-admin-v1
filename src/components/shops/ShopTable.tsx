import { PencilIcon, Trash2Icon } from "lucide-react"

import { LeaseStatusBadge } from "@/components/shops/LeaseStatusBadge"
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
import { formatDate, formatSAR } from "@/lib/format"
import type { Shop } from "@/schemas/shop"

export function ShopTable({
  shops,
  onEdit,
  onDelete,
}: {
  shops: Shop[]
  onEdit: (shop: Shop) => void
  onDelete: (shop: Shop) => void
}) {
  const sorted = [...shops].sort(
    (a, b) =>
      new Date(a.shopLeaseExpiryDate).getTime() -
      new Date(b.shopLeaseExpiryDate).getTime()
  )

  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Shop</TableHead>
            <TableHead className="text-right">
              Total Contract Value
            </TableHead>
            <TableHead className="text-right">Rent</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Lease Expiry</TableHead>
            <TableHead className="w-0">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((shop) => (
            <TableRow key={shop.id}>
              <TableCell className="font-medium">{shop.shopName}</TableCell>
              <TableCell className="text-right tabular-nums">
                {formatSAR(shop.amount)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatSAR(shop.rentAmount)}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{shop.payment}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{formatDate(shop.shopLeaseExpiryDate)}</span>
                  <LeaseStatusBadge
                    shopLeaseExpiryDate={shop.shopLeaseExpiryDate}
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEdit(shop)}
                  >
                    <PencilIcon />
                    <span className="sr-only">Edit {shop.shopName}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onDelete(shop)}
                  >
                    <Trash2Icon />
                    <span className="sr-only">Delete {shop.shopName}</span>
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
