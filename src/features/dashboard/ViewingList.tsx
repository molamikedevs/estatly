import DataRenderer from "@/components/common/DataRenderer"
import { EMPTY_UPCOMING_VIEWINGS } from "@/lib/states"
import type { DashboardViewing } from "@/types/database"
import { isToday } from "date-fns"
import ViewingGroup from "./ViewingGroup"

// Splits the upcoming viewings into "Today" and "Upcoming" groups
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
        const today = items.filter((v) => isToday(new Date(v.scheduled_at)))
        const later = items.filter((v) => !isToday(new Date(v.scheduled_at)))

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
