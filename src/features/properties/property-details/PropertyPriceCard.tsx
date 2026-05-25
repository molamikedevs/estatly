import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/helpers"
import type { Property } from "@/types/database"
import { Mail } from "lucide-react"

interface PropertyPriceCardProps {
  property: Property
  isRent: boolean
}

export default function PropertyPriceCard({
  property,
  isRent,
}: PropertyPriceCardProps) {
  const price = formatPrice(property.price, property.listing_type).replace(
    "/yr",
    ""
  )

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-card">
      <p className="text-xs font-medium text-muted-foreground">
        {isRent ? "Yearly rent" : "Sale price"}
      </p>
      <p className="mt-1 text-3xl font-bold text-primary tabular-nums">
        {price}
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
  )
}
