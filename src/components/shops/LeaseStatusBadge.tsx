import { Badge } from "@/components/ui/badge"
import { getLeaseStatus, LEASE_STATUS_META } from "@/lib/lease"

export function LeaseStatusBadge({
  shopLeaseExpiryDate,
}: {
  shopLeaseExpiryDate: string
}) {
  const status = getLeaseStatus(shopLeaseExpiryDate)
  const meta = LEASE_STATUS_META[status]

  return (
    <Badge variant="outline" className={meta.className}>
      {meta.label}
    </Badge>
  )
}
