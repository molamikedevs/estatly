import Buttons from "@/components/Buttons"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/helpers"
import { cn } from "@/lib/utils"
import type { Property } from "@/types/database"
import { CalendarDays, Eye, MapPin } from "lucide-react"

const statusStyles: Record<string, string> = {
  published: "bg-success-muted text-success",
  draft: "bg-warning-muted text-warning",
  archived: "bg-muted text-muted-foreground",
}

interface PropertyDetailsHeaderProps {
  property: Property
  onEdit: () => void
  onDelete: () => void
}

export default function PropertyDetailsHeader({
  property,
  onEdit,
  onDelete,
}: PropertyDetailsHeaderProps) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="border-0 bg-accent text-[10px] font-semibold tracking-wide text-accent-foreground uppercase">
            For {property.listing_type}
          </Badge>
          <Badge
            className={cn(
              "border-0 text-[10px] font-semibold capitalize",
              statusStyles[property.status] ?? statusStyles.archived
            )}
          >
            {property.status}
          </Badge>
          <Badge
            variant="outline"
            className="gap-1 border-border/60 text-[10px] font-normal text-muted-foreground capitalize"
          >
            {property.property_type}
          </Badge>
        </div>

        <Buttons onEdit={onEdit} onDelete={onDelete} />
      </div>

      <h1 className="mt-3 text-2xl font-bold tracking-tight">
        {property.title}
      </h1>
      <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4 shrink-0" />
        {property.address}
      </p>
      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Eye className="h-3.5 w-3.5" />
          {property.views_count} views
        </span>
        <span className="flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5" />
          Listed {formatDate(property.created_at)}
        </span>
      </div>
    </div>
  )
}
