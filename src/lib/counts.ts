import type { StatusCount } from "@/types/database"

// Turns rows into [{ status, count }], e.g. for the dashboard charts
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

// The count for one status, or 0 when it has no rows
export function countOf(rows: StatusCount[], status: string) {
  return rows.find((row) => row.status === status)?.count ?? 0
}
