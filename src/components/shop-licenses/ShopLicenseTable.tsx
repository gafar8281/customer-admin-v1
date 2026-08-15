import { PencilIcon, Trash2Icon } from "lucide-react"
import { useTranslation } from "react-i18next"

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
import { useFormat } from "@/i18n/useFormat"
import type { ShopLicense } from "@/schemas/shop-license"

export function ShopLicenseTable({
  shopLicenses,
  onEdit,
  onDelete,
}: {
  shopLicenses: ShopLicense[]
  onEdit: (shopLicense: ShopLicense) => void
  onDelete: (shopLicense: ShopLicense) => void
}) {
  const { t } = useTranslation()
  const { formatDate, formatSAR } = useFormat()

  const sorted = [...shopLicenses].sort(
    (a, b) =>
      new Date(a.licenseExpiryDate).getTime() -
      new Date(b.licenseExpiryDate).getTime()
  )

  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("shopLicenses.columns.shop")}</TableHead>
            <TableHead>{t("shopLicenses.columns.municipalLicense")}</TableHead>
            <TableHead>{t("shopLicenses.columns.expiryDate")}</TableHead>
            <TableHead>{t("shopLicenses.columns.refundInvoiceNumber")}</TableHead>
            <TableHead>{t("shopLicenses.columns.supplierName")}</TableHead>
            <TableHead className="text-end">
              {t("shopLicenses.columns.refund")}
            </TableHead>
            <TableHead className="w-0">
              <span className="sr-only">{t("common.actions")}</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((shopLicense) => (
            <TableRow key={shopLicense.id}>
              <TableCell className="font-medium">{shopLicense.shop}</TableCell>
              <TableCell>{shopLicense.municipalLicense}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{formatDate(shopLicense.licenseExpiryDate)}</span>
                  <LeaseStatusBadge expiryDate={shopLicense.licenseExpiryDate} />
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {shopLicense.refundInvoiceNumber || "—"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {shopLicense.supplierName || "—"}
              </TableCell>
              <TableCell className="text-end font-medium tabular-nums">
                {shopLicense.refund == null ? "—" : formatSAR(shopLicense.refund)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEdit(shopLicense)}
                  >
                    <PencilIcon />
                    <span className="sr-only">
                      {t("common.editItem", { name: shopLicense.shop })}
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onDelete(shopLicense)}
                  >
                    <Trash2Icon />
                    <span className="sr-only">
                      {t("common.deleteItem", { name: shopLicense.shop })}
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
