import Thumbnail from "@/components/common/Thumbnail"
import UserAvatar from "@/components/common/UserAvatar"
import {
  formatViewingDate,
  formatViewingTime,
  getClientLabel,
} from "@/lib/helpers"
import { cn } from "@/lib/utils"
import type { Viewing, ViewingStatus } from "@/types/database"
import { gridColumns } from "./gridColumns"
import ViewingActions from "./ViewingActions"
import ViewingStatusBadge from "./ViewingStatusBadge"

interface ViewingItemProps {
  viewing: Viewing
  showAgent: boolean
  onStatusChange: (status: ViewingStatus) => void
  onReschedule: () => void
  onDelete: () => void
}

export default function ViewingItem({
  viewing,
  showAgent,
  onStatusChange,
  onReschedule,
  onDelete,
}: ViewingItemProps) {
  const { property, agent } = viewing

  const date = formatViewingDate(viewing.scheduled_at)
  const time = `${formatViewingTime(viewing.scheduled_at)} · ${viewing.duration_minutes} min`
  const title = property?.title ?? "Property removed"
  const place = property ? `${property.neighborhood}, ${property.city}` : ""
  const clientLabel = getClientLabel(viewing)

  // Time has passed but nobody recorded what happened
  const needsUpdate =
    viewing.status === "scheduled" &&
    new Date(viewing.scheduled_at) < new Date()

  // Built once, placed in both layouts below
  const status = (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <ViewingStatusBadge status={viewing.status} />
      {needsUpdate && (
        <span className="text-xs text-warning">Update status</span>
      )}
    </div>
  )

  const actions = (
    <ViewingActions
      viewing={viewing}
      onStatusChange={onStatusChange}
      onReschedule={onReschedule}
      onDelete={onDelete}
    />
  )

  return (
    <li>
      {/* Desktop: one row in the grid */}
      <div
        className={cn(
          "hidden items-center gap-4 px-4 py-3 md:grid",
          gridColumns(showAgent)
        )}
      >
        <div>
          <p className="text-sm font-medium tabular-nums">{date}</p>
          <p className="text-xs text-muted-foreground tabular-nums">{time}</p>
        </div>

        <div className="flex min-w-0 items-center gap-3">
          <Thumbnail src={property?.main_image ?? null} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{title}</p>
            <p className="truncate text-xs text-muted-foreground">{place}</p>
          </div>
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm">{clientLabel}</p>
          {viewing.client?.email && (
            <p className="truncate text-xs text-muted-foreground">
              {viewing.client.email}
            </p>
          )}
        </div>

        {showAgent && (
          <div className="flex min-w-0 items-center gap-2">
            <UserAvatar name={agent?.full_name} src={agent?.avatar} size="xs" />
            <span className="truncate text-sm">
              {agent?.full_name ?? "No agent"}
            </span>
          </div>
        )}

        {status}
        {actions}
      </div>

      {/* Phone: a card. One bold line, the property; the rest supports it */}
      <div className="flex items-start gap-3 p-4 md:hidden">
        <Thumbnail src={property?.main_image ?? null} />

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground tabular-nums">
            {date} · {time}
          </p>
          <p className="mt-0.5 truncate font-medium">{title}</p>
          <p className="truncate text-sm text-muted-foreground">
            {clientLabel}
            {/* "with" says who the agent is; desktop has a column header */}
            {showAgent && agent && ` · with ${agent.full_name}`}
          </p>
          <div className="mt-2">{status}</div>
        </div>

        <div className="-mt-1 -mr-2">{actions}</div>
      </div>
    </li>
  )
}
