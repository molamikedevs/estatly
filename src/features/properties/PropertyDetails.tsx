import BackLink from "@/components/BackLink"
import StatCard from "@/components/layout/StatCard"
import Spinner from "@/components/Spinner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate, formatPrice, formatSize } from "@/lib/helpers"
import { cn } from "@/lib/utils"
import {
  Bath,
  BedDouble,
  CalendarDays,
  Check,
  Eye,
  Mail,
  MapPin,
  Ruler,
  Sofa,
  Sparkles,
} from "lucide-react"
import PropertyAgentCard from "./PropertyAgentCard"
import PropertyEmptyState from "./PropertyEmptyState"
import PropertyGallery from "./PropertyGallery"
import { useProperty } from "./useProperty"

const statusStyles: Record<string, string> = {
  published: "bg-success-muted text-success",
  draft: "bg-warning-muted text-warning",
  archived: "bg-muted text-muted-foreground",
}

export default function PropertyDetails() {
  const { isLoading, property } = useProperty()

  if (isLoading) return <Spinner label="Loading property" />
  if (!property) {
    return <PropertyEmptyState />
  }

  const isRent = property.listing_type === "rent"
  const galleryImages =
    property.gallery_images?.length > 0
      ? property.gallery_images
      : property.main_image
        ? [property.main_image]
        : []

  return (
    <div className="space-y-6">
      {/* ── Back link ──────────────────────────── */}
      <BackLink route="/properties" label="Back to properties" />

      {/* ── Gallery ────────────────────────────── */}
      <PropertyGallery images={galleryImages} title={property.title} />

      {/* ── Two-column layout ──────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* ─── Main column ─── */}
        <div className="space-y-6">
          {/* Title block */}
          <div>
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

          {/* Key stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              icon={BedDouble}
              label="Bedrooms"
              value={property.bedrooms}
            />
            <StatCard
              icon={Bath}
              label="Bathrooms"
              value={property.bathrooms}
            />
            <StatCard
              icon={Ruler}
              label="Size"
              value={formatSize(property.size_sqm)}
            />
            <StatCard
              icon={CalendarDays}
              label="Year built"
              value={property.year_built ?? "—"}
            />
          </div>

          {/* Description */}
          <section className="rounded-2xl border bg-card p-6 shadow-card">
            <h2 className="text-base font-semibold">Description</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {property.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                <Sofa className="h-3.5 w-3.5" />
                {property.furnished ? "Furnished" : "Unfurnished"}
              </span>
            </div>
          </section>

          {/* Features */}
          {property.features?.length > 0 && (
            <section className="rounded-2xl border bg-card p-6 shadow-card">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <Sparkles className="h-4 w-4 text-primary" />
                Features
              </h2>
              <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {property.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="h-4 w-4 shrink-0 text-success" />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Amenities */}
          {property.amenities?.length > 0 && (
            <section className="rounded-2xl border bg-card p-6 shadow-card">
              <h2 className="text-base font-semibold">Amenities</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="rounded-full border border-border/60 bg-muted/40 px-3 py-1.5 text-xs font-medium"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ─── Sticky sidebar ─── */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          {/* Price card */}
          <div className="rounded-2xl border bg-card p-5 shadow-card">
            <p className="text-xs font-medium text-muted-foreground">
              {isRent ? "Yearly rent" : "Sale price"}
            </p>
            <p className="tabular mt-1 text-3xl font-bold text-primary">
              {formatPrice(property.price, property.listing_type).replace(
                "/yr",
                ""
              )}
              {isRent && (
                <span className="text-sm font-normal text-muted-foreground">
                  {" "}
                  /year
                </span>
              )}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {property.neighborhood}, {property.city}
            </p>
            <Button className="mt-4 w-full gap-2 shadow-sm">
              <Mail className="h-4 w-4" />
              Contact agent
            </Button>
          </div>

          {/* Agent card */}
          <PropertyAgentCard />
        </aside>
      </div>
    </div>
  )
}
