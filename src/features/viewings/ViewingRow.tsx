import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableCell, TableRow } from "@/components/ui/table"
import UserAvatar from "@/components/UserAvatar"
import { formatViewingDate, formatViewingTime } from "@/lib/helpers"
import type { Viewing, ViewingStatus } from "@/types/database"
import {
  Ban,
  CalendarClock,
  Check,
  Clock,
  FileSignature,
  ImageOff,
  MoreHorizontal,
  Trash2,
  UserX,
} from "lucide-react"
import { useState } from "react"
import ViewingStatusBadge from "./ViewingStatusBadge"

interface ViewingRowProps {
  viewing: Viewing
  onStatusChange: (viewing: Viewing, status: ViewingStatus) => void
  onDelete?: (viewing: Viewing) => void
}

export default function ViewingRow({
  viewing,
  onDelete,
  onStatusChange,
}: ViewingRowProps) {
  const [imgError, setImgError] = useState(false)
  const { property, client, agent } = viewing

  return (
    <TableRow className="group">
      {/* Property */}
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-10 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
            {property?.main_image && !imgError ? (
              <img
                src={property.main_image}
                alt={property.title}
                loading="lazy"
                onError={() => setImgError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <ImageOff className="h-4 w-4" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium" title={property?.title}>
              {property?.title ?? "Unknown property"}
            </p>
            {property && (
              <p className="truncate text-xs text-muted-foreground">
                {property.neighborhood}, {property.city}
              </p>
            )}
          </div>
        </div>
      </TableCell>

      {/* Client */}
      <TableCell>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {client?.full_name ?? "Unknown client"}
          </p>
          {client?.email && (
            <p className="truncate text-xs text-muted-foreground">
              {client.email}
            </p>
          )}
        </div>
      </TableCell>

      {/* Agent */}
      <TableCell>
        <div className="flex min-w-0 items-center gap-2">
          <UserAvatar name={agent?.full_name} src={agent?.avatar} size="xs" />
          <span className="truncate text-sm">
            {agent?.full_name ?? "Unassigned"}
          </span>
        </div>
      </TableCell>

      {/* Schedule */}
      <TableCell>
        <div className="min-w-0">
          <p className="tabular truncate text-sm font-medium">
            {formatViewingDate(viewing.scheduled_at)}
          </p>
          <p className="tabular flex items-center gap-1 truncate text-xs text-muted-foreground">
            <Clock className="h-3 w-3 shrink-0" />
            {formatViewingTime(viewing.scheduled_at)} ·{" "}
            {viewing.duration_minutes}m
          </p>
        </div>
      </TableCell>

      {/* Status */}
      <TableCell>
        <ViewingStatusBadge status={viewing.status} />
      </TableCell>

      {/* Actions */}
      <TableCell className="pr-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground"
              aria-label="Viewing actions"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              onClick={() => onStatusChange(viewing, "scheduled")}
              className="gap-2 text-sm"
            >
              <CalendarClock className="h-3.5 w-3.5 text-info" />
              Scheduled
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange(viewing, "completed")}
              className="gap-2 text-sm"
            >
              <Check className="h-3.5 w-3.5 text-success" />
              Completed
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange(viewing, "offer-made")}
              className="gap-2 text-sm"
            >
              <FileSignature className="h-3.5 w-3.5 text-primary" />
              Offer made
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange(viewing, "cancelled")}
              className="gap-2 text-sm"
            >
              <Ban className="h-3.5 w-3.5 text-destructive" />
              Cancelled
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange(viewing, "no-show")}
              className="gap-2 text-sm"
            >
              <UserX className="h-3.5 w-3.5 text-warning" />
              No-show
            </DropdownMenuItem>

            {onDelete && <DropdownMenuSeparator />}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(viewing)}
                className="gap-2 text-sm text-destructive focus:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
