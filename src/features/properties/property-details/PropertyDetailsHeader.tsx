import { formatDate, formatSize } from "@/lib/helpers"
import type { Property } from "@/types/database"
import {
  Bath,
  BedDouble,
  CalendarDays,
  Eye,
  MapPin,
  Ruler,
  Sofa,
  type LucideIcon,
} from "lucide-react"
import PropertyActionsMenu from "../PropertyActionsMenu"
import PropertyStatusBadge from "../PropertyStatusBadge"

interface PropertyDetailsHeaderProps {
  property: Property
  onEdit?: (property: Property) => void
  onDelete?: (property: Property) => void
}

export default function PropertyDetailsHeader({
  property,
  onEdit,
  onDelete,
}: PropertyDetailsHeaderProps) {
  const views = property.views_count ?? 0

  const facts: { icon: LucideIcon; label: string; value: string | number }[] = [
    { icon: BedDouble, label: "Bedrooms", value: property.bedrooms },
    { icon: Bath, label: "Bathrooms", value: property.bathrooms },
    { icon: Ruler, label: "Size", value: formatSize(property.size_sqm) },
    {
      icon: CalendarDays,
      label: "Year built",
      value: property.year_built ?? "Not set",
    },
    {
      icon: Sofa,
      label: "Furnishing",
      value: property.furnished ? "Furnished" : "Unfurnished",
    },
  ]

  return (
    <header className="space-y-5">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold tracking-wide text-accent-foreground uppercase">
            For {property.listing_type}
          </span>
          <PropertyStatusBadge status={property.status} />
          <span className="rounded-full border border-border/60 px-2.5 py-1 text-[10px] font-medium text-muted-foreground capitalize">
            {property.property_type}
          </span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
              {property.title}
            </h1>
            <p className="mt-1.5 flex items-start gap-1.5 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              {property.address}
            </p>
          </div>
          <PropertyActionsMenu
            property={property}
            onEdit={onEdit}
            onDelete={onDelete}
            className="shrink-0"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5" />
            <span className="tabular">{views}</span>{" "}
            {views === 1 ? "view" : "views"}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            Listed {formatDate(property.created_at)}
          </span>
        </div>
      </div>

      {/* Key specs */}
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {facts.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="rounded-xl border border-border/60 bg-card px-4 py-3"
          >
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Icon aria-hidden className="h-3.5 w-3.5" />
              {label}
            </dt>
            <dd className="tabular mt-1 text-base font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
    </header>
  )
}
