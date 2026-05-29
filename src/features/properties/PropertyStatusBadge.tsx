import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { PropertyStatus } from "@/types/database"

const statusStyles: Record<PropertyStatus, string> = {
  published: "bg-background/85 text-success",
  sold: "bg-background/85 text-chart-1",
  rented: "bg-background/75 text-chart-4",
  "pending-approval": "bg-background/85 text-warning",
  "under-offer": "bg-background/85 text-info",
}

export default function PropertyStatusBadge({
  status,
}: {
  status: PropertyStatus
}) {
  return (
    <Badge
      className={cn(
        "pointer-events-none absolute top-3 right-3 border-0 text-[10px] font-semibold capitalize backdrop-blur-sm",
        statusStyles[status] ?? statusStyles.published
      )}
    >
      {status}
    </Badge>
  )
}
