import { useProperties } from "@/features/properties/useProperties"
import { PAGE_SIZE } from "@/lib/constants"
import type { Property } from "@/types/database"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useConfirmDeleteProperty } from "./useConfirmDeleteProperty"

export function usePropertiesOperations() {
  const [searchParams] = useSearchParams()
  const [editProperty, setEditProperty] = useState<Property | undefined>()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteProperty, setDeleteProperty] = useState<Property | undefined>()

  const { isLoading, properties } = useProperties()

  // On the list screen, a successful delete just clears the selection,
  // which closes the confirmation dialog. No navigation.
  const { confirmDelete, isDeleting } = useConfirmDeleteProperty(() =>
    setDeleteProperty(undefined)
  )

  function handleEdit(property: Property) {
    setEditProperty(property)
    setEditOpen(true)
  }

  function handleConfirmDelete() {
    confirmDelete(deleteProperty?.id?.toString())
  }

  const total = properties?.length ?? 0

  const listingFilter = searchParams.get("listing_type") || "all"
  const sortBy = searchParams.get("sortBy") || "newest"
  const currentPage = Number(searchParams.get("page")) || 1

  // add:
  const query = searchParams.get("q")?.trim().toLowerCase() ?? ""

  // ── Filter (unchanged) ──────────────────────
  const filters: Record<string, Property[] | undefined> = {
    all: properties,
    rent: properties?.filter((p) => p.listing_type === "rent"),
    sale: properties?.filter((p) => p.listing_type === "sale"),
  }
  const filteredProperties = filters[listingFilter] ?? properties ?? []

  // ── Search ──────────────────────────────────
  const searched = query
    ? filteredProperties.filter((p) =>
        [p.title, p.city, p.neighborhood, p.address]
          .filter(Boolean)
          .some((field) => field!.toLowerCase().includes(query))
      )
    : filteredProperties

  // ── Sort (now uses `searched`) ──────────────
  const sorters: Record<string, (a: Property, b: Property) => number> = {
    newest: (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    popular: (a, b) => b.views_count - a.views_count,
  }

  const visibleProperties = [...searched].sort(
    sorters[sortBy] ?? sorters.newest
  )

  // ── Paginate (unchanged) ────────────────────
  const paginatedProperties = visibleProperties.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  // Update isFiltered to include search
  const isFiltered = listingFilter !== "all" || query !== ""

  return {
    isFiltered,
    paginatedProperties,
    total,
    isLoading,
    visibleProperties,
    editProperty,
    deleteProperty,
    editOpen,
    isDeleting,
    handleEdit,
    setDeleteProperty,
    setEditOpen,
    handleConfirmDelete,
  }
}
