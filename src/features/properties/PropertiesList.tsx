import type { Property } from "@/types/index"
import { useSearchParams } from "react-router-dom"
import AddProperty from "./AddProperty"
import PropertiesEmptyState from "./PropertiesEmptyState"
import PropertiesOperations from "./PropertiesOperations"
import PropertyCard from "./PropertyCard"
import PropertyCardSkeleton from "./PropertyCardSkeleton"
import { useProperties } from "./useProperties"

import Pagination from "@/components/Pagination"
import { PAGE_SIZE } from "@/lib/constants"

export default function PropertiesList() {
  const { isLoading, properties } = useProperties()
  const [searchParams] = useSearchParams()

  const total = properties?.length ?? 0

  const listingFilter = searchParams.get("listing_type") || "all"
  const sortBy = searchParams.get("sortBy") || "newest"
  const currentPage = Number(searchParams.get("page")) || 1

  // ── Filter ──────────────────────────────────
  const filters: Record<string, Property[] | undefined> = {
    all: properties,
    rent: properties?.filter((p) => p.listing_type === "rent"),
    sale: properties?.filter((p) => p.listing_type === "sale"),
  }

  const filteredProperties = filters[listingFilter] ?? properties ?? []

  // ── Sort ────────────────────────────────────
  const sorters: Record<string, (a: Property, b: Property) => number> = {
    newest: (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    popular: (a, b) => b.views_count - a.views_count,
  }

  const visibleProperties = [...filteredProperties].sort(
    sorters[sortBy] ?? sorters.newest
  )

  // ── Paginate ────────────────────────────────
  const paginatedProperties = visibleProperties.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const isFiltered = listingFilter !== "all"

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Properties</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse and manage your property listings
            {!isLoading && total > 0 && (
              <span className="tabular"> · {total} total</span>
            )}
          </p>
        </div>
        <AddProperty />
      </div>

      {/* Filter + sort operations */}
      {!isLoading && total > 0 && <PropertiesOperations />}

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      ) : visibleProperties.length === 0 ? (
        <PropertiesEmptyState filtered={isFiltered} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          <Pagination count={visibleProperties.length} />
        </>
      )}
    </div>
  )
}
