import { useProperties } from "@/features/properties/useProperties"
import type { PropertiesQueryParams, PropertyParams } from "@/types/database"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useConfirmDeleteProperty } from "./useConfirmDeleteProperty"

export function usePropertiesOperations() {
  const [searchParams] = useSearchParams()
  const [editProperty, setEditProperty] = useState<PropertyParams | undefined>()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteProperty, setDeleteProperty] = useState<
    PropertyParams | undefined
  >()

  const params: PropertiesQueryParams = {
    filter: (searchParams.get("listing_type") ??
      "all") as PropertiesQueryParams["filter"],
    sort_by: (searchParams.get("sort_by") ??
      "recent") as PropertiesQueryParams["sort_by"],
    page: Number(searchParams.get("page")) || 1,
    page_size: Number(searchParams.get("page_size")) || 10,
    query: searchParams.get("query")?.trim() || "",
  }

  const { isLoading, data } = useProperties(params)

  const properties = data?.success ? data.data.properties : []
  const count = data?.success ? data.data.count : 0
  const error = data && !data.success ? data.error : undefined

  // On the list screen, a successful delete just clears the selection,
  // which closes the confirmation dialog. No navigation.
  const { confirmDelete, isDeleting } = useConfirmDeleteProperty(() =>
    setDeleteProperty(undefined)
  )

  function handleEdit(property: PropertyParams) {
    setEditProperty(property)
    setEditOpen(true)
  }

  function handleConfirmDelete() {
    confirmDelete(deleteProperty?.id?.toString())
  }

  return {
    isLoading,
    success: data?.success ?? false,
    error,
    properties,
    count,
    isFiltered: params.filter !== "all" || params.query !== "",
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
