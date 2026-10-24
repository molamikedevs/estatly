import type { ClientStatus, StatusCount } from "@/types/database"

export const DAY_MS = 24 * 60 * 60 * 1000

export function countByStatus(
  rows: { status: string | null }[]
): StatusCount[] {
  const counts: Record<string, number> = {}

  for (const row of rows) {
    const status = row.status ?? "unknown"
    counts[status] = (counts[status] ?? 0) + 1
  }

  return Object.entries(counts).map(([status, count]) => ({ status, count }))
}

export function countOf(rows: StatusCount[], status: string) {
  return rows.find((row) => row.status === status)?.count ?? 0
}

export const PROPERTY_STATUSES = [
  {
    status: "pending-approval",
    label: "Pending approval",
    color: "var(--status-pending)",
  },
  { status: "published", label: "Published", color: "var(--status-published)" },
  {
    status: "under-offer",
    label: "Under offer",
    color: "var(--status-under-offer)",
  },
  { status: "rented", label: "Rented", color: "var(--status-rented)" },
  { status: "sold", label: "Sold", color: "var(--status-sold)" },
]

// Pipeline order and colors: the clients board and the dashboard chart
export const CLIENT_STAGES: {
  status: ClientStatus
  label: string
  color: string
}[] = [
  { status: "active", label: "Active", color: "var(--primary)" },
  { status: "closed-won", label: "Closed, won", color: "var(--success)" },
  { status: "closed-lost", label: "Closed, lost", color: "var(--destructive)" },
  { status: "inactive", label: "Inactive", color: "var(--muted-foreground)" },
]
