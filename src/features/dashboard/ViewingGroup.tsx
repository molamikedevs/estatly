import {
  formatViewingDate,
  formatViewingTime,
  getClientLabel,
} from "@/lib/helpers"
import type { DashboardViewing } from "@/types/database"

// One group of viewings ("Today" or "Upcoming"), rendered by ViewingList
export default function ViewingGroup({
  label,
  viewings,
  showDate = false,
}: {
  label: string
  viewings: DashboardViewing[]
  showDate?: boolean
}) {
  return (
    <div>
      <h3 className="mb-1 text-xs font-medium text-muted-foreground">
        {label}
      </h3>
      <ul className="divide-y">
        {viewings.map((viewing) => (
          <li
            key={viewing.id}
            className="flex min-h-14 items-center gap-3 py-2"
          >
            <div className="w-14 shrink-0">
              <p className="text-sm font-semibold tabular-nums">
                {formatViewingTime(viewing.scheduled_at)}
              </p>
              {showDate && (
                <p className="text-xs text-muted-foreground">
                  {formatViewingDate(viewing.scheduled_at)}
                </p>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">
                {viewing.property?.title ?? "Property removed"}
              </p>
              {/* RLS can hide the client; the label explains why */}
              <p className="truncate text-sm text-muted-foreground">
                {getClientLabel(viewing)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
