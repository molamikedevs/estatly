import { useDeleteProperty } from "@/features/properties/useDeleteProperty"
import { useProperties } from "@/features/properties/useProperties"
import { PAGE_SIZE } from "@/lib/constants"
import type { PropertiesQueryParams, Property } from "@/types/database"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"

export function usePropertiesOperations() {
  const [searchParams] = useSearchParams()
  const [editProperty, setEditProperty] = useState<Property | undefined>()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Property | undefined>()

  const params: PropertiesQueryParams = {
    filter: (searchParams.get("listing_type") ??
      "all") as PropertiesQueryParams["filter"],
    sortBy: (searchParams.get("sortBy") ??
      "newest") as PropertiesQueryParams["sortBy"],
    page: Number(searchParams.get("page")) || 1,
    search: searchParams.get("search")?.trim() || "",
    pageSize: PAGE_SIZE,
  }

  const { isLoading, data, error, refetch } = useProperties(params)
  const { deleteProperty, isPending: isDeleting } = useDeleteProperty()

  function handleEdit(property: Property) {
    setEditProperty(property)
    setEditOpen(true)
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return
    deleteProperty(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(undefined),
    })
  }

  return {
    isLoading,
    error,
    refetch,
    properties: data?.data ?? [],
    total: data?.count ?? 0,
    isFiltered: params.filter !== "all" || params.search !== "",
    editProperty,
    editOpen,
    setEditOpen,
    handleEdit,
    deleteTarget,
    setDeleteTarget,
    isDeleting,
    handleConfirmDelete,
  }
}
