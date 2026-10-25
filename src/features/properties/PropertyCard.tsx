import { formatSize } from "@/lib/helpers"
import type { Property } from "@/types/database"
import {
  Bath,
  BedDouble,
  Eye,
  ImageOff,
  MapPin,
  Ruler,
  type LucideIcon,
} from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import PropertyActionsMenu from "./PropertyActionsMenu"
import PropertyPrice from "./PropertyPrice"
import PropertyStatusBadge from "./PropertyStatusBadge"

interface PropertyCardProps {
  property: Property
  onEdit?: (property: Property) => void
  onDelete?: (property: Property) => void
}

export default function PropertyCard({
  property,
  onEdit,
  onDelete,
}: PropertyCardProps) {
  const [imgError, setImgError] = useState(false)
  const showImage = Boolean(property.main_image) && !imgError

  return (
    <article className="card-hover group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-card">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {showImage ? (
          <img
            src={property.main_image!}
            alt=""
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground/60">
            <ImageOff className="h-7 w-7" />
          </div>
        )}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/25 to-transparent"
        />

        <div className="pointer-events-none absolute inset-x-2.5 top-2.5 flex items-start justify-between gap-2">
          <span className="rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase shadow-sm backdrop-blur-sm">
            For {property.listing_type}
          </span>
          <PropertyStatusBadge
            status={property.status}
            variant="overlay"
            className="px-2 py-0.5"
          />
        </div>

        {property.views_count > 0 && (
          <span className="pointer-events-none absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
            <Eye className="h-3 w-3" />
            <span className="tabular">{property.views_count}</span>
            <span className="sr-only">views</span>
          </span>
        )}

        <PropertyActionsMenu
          property={property}
          onEdit={onEdit}
          onDelete={onDelete}
          triggerVariant="overlay"
          className="absolute right-2.5 bottom-2.5 z-10 transition-opacity focus-within:opacity-100 has-[[data-state=open]]:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
        />
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <PropertyPrice property={property} className="text-base" />

        <h3 className="mt-0.5 line-clamp-1 text-sm font-semibold transition-colors group-hover:text-primary">
          {/* Stretched link: the whole card opens the listing, the menu sits above it */}
          <Link
            to={`/properties/${property.id}`}
            className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring"
          >
            {property.title}
          </Link>
        </h3>

        <p className="mt-0.5 mb-3 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="line-clamp-1">
            {property.neighborhood}, {property.city}
          </span>
        </p>

        <dl className="mt-auto flex items-center gap-3 border-t border-border/60 pt-2.5 text-xs text-muted-foreground">
          <Spec icon={BedDouble} label="Bedrooms" value={property.bedrooms} />
          <Spec icon={Bath} label="Bathrooms" value={property.bathrooms} />
          <Spec
            icon={Ruler}
            label="Size"
            value={formatSize(property.size_sqm)}
          />
        </dl>
      </div>
    </article>
  )
}

function Spec({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string | number
}) {
  return (
    <div className="flex items-center gap-1">
      <dt className="sr-only">{label}</dt>
      <Icon aria-hidden className="h-3.5 w-3.5" />
      <dd className="tabular font-medium text-foreground">{value}</dd>
    </div>
  )
}
