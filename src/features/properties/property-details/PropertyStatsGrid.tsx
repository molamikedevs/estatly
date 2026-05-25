import StatCard from "@/components/layout/StatCard"
import { formatSize } from "@/lib/helpers"
import type { Property } from "@/types/database"
import { Bath, BedDouble, CalendarDays, Ruler } from "lucide-react"

interface PropertyStatsGridProps {
  property: Property
}

export default function PropertyStatsGrid({
  property,
}: PropertyStatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatCard icon={BedDouble} label="Bedrooms" value={property.bedrooms} />
      <StatCard icon={Bath} label="Bathrooms" value={property.bathrooms} />
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
  )
}
