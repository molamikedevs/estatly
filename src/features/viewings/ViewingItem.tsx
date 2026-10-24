import Thumbnail from "@/components/common/Thumbnail"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import UserAvatar from "@/components/UserAvatar"
import { RESCHEDULABLE_STATUSES, viewingStatusOptions } from "@/lib/constants"
import {
  formatViewingDate,
  formatViewingTime,
  getClientLabel,
} from "@/lib/helpers"
import { cn } from "@/lib/utils"
import type { Viewing, ViewingStatus } from "@/types/database"
import { CalendarClock, Check, MoreHorizontal, Trash2 } from "lucide-react"
import { gridColumns } from "./constant"
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
  const place = property ? `${property.neighborhood}, ${property.city}` : ""
  const clientLabel = getClientLabel(viewing)

  // Time has passed but nobody recorded what happened
  const needsUpdate =
    viewing.status === "scheduled" &&
    new Date(viewing.scheduled_at) < new Date()

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
            <p className="truncate text-sm font-medium">
              {property?.title ?? "Property removed"}
            </p>
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

      {/* Phone: a card */}
      <div className="flex gap-3 p-4 md:hidden">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm font-medium tabular-nums">
            {date} · {time}
          </p>
          <p className="truncate font-medium">
            {property?.title ?? "Property removed"}
          </p>
          <p className="truncate text-sm text-muted-foreground">
            {clientLabel}
            {showAgent && agent ? ` · ${agent.full_name}` : ""}
          </p>
          <div className="pt-1">{status}</div>
        </div>
        {actions}
      </div>
    </li>
  )
}

function ViewingActions({
  viewing,
  onStatusChange,
  onReschedule,
  onDelete,
}: Omit<ViewingItemProps, "showAgent">) {
  const canReschedule = RESCHEDULABLE_STATUSES.includes(viewing.status)
  // Viewings that happened are records: they get a status, not a delete
  const canDelete = viewing.status === "scheduled"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="size-9 shrink-0 text-muted-foreground"
          aria-label={`Actions for ${viewing.property?.title ?? "viewing"}`}
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {canReschedule && (
          <>
            <DropdownMenuItem onSelect={onReschedule}>
              <CalendarClock />
              Reschedule
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuLabel>Set status</DropdownMenuLabel>
        {viewingStatusOptions.map((option) => {
          const isCurrent = option.value === viewing.status
          return (
            <DropdownMenuItem
              key={option.value}
              disabled={isCurrent}
              onSelect={() => onStatusChange(option.value)}
            >
              {option.label}
              {isCurrent && <Check className="ml-auto" />}
            </DropdownMenuItem>
          )
        })}

        {canDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={onDelete}>
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
