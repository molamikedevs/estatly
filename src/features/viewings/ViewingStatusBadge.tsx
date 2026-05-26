import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ViewingStatus } from "@/types/database"

const config: Record<ViewingStatus, { label: string; className: string }> = {
  scheduled: { label: "Scheduled", className: "bg-info-muted text-info" },
  completed: { label: "Completed", className: "bg-success-muted text-success" },
  cancelled: {
    label: "Cancelled",
    className: "bg-destructive/10 text-destructive",
  },
  "no-show": { label: "No show", className: "bg-warning-muted text-warning" },
  "offer-made": {
    label: "Offer made",
    className: "bg-accent text-accent-foreground",
  },
}

export default function ViewingStatusBadge({
  status,
}: {
  status: ViewingStatus
}) {
  const { label, className } = config[status] ?? config.scheduled
  return (
    <Badge className={cn("border-0 text-[10px] font-semibold", className)}>
      {label}
    </Badge>
  )
}
