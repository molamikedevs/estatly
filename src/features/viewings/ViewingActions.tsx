import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RESCHEDULABLE_STATUSES, viewingStatusOptions } from "@/lib/constants"
import type { Viewing, ViewingStatus } from "@/types/database"
import { CalendarClock, Check, MoreHorizontal, Trash2 } from "lucide-react"

interface ViewingActionsProps {
  viewing: Viewing
  onStatusChange: (status: ViewingStatus) => void
  onReschedule: () => void
  onDelete: () => void
}

export default function ViewingActions({
  viewing,
  onStatusChange,
  onReschedule,
  onDelete,
}: ViewingActionsProps) {
  // Same rules the API enforces: the menu hides what the query would refuse
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
