import { Badge } from "@/components/ui/badge"
import { formatPrice, formatSize } from "@/lib/helpers"
import { cn } from "@/lib/utils"
import type { Property } from "@/types/index"
import { Bath, BedDouble, Eye, ImageOff, MapPin, Ruler } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const statusStyles: Record<string, string> = {
  published: "bg-background/85 text-success",
  draft: "bg-warning-muted text-warning",
  archived: "bg-muted text-muted-foreground",
}

export default function PropertyCard({ property }: { property: Property }) {
  const navigate = useNavigate()
  const [imgError, setImgError] = useState(false)

  const isRent = property.listing_type === "rent"

  return (
    <button
      onClick={() => navigate(`/properties/${property.id}`)}
      className="card-hover group flex flex-col overflow-hidden rounded-xl border bg-card text-left shadow-card"
    >
      {/* ── Image ──────────────────────────────── */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {property.main_image && !imgError ? (
          <img
            src={property.main_image}
            alt={property.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageOff className="h-8 w-8" />
          </div>
        )}

        {/* listing type — top left */}
        <span className="absolute top-3 left-3 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-foreground uppercase backdrop-blur-sm">
          For {property.listing_type}
        </span>

        {/* status — top right */}
        <Badge
          className={cn(
            "absolute top-3 right-3 border-0 text-[10px] font-semibold capitalize backdrop-blur-sm",
            statusStyles[property.status] ?? statusStyles.archived
          )}
        >
          {property.status}
        </Badge>

        {/* views — bottom right, subtle */}
        <span className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full bg-background/85 px-2 py-1 text-[10px] font-medium text-muted-foreground backdrop-blur-sm">
          <Eye className="h-3 w-3" />
          {property.views_count}
        </span>
      </div>

      {/* ── Body ───────────────────────────────── */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-sm font-semibold transition-colors group-hover:text-primary">
          {property.title}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">
            {property.neighborhood}, {property.city}
          </span>
        </p>

        <p className="tabular mt-2.5 text-lg font-bold text-primary">
          {formatPrice(property.price, property.listing_type).replace(
            "/yr",
            ""
          )}
          {isRent && (
            <span className="text-xs font-normal text-muted-foreground">
              /yr
            </span>
          )}
        </p>

        {/* specs */}
        <div className="mt-auto flex items-center gap-3 border-t border-border/60 pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BedDouble className="h-4 w-4" />
            <span className="tabular">{property.bedrooms}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="h-4 w-4" />
            <span className="tabular">{property.bathrooms}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Ruler className="h-4 w-4" />
            <span className="tabular">{formatSize(property.size_sqm)}</span>
          </span>
        </div>
      </div>
    </button>
  )
}
