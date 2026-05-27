import { formatBudgetRange } from "@/lib/helpers"

interface BudgetRangeProps {
  min: number | null
  max: number | null
  /** Global ceiling across all clients, for proportional bar scaling */
  ceiling: number
}

export default function BudgetRange({ min, max, ceiling }: BudgetRangeProps) {
  const hasRange = min != null || max != null

  // Bar segment — from min to max as a fraction of the ceiling
  const start = ceiling > 0 ? ((min ?? 0) / ceiling) * 100 : 0
  const end = ceiling > 0 ? ((max ?? ceiling) / ceiling) * 100 : 100

  return (
    <div className="min-w-0">
      <p className="tabular truncate text-sm font-medium">
        {formatBudgetRange(min, max)}
      </p>
      {hasRange && (
        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{
              marginLeft: `${start}%`,
              width: `${Math.max(end - start, 4)}%`,
            }}
          />
        </div>
      )}
    </div>
  )
}
