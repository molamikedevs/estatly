import ViewingStatusBadge from "@/features/viewings/ViewingStatusBadge"
import { formatViewingDate, formatViewingTime } from "@/lib/helpers"
import type { Viewing } from "@/types/database"
import { ImageOff } from "lucide-react"
import { useState } from "react"

export default function ViewingItem({ viewing }: { viewing: Viewing }) {
  const [imgError, setImgError] = useState(false)
  const { property, client } = viewing

  return (
    <li className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
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
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {property?.title ?? "Unknown property"}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {client?.full_name ?? "Unknown client"} ·{" "}
          <span className="tabular">
            {formatViewingDate(viewing.scheduled_at)} ·{" "}
            {formatViewingTime(viewing.scheduled_at)}
          </span>
        </p>
      </div>
      <ViewingStatusBadge status={viewing.status} />
    </li>
  )
}
