import { useTranslation } from "react-i18next"

import { Badge } from "@/components/ui/badge"
import { getLeaseStatus, LEASE_STATUS_META } from "@/lib/lease"

export function LeaseStatusBadge({ expiryDate }: { expiryDate: string }) {
  const { t } = useTranslation()
  const status = getLeaseStatus(expiryDate)
  const meta = LEASE_STATUS_META[status]

  return (
    <Badge variant="outline" className={meta.className}>
      {t(`lease.status.${status}`)}
    </Badge>
  )
}
