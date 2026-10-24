import DataRenderer from "@/components/DataRenderer"
import { formatViewingDate, formatViewingTime } from "@/lib/helpers"
import { EMPTY_UPCOMING_VIEWINGS } from "@/lib/states"
import type { DashboardViewing } from "@/types/database"

function isToday(iso: string) {
  return new Date(iso).toDateString() === new Date().toDateString()
}

// RLS hides clients that belong to another agent, so say so instead of "Unknown"
function clientLabel(viewing: DashboardViewing) {
  if (viewing.client) return viewing.client.full_name
  if (viewing.client_id) return "Client assigned to another agent"
  return "No client"
}

export default function ViewingList({
  viewings,
}: {
  viewings: DashboardViewing[]
}) {
  return (
    <DataRenderer
      data={viewings}
      empty={EMPTY_UPCOMING_VIEWINGS}
      compact
      render={(items) => {
        const today = items.filter((v) => isToday(v.scheduled_at))
        const later = items.filter((v) => !isToday(v.scheduled_at))

        return (
          <div className="space-y-4">
            {today.length > 0 && (
              <ViewingGroup label="Today" viewings={today} />
            )}
            {later.length > 0 && (
              <ViewingGroup label="Upcoming" viewings={later} showDate />
            )}
          </div>
        )
      }}
    />
  )
}

function ViewingGroup({
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
              <p className="truncate text-sm text-muted-foreground">
                {clientLabel(viewing)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
