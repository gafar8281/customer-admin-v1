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
import type { License } from "@/schemas/license"

export function LicenseTable({
  licenses,
  onEdit,
  onDelete,
}: {
  licenses: License[]
  onEdit: (license: License) => void
  onDelete: (license: License) => void
}) {
  const { t } = useTranslation()
  const { formatDate } = useFormat()

  const sorted = [...licenses].sort(
    (a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
  )

  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("licenses.columns.facility")}</TableHead>
            <TableHead>{t("licenses.columns.unifiedNumber")}</TableHead>
            <TableHead>{t("licenses.columns.expiryDate")}</TableHead>
            <TableHead className="w-0">
              <span className="sr-only">{t("common.actions")}</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((license) => (
            <TableRow key={license.id}>
              <TableCell className="font-medium">{license.facilities}</TableCell>
              <TableCell>{license.unifiedNumber}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{formatDate(license.expiryDate)}</span>
                  <LeaseStatusBadge expiryDate={license.expiryDate} />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEdit(license)}
                  >
                    <PencilIcon />
                    <span className="sr-only">
                      {t("common.editItem", { name: license.facilities })}
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onDelete(license)}
                  >
                    <Trash2Icon />
                    <span className="sr-only">
                      {t("common.deleteItem", { name: license.facilities })}
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
