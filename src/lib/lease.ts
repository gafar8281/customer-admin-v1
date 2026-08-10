const EXPIRING_SOON_WINDOW_DAYS = 30

export type LeaseStatus = "expired" | "expiring-soon" | "active"

function startOfDay(date: Date) {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

export function getLeaseStatus(iso: string): LeaseStatus {
  const today = startOfDay(new Date())
  const expiry = startOfDay(new Date(iso))
  const daysUntilExpiry = Math.round(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (daysUntilExpiry < 0) return "expired"
  if (daysUntilExpiry <= EXPIRING_SOON_WINDOW_DAYS) return "expiring-soon"
  return "active"
}

export const LEASE_STATUS_META: Record<LeaseStatus, { className: string }> = {
  expired: {
    className: "bg-destructive/10 text-destructive",
  },
  "expiring-soon": {
    className:
      "bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  },
  active: {
    className: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
}
