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
  const { t } = useTranslation()
  const { formatSAR, formatDate } = useFormat()

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
            <TableHead>{t("shops.columns.shop")}</TableHead>
            <TableHead className="text-end">
              {t("shops.columns.totalContractValue")}
            </TableHead>
            <TableHead className="text-end">{t("shops.columns.rent")}</TableHead>
            <TableHead>{t("shops.columns.payment")}</TableHead>
            <TableHead>{t("shops.columns.leaseExpiry")}</TableHead>
            <TableHead className="w-0">
              <span className="sr-only">{t("common.actions")}</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((shop) => (
            <TableRow key={shop.id}>
              <TableCell className="font-medium">{shop.shopName}</TableCell>
              <TableCell className="text-end tabular-nums">
                {formatSAR(shop.amount)}
              </TableCell>
              <TableCell className="text-end tabular-nums">
                {formatSAR(shop.rentAmount)}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{t(`payment.${shop.payment}`)}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{formatDate(shop.shopLeaseExpiryDate)}</span>
                  <LeaseStatusBadge expiryDate={shop.shopLeaseExpiryDate} />
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
                    <span className="sr-only">
                      {t("common.editItem", { name: shop.shopName })}
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onDelete(shop)}
                  >
                    <Trash2Icon />
                    <span className="sr-only">
                      {t("common.deleteItem", { name: shop.shopName })}
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
