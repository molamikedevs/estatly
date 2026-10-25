import { formatPrice } from "@/lib/helpers"
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
  const isRent = property.listing_type === "rent"
  // formatPrice appends "/yr" for rentals; strip it so the suffix can be styled
  const amount = formatPrice(property.price, property.listing_type).replace(
    "/yr",
    ""
  )

  return (
    <p
      className={cn(
        "tabular font-bold tracking-tight text-foreground",
        className
      )}
    >
      {amount}
      {isRent && (
        <span className="ml-1 text-[0.55em] font-medium text-muted-foreground">
          /year
        </span>
      )}
    </p>
  )
}
