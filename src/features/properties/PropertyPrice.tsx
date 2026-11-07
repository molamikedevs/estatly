import { formatAmount } from "@/lib/helpers"
import { cn } from "@/lib/utils"
import type { Property } from "@/types/database"

interface PropertyPriceProps {
  property: Pick<Property, "price" | "listing_type">
  className?: string
}

export default function PropertyPrice({
  property,
  className,
}: PropertyPriceProps) {
  return (
    <p
      className={cn(
        "tabular font-bold tracking-tight text-foreground",
        className
      )}
    >
      {formatAmount(property.price)}
      {/* Its own element, so it can be smaller than the amount */}
      {property.listing_type === "rent" && (
        <span className="ml-1 text-[0.55em] font-medium text-muted-foreground">
          /year
        </span>
      )}
    </p>
  )
}
