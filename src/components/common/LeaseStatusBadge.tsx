import { Badge } from "@/components/ui/badge"
import { getLeaseStatus, LEASE_STATUS_META } from "@/lib/lease"

export function LeaseStatusBadge({ expiryDate }: { expiryDate: string }) {
  const status = getLeaseStatus(expiryDate)
  const meta = LEASE_STATUS_META[status]

  return (
    <Badge variant="outline" className={meta.className}>
      {meta.label}
    </Badge>
  )
}
