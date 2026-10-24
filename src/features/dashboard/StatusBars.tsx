import EmptyMessage from "@/components/common/EmptyMessage"
import type { EmptyState } from "@/lib/states"
import type { StatusCount } from "@/types/database"

interface StatusConfig {
  status: string
  label: string
  color: string
}

interface StatusBarsProps {
  config: StatusConfig[]
  counts: StatusCount[]
  empty: EmptyState
}

export default function StatusBars({ config, counts, empty }: StatusBarsProps) {
  // Every status shows, in lifecycle order, even when its count is 0
  const rows = config.map((item) => ({
    ...item,
    count: counts.find((c) => c.status === item.status)?.count ?? 0,
  }))

  const max = Math.max(...rows.map((row) => row.count))

  // All zero: the list is not empty, but there is nothing to compare
  if (max === 0) return <EmptyMessage empty={empty} compact />

  return (
    <ul className="space-y-3">
      {rows.map((row) => (
        <li key={row.status}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate">{row.label}</span>
            <span className="font-medium tabular-nums">{row.count}</span>
          </div>
          <div aria-hidden="true" className="mt-1.5 h-2 rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-[width] duration-300 ease-out"
              style={{
                width: `${(row.count / max) * 100}%`,
                backgroundColor: row.color,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
