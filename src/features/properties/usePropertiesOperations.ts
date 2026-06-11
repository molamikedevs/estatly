import { useProperties } from "@/features/properties/useProperties"
import type { PropertiesQueryParams, Property } from "@/types/database"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useConfirmDeleteProperty } from "./useConfirmDeleteProperty"

export function usePropertiesOperations() {
  const [searchParams] = useSearchParams()
  const [editProperty, setEditProperty] = useState<Property | undefined>()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteProperty, setDeleteProperty] = useState<Property | undefined>()

  const params: PropertiesQueryParams = {
    filter: (searchParams.get("listing_type") ??
      "all") as PropertiesQueryParams["filter"],
    sortBy: (searchParams.get("sortBy") ??
      "newest") as PropertiesQueryParams["sortBy"],
    page: Number(searchParams.get("page")) || 1,
    search: searchParams.get("q")?.trim() || "",
  }

  const { isLoading, data } = useProperties(params)

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

  return {
    isLoading,
    properties: data?.data ?? [],
    total: data?.count ?? 0,
    isFiltered: params.filter !== "all" || params.search !== "",
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
