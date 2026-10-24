import DataRenderer from "@/components/DataRenderer"
import Thumbnail from "@/components/common/Thumbnail"
import { formatPrice } from "@/lib/helpers"
import { EMPTY_PENDING } from "@/lib/states"
import type { DashboardProperty } from "@/types/database"
import { ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

const MAX_ROWS = 5

export default function PendingList({
  properties,
}: {
  properties: DashboardProperty[]
}) {
  const hidden = properties.length - MAX_ROWS

  return (
    <DataRenderer
      data={properties}
      empty={EMPTY_PENDING}
      compact
      render={(items) => (
        <>
          <ul className="-mx-2">
            {items.slice(0, MAX_ROWS).map((property) => (
              <li key={property.id}>
                <Link
                  to={`/properties/${property.id}`}
                  className="flex min-h-14 items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted active:bg-muted"
                >
                  <Thumbnail src={property.main_image} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{property.title}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {property.agent?.full_name ?? "No agent"} ·{" "}
                      <span className="text-highlight tabular-nums">
                        {formatPrice(property.price, property.listing_type)}
                      </span>
                    </p>
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>

          {hidden > 0 && (
            <Link
              to="/properties"
              className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
            >
              {hidden} more in Properties
            </Link>
          )}
        </>
      )}
    />
  )
}
