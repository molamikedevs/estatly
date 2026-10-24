import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ViewingStatus } from "@/types/database"

const config: Record<ViewingStatus, { label: string; className: string }> = {
  scheduled: { label: "Scheduled", className: "bg-info/15 text-info" },
  completed: { label: "Completed", className: "bg-success/15 text-success" },
  cancelled: {
    label: "Cancelled",
    className: "bg-destructive/15 text-destructive",
  },
  "no-show": { label: "No show", className: "bg-warning/15 text-warning" },
  "offer-made": {
    label: "Offer made",
    className: "bg-status-under-offer/15 text-status-under-offer",
  },
}

export default function ViewingStatusBadge({
  status,
}: {
  status: ViewingStatus
}) {
  const { label, className } = config[status] ?? config.scheduled
  return (
    <Badge className={cn("border-0 text-xs font-medium", className)}>
      {label}
    </Badge>
  )
}
